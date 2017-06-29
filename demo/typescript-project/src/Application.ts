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
