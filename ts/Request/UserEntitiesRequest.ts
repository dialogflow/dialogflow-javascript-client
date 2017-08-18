/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
import {ApiAiClient} from "../ApiAiClient";
import {IRequestOptions} from "../Interfaces";
import {IEntity} from "../Models/Entity";
import ApiAiUtils from "../Utils";
import XhrRequest from "../XhrRequest";
import Request from "./Request";

export class UserEntitiesRequest extends Request {

    private static ENDPOINT: string = "userEntities";
    private baseUri: string;

    constructor(apiAiClient: ApiAiClient, protected options: IUserEntitiesRequestOptions = {}) {
        super(apiAiClient, options);
        this.baseUri = this.apiAiClient.getApiBaseUrl() + UserEntitiesRequest.ENDPOINT;
    }

    public create(entities: IEntity[]|IEntity) {
        this.uri = this.baseUri;
        const options = ApiAiUtils.cloneObject(this.options);
        options.entities = Array.isArray(entities) ? entities : [entities];
        return this.perform(options);
    }

    public retrieve(name: string) {
        this.uri = this.baseUri + "/" + name;
        this.requestMethod = XhrRequest.Method.GET;
        return this.perform();
    }

    public update(name: string, entries: IEntity.IEntry[], extend: boolean = false) {
        this.uri = this.baseUri + "/" + name;
        this.requestMethod = XhrRequest.Method.PUT;
        const options = ApiAiUtils.cloneObject(this.options);
        options.extend = extend;
        options.entries = entries;
        options.name = name;
        return this.perform(options);
    }

    public delete(name: string) {
        this.uri = this.baseUri + "/" + name;
        this.requestMethod = XhrRequest.Method.DELETE;
        return this.perform();
    }
}

interface IUserEntitiesRequestOptions extends IRequestOptions {
    extend?: boolean;
    name?: string;
    entities?: IEntity[];
    entries?: IEntity.IEntry[];
}
