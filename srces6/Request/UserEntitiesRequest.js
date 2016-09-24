import Request from "./Request";
import ApiAiUtils from "../Utils";
import XhrRequest from "../XhrRequest";
export class UserEntitiesRequest extends Request {
    constructor(apiAiClient, options = {}) {
        super(apiAiClient, options);
        this.options = options;
        this.baseUri = this.apiAiClient.getApiBaseUrl() + UserEntitiesRequest.ENDPOINT;
    }
    create(entities) {
        this.uri = this.baseUri;
        let options = ApiAiUtils.cloneObject(this.options);
        options.entities = Array.isArray(entities) ? entities : [entities];
        return this.perform(options);
    }
    retrieve(name) {
        this.uri = this.baseUri + "/" + name;
        this.requestMethod = XhrRequest.Method.GET;
        return this.perform();
    }
    update(name, entries, extend = false) {
        this.uri = this.baseUri + "/" + name;
        this.requestMethod = XhrRequest.Method.PUT;
        let options = ApiAiUtils.cloneObject(this.options);
        options.extend = extend;
        options.entries = entries;
        options.name = name;
        return this.perform(options);
    }
    delete(name) {
        this.uri = this.baseUri + "/" + name;
        this.requestMethod = XhrRequest.Method.DELETE;
        return this.perform();
    }
}
UserEntitiesRequest.ENDPOINT = "userEntities";
