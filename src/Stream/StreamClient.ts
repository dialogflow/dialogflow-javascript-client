/**
 * this is mostly copy-paste of v1 API.AI JS SDK. Todo: finish and make it work .
 */
class StreamClient {

    private static CONTENT_TYPE : string = "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1";
    private static INTERVAL : number = 250;
    private static TAG_END_OF_SENTENCE: string = "EOS";

    private audioContext: AudioContext;

    constructor(config = {}) {
        try {
            window.AudioContext = window.AudioContext || webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            //window.URL = window.URL;// || window.webkitURL;
            this.audioContext = new AudioContext();
        } catch (e) {
            // Firefox 24: TypeError: AudioContext is not a constructor
            // Set media.webaudio.enabled = true (in about:config) to fix this.
            //_this.onError(ERR_CLIENT, "Error initializing Web Audio browser: " + JSON.stringify(e));
        }

    }
}

module StreamClient {
    export enum ERROR {
        ERR_NETWORK,
        ERR_AUDIO,
        ERR_SERVER,
        ERR_CLIENT
    }
    export enum Events {
        MSG_WAITING_MICROPHONE,
        MSG_MEDIA_STREAM_CREATED,
        MSG_INIT_RECORDER,
        MSG_RECORDING,
        MSG_SEND,
        MSG_SEND_EMPTY,
        MSG_SEND_EOS_OR_JSON,
        MSG_WEB_SOCKET,
        MSG_WEB_SOCKET_OPEN,
        MSG_WEB_SOCKET_CLOSE,
        MSG_STOP,
        MSG_CONFIG_CHANGED
    }
}

export default StreamClient;