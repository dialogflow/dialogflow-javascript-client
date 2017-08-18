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
describe("API", () => {

    const client = new ApiAiClient({accessToken: "3485a96fb27744db83e78b8c4bc9e7b7"});

    describe("Text Query", () => {
        it ("should return response", function (done) {
            this.timeout(5000);
            client.textRequest("Hello!").then((response) => {
                chai.expect(response.result.action).to.eq("greeting");
                chai.expect(response.result.resolvedQuery).to.eq("Hello!");
                done();
            });
        });

        it("should respect UTF-8", function(done) {
            this.timeout(5000);
            client.textRequest("¿Cuál es la población de España?").then((response) => {
                chai.expect(response.result.resolvedQuery).to.eq("¿Cuál es la población de España?");
                done();
            });
        });
    });

});
