import { ApiAiConstants } from "./ApiAiConstants";
import { ApiAiClientConfigurationError } from "./Errors";
import { EventRequest } from "./Request/EventRequest";
import TextRequest from "./Request/TextRequest";
// import { TTSRequest } from "./Request/TTSRequest";

import { IApiClientOptions, IRequestOptions, IServerResponse, IStringMap } from "./Interfaces";

export * from "./Interfaces";
export {ApiAiConstants} from "./ApiAiConstants";

export class ApiAiClient {

    private apiLang: ApiAiConstants.AVAILABLE_LANGUAGES;
    private apiVersion: string;
    private apiBaseUrl: string;
    private sessionId: string;
    private accessToken: string;

    constructor(options: IApiClientOptions) {

        if (!options || !options.accessToken) {
            throw new ApiAiClientConfigurationError("Access token is required for new ApiAi.Client instance");
        }

        this.accessToken = options.accessToken;
        this.apiLang = options.lang || ApiAiConstants.DEFAULT_CLIENT_LANG;
        this.apiVersion = options.version || ApiAiConstants.DEFAULT_API_VERSION;
        this.apiBaseUrl = options.baseUrl || ApiAiConstants.DEFAULT_BASE_URL;
        this.sessionId = options.sessionId || this.guid();
    }

    public textRequest(query, options: IRequestOptions = {}): Promise<IServerResponse> {
        if (!query) {
            throw new ApiAiClientConfigurationError("Query should not be empty");
        }
        options.query = query;
        return new TextRequest(this, options).perform();
    }

    public eventRequest(eventName, eventData: IStringMap = {},
                        options: IRequestOptions = {}): Promise<IServerResponse> {
        if (!eventName) {
            throw new ApiAiClientConfigurationError("Event name can not be empty");
        }
        options.event = {name: eventName, data: eventData};
        return new EventRequest(this, options).perform();
    }

    // @todo: implement local tts request
    /*public ttsRequest(query) {
        if (!query) {
            throw new ApiAiClientConfigurationError("Query should not be empty");
        }
        return new TTSRequest(this).makeTTSRequest(query);
    }*/

    /*public userEntitiesRequest(options: IRequestOptions = {}): UserEntitiesRequest {
        return new UserEntitiesRequest(this, options);
    }*/

    public getAccessToken(): string {
        return this.accessToken;
    }

    public getApiVersion(): string {
        return (this.apiVersion) ? this.apiVersion : ApiAiConstants.DEFAULT_API_VERSION;
    }

    public getApiLang(): ApiAiConstants.AVAILABLE_LANGUAGES {
        return (this.apiLang) ? this.apiLang : ApiAiConstants.DEFAULT_CLIENT_LANG;
    }

    public getApiBaseUrl(): string {
        return (this.apiBaseUrl) ? this.apiBaseUrl : ApiAiConstants.DEFAULT_BASE_URL;
    }

    public setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    public getSessionId(): string {
        return this.sessionId;
    }

    /**
     * generates new random UUID
     * @returns {string}
     */
    private guid(): string {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    }
}
