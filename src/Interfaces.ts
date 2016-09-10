import Constants from "./Constants";

export interface IRequestOptions {
    query?: string;
    sessionId?: string;
    lang?: Constants.AVAILABLE_LANGUAGES;
}
export interface IServerResponse {
    id?: string;
    result?: {
        speech: string;
        fulfilment?: {
            speech: string
        }
    };
    status: {
        code: number,
        errorDetails?: string,
        errorID?: string,
        errorType: string
    };
}
export interface IStringMap { [s: string]: string; }
export interface IApiClientOptions {
    lang?: Constants.AVAILABLE_LANGUAGES;
    version?: string;
    baseUrl?: string;
    sessionId?: string;
    accessToken: string;
}
export interface IStreamClientOptions {
    server?: string;
    token?: string;
    sessionId?: string;
    lang?: Constants.AVAILABLE_LANGUAGES;
    contentType?: string;
    readingInterval?: string;
    onOpen?: Function;
    onClose?: Function;
    onInit?: Function;
    onStartListening?: Function;
    onStopListening?: Function;
    onResults?: Function;
    onEvent?: Function;
    onError?: Function;
}
