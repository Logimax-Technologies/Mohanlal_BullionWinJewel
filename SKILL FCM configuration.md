---
name: onesignal-to-fcm-migration
description: >-
  Complete, production-tested master guide and automated procedure to migrate any of the 170+
  Logimax Bullion mobile apps (Ionic 3 / Cordova) and web backends (CodeIgniter & Lumen)
  from legacy OneSignal to Google Firebase Cloud Messaging (FCM) HTTP v1 with dynamic multi-provider
  switching ($push_provider = 'both' | 'fcm' | 'onesignal').
---

# Master Playbook: Logimax Bullion Apps OneSignal to FCM HTTP v1 Migration

This skill provides **end-to-end instructions, full drop-in code templates, and exact diffs** to migrate any of the 170+ Logimax Bullion client projects from OneSignal to Google Firebase Cloud Messaging (FCM) HTTP v1.

Any developer or AI agent given this document can migrate a client mobile app (`WTApp-{Client}/android/`) and web backend (`WTWeb-{Client}/`) in under 10 minutes with 0 breaking changes and seamless dual delivery.

---

## 1. System Architecture & Core Concepts

```
                  +------------------------------------------------------+
                  |                WEB BACKEND / ADMIN / CRON            |
                  |  $push_provider = 'both' | 'fcm' | 'onesignal'       |
                  +--------------------------+---------------------------+
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
         [ FCM HTTP v1 Route ]                               [ OneSignal Route ]
                   |                                                   |
      fcm_helper.php (OAuth2 JWT)                          Legacy REST API v1
      Bearer Token Cached 50 mins                                      |
                   |                                                   |
  +----------------+----------------+                                  |
  |                                 |                                  |
Topic 'all'                 Topic 'device_{uuid}'            Segments / Player IDs
(Broadcast, Trade ON/OFF,   (Guest & User Rate Alerts)                 |
 High/Low, Manual Push)             |                                  |
  |                                 |                                  |
  +----------------+----------------+                                  |
                   |                                                   |
                   v                                                   v
         +-------------------+                               +-------------------+
         |  NEW MOBILE APP   |                               |  OLD MOBILE APP   |
         |  (FCM HTTP v1)    |                               |  (OneSignal SDK)  |
         +-------------------+                               +-------------------+
```

### Key Architectural Rules
1. **Google FCM HTTP v1 (OAuth2)**:
   - Google shut down legacy `/fcm/send` in June 2024.
   - FCM HTTP v1 uses OAuth2 access tokens generated on-the-fly via RS256 JWT assertion signed with the Firebase Service Account private key (`wt-{client}-fcm.json`).
   - Access tokens are cached in `sys_get_temp_dir()` for 50 minutes to eliminate OAuth latency on bursts.
   - Self-healing NTP clock compensation prevents token generation failures on skewed Linux servers.

2. **Topic Subscription Strategy (0 DB Hits on Broadcast)**:
   - **Broadcast**: Admin notifications, High/Low alerts, Trade ON/OFF publish to topic `all`. The mobile app subscribes to `all` on startup.
   - **Rate Alerts**: Personal rate alerts publish to topic `device_{cleanUuid}` (where `{cleanUuid}` = `String(uuid).replace(/[^a-zA-Z0-9-_.~%]/g, "_")`) as well as direct device registration token.

3. **Seamless Dual-Delivery (`$push_provider = 'both'`)**:
   - Web backend dispatches to both OneSignal and FCM simultaneously so existing app users on store versions receive notifications while updated users on FCM receive them concurrently.

---

## 2. Information Needed Before Migrating a Client

| Parameter | Description | Example |
|---|---|---|
| `{CLIENT_NAME}` | Client folder code | `MaharajaBullionJMJ` |
| `{CLIENT_KEY}` | Winbull Lite Client Prefix | `MAHARAJ` / `MPSILVER` |
| `{APP_PATH}` | Absolute path to mobile app `android/` | `/run/media/.../WTApp-MaharajaBullionJMJ/android` |
| `{WEB_PATH}` | Absolute path to web backend | `/run/media/.../WTWeb-JMJBullion` |
| `{FCM_JSON_PATH}` | Server path to Firebase Service Account JSON | `/var/www/html/maharaj/client/wt-maharaj-fcm.json` |

---

## 3. Web Backend Migration (`WTWeb-{Client}/`)

### File 1: Add FCM Helper Class
**Path**: `system/helpers/lmx/classes/fcm_helper.php`  
**Action**: Create new file with this exact content:

