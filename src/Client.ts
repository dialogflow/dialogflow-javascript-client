import TextRequest from "./TextRequest";
import Constants from "./Constants";
export class Client {

    private apiVersion: string;
    private apiLang: string;
    private apiBaseUrl: string;

    constructor (private accessToken : string) {

    }

    public textRequest (query = '', options = {}) : void {
        options['query'] = query;
        return new TextRequest(this, options).perform();
    }

    public getAccessToken () : string {
        return this.accessToken;
    }

    public getApiVersion () : string {
        return (this.apiVersion) ? this.apiVersion : Constants.DEFAULT_API_VERSION;
    }

    public getApiLang () : string {
        return (this.apiLang) ? this.apiLang : Constants.DEFAULT_CLIENT_LANG;
    }

    public getApiBaseUrl () : string {
        return (this.apiBaseUrl) ? this.apiBaseUrl : Constants.DEFAULT_BASE_URL;
    }
}