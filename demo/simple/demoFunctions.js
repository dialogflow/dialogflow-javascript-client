"use strict";

/**
 * All this stuff is moved into global namespace and separate files just to be
 * MAXIMUM clear and easy to understand
 */

var client;
window.init = function(token) {
  client = new ApiAi.ApiAiClient({accessToken: token});
};

function sendText(text) {
  return client.textRequest(text);
}
