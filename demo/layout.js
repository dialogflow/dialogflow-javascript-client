(function() {
  "use strict";

  var ENTER_KEY_CODE = 13;
  var queryInput, resultDiv;

  window.onload = init;

  function init() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");
    console.log(resultDiv);
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
      }
      setResponseOnNode(result, responseNode);

    });
  }

  function createQueryNode(query) {
    var node = document.createElement('div');
    node.className = "left-align flow-text";
    node.innerHTML = query;
    console.log(node);
    resultDiv.appendChild(node);
  }

  function createResponseNode() {
    var node = document.createElement('div');
    node.className = "right-align flow-text";
    node.innerHTML = "...";
    resultDiv.appendChild(node);
    return node;
  }

  function setResponseOnNode(response, node) {
    node.innerHTML = response;
  }

  function sendRequest() {

  }

})();
