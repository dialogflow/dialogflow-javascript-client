import AVAILABLE_LANGUAGES = Constants.AVAILABLE_LANGUAGES;
export class Constants {
    public static VERSION = '2.0.0';
    public static DEFAULT_BASE_URL = 'https://api.api.ai/v1/';
    public static DEFAULT_API_VERSION = '20150204';
    public static DEFAULT_CLIENT_LANG: AVAILABLE_LANGUAGES = AVAILABLE_LANGUAGES.EN;
}

export namespace Constants {
    export enum AVAILABLE_LANGUAGES {
        EN = <any> 'en', DE = <any> 'de', ES = <any> 'es'
    }
}

export default Constants;
