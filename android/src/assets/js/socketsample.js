/* var socketurl = '';
var baserateapiurl  = '';
var symbol='';
// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest()

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'http://www.mohanlaljewellers.in/api/getsettings.php', false)

request.onload = function() {
 // Begin accessing JSON data here
 if (request.status >= 200 && request.status < 400) {
response = JSON.parse(this.response);
socketurl = response.socketurl;
baserateapiurl = response.rateurl;
symbols = response.symbol;
 }
}

// Send request
request.send() */

var socketurl = '';
var baserateapiurl  = '';
var symbols ='';
var flag_settings;
var bcurl;
var bcclient;
var bcusername;
var bcpassword;
try{
// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest()

// Open a new connection, using the GET request on the URL endpoint
//request.open('GET', 'http://52.66.59.239/api/getsettings.php', false)
request.open('GET', 'https://www.mohanlaljewellers.in/api/getsettings.php', false)

request.onload = function() {
 // Begin accessing JSON data here
 if (request.status >= 200 && request.status < 400) {
response = JSON.parse(this.response);
socketurl = response.socketurl;
baserateapiurl = response.rateurl;
symbols = response.symbol;
bcurl = response.bcurl;
bcclient = response.bcclient;
bcusername = response.bcusername;
bcpassword = response.bcpassword;
flag_settings = 1;
 }
}

// Send request
request.send()
}catch(e){
    console.log("socketsample ", e);
    var socketurl = 'https://liverate.logimaxindia.com:3001/';
    var baserateapiurl  = 'https://liverate.logimaxindia.com/lmxtrade/winbullliteapi/api/v1/wlcurrentrates';
    flag_settings = 0;
}
