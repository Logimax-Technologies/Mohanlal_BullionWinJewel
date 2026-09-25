/**
 * fix-ios-signing.js  (cordova after_prepare hook, iOS)
 *
 * Two independent signing problems, both re-introduced whenever platforms/ is
 * regenerated - which is why this runs as a hook rather than a one-off edit:
 *
 * 1. cordova's own build-release.xcconfig hardcodes the legacy
 *    `CODE_SIGN_IDENTITY = iPhone Distribution`. That cannot coexist with
 *    automatic signing and fails the archive with:
 *      "automatically signed for development, but a conflicting code signing
 *       identity iPhone Distribution has been manually specified"
 *
 * 2. build.json is only read by `cordova build`. Opening the workspace and
 *    pressing Run ignores it entirely and fails with "Signing requires a
 *    development team", so DEVELOPMENT_TEAM / CODE_SIGN_STYLE are stamped into
 *    project.pbxproj as well, keeping the GUI and CLI paths in agreement.
 */
const fs = require('fs');
const path = require('path');

module.exports = function (context) {
  const root = context.opts.projectRoot;
  const iosDir = path.join(root, 'platforms', 'ios');
  if (!fs.existsSync(iosDir)) return;

  // --- 1. Comment out the hardcoded identities in the build xcconfigs ---
  ['build-release.xcconfig', 'build-debug.xcconfig'].forEach((name) => {
    const p = path.join(iosDir, 'cordova', name);
    if (!fs.existsSync(p)) return;
    let s = fs.readFileSync(p, 'utf8');
    const before = s;
    // Only touch uncommented assignments, so re-running is a no-op.
    s = s.replace(/^(CODE_SIGN_IDENTITY.*)$/gm, '// $1  // disabled: conflicts with automatic signing');
    if (s !== before) {
      fs.writeFileSync(p, s, 'utf8');
      console.log('fix-ios-signing: disabled CODE_SIGN_IDENTITY in ' + name);
    }
  });

  // --- 2. Stamp the team into project.pbxproj so the Xcode GUI signs too ---
  let team = null;
  const buildJson = path.join(root, 'build.json');
  if (fs.existsSync(buildJson)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(buildJson, 'utf8'));
      team = (cfg.ios && cfg.ios.release && cfg.ios.release.developmentTeam) || null;
    } catch (e) {
      console.log('fix-ios-signing: could not read build.json: ' + e.message);
    }
  }

  // Leave the project alone while build.json still holds the placeholder -
  // writing "{TEAM_ID}" into the project would just move the error.
  if (!team || /^\{.*\}$/.test(team)) {
    console.log('fix-ios-signing: no real developmentTeam in build.json; skipping pbxproj stamp');
    return;
  }

  const projDir = fs.readdirSync(iosDir).find((f) => f.endsWith('.xcodeproj'));
  if (!projDir) return;
  const pbx = path.join(iosDir, projDir, 'project.pbxproj');
  if (!fs.existsSync(pbx)) return;

  let s = fs.readFileSync(pbx, 'utf8');
  const before = s;

  if (s.indexOf('DEVELOPMENT_TEAM') === -1) {
    // Add the team next to the bundle id, which every build config carries.
    s = s.replace(/(PRODUCT_BUNDLE_IDENTIFIER = [^;]+;)/g,
                  '$1\n\t\t\t\tDEVELOPMENT_TEAM = ' + team + ';\n\t\t\t\tCODE_SIGN_STYLE = Automatic;');
  } else {
    s = s.replace(/DEVELOPMENT_TEAM = [^;]*;/g, 'DEVELOPMENT_TEAM = ' + team + ';');
  }

  if (s !== before) {
    fs.writeFileSync(pbx, s, 'utf8');
    console.log('fix-ios-signing: stamped DEVELOPMENT_TEAM = ' + team + ' into project.pbxproj');
  }
};
