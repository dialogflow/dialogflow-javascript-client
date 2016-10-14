import Constants from "./Constants";
import {ApiAiClientConfigurationError} from "./Errors";
import {IApiClientOptions, IRequestOptions, IServerResponse, IStreamClientOptions} from "./Interfaces";
import StreamClient from "./Stream/StreamClient";
import TextRequest from "./Request/TextRequest";
import {TTSRequest} from "./Request/TTSRequest";
// import {UserEntitiesRequest} from "./Request/UserEntitiesRequest";
export {default as XhrRequest} from "./XhrRequest";

export {StreamClient as StreamClient};

export class Client {

    private apiLang: Constants.AVAILABLE_LANGUAGES;
    private apiVersion: string;
    private apiBaseUrl: string;
    private sessionId: string;
    private accessToken: string;

    constructor (options: IApiClientOptions) {

        if (!options || !options.accessToken) {
            throw new ApiAiClientConfigurationError("Access token is required for new ApiAi.Client instance");
        }

        this.accessToken = options.accessToken;
        this.apiLang = options.lang || Constants.DEFAULT_CLIENT_LANG;
        this.apiVersion = options.version || Constants.DEFAULT_API_VERSION;
        this.apiBaseUrl = options.baseUrl || Constants.DEFAULT_BASE_URL;
        this.sessionId = options.sessionId || this.guid();

    }

    public textRequest (query, options: IRequestOptions = {}): Promise<IServerResponse> {
        if (!query) {
            throw new ApiAiClientConfigurationError("Query should not be empty");
        }
        options.query = query;
        return new TextRequest(this, options).perform();
    }

    public ttsRequest (query) {
        if (!query) {
            throw new ApiAiClientConfigurationError("Query should not be empty");
        }
        return new TTSRequest(this).makeTTSRequest(query);
    }

    /*public userEntitiesRequest(options: IRequestOptions = {}): UserEntitiesRequest {
        return new UserEntitiesRequest(this, options);
    }*/

    public createStreamClient(streamClientOptions: IStreamClientOptions = {}) {

        streamClientOptions.server = ""
            + Constants.STREAM_CLIENT_SERVER_PROTO
            + "://" + Constants.DEFAULT_STREAM_CLIENT_BASE_URL
            + Constants.STREAM_CLIENT_SERVER_PATH;

        streamClientOptions.token = this.getAccessToken();
        streamClientOptions.sessionId =  this.getSessionId();
        streamClientOptions.lang = this.getApiLang();

        return new StreamClient(streamClientOptions);
    }

    public getAccessToken (): string {
        return this.accessToken;
    }

    public getApiVersion (): string {
        return (this.apiVersion) ? this.apiVersion : Constants.DEFAULT_API_VERSION;
    }

    public getApiLang (): Constants.AVAILABLE_LANGUAGES {
        return (this.apiLang) ? this.apiLang : Constants.DEFAULT_CLIENT_LANG;
    }

    public getApiBaseUrl (): string {
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
        let s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    }
}
