import {Client} from "../Client";
import {IRequestOptions} from "../Interfaces";
import XhrRequest from "../XhrRequest";
import Request from "./Request";
/**
 * @todo: implement
 */

export class TTSRequest extends Request {

    constructor(apiAiClient: Client, options: IRequestOptions){
        super(apiAiClient, options);

        this.requestMethod = XhrRequest.Method.GET;
        this.uri = apiAiClient.getApiBaseUrl() + "tts";
    }

    public play() {
        this.perform().then((response) => {
            let blob = new Blob(response.data);
        })
    }
}
