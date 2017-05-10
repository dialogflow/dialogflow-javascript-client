export class ApiAiBaseError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.stack = new Error().stack;
    }
}
export class ApiAiClientConfigurationError extends ApiAiBaseError {
    constructor(message) {
        super(message);
        this.name = "ApiAiClientConfigurationError";
    }
}
export class ApiAiRequestError extends ApiAiBaseError {
    constructor(message, code = null) {
        super(message);
        this.message = message;
        this.code = code;
        this.name = "ApiAiRequestError";
    }
}
