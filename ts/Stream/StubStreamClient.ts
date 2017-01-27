import {ApiAiClientConfigurationError} from "../Errors";
export default class StubStreamClient {
    constructor(options = {}) {
        throw new ApiAiClientConfigurationError("You are using SDK version without built-in stream support");
    }
}
