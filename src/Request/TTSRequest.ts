import {Client} from "../Client";
import Constants from "../Constants";
import {IRequestOptions} from "../Interfaces";
import XhrRequest from "../XhrRequest";
import Request from "./Request";
import {ApiAiClientConfigurationError} from "../Errors";

export class TTSRequest extends Request {

    private static RESPONSE_TYPE_ARRAYBUFFER = "arraybuffer";

    private audioContext: AudioContext;

    constructor(protected apiAiClient: Client, options: IRequestOptions = {}) {
        super(apiAiClient, options);
        // this.requestMethod = XhrRequest.Method.GET;
        this.uri = Constants.DEFAULT_TTS_HOST;
        let AudioContext = window.AudioContext || webkitAudioContext;
        this.audioContext = new AudioContext();

    }

    public makeTTSRequest(text: string) {

        if (!text) {
            throw new ApiAiClientConfigurationError("Request can not be empty");
        }

        let params = {
            lang: "en-US", // <any> this.apiAiClient.getApiLang(),
            text: encodeURIComponent(encodeURIComponent(text)), // hack for platform's tts.
            v: this.apiAiClient.getApiVersion()
        };

        let headers = {
            Authorization: "Bearer " + this.apiAiClient.getAccessToken(),
            "Accept-language": "en-US"
        };

        this.makeRequest(this.uri, params, headers, {responseType: TTSRequest.RESPONSE_TYPE_ARRAYBUFFER})
            .then(this.resolveTTSPromise)
        // .catch(this.rejectTTSPromise.bind(this))
        ;
    }

    private resolveTTSPromise = (data: {response: ArrayBuffer}) => {
        return this.speak(data.response);
    };

    private makeRequest(url, params, headers, options): Promise<{response: ArrayBuffer}> {
        return XhrRequest.get(url, params, headers, options);
    }

    private speak(data: ArrayBuffer): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.audioContext.decodeAudioData(
                data,
                (buffer: AudioBuffer) => {
                    return this.playSound(buffer, resolve);
                },
                reject
            );
        });
    }

    private playSound(buffer: AudioBuffer, resolve) {
        let source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.onended = resolve;
        source.start(0);
    };
}
