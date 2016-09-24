import {Client} from "../src/Client";
describe("API", () => {

    const client = new Client({accessToken: "3485a96fb27744db83e78b8c4bc9e7b7"});

    describe("Text Query", () => {
        it ("should return response", (done) => {
            client.textRequest("Hello!").then((response) => {
                chai.expect(response.result.action).to.eq("greeting");
                chai.expect(response.result.resolvedQuery).to.eq("Hello!");
                done();
            });
        });
    });
});