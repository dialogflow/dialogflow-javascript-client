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
            "ApiAiClientConfigurationError: Access token is required for new ApiAi.Client instance"
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
        const apiVersion = "2";
        const apiBaseUrl = "3";
        const sessionId = "test";
        let innerClient = new ApiAiClient({
            accessToken: ACCESS_TOKEN,
            baseUrl: apiBaseUrl,
            lang: Constants.AVAILABLE_LANGUAGES.DE,
            sessionId: sessionId,
            version: apiVersion
        });

        expect(innerClient.getApiLang()).to.eq(Constants.AVAILABLE_LANGUAGES.DE);
        expect(innerClient.getApiVersion()).to.eq(apiVersion);
        expect(innerClient.getApiBaseUrl()).to.eq(apiBaseUrl);
        expect(innerClient.getAccessToken()).to.eq(ACCESS_TOKEN);
        expect(innerClient.getSessionId()).to.eq(sessionId);
    });
});
