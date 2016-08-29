import XhrRequest from "./XhrRequest";
export default class Request {
    constructor(apiAiClient, options) {
        this.apiAiClient = apiAiClient;
        this.options = options;
        this.uri = this.apiAiClient.getApiBaseUrl() + 'query?v=' + this.apiAiClient.getApiVersion();
        this.requestMethod = 'POST';
        this.options['lang'] = this.apiAiClient.getApiLang();
        this.options['sessionId'] = this.apiAiClient.getSessionId();
        this.headers = {
            'Authorization': 'Bearer ' + this.apiAiClient.getAccessToken()
        };
    }
    perform() {
        console.log('performing test request on URI', this.uri, 'with options:', this.options, 'with headers', this.headers);
        return XhrRequest.post(this.uri, this.options, this.headers)
            .then(Request.handleSuccess.bind(this))
            .catch(Request.handleError.bind(this));
    }
    static handleSuccess(xhr) {
        return Promise.resolve(JSON.parse(xhr.responseText));
    }
    static handleError(xhr) {
        return Promise.reject(JSON.parse(xhr.responseText));
    }
}
