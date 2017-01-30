import Constants from "./Constants";
import { ApiAiClientConfigurationError } from "./Errors";
import { EventRequest } from "./Request/EventRequest";
import TextRequest from "./Request/TextRequest";
import { TTSRequest } from "./Request/TTSRequest";
export * from "./Interfaces";
export class ApiAiClient {
    constructor(options) {
        if (!options || !options.accessToken) {
            throw new ApiAiClientConfigurationError("Access token is required for new ApiAi.Client instance");
        }
        this.accessToken = options.accessToken;
        this.apiLang = options.lang || Constants.DEFAULT_CLIENT_LANG;
        this.apiVersion = options.version || Constants.DEFAULT_API_VERSION;
        this.apiBaseUrl = options.baseUrl || Constants.DEFAULT_BASE_URL;
        this.sessionId = options.sessionId || this.guid();
        this.streamClientClass = options.streamClientClass || null;
    }
    textRequest(query, options = {}) {
        if (!query) {
            throw new ApiAiClientConfigurationError("Query should not be empty");
        }
        options.query = query;
        return new TextRequest(this, options).perform();
    }
    eventRequest(eventName, eventData = {}, options = {}) {
        if (!eventName) {
            throw new ApiAiClientConfigurationError("Event name can not be empty");
        }
        options.event = { name: eventName, data: eventData };
        return new EventRequest(this, options).perform();
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
        if (this.streamClientClass) {
            streamClientOptions.token = this.getAccessToken();
            streamClientOptions.sessionId = this.getSessionId();
            streamClientOptions.lang = this.getApiLang();
            return new this.streamClientClass(streamClientOptions);
        }
        else {
            throw new ApiAiClientConfigurationError("No StreamClient implementation given to ApiAi Client constructor");
        }
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
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    }
}
