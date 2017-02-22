import {ApiAiClient} from "../ApiAiClient";
import {IRequestOptions} from "../Interfaces";
import Request from "./Request";

/**
 * @todo: implement
 */

class VoiceRequest extends Request {
    constructor(client: ApiAiClient, options: IRequestOptions = {}) {
        super(client, options);

    }
}
