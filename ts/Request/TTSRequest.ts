import {ApiAiClient} from "../ApiAiClient";
import {ApiAiConstants} from "../ApiAiConstants";
import {ApiAiClientConfigurationError, ApiAiRequestError} from "../Errors";
import {IRequestOptions} from "../Interfaces";
import XhrRequest from "../XhrRequest";
import Request from "./Request";

export class TTSRequest extends Request {

  private static RESPONSE_TYPE_ARRAYBUFFER = "arraybuffer";

  private static audioContext: AudioContext;

  constructor(protected apiAiClient: ApiAiClient, options: IRequestOptions = {}) {
    super(apiAiClient, options);
    // this.requestMethod = XhrRequest.Method.GET;
    this.uri = ApiAiConstants.DEFAULT_TTS_HOST;
    const AudioContext = window.AudioContext || webkitAudioContext;

    if (!TTSRequest.audioContext) {
      TTSRequest.audioContext = new AudioContext();
    }
  }

  public makeTTSRequest(text: string) {

    if (!text) {
      throw new ApiAiClientConfigurationError("Request can not be empty");
    }

    const params = {
      lang: "en-US", // <any> this.apiAiClient.getApiLang(),
      text: encodeURIComponent(text),
      v: this.apiAiClient.getApiVersion()
    };

    const headers = {
      "Accept-language": "en-US",
      "Authorization": "Bearer " + this.apiAiClient.getAccessToken()
    };

    return this.makeRequest(this.uri, params, headers, {responseType: TTSRequest.RESPONSE_TYPE_ARRAYBUFFER})
      .then(this.resolveTTSPromise)
      .catch(this.rejectTTSPromise.bind(this))
      ;
  }

  private resolveTTSPromise = (data: {response: ArrayBuffer}) => {
    return this.speak(data.response);
  }

  private rejectTTSPromise = (reason: string) => {
    throw new ApiAiRequestError(reason);
  }

  private makeRequest(url, params, headers, options): Promise<{response: ArrayBuffer}> {
    return XhrRequest.get(url, params, headers, options);
  }

  private speak(data: ArrayBuffer): Promise<any> {

    if (!data.byteLength) {
      return Promise.reject("TTS Server unavailable");
    }

    return new Promise((resolve, reject) => {
      TTSRequest.audioContext.decodeAudioData(
        data,
        (buffer: AudioBuffer) => {
          return this.playSound(buffer, resolve);
        },
        reject
      ).then(null, (err) => reject(err));
    });
  }

  private playSound(buffer: AudioBuffer, resolve) {
    const source = TTSRequest.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(TTSRequest.audioContext.destination);
    source.onended = resolve;
    source.start(0);
  };
}