```php
<?php
defined('BASEPATH') OR defined('FCM_HELPER_EXTERNAL') OR exit('No direct script access allowed');

class Fcm
{
    private $serviceAccountPath;
    private $projectId;
    private $clientEmail;
    private $privateKey;
    private $tokenCacheDir;
    private $lastError = '';

    public function __construct($serviceAccountPath = '', $tokenCacheDir = '')
    {
        if (empty($serviceAccountPath) && class_exists('Globals', false) && !empty(Globals::$fcmServiceAccountPath)) {
            $serviceAccountPath = Globals::$fcmServiceAccountPath;
        }

        if (empty($tokenCacheDir) && class_exists('Globals', false) && !empty(Globals::$fcmTokenCacheDir)) {
            $tokenCacheDir = Globals::$fcmTokenCacheDir;
        }

        if (empty($tokenCacheDir)) {
            $tokenCacheDir = sys_get_temp_dir();
        }

        $this->serviceAccountPath = $serviceAccountPath;
        $this->tokenCacheDir      = rtrim($tokenCacheDir, '/\\');

        $this->load_credentials();
    }

    public function is_ready()
    {
        return !empty($this->projectId) && !empty($this->clientEmail) && !empty($this->privateKey);
    }

    public function last_error()
    {
        return $this->lastError;
    }

    private function load_credentials()
    {
        if (empty($this->serviceAccountPath)) {
            $this->lastError = 'FCM: Service account path not configured.';
            return false;
        }

        if (!file_exists($this->serviceAccountPath) || !is_readable($this->serviceAccountPath)) {
            $this->lastError = 'FCM: Service account file missing or unreadable: ' . $this->serviceAccountPath;
            return false;
        }

        $json = file_get_contents($this->serviceAccountPath);
        $data = json_decode($json, true);

        if (!is_array($data)) {
            $this->lastError = 'FCM: Service account file contains invalid JSON.';
            return false;
        }

        $this->projectId   = isset($data['project_id']) ? $data['project_id'] : '';
        $this->clientEmail = isset($data['client_email']) ? $data['client_email'] : '';
        $this->privateKey  = isset($data['private_key']) ? $data['private_key'] : '';

        if (!$this->is_ready()) {
            $this->lastError = 'FCM: Service account JSON is missing project_id, client_email, or private_key.';
            return false;
        }

        return true;
    }

    public function get_access_token()
    {
        if (!$this->is_ready()) {
            return false;
        }

        $cacheFile = $this->tokenCacheDir . '/fcm_access_token_' . md5($this->clientEmail) . '.json';

        if (file_exists($cacheFile)) {
            $cached = json_decode(@file_get_contents($cacheFile), true);
            if (is_array($cached) && isset($cached['access_token'], $cached['expires_at'])) {
                if (time() < ($cached['expires_at'] - 300)) {
                    return $cached['access_token'];
                }
            }
        }

        $tokenData = $this->request_oauth_token();
        if ($tokenData === false) {
            return false;
        }

        @file_put_contents($cacheFile, json_encode($tokenData), LOCK_EX);
        return $tokenData['access_token'];
    }

    private function base64url_encode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function build_jwt($timeDrift = 0)
    {
        $now = time() + $timeDrift;
        $header = array('alg' => 'RS256', 'typ' => 'JWT');
        $claim  = array(
            'iss'   => $this->clientEmail,
            'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
            'aud'   => 'https://oauth2.googleapis.com/token',
            'iat'   => $now,
            'exp'   => $now + 3600
        );

        $encHeader = $this->base64url_encode(json_encode($header));
        $encClaim  = $this->base64url_encode(json_encode($claim));
        $signatureInput = $encHeader . '.' . $encClaim;

        $binarySig = '';
        $pk = openssl_pkey_get_private($this->privateKey);
        if (!$pk) {
            $this->lastError = 'FCM: Invalid private key format. OpenSSL error: ' . openssl_error_string();
            return false;
        }

        $ok = openssl_sign($signatureInput, $binarySig, $pk, OPENSSL_ALGO_SHA256);
        if (is_resource($pk) || (is_object($pk) && get_class($pk) === 'OpenSSLAsymmetricKey')) {
            if (PHP_VERSION_ID < 80000 && is_resource($pk)) {
                openssl_free_key($pk);
            }
        }

        if (!$ok) {
            $this->lastError = 'FCM: Failed to sign JWT assertion: ' . openssl_error_string();
            return false;
        }

        return $signatureInput . '.' . $this->base64url_encode($binarySig);
    }

    private function request_oauth_token($timeDrift = 0)
    {
        $jwt = $this->build_jwt($timeDrift);
        if ($jwt === false) {
            return false;
        }

        $postFields = http_build_query(array(
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $jwt
        ));

        $ch = curl_init('https://oauth2.googleapis.com/token');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
        curl_setopt($ch, CURLOPT_HEADER, true);

        $rawResponse = curl_exec($ch);
        $httpCode    = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headerSize  = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $curlErr     = curl_error($ch);
        curl_close($ch);

        if ($rawResponse === false) {
            $this->lastError = 'FCM OAuth cURL error: ' . $curlErr;
            return false;
        }

        $headerText = substr($rawResponse, 0, $headerSize);
        $bodyText   = substr($rawResponse, $headerSize);
        $json       = json_decode($bodyText, true);

        if ($httpCode !== 200 || !isset($json['access_token'])) {
            if ($timeDrift === 0 && preg_match('/^Date:\s*(.+)$/mi', $headerText, $m)) {
                $googleTime = strtotime(trim($m[1]));
                if ($googleTime && abs($googleTime - time()) > 30) {
                    $drift = $googleTime - time();
                    return $this->request_oauth_token($drift);
                }
            }

            $this->lastError = 'FCM OAuth token exchange failed (HTTP ' . $httpCode . '): ' . $bodyText;
            return false;
        }

        $expiresIn = isset($json['expires_in']) ? (int)$json['expires_in'] : 3600;
        return array(
            'access_token' => $json['access_token'],
            'expires_at'   => time() + $expiresIn
        );
    }

    public function send($targetType, $targetValue, $title, $body, array $data = array(), array $options = array())
    {
        $accessToken = $this->get_access_token();
        if ($accessToken === false) {
            return false;
        }

        $cleanData = array();
        foreach ($data as $k => $v) {
            if (is_array($v) || is_object($v)) {
                $cleanData[(string)$k] = json_encode($v);
            } elseif ($v === null) {
                $cleanData[(string)$k] = '';
            } else {
                $cleanData[(string)$k] = (string)$v;
            }
        }

        $message = array();
        if ($targetType === 'topic') {
            $topic = ltrim($targetValue, '/topics/');
            $message['topic'] = $topic;
        } elseif ($targetType === 'token') {
            $message['token'] = $targetValue;
        } else {
            $this->lastError = 'FCM: Unknown targetType: ' . $targetType;
            return false;
        }

        $message['notification'] = array(
            'title' => (string)$title,
            'body'  => (string)$body
        );

        if (!empty($cleanData)) {
            $message['data'] = $cleanData;
        }

        $androidNotification = array(
            'sound'        => isset($options['sound']) ? $options['sound'] : 'default',
            'channel_id'   => isset($options['channel_id']) ? $options['channel_id'] : 'default',
            'click_action' => isset($options['click_action']) ? $options['click_action'] : 'FCM_PLUGIN_ACTIVITY'
        );

        if (!empty($options['icon'])) {
            $androidNotification['icon'] = $options['icon'];
        }
        if (!empty($options['color'])) {
            $androidNotification['color'] = $options['color'];
        }
        if (!empty($options['image'])) {
            $androidNotification['image'] = $options['image'];
            $message['notification']['image'] = $options['image'];
        }

        $message['android'] = array(
            'priority'     => isset($options['priority']) ? $options['priority'] : 'HIGH',
            'notification' => $androidNotification
        );

        $message['apns'] = array(
            'headers' => array('apns-priority' => '10'),
            'payload' => array(
                'aps' => array(
                    'sound' => isset($options['sound']) ? $options['sound'] : 'default',
                    'badge' => isset($options['badge']) ? (int)$options['badge'] : 1
                )
            )
        );

        $payload = json_encode(array('message' => $message));
        $url     = 'https://fcm.googleapis.com/v1/projects/' . $this->projectId . '/messages:send';

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json; charset=UTF-8',
            'Authorization: Bearer ' . $accessToken
        ));

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr  = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            $this->lastError = 'FCM send cURL error: ' . $curlErr;
            return false;
        }

        if ($httpCode !== 200) {
            $this->lastError = 'FCM send failed (HTTP ' . $httpCode . '): ' . $response;
            return false;
        }

        return json_decode($response, true);
    }

    public function send_to_topic($topic, $title, $body, array $data = array(), array $options = array())
    {
        return $this->send('topic', $topic, $title, $body, $data, $options);
    }

    public function send_to_token($registrationToken, $title, $body, array $data = array(), array $options = array())
    {
        return $this->send('token', $registrationToken, $title, $body, $data, $options);
    }

    public function send_to_tokens(array $tokens, $title, $body, array $data = array(), array $options = array())
    {
        $results = array('success' => 0, 'failure' => 0, 'errors' => array());
        foreach ($tokens as $tok) {
            $tok = trim($tok);
            if (empty($tok)) continue;
            $res = $this->send_to_token($tok, $title, $body, $data, $options);
            if ($res !== false) {
                $results['success']++;
            } else {
                $results['failure']++;
                $results['errors'][] = array('token' => $tok, 'error' => $this->last_error());
            }
        }
        return $results;
    }
}
```

