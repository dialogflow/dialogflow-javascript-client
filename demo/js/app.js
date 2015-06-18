/**
 * Demo application
 */

var app, text, dialogue, response, start, stop;
var SERVER_DOMAIN, ACCESS_TOKEN;


SERVER_DOMAIN = 'dev.api.ai';
ACCESS_TOKEN = 'f234ec9f1bd747e2a3765f9e74830890';

//SERVER = 'localhost:8080';
//ACCESS_TOKEN = 'a92632e7312b4ab7afa457a0e0a7a515';


window.onload = function () {
    text = $('text');
    dialogue = $('dialogue');
    response = $('response');
    start = $('start');
    stop = $('stop');

    app = new App();
};

function App() {
    var apiAi, apiAiTts;
    var isListening = false;
    var sessionId = _generateId(32);

    this.start = function () {
        start.className += ' hidden';
        stop.className = stop.className.replace('hidden', '');

        _start();
    };
    this.stop = function () {
        _stop();

        stop.className += ' hidden';
        start.className = start.className.replace('hidden', '');
    };

    this.sendJson = function () {
        var query = text.value,
            queryJson = {
                "v": "20150512",
                "query": query,
                "timezone": "GMT+6",
                "lang": "en",
                //"contexts" : ["weather", "local"],
                "sessionId": sessionId
            };

        console.log('sendJson', queryJson);

        apiAi.sendJson(queryJson);
    };

    this.open = function () {
        console.log('open');
        apiAi.open();
    };

    this.close = function () {
        console.log('close');
        apiAi.close();
    };

    this.clean = function () {
        dialogue.innerHTML = '';
    };

    _init();


    function _init() {
        console.log('init');

        /**
         * You can use configuration object to set properties and handlers.
         */
        var config = {
            server: 'wss://' + SERVER_DOMAIN + ':4435/api/ws/query',
            token: ACCESS_TOKEN,// Use Client access token there (see agent keys).
            sessionId: sessionId,
            onInit: function () {
                console.log("> ON INIT use config");
            }
        };
        apiAi = new ApiAi(config);

        /**
         * Also you can set properties and handlers directly.
         */
        apiAi.sessionId = '1234';

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

            /**
             * You can send json through websocet.
             * For example to initialise dialog if you have appropriate intent.
             */
            apiAi.sendJson({
                "v": "20150512",
                "query": "hello",
                "timezone": "GMT+6",
                "lang": "en",
                //"contexts" : ["weather", "local"],
                "sessionId": sessionId
            });

        };

        apiAi.onClose = function () {
            console.log("> ON CLOSE");
            apiAi.close();
        };

        /**
         * Reuslt handler
         */
        apiAi.onResults = function (data) {
            console.log("> ON RESULT", data);

            var status = data.status,
                code,
                speech;

            if (!(status && (code = status.code) && isFinite(parseFloat(code)) && code < 300 && code > 199)) {
                //dialogue.innerHTML = JSON.stringify(status);
                return;
            }

            speech = data.result.speech;
            // Use Text To Speech service to play text.
            apiAiTts.tts(speech);

            dialogue.innerHTML += ('user : ' + data.result.resolvedQuery + '\napi  : ' + data.result.speech + '\n\n');
            response.innerHTML = JSON.stringify(data, null, 2);
            text.innerHTML = '';// clean input
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

        /**
         * Initialise Text To Speech service for playing text.
         */
        apiAiTts = new TTS(SERVER_DOMAIN, ACCESS_TOKEN);

    }

    function _start() {
        console.log('start');

        isListening = true;
        apiAi.startListening();
    }

    function _stop() {
        console.log('stop');

        apiAi.stopListening();
        isListening = false;
    }

    function _generateId(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

}


function $(id) {
    return document.getElementById(id);
}
