namespace Constants {

    export enum AVAILABLE_LANGUAGES {
        EN = <any> "en", DE = <any> "de", ES = <any> "es", PT_BR = <any> "pt-BR", ZH_HK = <any> "zh-HK",
        ZH_CN = <any> "zh-CN", ZH_TW = <any> "zh-TW", NL = <any> "nl", FR = <any> "fr", IT = <any> "it",
        JA = <any> "ja", KO = <any> "ko", PT = <any> "pt", RU = <any> "ru", UK = <any> "uk"
    }

    export const VERSION: string = "2.0.0";
    export const DEFAULT_BASE_URL: string = "https://api.api.ai/v1/";
    export const DEFAULT_STREAM_CLIENT_BASE_URL: string = "api-ws.api.ai:4435/v1/";
    export const DEFAULT_API_VERSION: string = "20150204";
    export const DEFAULT_CLIENT_LANG: AVAILABLE_LANGUAGES = AVAILABLE_LANGUAGES.EN;

    export const STREAM_CLIENT_SERVER_PROTO: string = "wss";
    export const STREAM_CLIENT_SERVER_PATH: string = "/ws/query";

}

export default Constants;