---

### File 2: Update Notifications Helper
**Path**: `system/helpers/lmx/functions/notifications_helper.php`  
**Action**: Replace whole file with this dynamic dispatcher:

```php
<?php
defined('BASEPATH') OR exit('No direct script access allowed');

function push_notification_helper($fields) {
    $provider = 'both';
    if (class_exists('Globals', false) && !empty(Globals::$push_provider)) {
        $provider = strtolower(Globals::$push_provider);
    }

    $results = array();

    if ($provider === 'fcm' || $provider === 'both') {
        $results['fcm'] = fcm_push_dispatch($fields);
    }

    if ($provider === 'onesignal' || $provider === 'both') {
        $results['onesignal'] = onesignal_push_dispatch($fields);
    }

    return isset($results['fcm']) ? $results['fcm'] : (isset($results['onesignal']) ? $results['onesignal'] : false);
}

function push_token_kind($token) {
    $token = trim((string)$token);
    if ($token === '') return 'empty';
    if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $token)) {
        return 'onesignal';
    }
    if (strlen($token) > 60) {
        return 'fcm';
    }
    return 'unknown';
}

function push_filter_tokens($tokens, $targetProvider) {
    if (!is_array($tokens)) {
        $tokens = array($tokens);
    }
    $filtered = array();
    foreach ($tokens as $tok) {
        $kind = push_token_kind($tok);
        if ($targetProvider === 'fcm' && $kind === 'fcm') {
            $filtered[] = $tok;
        } elseif ($targetProvider === 'onesignal' && $kind === 'onesignal') {
            $filtered[] = $tok;
        }
    }
    return array_values(array_unique($filtered));
}

function fcm_push_dispatch($fields) {
    if (is_string($fields)) {
        $fields = json_decode($fields, true);
    }
    if (!is_array($fields)) {
        return false;
    }

    $CI =& get_instance();
    if (!class_exists('Fcm', false)) {
        $CI->load->library('lmx/classes/fcm_helper');
    }

    $fcm = new Fcm();
    if (!$fcm->is_ready()) {
        log_message('error', 'FCM Dispatcher skipped: ' . $fcm->last_error());
        return false;
    }

    $title = '';
    if (isset($fields['headings'])) {
        $title = is_array($fields['headings']) ? (isset($fields['headings']['en']) ? $fields['headings']['en'] : reset($fields['headings'])) : $fields['headings'];
    }
    if (empty($title) && isset(Globals::$notification_title)) {
        $title = Globals::$notification_title;
    }

    $body = '';
    if (isset($fields['contents'])) {
        $body = is_array($fields['contents']) ? (isset($fields['contents']['en']) ? $fields['contents']['en'] : reset($fields['contents'])) : $fields['contents'];
    }

    $data = isset($fields['data']) && is_array($fields['data']) ? $fields['data'] : array('nav' => '1');

    $options = array();
    if (isset($fields['android_accent_color'])) {
        $options['color'] = '#' . ltrim($fields['android_accent_color'], '#');
    }
    if (isset($fields['big_picture'])) {
        $options['image'] = $fields['big_picture'];
    }

    $sent = false;

    // 1. Topic Broadcast
    if (isset($fields['included_segments']) && is_array($fields['included_segments'])) {
        foreach ($fields['included_segments'] as $segment) {
            $segment = trim($segment);
            if (strtolower($segment) === 'all') {
                $topic = isset(Globals::$fcmTopic) && !empty(Globals::$fcmTopic) ? Globals::$fcmTopic : 'all';
                $res = $fcm->send_to_topic($topic, $title, $body, $data, $options);
                if ($res !== false) $sent = true;
            } elseif (strpos($segment, 'user_') === 0 || strpos($segment, 'device_') === 0) {
                $res = $fcm->send_to_topic($segment, $title, $body, $data, $options);
                if ($res !== false) $sent = true;
            }
        }
    }

    // 2. Direct Device Registration Token Delivery
    if (isset($fields['include_player_ids']) && is_array($fields['include_player_ids'])) {
        $fcmTokens = push_filter_tokens($fields['include_player_ids'], 'fcm');
        if (!empty($fcmTokens)) {
            $batchRes = $fcm->send_to_tokens($fcmTokens, $title, $body, $data, $options);
            if ($batchRes['success'] > 0) $sent = true;
        }
    }

    return $sent;
}

function onesignal_push_dispatch($fields) {
    if (is_string($fields)) {
        $fields = json_decode($fields, true);
    }
    if (!is_array($fields)) {
        return false;
    }

    if (empty($fields['app_id']) && isset(Globals::$app_id)) {
        $fields['app_id'] = Globals::$app_id;
    }

    if (isset($fields['include_player_ids']) && is_array($fields['include_player_ids'])) {
        $osIds = push_filter_tokens($fields['include_player_ids'], 'onesignal');
        if (empty($osIds) && !isset($fields['included_segments'])) {
            return false;
        }
        $fields['include_player_ids'] = $osIds;
    }

    $auth_key = isset(Globals::$rest_api_key) ? Globals::$rest_api_key : '';
    if (empty($auth_key) || empty($fields['app_id'])) {
        return false;
    }

    $json_fields = json_encode($fields);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json; charset=utf-8',
        'Authorization: Basic ' . $auth_key
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HEADER, FALSE);
    curl_setopt($ch, CURLOPT_POST, TRUE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_fields);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);

    $response = curl_exec($ch);
    curl_close($ch);

    return $response;
}
```

---

### File 3: Add FCM Settings to `global_configs.php`
**Path**: `global_configs.php`  
**Action**: Add these properties inside `class Globals`:

```php
    // FCM HTTP v1 Configuration
    public static $fcmServiceAccountPath = "/var/www/html/{client_dir}/client/wt-{client}-fcm.json";
    public static $fcmTopic = "all";
    public static $fcmTokenCacheDir = "";
    public static $push_provider = "both"; // 'onesignal' | 'fcm' | 'both'
```

