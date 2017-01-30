import {ApiAiClient, IStreamClient} from "api-ai-javascript/ApiAiClient";
import {ApiAiStreamClient} from "api-ai-javascript/ApiAiStreamClient";

export class ApiAiEnabledApplication {

    private static BUTTON_ID = "button";

    private apiAiClient: ApiAiClient;
    private apiAiStreamClient: IStreamClient;
    private button: HTMLButtonElement;

    private isListening: boolean = false;

    public init(accessToken: string): ApiAiEnabledApplication {
        this.apiAiClient = new ApiAiClient({accessToken, streamClientClass: ApiAiStreamClient});
        this.apiAiStreamClient = this.apiAiClient.createStreamClient({
            onInit: () => {
                this.apiAiStreamClient.open();
                console.log("> ON INIT");
            },
            onOpen: () => {
                console.log("> ON OPEN");
            },
            onStartListening: () => {
                console.log("> ON START LISTENING");
            },
            onStopListening: () => {
                console.log("> ON STOP LISTENING");
            },
            onResults: (data) => {
                console.log("> ON RESULTS");
                console.log(data.result);
            },
            onEvent: (eventCode, message) => {
                console.log("> ON EVENT: ", eventCode, message, "[event: ", IStreamClient.EVENT[eventCode], "]");
            },
            onError: (errorCode, message) => {
                console.log("> ON ERROR: ", errorCode, message, "[error: ", IStreamClient.ERROR[errorCode], "]");
            }
        });
        this.apiAiStreamClient.init();
        this.button = document.getElementById(ApiAiEnabledApplication.BUTTON_ID) as HTMLButtonElement;
        this.button.addEventListener("click", this.handleClick.bind(this));
        return this;
    }

    public open() {
        this.apiAiStreamClient.open();
        return this;
    }

    public close() {
        this.apiAiStreamClient.close();
        return this;
    }

    public getClient(): ApiAiClient {
        return this.apiAiClient;
    }

    private handleClick() {
        if (!this.isListening) {
            this.apiAiStreamClient.startListening();
            this.isListening = true;
            this.button.innerText = "Stop listening";
        } else {
            this.apiAiStreamClient.stopListening();
            this.isListening = false;
            this.button.innerText = "Start listening";
        }
    }
}
