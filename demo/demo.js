// DEPRECATED

var SERVER_PROTO, SERVER_DOMAIN, SERVER_PORT, ACCESS_TOKEN;

SERVER_PROTO = 'wss';
SERVER_DOMAIN = 'api.api.ai';
SERVER_PORT = '4435';
ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

var config = {
  server: SERVER_PROTO + '://' + SERVER_DOMAIN + ':' + SERVER_PORT + '/api/ws/query',
  token: ACCESS_TOKEN,// Use Client access token there (see agent keys).
  sessionId: '123',
  lang: 'en',
  onInit: function () {
    console.log("> ON INIT use config");
  }
};

var streamClient = new ApiAi.StreamClient(config);

streamClient.onInit = function() {
  console.log("> ON INIT use direct assignment property");
  streamClient.open();
};

streamClient.onStartListening = function() {
  console.log("> ON START LISTENING");
};

streamClient.onStopListening = function() {
  console.log("> ON STOP LISTENING");
};

streamClient.onOpen = function() {
  console.log("> ON OPEN SESSION");
};

streamClient.onClose = function() {
  console.log("> ON CLOSE");
  streamClient.close();
};

streamClient.onResults = function(data) {
  console.log("> ON RESULT", data);
};
streamClient.onError = function(code, data) {
  streamClient.close();
  console.log("> ON ERROR", code, data);
  // if (data && data.indexOf('No live audio input in this browser') >= 0) {}
};

streamClient.onEvent = function(code, data) {
  console.log("> ON EVENT", code, data);
};

/**
 * You have to invoke init() method explicitly to decide when ask permission to use microphone.
 */
streamClient.init();
