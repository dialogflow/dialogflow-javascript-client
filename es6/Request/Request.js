import { ApiAiRequestError } from "../Errors";
import XhrRequest from "../XhrRequest";
class Request {
    constructor(apiAiClient, options) {
        this.apiAiClient = apiAiClient;
        this.options = options;
        this.uri = this.apiAiClient.getApiBaseUrl() + "query?v=" + this.apiAiClient.getApiVersion();
        this.requestMethod = XhrRequest.Method.POST;
        this.headers = {
            Authorization: "Bearer " + this.apiAiClient.getAccessToken(),
        };
        this.options.lang = this.apiAiClient.getApiLang();
        this.options.sessionId = this.apiAiClient.getSessionId();
    }
    static handleSuccess(xhr) {
        return Promise.resolve(JSON.parse(xhr.responseText));
    }
    static handleError(xhr) {
        let error = new ApiAiRequestError(null);
        try {
            const serverResponse = JSON.parse(xhr.responseText);
            if (serverResponse.status && serverResponse.status.errorDetails) {
                error = new ApiAiRequestError(serverResponse.status.errorDetails, serverResponse.status.code);
            }
            else {
                error = new ApiAiRequestError(xhr.statusText, xhr.status);
            }
        }
        catch (e) {
            error = new ApiAiRequestError(xhr.statusText, xhr.status);
        }
        return Promise.reject(error);
    }
    perform(overrideOptions = null) {
        const options = overrideOptions ? overrideOptions : this.options;
        return XhrRequest.ajax(this.requestMethod, this.uri, options, this.headers)
            .then(Request.handleSuccess.bind(this))
            .catch(Request.handleError.bind(this));
    }
}
export default Request;
