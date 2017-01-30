import Constants from "./Constants";
import { ApiAiClientConfigurationError } from "./Errors";
import { EventRequest } from "./Request/EventRequest";
import TextRequest from "./Request/TextRequest";
import { TTSRequest } from "./Request/TTSRequest";
// import {UserEntitiesRequest} from "./Request/UserEntitiesRequest";

import { IApiClientOptions, IRequestOptions, IServerResponse, IStreamClient, IStreamClientConstructor,
    IStreamClientOptions, IStringMap } from "./Interfaces";

export * from "./Interfaces";

export class ApiAiClient {

    private apiLang: Constants.AVAILABLE_LANGUAGES;
    private apiVersion: string;
    private apiBaseUrl: string;
    private sessionId: string;
    private accessToken: string;
    private streamClientClass: IStreamClientConstructor;

    constructor(options: IApiClientOptions) {

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

    public ttsRequest(query) {
        if (!query) {
            throw new ApiAiClientConfigurationError("Query should not be empty");
        }
        return new TTSRequest(this).makeTTSRequest(query);
    }

    /*public userEntitiesRequest(options: IRequestOptions = {}): UserEntitiesRequest {
        return new UserEntitiesRequest(this, options);
    }*/

    public createStreamClient(streamClientOptions: IStreamClientOptions = {}): IStreamClient {
        if (this.streamClientClass) {

            streamClientOptions.token = this.getAccessToken();
            streamClientOptions.sessionId =  this.getSessionId();
            streamClientOptions.lang = this.getApiLang();

            return new this.streamClientClass(streamClientOptions);
        } else {
            throw new ApiAiClientConfigurationError("No StreamClient implementation given to ApiAi Client constructor");
        }
    }

    public getAccessToken(): string {
        return this.accessToken;
    }

    public getApiVersion(): string {
        return (this.apiVersion) ? this.apiVersion : Constants.DEFAULT_API_VERSION;
    }

    public getApiLang(): Constants.AVAILABLE_LANGUAGES {
        return (this.apiLang) ? this.apiLang : Constants.DEFAULT_CLIENT_LANG;
    }

    public getApiBaseUrl(): string {
        return (this.apiBaseUrl) ? this.apiBaseUrl : Constants.DEFAULT_BASE_URL;
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
