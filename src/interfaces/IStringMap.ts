import Constants from "../Constants";
export interface IStringMap { [s: string]: string; }
export interface IApiClientOptions {
    apiVersion?: string,
    apiLang?: Constants.AVAILABLE_LANGUAGES

}