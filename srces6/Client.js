import Constants from "./Constants";
import { ApiAiClientConfigurationError } from "./Errors";
import StreamClient from "./Stream/StreamClient";
import TextRequest from "./Request/TextRequest";
import { TTSRequest } from "./Request/TTSRequest";
// import {UserEntitiesRequest} from "./Request/UserEntitiesRequest";
export { default as XhrRequest } from "./XhrRequest";
export { StreamClient as StreamClient };
export class Client {
    constructor(options) {
        if (!options || !options.accessToken) {
            throw new ApiAiClientConfigurationError("Access token is required for new ApiAi.Client instance");
        }
        this.accessToken = options.accessToken;
        this.apiLang = options.lang || Constants.DEFAULT_CLIENT_LANG;
        this.apiVersion = options.version || Constants.DEFAULT_API_VERSION;
        this.apiBaseUrl = options.baseUrl || Constants.DEFAULT_BASE_URL;
        this.sessionId = options.sessionId || this.guid();
    }
    textRequest(query, options = {}) {
        if (!query) {
            throw new ApiAiClientConfigurationError("Query should not be empty");
        }
        options.query = query;
        return new TextRequest(this, options).perform();
    }
    ttsRequest(query) {
        if (!query) {
            throw new ApiAiClientConfigurationError("Query should not be empty");
        }
        return new TTSRequest(this).makeTTSRequest(query);
    }
    /*public userEntitiesRequest(options: IRequestOptions = {}): UserEntitiesRequest {
        return new UserEntitiesRequest(this, options);
    }*/
    createStreamClient(streamClientOptions = {}) {
        streamClientOptions.server = ""
            + Constants.STREAM_CLIENT_SERVER_PROTO
            + "://" + Constants.DEFAULT_STREAM_CLIENT_BASE_URL
            + Constants.STREAM_CLIENT_SERVER_PATH;
        streamClientOptions.token = this.getAccessToken();
        streamClientOptions.sessionId = this.getSessionId();
        streamClientOptions.lang = this.getApiLang();
        return new StreamClient(streamClientOptions);
    }
    getAccessToken() {
        return this.accessToken;
    }
    getApiVersion() {
        return (this.apiVersion) ? this.apiVersion : Constants.DEFAULT_API_VERSION;
    }
    getApiLang() {
        return (this.apiLang) ? this.apiLang : Constants.DEFAULT_CLIENT_LANG;
    }
    getApiBaseUrl() {
        return (this.apiBaseUrl) ? this.apiBaseUrl : Constants.DEFAULT_BASE_URL;
    }
    setSessionId(sessionId) {
        this.sessionId = sessionId;
    }
    getSessionId() {
        return this.sessionId;
    }
    /**
     * generates new random UUID
     * @returns {string}
     */
    guid() {
        let s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    }
}
