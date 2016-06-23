import {Client} from "./Client";
import XhrRequest from "./XhrRequest";
import {IServerResponse} from "./interfaces/IServerResponse";

export default class Request {

    private uri;
    private requestMethod;
    private headers;

    constructor (private apiAiClient : Client, private options) {
        this.uri = this.apiAiClient.getApiBaseUrl() + 'query?v=' + this.apiAiClient.getApiVersion();
        this.requestMethod = 'POST';
        this.options['lang'] = this.apiAiClient.getApiLang();
        this.options['sessionId'] = this.apiAiClient.getSessionId();
        this.headers = {
            'Authorization': 'Bearer ' + this.apiAiClient.getAccessToken()
        }
    }

    /**
     * @todo: deal with Access-Control headers, probably on server-side
     */
    public perform () : Promise<IServerResponse> {
        console.log('performing test request on URI', this.uri, 'with options:', this.options, 'with headers', this.headers);
        
        return XhrRequest.post(this.uri, this.options, this.headers)
            .then(Request.handleSuccess.bind(this))
            .catch(Request.handleError.bind(this));
    }

    private static handleSuccess(xhr: XMLHttpRequest) : Promise<IServerResponse> {
        return Promise.resolve(JSON.parse(xhr.responseText));
    }

    private static handleError(xhr: XMLHttpRequest) : Promise<IServerResponse> {
        return Promise.reject(JSON.parse(xhr.responseText));
    }

}