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
 
import {ApiAiClient, IStreamClient} from "api-ai-javascript/ApiAiClient";
import {ApiAiStreamClient} from "api-ai-javascript/ApiAiStreamClient";

export class ApiAiEnabledApplication {

    private static BUTTON_ID = "button";

    private apiAiClient: ApiAiClient;
    private button: HTMLButtonElement;

    private isListening: boolean = false;

    public init(accessToken: string): ApiAiEnabledApplication {

        this.apiAiClient = new ApiAiClient({accessToken, streamClientClass: ApiAiStreamClient});
        this.button = document.getElementById(ApiAiEnabledApplication.BUTTON_ID) as HTMLButtonElement;
        this.button.addEventListener("click", this.handleClick.bind(this));
        return this;
    }

    private handleClick() {
        this.apiAiClient.textRequest("test").then((response) => {
            console.log(response);
        });
    }

    private setIsListening(isListening: boolean) {
        this.isListening = isListening;
        this.button.innerText = (isListening) ? "Stop listening" : "Start listening";
    }
}
