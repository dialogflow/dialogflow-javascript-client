import {IStreamClient, IStreamClientOptions} from "./Interfaces";
import StreamClient from "./Stream/StreamClient";

/**
 * @deprecated
 */
export class ApiAiStreamClient extends StreamClient implements IStreamClient {
    private static DEFAULT_STREAM_CLIENT_BASE_URL: string = "api-ws.api.ai:4435/v1/";
    private static STREAM_CLIENT_SERVER_PROTO: string = "wss";
    private static STREAM_CLIENT_SERVER_PATH: string = "/ws/query";

    constructor(streamClientOptions: IStreamClientOptions = {}) {

        if (!streamClientOptions.server) {
            streamClientOptions.server = ""
                + ApiAiStreamClient.STREAM_CLIENT_SERVER_PROTO
                + "://" + ApiAiStreamClient.DEFAULT_STREAM_CLIENT_BASE_URL
                + ApiAiStreamClient.STREAM_CLIENT_SERVER_PATH;
        }

        super(streamClientOptions);
    }
}
