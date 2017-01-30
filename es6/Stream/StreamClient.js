import { IStreamClient } from "../Interfaces";
import { Processors } from "./Processors";
import Recorder from "./Recorder";
/**
 * this is mostly copy-paste of v1 API.AI JS SDK.
 * @deprecated
 */
class StreamClient {
    constructor(config = {}) {
        Processors.bindProcessors();
        this.server = config.server || "";
        this.token = config.token || "";
        this.sessionId = config.sessionId || "";
        this.lang = config.lang || "en";
        this.contentType = config.contentType || StreamClient.CONTENT_TYPE;
        this.readingInterval = config.readingInterval || StreamClient.INTERVAL;
        this.onOpen = config.onOpen && config.onOpen.bind(this) || _noop;
        this.onClose = config.onClose && config.onClose.bind(this) || _noop;
        this.onInit = config.onInit && config.onInit.bind(this) || _noop;
        this.onStartListening = config.onStartListening && config.onStartListening.bind(this) || _noop;
        this.onStopListening = config.onStopListening && config.onStopListening.bind(this) || _noop;
        this.onResults = config.onResults && config.onResults.bind(this) || _noop;
        this.onEvent = config.onEvent && config.onEvent.bind(this) || _noop;
        this.onError = config.onError && config.onError.bind(this) || _noop;
        function _noop() {
            // noop
        }
    }
    init() {
        this.onEvent(IStreamClient.EVENT.MSG_WAITING_MICROPHONE, "Waiting for approval to access your microphone ...");
        try {
            window.AudioContext = window.AudioContext || webkitAudioContext;
            navigator.getUserMedia =
                navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            window.URL = window.URL || window.webkitURL;
            this.audioContext = new AudioContext();
        }
        catch (e) {
            // Firefox 24: TypeError: AudioContext is not a constructor
            // Set media.webaudio.enabled = true (in about:config) to fix this.
            this.onError(IStreamClient.ERROR.ERR_CLIENT, "Error initializing Web Audio browser: " + JSON.stringify(e));
        }
        if (navigator.getUserMedia) {
            navigator.getUserMedia({ audio: true }, this.startUserMedia.bind(this, this.onInit), (e) => {
                this.onError(IStreamClient.ERROR.ERR_CLIENT, "No live audio input in this browser: " + JSON.stringify(e));
            });
        }
        else {
            this.onError(IStreamClient.ERROR.ERR_CLIENT, "No user media support");
        }
    }
    getGainNode() {
        return this.gainNode;
    }
    startListening() {
        if (!this.recorder) {
            this.onError(IStreamClient.ERROR.ERR_AUDIO, "Recorder undefined");
            return;
        }
        if (!this.ws) {
            this.onError(IStreamClient.ERROR.ERR_AUDIO, "No web socket connection");
            return;
        }
        const isUseVad = (endOfSpeechCallback) => {
            this.resampleProcessor = this.audioContext.createResampleProcessor(256, 1, 1, 16000);
            this.mediaStreamSource.connect(this.resampleProcessor);
            const endOfSpeechProcessor = this.audioContext.createEndOfSpeechProcessor(256);
            endOfSpeechProcessor.endOfSpeechCallback = endOfSpeechCallback;
            this.resampleProcessor.connect(endOfSpeechProcessor);
        };
        isUseVad(() => this.stopListening());
        this.ws
            .send("{'timezone':'America/New_York', 'lang':'" + this.lang + "', 'sessionId':'" + this.sessionId + "'}");
        this.intervalKey = setInterval(() => {
            this.recorder.export16kMono((blob) => {
                this.socketSend(blob);
                this.recorder.clear();
            }, "audio/x-raw");
        }, this.readingInterval);
        // Start recording
        this.recorder.record();
        this.onStartListening(); // call interface method
    }
    ;
    stopListening() {
        if (this.resampleProcessor) {
            this.resampleProcessor.disconnect();
        }
        // Stop the regular sending of audio
        clearInterval(this.intervalKey);
        const recorder = this.recorder;
        if (!recorder) {
            this.onError(IStreamClient.ERROR.ERR_AUDIO, "Recorder undefined");
            return;
        }
        // Stop recording
        recorder.stop();
        this.onEvent(IStreamClient.EVENT.MSG_STOP, "Stopped recording");
        // Push the remaining audio to the server
        recorder.export16kMono((blob) => {
            this.socketSend(blob);
            this.socketSend(StreamClient.TAG_END_OF_SENTENCE);
            recorder.clear();
        }, "audio/x-raw");
        this.onStopListening();
    }
    ;
    open() {
        if (!this.recorder) {
            this.init();
        }
        else {
            this.openWebSocket();
        }
    }
    ;
    close() {
        // Stop the regular sending of audio (if present)
        clearInterval(this.intervalKey);
        if (this.recorder) {
            this.recorder.stop();
            this.recorder.clear();
            this.onEvent(IStreamClient.EVENT.MSG_STOP, "Stopped recording");
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    ;
    startUserMedia(onInit, stream) {
        this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
        this.onEvent(IStreamClient.EVENT.MSG_MEDIA_STREAM_CREATED, "Media stream created");
        this.userSpeechAnalyser = this.audioContext.createAnalyser();
        this.gainNode = this.audioContext.createGain();
        this.mediaStreamSource.connect(this.userSpeechAnalyser);
        this.mediaStreamSource.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        this.recorder = new Recorder(this.mediaStreamSource);
        this.onEvent(IStreamClient.EVENT.MSG_INIT_RECORDER, "Recorder initialized");
        if (onInit) {
            onInit();
        }
    }
    openWebSocket() {
        if (!this.recorder) {
            this.onError(IStreamClient.ERROR.ERR_AUDIO, "Recorder undefined");
            return;
        }
        if (this.ws) {
            this.close();
        }
        try {
            this.ws = this.createWebSocket();
        }
        catch (e) {
            this.onError(IStreamClient.ERROR.ERR_CLIENT, "No web socket support in this browser!");
        }
    }
    ;
    createWebSocket() {
        const url = this.server + "?" + this.contentType + "&access_token=" + this.token;
        const ws = new WebSocket(url);
        ws.onmessage = (e) => {
            const data = e.data;
            this.onEvent(IStreamClient.EVENT.MSG_WEB_SOCKET, data);
            if (data instanceof Object && !(data instanceof Blob)) {
                this.onError(IStreamClient.ERROR.ERR_SERVER, "WebSocket: onEvent: got Object that is not a Blob");
            }
            else if (data instanceof Blob) {
                this.onError(IStreamClient.ERROR.ERR_SERVER, "WebSocket: got Blob");
            }
            else {
                this.onResults(JSON.parse(data)); // call interface method
            }
        };
        // Start recording only if the socket becomes open
        ws.onopen = (e) => {
            // send first request for initialisation dialogue
            // ws.send("{'timezone':'America/New_York', 'lang':'en'}");
            this.onOpen(); // call interface method
            this.onEvent(IStreamClient.EVENT.MSG_WEB_SOCKET_OPEN, e);
        };
        // This can happen if the blob was too big
        // E.g. "Frame size of 65580 bytes exceeds maximum accepted frame size"
        // Status codes
        // http://tools.ietf.org/html/rfc6455#section-7.4.1
        // 1005:
        // 1006:
        ws.onclose = (e) => {
            // The server closes the connection (only?)
            // when its endpointer triggers.
            this.onClose(); // call interface method
            this.onEvent(IStreamClient.EVENT.MSG_WEB_SOCKET_CLOSE, e.code + "/" + e.reason + "/" + e.wasClean);
        };
        ws.onerror = (e) => {
            this.onError(IStreamClient.ERROR.ERR_NETWORK, JSON.stringify(e.data));
        };
        return ws;
    }
    socketSend(item) {
        if (!this.ws) {
            this.onError(IStreamClient.ERROR.ERR_CLIENT, "No web socket connection: failed to send: " + item);
            return;
        }
        const state = this.ws.readyState;
        if (state !== 1) {
            let errorMsg = "WebSocket: ";
            switch (state) {
                case 0:
                    errorMsg += "The connection is not yet open.";
                    break;
                // case 1:break;// OPEN
                case 2:
                    errorMsg += "The connection is in the process of closing.";
                    break;
                case 3:
                    errorMsg += "The connection is closed or couldn\'t be opened.";
                    break;
                default:
            }
            errorMsg += " readyState=" + state + " (!=1) failed to send: " + item;
            this.onError(IStreamClient.ERROR.ERR_NETWORK, errorMsg);
        }
        // If item isn't an audio blob it's the EOS tag or json data (string)
        if (!(item instanceof Blob)) {
            this.ws.send(item);
            this.onEvent(IStreamClient.EVENT.MSG_SEND_EOS_OR_JSON, "Send string: " + item);
        }
        else if (item.size > 0) {
            this.ws.send(item);
            this.onEvent(IStreamClient.EVENT.MSG_SEND, "Send: blob: " + item.type + ", " + item.size);
        }
        else {
            this.onEvent(IStreamClient.EVENT.MSG_SEND_EMPTY, "Send: blob: " + item.type + ", EMPTY");
        }
    }
}
StreamClient.CONTENT_TYPE = "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1";
StreamClient.INTERVAL = 250;
StreamClient.TAG_END_OF_SENTENCE = "EOS";
export default StreamClient;
