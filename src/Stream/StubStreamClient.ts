import {ApiAiClientConfigurationError} from "../Errors";
export class StubStreamClient {
    constructor() {
        throw new ApiAiClientConfigurationError("You are using SDK version without built-in stream support");
    }
}