import {ApiAiEnabledApplication} from "./Application";
const app = new ApiAiEnabledApplication();

app.init("ACCESS_TOKEN");


window["app"] = app;
