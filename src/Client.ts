import TextRequest from "./TextRequest";
import Constants from "./Constants";
import {IServerResponse} from "./interfaces/IServerResponse";
import StreamClient from "./Stream/StreamClient";

export {default as XhrRequest} from 'XhrRequest';

export class Client {

    private apiVersion: string;
    private apiLang: string;
    private apiBaseUrl: string;
    private sessionId: string;

    constructor (private accessToken : string) {
        if (!this.sessionId) {
            this.setSessionId(this.guid());
        }
    }

    public textRequest (query = '', options = {}) : Promise<IServerResponse> {
        options['query'] = query;
        return new TextRequest(this, options).perform();
    }

    public createStream () : void {
        //new StreamClient();
        //@todo
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

    public setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    public getSessionId() : string {
        return this.sessionId;
    }

    /**
     * generates new random UUID
     * @returns {string}
     */
    private guid() : string {
        let s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}