export interface IServerResponse {
    id?: string,
    result?: {
        speech: string,
        fulfilment?: {
            speech: string
        }
    }
    status: {
        code: number,
        errorDetails?: string,
        errorID?: string,
        errorType: string
    }
}