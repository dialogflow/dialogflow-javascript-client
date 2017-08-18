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
 
export abstract class ApiAiBaseError extends Error {

    public abstract name: string;
    public stack: string;
    constructor(public message: string) {
        super(message);
        this.stack = new Error().stack;
    }
}

export class ApiAiClientConfigurationError extends ApiAiBaseError {

    public name: string = "ApiAiClientConfigurationError";

    constructor(message: string) {
        super(message);
    }
}

export class ApiAiRequestError extends ApiAiBaseError {

    public name: string = "ApiAiRequestError";

    constructor(public message: string, public code: number = null) {
        super(message);
    }
}
