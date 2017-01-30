interface Navigator {
    Resampler: any;
}
interface AudioContext {
    createResampleProcessor: Function;
    createEndOfSpeechProcessor: Function;
}
interface Window {
    speechSynthesis: any;
    webkitURL: any;
}
