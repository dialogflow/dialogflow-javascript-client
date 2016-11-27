(function() {
  "use strict";

  var ENTER_KEY_CODE = 13;
  var queryInput, resultDiv;

  window.onload = init;

  function init() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");
    queryInput.addEventListener("keydown", queryInputKeyDown);
  }

  function queryInputKeyDown(event) {
    if (event.which !== ENTER_KEY_CODE) {
      return;
    }

    var value = queryInput.value;
    queryInput.value = "";

    createQueryNode(value);
    var responseNode = createResponseNode();

    sendText(value).then(function(response) {
      var result;
      try {
        result = response.result.fulfillment.speech
      } catch(error) {
        result = "";
      }

      if (!result) {
        result = "[empty response]";
      } else {
        tts(result).catch((err) => {
          Materialize.toast(err, 2000, 'red lighten-1');
        });
      }
      setResponseJSON(response);
      setResponseOnNode(result, responseNode);
    });
  }

  function createQueryNode(query) {
    var node = document.createElement('div');
    node.className = "left-align card-panel teal lighten-2 teal lighten-2";
    node.innerHTML = query;
    resultDiv.appendChild(node);
  }

  function createResponseNode() {
    var node = document.createElement('div');
    node.className = "right-align card-panel blue-text text-darken-2";
    node.innerHTML = "...";
    resultDiv.appendChild(node);
    return node;
  }

  function setResponseOnNode(response, node) {
    node.innerHTML = response;
  }

  function setResponseJSON(response) {
    var node = document.getElementById("jsonResponse");
    node.innerHTML = JSON.stringify(response, null, 2);
  }

  function sendRequest() {

  }

})();