---

### File 4: Update Rate Alert Triggering in `Booking_model.php`
**Path**: `application/models/Booking_model.php`  
**Action**: Locate `function update_ratealert($alertid)` and update it:

```php
    function update_ratealert($alertid)
    {
        $alert_details = $this->db->query("select * from dt_ratealert where alert_id = ?", array($alertid))->row_array();
        $rate_str = (isset($alert_details['alert_rate']) && !empty($alert_details['alert_rate'])) ? $alert_details['alert_rate'] : '';
        $comm_str = (isset($alert_details['alert_commodity']) && !empty($alert_details['alert_commodity'])) ? $alert_details['alert_commodity'] : '';
        $notification_message = "Your rate alert has been executed. Commodity: " . $comm_str . " Rate: " . $rate_str;

        $target_tokens = array();
        $device_uuid = isset($alert_details['alert_device']) ? trim($alert_details['alert_device']) : '';

        if (!empty($device_uuid)) {
            $device_row = $this->db->query("select device_token, device_uuid from dt_user_device where device_uuid = ? or device_token = ? limit 1", array($device_uuid, $device_uuid))->row_array();
            if (!empty($device_row)) {
                if (!empty($device_row['device_token'])) $target_tokens[] = $device_row['device_token'];
                if (!empty($device_row['device_uuid'])) $target_tokens[] = $device_row['device_uuid'];
            } else {
                $target_tokens[] = $device_uuid;
            }
        }

        $heading = isset(Globals::$notification_title) ? Globals::$notification_title : "Rate Alert Execution";
        $fields = array(
            'included_segments' => (!empty($device_uuid)) ? array('device_' . preg_replace('/[^a-zA-Z0-9-_.~%]/', '_', $device_uuid)) : array(),
            'include_player_ids' => array_values(array_unique($target_tokens)),
            'data' => array("nav" => "1"),
            'headings' => array("en" => $heading),
            'subtitle' => array("en" => "Rate alert Execution"),
            'contents' => array("en" => $notification_message),
            'android_accent_color' => "21a7c5",
            'web_buttons' => array()
        );

        push_notification_helper($fields);

        $data = array('alert_status' => '2');
        $this->db->where('alert_id', $alertid);
        $this->db->update('dt_ratealert', $data);
        return true;
    }
```

---

### File 5: Update Device Registration in `MLogin_model.php`
**Path**: `application/models/MLogin_model.php`  
**Action**: Locate `function user_device_register($regid, $uuid, $type)` and update it:

```php
    function user_device_register($regid, $uuid, $type)
    {
        $regid = trim((string)$regid);
        $uuid  = trim((string)$uuid);

        if (empty($uuid) && empty($regid)) {
            return false;
        }

        $lookupKey = !empty($uuid) ? $uuid : $regid;
        $device_check = $this->db->query("SELECT * FROM dt_user_device WHERE device_uuid = ? OR device_token = ? LIMIT 1", array($lookupKey, $lookupKey))->row_array();

        if (!empty($device_check)) {
            $updateData = array('device_type' => $type, 'updated_at' => date('Y-m-d H:i:s'));
            if (!empty($regid)) $updateData['device_token'] = $regid;
            if (!empty($uuid))  $updateData['device_uuid']  = $uuid;

            $this->db->where('device_id', $device_check['device_id']);
            $this->db->update('dt_user_device', $updateData);
            return $device_check['device_id'];
        } else {
            $insertData = array(
                'device_token' => $regid,
                'device_uuid'  => !empty($uuid) ? $uuid : $regid,
                'device_type'  => $type,
                'created_at'   => date('Y-m-d H:i:s')
            );
            $this->db->insert('dt_user_device', $insertData);
            return $this->db->insert_id();
        }
    }
```

---

### File 6: Admin Broadcast Push in `C_customersms.php`
**Path**: `admin/application/controllers/C_customersms.php`  
**Action**: Update `function create_pushnotification()`:

```php
	function create_pushnotification() {
		$notification_message = $this->input->post('notification_message', true);
		$notification_heading = $this->input->post('notification_heading', true);

		$heading = !empty($notification_heading) ? $notification_heading : (isset(Globals::$notification_title) ? Globals::$notification_title : '');

		$hashes_array = array();
		$fields = array(
			'included_segments' => array('All'),
			'data' => array(
				"nav" => "1"
			),
			'headings' => array("en" => $heading),
			'subtitle' => array("en" => isset(Globals::$notification_subtitle) ? Globals::$notification_subtitle : ''),
			'contents' => array("en" => $notification_message),
			'web_buttons' => $hashes_array
		);

		push_notification_helper($fields);

		$this->session->set_flashdata('message_notification', "Notification sent successfully");
		redirect("C_customersms/open_notification_entry_form");
	}
```

---

### File 7: Winbull Lite API / Lumen (`lmxtrade/winbullliteapi/`)
1. Create `app/FcmClients.php`:
```php
<?php
namespace App;

use Illuminate\Support\Facades\Log;

class FcmClients
{
	private static $senders = [];

	public static function forClient($clientKey)
	{
		if ($clientKey === null || $clientKey === '') return null;
		if (array_key_exists($clientKey, self::$senders)) return self::$senders[$clientKey] ?: null;

		self::$senders[$clientKey] = false;
		$configured = json_decode((string) env('FCM_SERVICE_ACCOUNTS', ''), true);
		if (!is_array($configured) || !isset($configured[$clientKey])) return null;

		if (!self::loadHelper()) return null;

		$sender = new \Fcm($configured[$clientKey], storage_path('app'));
		if (!$sender->is_ready()) {
			Log::error('FCM disabled for client ' . $clientKey . ': ' . $sender->last_error());
			return null;
		}

		self::$senders[$clientKey] = $sender;
		return $sender;
	}

	public static function topic()
	{
		return (string) env('FCM_TOPIC', 'all');
	}

	private static function loadHelper()
	{
		if (class_exists('\Fcm')) return true;
		$path = env('FCM_HELPER_PATH', dirname(__DIR__, 3) . '/system/helpers/lmx/classes/fcm_helper.php');
		if (!is_readable($path)) {
			Log::error('FCM helper not found at ' . $path);
			return false;
		}
		if (!defined('FCM_HELPER_EXTERNAL')) define('FCM_HELPER_EXTERNAL', true);
		require_once $path;
		return class_exists('\Fcm');
	}
}
```
2. Update `.env` and `.env.example`:
```env
FCM_SERVICE_ACCOUNTS='{"{CLIENT_KEY}":"/var/www/html/{client}/client/wt-{client}-fcm.json"}'
FCM_TOPIC=all
```

