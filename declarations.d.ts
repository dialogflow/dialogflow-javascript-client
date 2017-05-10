interface Navigator {
    Resampler: any;
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
}
interface AudioContext {
    createResampleProcessor: Function;
    createEndOfSpeechProcessor: Function;
}
interface Window {
    webkitURL: any;
}

declare var webkitAudioContext: {
    new (): AudioContext;
}

declare var webkitOfflineAudioContext: {
    new (numberOfChannels: number, length: number, sampleRate: number): OfflineAudioContext;
}

interface AudioContextConstructor {
    new(): AudioContext;
}

interface Window {
    AudioContext: AudioContextConstructor;
}

interface AudioContext {
    createMediaStreamSource(stream: MediaStream): MediaStreamAudioSourceNode;
}

interface MediaStreamAudioSourceNode extends AudioNode {

}

interface MediaStreamAudioDestinationNode extends AudioNode {
    stream: MediaStream;
}

interface AudioBuffer {
    copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel?: number): void;

    copyToChannel(source: Float32Array, channelNumber: number, startInChannel?: number): void;
}

interface AudioNode {
    disconnect(destination: AudioNode): void;
}

interface AudioContext {
    suspend(): Promise<void>;
    resume(): Promise<void>;
    close(): Promise<void>;
    createMediaStreamDestination(): MediaStreamAudioDestinationNode; 
}
