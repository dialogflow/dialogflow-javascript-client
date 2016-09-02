import Constants from "./Constants";

export interface IRequestOptions {
    query?: string;
    sessionId?: string;
    lang?: Constants.AVAILABLE_LANGUAGES;
}
export interface IServerResponse {
    id?: string,
    result?: {
        speech: string,
        fulfilment?: {
            speech: string
        }
    }
    status: {
        code: number,
        errorDetails?: string,
        errorID?: string,
        errorType: string
    }
}
export interface IStringMap { [s: string]: string; }
export interface IApiClientOptions {
    lang?: Constants.AVAILABLE_LANGUAGES;
    version?: string;
    baseUrl?: string;
    sessionId?: string;
    accessToken: string;
}