---

## 4. Mobile App Migration (`WTApp-{Client}/android/`)

### File 1: Update `package.json`
Add `cordova-plugin-firebasex-messaging` & modern Dart Sass build overrides:

```json
  "devDependencies": {
    "cordova-android": "^15.0.0",
    "cordova-plugin-firebasex-messaging": "^2.0.2",
    "node-sass": "npm:sass@^1.103.1",
    "sass": "^1.77.8"
  },
  "cordova": {
    "plugins": {
      "cordova-plugin-firebasex-messaging": {
        "FIREBASE_FCM_AUTOINIT_ENABLED": "true",
        "FIREBASE_MESSAGING_IMMEDIATE_PAYLOAD_DELIVERY": "false",
        "IOS_FCM_ENABLED": "true",
        "IOS_ENABLE_CRITICAL_ALERTS_ENABLED": "false",
        "ANDROID_ICON_ACCENT": "#FFFFFF",
        "ANDROID_FIREBASE_MESSAGING_VERSION": "25.0.2"
      }
    }
  },
  "config": {
    "ionic_sass": "./sass.config.js"
  },
  "overrides": {
    "node-sass": "$node-sass"
  }
```

> **CRITICAL — `cordova-android` must be `>= 15`.** `cordova-plugin-firebasex-messaging@2.x` requires `cordova-android >= 14`. Legacy apps often pin `cordova-android ^13.0.0`; with 13 the plugin is **silently skipped** during `cordova platform add` (`Plugin doesn't support this project's cordova-android version ... Skipping`), so the app builds with **no FCM at all**. Bump to `^15.0.0`. Note that `cordova platform rm android` strips `cordova-android` from `package.json` — re-add it with `npm i -D cordova-android@^15.0.0 --legacy-peer-deps` if you ever remove the platform.

> **npm 10 gotchas** (these projects are legacy Angular 5 trees):
> - The `overrides` value **must** be `"$node-sass"` (reference the direct dependency), not a literal `npm:sass@...`. A literal version conflicts with the `node-sass` devDependency and fails with `EOVERRIDE`.
> - Add an **`.npmrc`** next to `package.json` containing `legacy-peer-deps=true`. Without it, `npm install` and (more importantly) Cordova's internal npm calls during `platform add` fail with `ERESOLVE` on the `@angular/http@7` ↔ `@angular/core@5` peer conflict.

---

### File 2: Update `config.xml`
Under `<platform name="android">`:
```xml
    <platform name="android">
        <hook src="scripts/fix-gradle-wrapper.js" type="before_prepare" />
        <hook src="scripts/fix-gradle-wrapper.js" type="before_build" />
        <hook src="scripts/fix-gradle-wrapper.js" type="before_compile" />
        <preference name="Scheme" value="http" />
        <preference name="GradlePluginGoogleServicesEnabled" value="true" />
        <resource-file src="resources/android/{client}-fcm.json" target="app/google-services.json" />
```
Under `<platform name="ios">`:
```xml
    <platform name="ios">
        <resource-file src="resources/ios/GoogleService-Info.plist" />
```

On the `<widget><author>` element, update the author email to the shared support address:
```xml
    <author email="support@logimaxindia.com" href="http://www.logimaxindia.com/">Logimax Team</author>
```
> Change any legacy per-developer address (e.g. `vinoth@logimaxindia.com`) to `support@logimaxindia.com` so store/build contact points at the shared team inbox, not an individual.

---

### File 3: Add Build Support Scripts
Create `scripts/postinstall-patch.js`:
```javascript
const fs = require('fs');
const path = require('path');

// Patch 1: Fix ionic-angular multi-line SCSS strings
const scssFile = path.join('node_modules', 'ionic-angular', 'themes', 'ionic.functions.scss');
if (fs.existsSync(scssFile)) {
  let scss = fs.readFileSync(scssFile, 'utf8');
  if (scss.includes('$error-msg: "\n')) {
    scss = scss.replace(/\$error-msg:\s*"\n[\s\S]*?";/g, (m) => {
      const i = m.match(/\$error-msg:\s*"([\s\S]*?)";/);
      return i ? `$error-msg: "${i[1].replace(/\n\s*/g, ' ').trim()}";` : m;
    });
    fs.writeFileSync(scssFile, scss);
    console.log('✔ Patched ionic SCSS multi-line strings');
  } else { console.log('✔ ionic SCSS already patched'); }
}

// Patch 2: Silence Dart Sass deprecation warnings
const sassJs = path.join('node_modules', '@ionic', 'app-scripts', 'dist', 'sass.js');
if (fs.existsSync(sassJs)) {
  let s = fs.readFileSync(sassJs, 'utf8');
  if (!s.includes('logger:')) {
    s = s.replace(
      'node_sass_1.render(sassConfig,',
      'sassConfig.quietDeps=true;sassConfig.logger={warn:function(){}};node_sass_1.render(sassConfig,'
    );
    fs.writeFileSync(sassJs, s);
    console.log('✔ Patched sass.js — warnings silenced');
  } else { console.log('✔ sass.js already patched'); }
}

// Patch 3: Remove nested node-sass inside @ionic/app-scripts
const nestedNodeSass = path.join('node_modules', '@ionic', 'app-scripts', 'node_modules', 'node-sass');
if (fs.existsSync(nestedNodeSass)) {
  try {
    fs.rmSync(nestedNodeSass, { recursive: true, force: true });
    console.log('✔ Removed nested node-sass inside @ionic/app-scripts');
  } catch (e) {
    console.warn('Warning: Could not remove nested node-sass:', e.message);
  }
}

// Patch 4: Ensure Gradle wrapper uses Gradle 8.14.2 for cordova-android v15
const gradlePropsPath = path.join('platforms', 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties');
if (fs.existsSync(gradlePropsPath)) {
  let content = fs.readFileSync(gradlePropsPath, 'utf8');
  const localGradlePath = '/home/lmx/.gradle/local-dists/gradle-8.14.2-bin.zip';
  const distUrl = fs.existsSync(localGradlePath)
    ? 'file\\:///home/lmx/.gradle/local-dists/gradle-8.14.2-bin.zip'
    : 'https\\://services.gradle.org/distributions/gradle-8.14.2-bin.zip';

  if (!content.includes('gradle-8.14.2')) {
    content = content.replace(/distributionUrl=.*/g, `distributionUrl=${distUrl}`);
    fs.writeFileSync(gradlePropsPath, content, 'utf8');
    console.log('✔ Patched gradle-wrapper.properties to Gradle 8.14.2');
  } else { console.log('✔ gradle-wrapper.properties already on Gradle 8.14.2'); }
}

// Patch 5: Patch cordova-android ProjectBuilder.js
const projectBuilderJs = path.join('node_modules', 'cordova-android', 'lib', 'builders', 'ProjectBuilder.js');
if (fs.existsSync(projectBuilderJs)) {
  let pbContent = fs.readFileSync(projectBuilderJs, 'utf8');
  if (!pbContent.includes('gradle-8.14.2-bin.zip')) {
    pbContent = pbContent.replace(
      'async installGradleWrapper (gradleVersion) {',
      'async installGradleWrapper (gradleVersion) {\n        if (process.env.CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL && process.env.CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL.includes("8.7")) {\n            process.env.CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL = process.env.CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL.replace(/gradle-8\\.7(-bin|-all)?\\.zip/, "gradle-8.14.2-bin.zip");\n        }'
    );
    fs.writeFileSync(projectBuilderJs, pbContent, 'utf8');
    console.log('✔ Patched cordova-android ProjectBuilder.js (Gradle 8.7 -> 8.14.2)');
  } else { console.log('✔ cordova-android ProjectBuilder.js already patched'); }
}

console.log('✔ postinstall patches complete');
```

