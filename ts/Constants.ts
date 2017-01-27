namespace Constants {

    export enum AVAILABLE_LANGUAGES {
        EN = "en" as any, DE = "de" as any, ES = "es" as any, PT_BR = "pt-BR" as any, ZH_HK = "zh-HK" as any,
        ZH_CN = "zh-CN" as any, ZH_TW = "zh-TW" as any, NL = "nl" as any, FR = "fr" as any, IT = "it" as any,
        JA = "ja" as any, KO = "ko" as any, PT = "pt" as any, RU = "ru" as any, UK = "uk" as any
    }

    export const VERSION: string = "2.0.0-beta.8";
    export const DEFAULT_BASE_URL: string = "https://api.api.ai/v1/";
    export const DEFAULT_API_VERSION: string = "20150910";
    export const DEFAULT_CLIENT_LANG: AVAILABLE_LANGUAGES = AVAILABLE_LANGUAGES.EN;

    // @todo: make configurable, ideally fix non-working v1
    export const DEFAULT_TTS_HOST: string = "https://api.api.ai/api/tts";
}

export default Constants;
