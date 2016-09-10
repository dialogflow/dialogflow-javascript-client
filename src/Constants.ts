namespace Constants {

    export enum AVAILABLE_LANGUAGES {
        EN = <any> 'en', DE = <any> 'de', ES = <any> 'es'
    }

    export const VERSION: string = '2.0.0';
    export const DEFAULT_BASE_URL: string = 'https://api.api.ai/v1/';
    export const DEFAULT_API_VERSION: string = '20150204';
    export const DEFAULT_CLIENT_LANG: AVAILABLE_LANGUAGES = AVAILABLE_LANGUAGES.EN;

    export const STREAM_CLIENT_SERVER_PROTO: string = 'wss';
    export const STREAM_CLIENT_SERVER_PORT: string = '4435';
    export const STREAM_CLIENT_SERVER_PATH:  string = 'ws/query';

}

export default Constants;