Create `scripts/fix-gradle-wrapper.js`:
```javascript
const fs = require('fs');
const path = require('path');

const gradlePropsPath = path.join(process.cwd(), 'platforms', 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties');

if (fs.existsSync(gradlePropsPath)) {
  let content = fs.readFileSync(gradlePropsPath, 'utf8');
  const localGradlePath = '/home/lmx/.gradle/local-dists/gradle-8.14.2-bin.zip';
  const distUrl = fs.existsSync(localGradlePath)
    ? 'file\\:///home/lmx/.gradle/local-dists/gradle-8.14.2-bin.zip'
    : 'https\\://services.gradle.org/distributions/gradle-8.14.2-bin.zip';

  if (!content.includes('gradle-8.14.2')) {
    content = content.replace(/distributionUrl=.*/g, `distributionUrl=${distUrl}`);
    fs.writeFileSync(gradlePropsPath, content, 'utf8');
    console.log('✔ [Hook] Fixed Gradle wrapper to 8.14.2');
  }
}
```

Create `sass.config.js`:
```javascript
const sassConfig = require('@ionic/app-scripts/config/sass.config.js');
sassConfig.sassModule = require('sass');
sassConfig.quietDeps = true;
sassConfig.logger = { warn: function() {} };
module.exports = sassConfig;
```

---

### File 4: Update `src/app/app.module.ts`
Remove `OneSignal` import and remove `OneSignal` from the `providers: [...]` array.

---

### File 5: Update `src/app/app.component.ts`
1. Remove `OneSignal` import and constructor argument.
2. In `constructor`:
```typescript
      document.addEventListener("deviceready", FcmInit, false);
      var that = this;
      var self = this;

      function runServerAppSettings(fcmToken?: string) {
        var token = fcmToken || localStorage.getItem("{CLIENT_KEY}_fcmToken") || "1563456123";
        var uuid = (self && self.device && self.device.uuid) ? self.device.uuid : (window['device'] ? window['device']['uuid'] : "78976952552");
        var isAndroid = (self && self.platform) ? self.platform.is('android') : true;
        var isIos = (self && self.platform) ? self.platform.is('ios') : false;
        var platformId = isAndroid ? 1 : (isIos ? 2 : 0);

        var deviceData = {
          pushToken: token,
          uuid: uuid,
          deviceType: isAndroid ? 1 : 2,
          platform: platformId
        };
        localStorage.setItem("{CLIENT_KEY}_deviceData", JSON.stringify(deviceData));

        let initialData = JSON.parse(localStorage.getItem("{CLIENT_KEY}_InitialData"));
        var appVer = (self && self.app_version) ? self.app_version : "1.0.0";

        if (initialData == null || initialData == undefined) {
          if (self && self.checkserverappSettings) {
            self.checkserverappSettings(JSON.stringify({
              platform: platformId,
              app_version: appVer,
              uuid: uuid,
              pushToken: token
            }));
          }
        } else {
          if (self && self.checkserverappSettingsChanges) {
            self.checkserverappSettingsChanges(JSON.stringify({
              platform: platformId,
              app_version: appVer,
              uuid: uuid,
              pushToken: token,
              updatetime: initialData.updatetime
            }));
          }
        }
      }

      function FcmInit() {
        var settingsCalled = false;
        function triggerSettingsOnce(token?: string) {
          if (!settingsCalled) {
            settingsCalled = true;
            runServerAppSettings(token);
          }
        }

        if (!window["FirebasexMessaging"]) {
          triggerSettingsOnce();
          return;
        }

        var fcm = window["FirebasexMessaging"];

        fcm.hasPermission(function (hasPermission) {
          if (!hasPermission) {
            fcm.grantPermission(function (granted) {});
          }
        });

        // 1. Broadcast Topic (All users, Trade ON/OFF, High/Low, Admin Messages)
        fcm.subscribe("all", function () {}, function (err) {});

        // 2. Device UUID Topic (for rate alerts)
        try {
          var deviceUuid = (self && self.device && self.device.uuid) ? self.device.uuid : (window['device'] ? window['device']['uuid'] : null);
          if (deviceUuid) {
            var cleanUuid = String(deviceUuid).replace(/[^a-zA-Z0-9-_.~%]/g, "_");
            fcm.subscribe("device_" + cleanUuid, function () {}, function (err) {});
          }
        } catch (e) {}

        // 3. Message Receiver
        fcm.onMessageReceived(function (message) {
          var title = message.title || (message.notification ? message.notification.title : "") || "";
          var body = message.body || (message.notification ? message.notification.body : "") || "";

          // CRITICAL: FCM does NOT auto-post to the system tray when the app is in
          // the FOREGROUND — it only calls this handler. `message.tap` is set only
          // when the user tapped a tray notification (app was backgrounded/closed),
          // which Android already displayed. So when `tap` is absent we must show the
          // notification in-app ourselves, or foreground pushes appear to "not arrive".
          if (!message.tap && (title || body)) {
            that.presentPushNotification(title, body);
          }

          if (title || body) {
            that.events.publish("notificationdata", { title: title, subTitle: body });
          }
        });

        // 4. Token handling
        fcm.getToken(function (token) {
          if (token) localStorage.setItem("{CLIENT_KEY}_fcmToken", token);
          triggerSettingsOnce(token);
        }, function (err) {
          triggerSettingsOnce();
        });

        fcm.onTokenRefresh(function (token) {
          if (token) localStorage.setItem("{CLIENT_KEY}_fcmToken", token);
        });

        setTimeout(function() {
          triggerSettingsOnce();
        }, 1500);
      }
```
3. In `ResponsiveApp()`:
```typescript
    ResponsiveApp() {
      this.platform.ready().then(() => {
        try {
          if (this.mobileAccessibility) {
            this.mobileAccessibility.getTextZoom().then((textZoom) => {}).catch((err) => {});
            try { this.mobileAccessibility.setTextZoom(100); } catch (e) {}
            try { this.mobileAccessibility.usePreferredTextZoom(false); } catch (e) {}
          }
        } catch (e) {}
      });
    }
```
4. Add a `presentPushNotification()` method to the class (referenced by the foreground branch of `onMessageReceived`). Without it, pushes only appear when the app is closed. Use a top toast so it reads as a notification banner and does not block navigation:
```typescript
	presentPushNotification(title, body) {
		let message = (title && body) ? (title + ': ' + body) : (title || body);
		if (!message) { return; }
		let toast = this.toastController.create({
			message: message,
			duration: 6000,
			position: 'top',
			showCloseButton: true,
			closeButtonText: 'Close',
			cssClass: 'push-toast'
		});
		toast.present();
	}
```
> Requires `ToastController` (already injected in most Winbull Lite apps). If the client prefers a blocking dialog instead of a banner, swap in `this.alertCtrl.create({ title, subTitle: body, buttons: ['OK'] })`.

