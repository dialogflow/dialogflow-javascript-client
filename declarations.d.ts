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
