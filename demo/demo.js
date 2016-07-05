/*var client = new ApiAi.Client('YOUR_ACCESS_TOKEN');
//will work (well, somehow)
var request = 'test';
//will not work, too long, should throw error
var longTextRequest = 'test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test ';

client.textRequest(longTextRequest)
    .then(handleResponse)
    .catch(heandleError);

function handleResponse(serverResponse) {
    console.log(serverResponse);
}
function heandleError(serverError) {
    console.log(serverError);
}*/


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

apiAi = ApiAi.Client.createStream(config);

apiAi.onInit = function () {
    console.log("> ON INIT use direct assignment property");
    apiAi.open();
};

apiAi.onStartListening = function () {
    console.log("> ON START LISTENING");
};

apiAi.onStopListening = function () {
    console.log("> ON STOP LISTENING");
};

apiAi.onOpen = function () {
    console.log("> ON OPEN SESSION");
};

apiAi.onClose = function () {
    console.log("> ON CLOSE");
    apiAi.close();
};

apiAi.onResults = function (data) {
    console.log("> ON RESULT", data)
};
apiAi.onError = function (code, data) {
    apiAi.close();
    console.log("> ON ERROR", code, data);
    //if (data && data.indexOf('No live audio input in this browser') >= 0) {}
};

apiAi.onEvent = function (code, data) {
    console.log("> ON EVENT", code, data);
};

/**
 * You have to invoke init() method explicitly to decide when ask permission to use microphone.
 */
apiAi.init();



