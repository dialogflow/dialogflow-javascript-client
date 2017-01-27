import StreamClient from "./Stream/StreamClient";
/**
 * @deprecated
 */
export class ApiAiStreamClient extends StreamClient {
    constructor(streamClientOptions = {}) {
        if (!streamClientOptions.server) {
            streamClientOptions.server = ""
                + ApiAiStreamClient.STREAM_CLIENT_SERVER_PROTO
                + "://" + ApiAiStreamClient.DEFAULT_STREAM_CLIENT_BASE_URL
                + ApiAiStreamClient.STREAM_CLIENT_SERVER_PATH;
        }
        super(streamClientOptions);
    }
}
ApiAiStreamClient.DEFAULT_STREAM_CLIENT_BASE_URL = "api-ws.api.ai:4435/v1/";
ApiAiStreamClient.STREAM_CLIENT_SERVER_PROTO = "wss";
ApiAiStreamClient.STREAM_CLIENT_SERVER_PATH = "/ws/query";
