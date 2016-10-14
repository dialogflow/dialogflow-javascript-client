// DEPRECATED

const ACCESS_TOKEN = 'ACCESS_TOKEN';

const client = new ApiAi.Client({accessToken: ACCESS_TOKEN});
const streamClient = client.createStreamClient();

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

client.textRequest("hello").then((result) => console.log(result));
streamClient.init();


