import Constants from "../Constants";
import { ApiAiClientConfigurationError, ApiAiRequestError } from "../Errors";
import XhrRequest from "../XhrRequest";
import Request from "./Request";
export class TTSRequest extends Request {
    constructor(apiAiClient, options = {}) {
        super(apiAiClient, options);
        this.apiAiClient = apiAiClient;
        this.resolveTTSPromise = (data) => {
            return this.speak(data.response);
        };
        this.rejectTTSPromise = (reason) => {
            throw new ApiAiRequestError(reason);
        };
        // this.requestMethod = XhrRequest.Method.GET;
        this.uri = Constants.DEFAULT_TTS_HOST;
        const AudioContext = window.AudioContext || webkitAudioContext;
        if (!TTSRequest.audioContext) {
            TTSRequest.audioContext = new AudioContext();
        }
    }
    makeTTSRequest(text) {
        if (!text) {
            throw new ApiAiClientConfigurationError("Request can not be empty");
        }
        const params = {
            lang: "en-US",
            text: encodeURIComponent(text),
            v: this.apiAiClient.getApiVersion()
        };
        const headers = {
            "Accept-language": "en-US",
            "Authorization": "Bearer " + this.apiAiClient.getAccessToken()
        };
        return this.makeRequest(this.uri, params, headers, { responseType: TTSRequest.RESPONSE_TYPE_ARRAYBUFFER })
            .then(this.resolveTTSPromise)
            .catch(this.rejectTTSPromise.bind(this));
    }
    makeRequest(url, params, headers, options) {
        return XhrRequest.get(url, params, headers, options);
    }
    speak(data) {
        if (!data.byteLength) {
            return Promise.reject("TTS Server unavailable");
        }
        return new Promise((resolve, reject) => {
            TTSRequest.audioContext.decodeAudioData(data, (buffer) => {
                return this.playSound(buffer, resolve);
            }, reject).then(null, (err) => reject(err));
        });
    }
    playSound(buffer, resolve) {
        const source = TTSRequest.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(TTSRequest.audioContext.destination);
        source.onended = resolve;
        source.start(0);
    }
    ;
}
TTSRequest.RESPONSE_TYPE_ARRAYBUFFER = "arraybuffer";
