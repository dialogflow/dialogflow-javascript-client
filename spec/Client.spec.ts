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
 
import {ApiAiClient} from "../ts/ApiAiClient";
import {ApiAiConstants} from "../ts/ApiAiConstants";

const ACCESS_TOKEN = "AT";
const expect = chai.expect;

describe("ApiAi.Client", () => {

    const client = new ApiAiClient({accessToken: ACCESS_TOKEN});

    it("should instantinates", () => {
        expect(client instanceof ApiAiClient).to.be.true;
    });

    it("sould fail without access token", () => {
        expect(() => new ApiAiClient({accessToken: undefined})).to.throw(
            "Access token is required for new ApiAi.Client instance"
        );
    });

    it("sould create session id in case it was not provided", () => {
        expect(typeof client.getSessionId() === "string").to.be.true;
    });

    it("should use valid credentials", () => {
        expect(client.getApiLang()).to.eq(ApiAiConstants.DEFAULT_CLIENT_LANG);
        expect(client.getApiVersion()).to.eq(ApiAiConstants.DEFAULT_API_VERSION);
        expect(client.getApiBaseUrl()).to.eq(ApiAiConstants.DEFAULT_BASE_URL);
        expect(client.getAccessToken()).to.eq(ACCESS_TOKEN);
    });

    it("should use valid setted credentilas", () => {
        const version = "2";
        const baseUrl = "3";
        const sessionId = "test";
        const innerClient = new ApiAiClient({
            accessToken: ACCESS_TOKEN,
            lang: ApiAiConstants.AVAILABLE_LANGUAGES.DE,
            baseUrl,
            sessionId,
            version
        });

        expect(innerClient.getApiLang()).to.eq(ApiAiConstants.AVAILABLE_LANGUAGES.DE);
        expect(innerClient.getApiVersion()).to.eq(version);
        expect(innerClient.getApiBaseUrl()).to.eq(baseUrl);
        expect(innerClient.getAccessToken()).to.eq(ACCESS_TOKEN);
        expect(innerClient.getSessionId()).to.eq(sessionId);
    });
});
