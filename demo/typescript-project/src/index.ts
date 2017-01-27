import {ApiAiClient} from "api-ai-javascript/ApiAiClient";

const ACCESS_TOKEN = "ACCESS_TOKEN";
const client = new ApiAiClient({accessToken: ACCESS_TOKEN});

client.textRequest("Hello!")
    .then(JSON.stringify).then(alert)
    .catch(JSON.stringify).then(alert);
