export class LocalTTSRequest {
    private isSupported() {
        return !!window.speechSynthesis;
    }
    private getLanguage() {

    }
}
