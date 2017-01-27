"use strict";

/**
 * All this stuff is moved into global namespace and separate files just to be MAXIMUM clear and easy to understand
 */

var client, streamClient;
window.init = function(token) {
  
  if (streamClient) {
    streamClient.close();
  }
  
  client = new ApiAi.ApiAiClient({accessToken: token, streamClientClass: ApiAi.ApiAiStreamClient});
  
  streamClient = client.createStreamClient();
  console.log(client.createStreamClient());
  streamClient.init();

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
}


// streamClient events definitions

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
