import {ApiAiConstants} from "./ApiAiConstants";

export interface IRequestOptions {
    query?: string;
    event?: {name: string, data?: IStringMap};
    sessionId?: string;
    lang?: ApiAiConstants.AVAILABLE_LANGUAGES;
}

export interface IServerResponse {
    id?: string;
    result?: {
        action: string,
        resolvedQuery: string,
        speech: string;
        fulfillment?: {
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
    lang?: ApiAiConstants.AVAILABLE_LANGUAGES;
    version?: string;
    baseUrl?: string;
    sessionId?: string;
    streamClientClass?: IStreamClientConstructor;
    accessToken: string;
}

export interface IStreamClientConstructor {
    new (options: IStreamClientOptions): IStreamClient;
}

export interface IStreamClient {
    init(): void;
    open(): void;
    close(): void;
    startListening(): void;
    stopListening(): void;
}

export interface IStreamClientOptions {
    server?: string;
    token?: string;
    sessionId?: string;
    lang?: ApiAiConstants.AVAILABLE_LANGUAGES;
    contentType?: string;
    readingInterval?: string;
    onOpen?: () => void;
    onClose?: () => void;
    onInit?: () => void;
    onStartListening?: () => void;
    onStopListening?: () => void;
    onResults?: (data: IServerResponse) => void;
    onEvent?: (eventCode: IStreamClient.EVENT, message: string) => void;
    onError?: (errorCode: IStreamClient.ERROR, message: string) => void;
}

export namespace IStreamClient {
    export enum ERROR {
        ERR_NETWORK,
        ERR_AUDIO,
        ERR_SERVER,
        ERR_CLIENT
    }
    export enum EVENT {
        MSG_WAITING_MICROPHONE,
        MSG_MEDIA_STREAM_CREATED,
        MSG_INIT_RECORDER,
        MSG_RECORDING,
        MSG_SEND,
        MSG_SEND_EMPTY,
        MSG_SEND_EOS_OR_JSON,
        MSG_WEB_SOCKET,
        MSG_WEB_SOCKET_OPEN,
        MSG_WEB_SOCKET_CLOSE,
        MSG_STOP,
        MSG_CONFIG_CHANGED
    }
}
