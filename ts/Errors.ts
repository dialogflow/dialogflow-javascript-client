export abstract class ApiAiBaseError extends Error {

    public abstract name: string;
    public stack: string;
    constructor(public message: string) {
        super(message);
        this.stack = new Error().stack;
    }
}

export class ApiAiClientConfigurationError extends ApiAiBaseError {

    public name: string = "ApiAiClientConfigurationError";

    constructor(message: string) {
        super(message);
    }
}

export class ApiAiRequestError extends ApiAiBaseError {

    public name: string = "ApiAiRequestError";

    constructor(public message: string, public code: number = null) {
        super(message);
    }
}
