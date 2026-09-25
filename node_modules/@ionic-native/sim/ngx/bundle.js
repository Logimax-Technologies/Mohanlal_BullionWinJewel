'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var Sim = /** @class */ (function (_super) {
    tslib.__extends(Sim, _super);
    function Sim() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sim.prototype.getSimInfo = function () { return core.cordova(this, "getSimInfo", {}, arguments); };
    Sim.prototype.hasReadPermission = function () { return core.cordova(this, "hasReadPermission", { "platforms": ["Android"] }, arguments); };
    Sim.prototype.requestReadPermission = function () { return core.cordova(this, "requestReadPermission", { "platforms": ["Android"] }, arguments); };
    Sim.pluginName = "Sim";
    Sim.plugin = "cordova-plugin-sim";
    Sim.pluginRef = "plugins.sim";
    Sim.repo = "https://github.com/pbakondy/cordova-plugin-sim";
    Sim.platforms = ["Android", "iOS", "Windows", "Windows Phone"];
    Sim.decorators = [
        { type: core$1.Injectable }
    ];
    return Sim;
}(core.IonicNativePlugin));

exports.Sim = Sim;
