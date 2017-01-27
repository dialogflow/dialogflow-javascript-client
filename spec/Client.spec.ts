import {ApiAiClient} from "../ts/ApiAiClient";
import Constants from "../ts/Constants";

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
        expect(client.getApiLang()).to.eq(Constants.DEFAULT_CLIENT_LANG);
        expect(client.getApiVersion()).to.eq(Constants.DEFAULT_API_VERSION);
        expect(client.getApiBaseUrl()).to.eq(Constants.DEFAULT_BASE_URL);
        expect(client.getAccessToken()).to.eq(ACCESS_TOKEN);
    });

    it("should use valid setted credentilas", () => {
        const version = "2";
        const baseUrl = "3";
        const sessionId = "test";
        const innerClient = new ApiAiClient({
            accessToken: ACCESS_TOKEN,
            lang: Constants.AVAILABLE_LANGUAGES.DE,
            baseUrl,
            sessionId,
            version
        });

        expect(innerClient.getApiLang()).to.eq(Constants.AVAILABLE_LANGUAGES.DE);
        expect(innerClient.getApiVersion()).to.eq(version);
        expect(innerClient.getApiBaseUrl()).to.eq(baseUrl);
        expect(innerClient.getAccessToken()).to.eq(ACCESS_TOKEN);
        expect(innerClient.getSessionId()).to.eq(sessionId);
    });
});
