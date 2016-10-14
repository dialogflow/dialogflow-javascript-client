const ACCESS_TOKEN = '3485a96fb27744db83e78b8c4bc9e7b7';
const client = new ApiAi.Client({accessToken: ACCESS_TOKEN});
const streamClient = client.createStreamClient();

"use strict";
// streamClient events definitions

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

streamClient.onResults = streamClientOnResults;

streamClient.onError = function(code, data) {
  streamClient.close();
  console.log("> ON ERROR", code, data);
};

streamClient.onEvent = function(code, data) {
  console.log("> ON EVENT", code, data);
};

function sendText(text) {
  return client.textRequest(text);
}

function tts(text) {
  return client.ttsRequest(text);
}

function startMic() {
  streamClient.startListening();
}

function stopMic() {
  streamClient.stopListening();
}

function streamClientOnResults(results) {
  console.log("> ON RESULTS", results);
}
