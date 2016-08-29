import TextRequest from "./TextRequest";
import Constants from "./Constants";
export { default as XhrRequest } from './XhrRequest';
export { default as StreamClient } from './Stream/StreamClient';
export class Client {
    constructor(accessToken) {
        this.accessToken = accessToken;
        if (!this.sessionId) {
            this.setSessionId(this.guid());
        }
    }
    textRequest(query = '', options = {}) {
        options['query'] = query;
        return new TextRequest(this, options).perform();
    }
    getAccessToken() {
        return this.accessToken;
    }
    getApiVersion() {
        return (this.apiVersion) ? this.apiVersion : Constants.DEFAULT_API_VERSION;
    }
    getApiLang() {
        return (this.apiLang) ? this.apiLang : Constants.DEFAULT_CLIENT_LANG;
    }
    getApiBaseUrl() {
        return (this.apiBaseUrl) ? this.apiBaseUrl : Constants.DEFAULT_BASE_URL;
    }
    setSessionId(sessionId) {
        this.sessionId = sessionId;
    }
    getSessionId() {
        return this.sessionId;
    }
    /**
     * generates new random UUID
     * @returns {string}
     */
    guid() {
        let s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}