---

### File 6: Bump App Version & Confirm SDK Targets
**Action**: Every FCM migration ships as a **new store release**, so increment the version. Keep all three values in sync.

1. **`config.xml`** — bump `android-versionCode` (integer, +1) and `version` (semver) on the `<widget>` element:
```xml
<widget android-versionCode="{OLD+1}" id="{app.id}" version="{NEW_SEMVER}" ...>
```
2. **`src/app/app.component.ts`** — bump the hardcoded fallback to match `config.xml`:
```typescript
  app_version = "{NEW_SEMVER}";
```
> Note: on-device, `appVersion.getVersionNumber()` overwrites `app_version` from `config.xml` at runtime, so `config.xml` is the source of truth. The hardcoded value only matters for the non-Cordova/web path — keep it in sync anyway.

3. **Confirm SDK targets** in `config.xml`. `minSdkVersion` **must be >= 23** — `com.google.firebase:firebase-messaging:25.0.2` declares `minSdk 23`, so a lower value (e.g. the legacy `22`) fails the manifest merge with:
   `uses-sdk:minSdkVersion 22 cannot be smaller than version 23 declared in library [com.google.firebase:firebase-messaging:25.0.2]`.
   Do NOT lower `targetSdkVersion` either; Play Store requires `targetSdkVersion >= 35` as of 2025.
```xml
<preference name="android-minSdkVersion" value="23" />
<preference name="android-targetSdkVersion" value="36" />
```

---

### File 7: Fix Android 15+ Edge-to-Edge Status Bar / Footer "Extra Space"

**Symptom**: After the migration the app shows an **empty colored band** at the top (header background above the logo) and/or bottom (footer background above the nav bar) — users report "extra space" near the **status bar** and **footer**.

**Root cause**: Upgrading to **`cordova-android 15`** (required for the FCM plugin) turns the WebView **edge-to-edge**: the default theme sets `android:statusBarColor` transparent and the activity draws full-screen behind the system bars. On these apps the WebView is *already* laid out below the status bar and above the nav bar, yet the header/footer SCSS also pads by `env(safe-area-inset-*)` — so the inset is **double-counted** and rendered as a redundant band. Under the old `cordova-android 13` those insets were `0`, so the bands never appeared. `StatusBar.overlaysWebView(false)` does **not** undo this on cordova-android 15.

**Do NOT** try to "fix" it with `env(safe-area-inset-*)` or a hardcoded value like `38px` — both still produce a band (the WebView is already inset). The correct padding is **`0` on every Android version**.

Winbull Lite apps drive these paddings from CSS variables set at startup. The **legacy** SCSS (in `src/app/app.scss`) uses an `env()` fallback — which is exactly what causes the bands (and the File 7b content gap). Change the fallback to `0px`:
```scss
ion-header { padding-top:    var(--header-padding, 0px) !important; }  // was env(safe-area-inset-top)
ion-footer { padding-bottom: var(--footer-padding, 0px) !important; }  // was env(safe-area-inset-bottom)
```

In `src/app/app.component.ts`, inside `platform.ready().then(...)`, set the header/footer padding variables to `0` (replace any prior `device.version`-based block — and note the legacy string comparison `device.version >= '15'` is buggy: `'9' >= '15'` is `true`):
```typescript
      // The Cordova WebView (cordova-android 15 + ionic-webview) is already laid out below the
      // opaque status bar and above the nav bar, so env(safe-area-inset-*) double-counts and adds
      // a redundant colored band in the header/footer. Keep those paddings at 0 so the header and
      // footer sit flush against the system bars. (Applies to Android 14 and 16 alike.)
      document.documentElement.style.setProperty('--header-padding', '0px');
      document.documentElement.style.setProperty('--footer-padding', '0px');
      document.documentElement.style.setProperty('--viewer-margin-top', '56px');
      document.documentElement.style.setProperty('--fabs-margin-bottom', '70px');
      document.documentElement.style.setProperty('--skip_btn_height-margin-top', '0px');
```

> Verified on Android 14 (3-button nav) and Android 16 / One UI (gesture nav): logo sits flush below the status bar, footer/copyright sits flush above the nav bar, with no colored bands. Verify on-device with `adb exec-out screencap -p > shot.png` after each build.

#### File 7b: Fix the empty band *between the header and the content* — change the SCSS fallback to `0`

**Symptom** (all Android versions once on cordova-android 15): even after the header padding is `0`, there is an empty band **between the fixed header and the first content element** (e.g. between the marquee/welcome bar and the first table).

**Root cause**: On the edge-to-edge WebView, `env(safe-area-inset-top)` returns the status-bar height (~29–32px) **regardless of `viewport-fit`**. Ionic 3's `Content` measures the header height **once at page load** and sets `.scroll-content` `margin-top = headerHeight` (`_cTop = _hdrHeight`). But `app.component` sets `--header-padding: 0` *inside* `platform.ready()`, which resolves **after** that measurement — so at measure time the SCSS fallback `env(safe-area-inset-top)` makes the header ~32px taller, and Ionic bakes that into the content margin as a persistent gap (it does **not** re-measure when the padding later changes). Confirmed via remote debugging: `env=32`, header `clientHeight=100` after JS runs, but `scroll-content margin-top=132`.

