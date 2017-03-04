import {ApiAiClient} from "../ApiAiClient";
import {ApiAiRequestError} from "../Errors";
import {IRequestOptions, IServerResponse, IStringMap} from "../Interfaces";
import XhrRequest from "../XhrRequest";

abstract class Request {

  private static handleSuccess(xhr: XMLHttpRequest): Promise<IServerResponse> {
    return Promise.resolve(JSON.parse(xhr.responseText));
  }

  private static handleError(xhr: XMLHttpRequest): Promise<ApiAiRequestError> {

    let error = new ApiAiRequestError(null);
    try {
      const serverResponse: IServerResponse = JSON.parse(xhr.responseText);
      if (serverResponse.status && serverResponse.status.errorDetails) {
        error = new ApiAiRequestError(serverResponse.status.errorDetails, serverResponse.status.code);
      } else {
        error = new ApiAiRequestError(xhr.statusText, xhr.status);
      }
    } catch (e) {
      error = new ApiAiRequestError(xhr.statusText, xhr.status);
    }

    return Promise.reject<ApiAiRequestError>(error);
  }

  protected uri;
  protected requestMethod;
  protected headers;

  constructor(protected apiAiClient: ApiAiClient, protected options: IRequestOptions) {

    this.uri = this.apiAiClient.getApiBaseUrl() + "query?v=" + this.apiAiClient.getApiVersion();
    this.requestMethod = XhrRequest.Method.POST;
    this.headers = {
      Authorization: "Bearer " + this.apiAiClient.getAccessToken(),
    };

    this.options.lang = this.apiAiClient.getApiLang();
    this.options.sessionId = this.apiAiClient.getSessionId();

  }

  public perform(overrideOptions = null): Promise<IServerResponse> {

    const options = overrideOptions ? overrideOptions : this.options;

    return XhrRequest.ajax(this.requestMethod, this.uri, options as IStringMap, this.headers)
      .then(Request.handleSuccess.bind(this))
      .catch(Request.handleError.bind(this));
  }
}

export default Request;