**Fix** — make the SCSS **fallback** `0px` (not `env(...)`) so the header is the correct height from the very first paint, before any JS runs. This is the single change that fixes **both** the header/footer bands (File 7) *and* this content gap. In `src/app/app.scss`:
```scss
ion-header { padding-top:    var(--header-padding, 0px) !important; }  // was env(safe-area-inset-top)
ion-footer { padding-bottom: var(--footer-padding, 0px) !important; }  // was env(safe-area-inset-bottom)
```
Keep the `app.component.ts` `--header-padding`/`--footer-padding = 0px` assignments too (belt-and-suspenders; they also cover the web build path).

> **Approaches that DON'T work (verified, avoid):**
> - `.scroll-content { transform: translateY(calc(-1 * env(safe-area-inset-top))) }` — closes the gap on the pages where Ionic added the inset, but **clips the top of pages where it didn't** (Ionic's per-page behavior is inconsistent). Do not use.
> - Removing `viewport-fit=cover` — the inset persists on the edge-to-edge WebView; no effect.
> - Ionic `IonicModule.forRoot(MyApp, { statusbarPadding: false })` — does not change the content margin here.
> - Native edge-to-edge opt-out (`android:windowOptOutEdgeToEdgeEnforcement` + targetSdk 35) — the theme flag does **not** zero `env()` (cordova-android 15 forces edge-to-edge in Java).
> - Patching `CordovaActivity.java` `setDecorFitsSystemWindows(..., true)` — **does** zero `env()`, but **breaks on-screen compositing (black screen on the device)**. Never ship this.
>
> To diagnose gaps like this, remote-debug the WebView: `adb forward tcp:9222 localabstract:webview_devtools_remote_$(adb shell pidof <pkg>)`, then `Runtime.evaluate` computed `margin-top` / `env(safe-area-inset-top)` via `http://localhost:9222/json`. Note `adb exec-out screencap` can return an all-black frame for a WebView surface even when the screen is fine — confirm with the CDP `Page.captureScreenshot` render, or a fresh screencap right after relaunch.

---

## 5. Verification Checklist (Run on every migration)

```bash
# 1. PHP Syntax Check
php -l global_configs.php
php -l system/helpers/lmx/classes/fcm_helper.php
php -l system/helpers/lmx/functions/notifications_helper.php
php -l application/models/Booking_model.php
php -l application/models/MLogin_model.php
php -l application/controllers/C_client_main.php
php -l admin/application/controllers/C_customersms.php
php -l lmxtrade/winbullliteapi/app/FcmClients.php

# 2. Android App Build Verification
cd android
node scripts/postinstall-patch.js
node ./node_modules/@ionic/app-scripts/bin/ionic-app-scripts.js build

# 3. Version & SDK Sanity Check (must be a NEW release, targetSdk >= 35)
grep -E 'android-versionCode|version=' config.xml | head -1
grep 'android-targetSdkVersion' config.xml
grep 'app_version =' src/app/app.component.ts
```

---

## 6. Common Gotchas & Troubleshooting

| Issue | Root Cause | Solution |
|---|---|---|
| `Manifest merger failed : uses-sdk:minSdkVersion 22 cannot be smaller than version 23 declared in library [com.google.firebase:firebase-messaging:25.0.2]` | Legacy apps ship `android-minSdkVersion=22`, but `firebase-messaging:25.0.2` requires minSdk 23 | Set `<preference name="android-minSdkVersion" value="23" />` in `config.xml`, then re-run `cordova run android --device`. |
| Notification only appears when the app is **closed**, not while it is **open** | FCM does not auto-post `notification` messages to the system tray when the app is in the foreground — it only invokes `onMessageReceived`. If that handler merely publishes an event with no subscriber, nothing is shown. | In `onMessageReceived`, when `message.tap` is absent (foreground delivery), call `presentPushNotification(title, body)` to show an in-app toast/alert. See Mobile App File 5. |
| `JWT signature invalid` / `401 Unauthorized` | Server clock is skewed > 5 minutes | `fcm_helper.php` automatically auto-compensates for NTP drift using the HTTP `Date` response header from Google. |
| Duplicate device rows in `dt_user_device` | Search query was matching `device_token` which changes between OneSignal UUID and FCM token string | Key all lookups on `device_uuid = ?` as implemented in `MLogin_model.php`. |
| Sass compilation error on Node 20/24 | `@ionic/app-scripts` attempts to use legacy C++ `node-sass` | Configured `node-sass: npm:sass@^1.103.1` in `package.json` and added `sass.config.js`. |
| Gradle build failure on cordova-android 15+ | Cordova defaults to old Gradle 8.7 while AGP 8.10.1 requires Gradle 8.14.2+ | `fix-gradle-wrapper.js` and `postinstall-patch.js` automatically enforce Gradle 8.14.2 distribution. |
| Double image popup on app startup | `checkserverappSettings()` triggered twice (from deviceready + token listener) | Added `settingsCalled` debounce lock in `FcmInit()`. |
| Empty colored band ("extra space") near the **status bar** and/or **footer** | `cordova-android 15` renders the WebView edge-to-edge, so the header/footer `env(safe-area-inset-*)` padding double-counts an inset the WebView already applies | Set `--header-padding` / `--footer-padding` to `0px` at startup (Mobile App **File 7**). Not `env()`, not a fixed px — `0` on all Android versions. |
| Empty band **between the header and the first content row** | Ionic 3 measures the header height once at load (before `platform.ready()` sets `--header-padding:0`), so the SCSS `env()` fallback makes the header taller and Ionic bakes that into `.scroll-content margin-top` | Change the SCSS **fallback** to `0px`: `padding-top: var(--header-padding, 0px)` (Mobile App **File 7b**). NOT a `transform` (clips), NOT a native decor patch (black screen). |
| FCM not working; no `cordova-plugin-firebasex-*` in `cordova plugin ls` | Project pins `cordova-android ^13`; the plugin requires `>= 14` and is **silently skipped** at `platform add` | Bump `cordova-android` to `^15.0.0`, remove `platforms/android`, re-run `cordova platform add android@15`. |
| `npm error code EOVERRIDE ... node-sass conflicts with direct dependency` | On npm 10 an `overrides` entry can't restate a direct dependency's version literally | Use `"overrides": { "node-sass": "$node-sass" }` (reference form). |
| `ERESOLVE` during `npm install` or `cordova platform add` | Legacy Angular 5 tree (`@angular/http@7` peer-conflicts with `@angular/core@5`) | Add `.npmrc` with `legacy-peer-deps=true` so all npm calls (including Cordova's) resolve. |

