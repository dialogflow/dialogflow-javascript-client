var Constants;
(function (Constants) {
    (function (AVAILABLE_LANGUAGES) {
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["EN"] = 'en'] = "EN";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["DE"] = 'de'] = "DE";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["ES"] = 'es'] = "ES";
    })(Constants.AVAILABLE_LANGUAGES || (Constants.AVAILABLE_LANGUAGES = {}));
    var AVAILABLE_LANGUAGES = Constants.AVAILABLE_LANGUAGES;
    Constants.VERSION = '2.0.0';
    Constants.DEFAULT_BASE_URL = 'https://api.api.ai/v1/';
    Constants.DEFAULT_API_VERSION = '20150204';
    Constants.DEFAULT_CLIENT_LANG = AVAILABLE_LANGUAGES.EN;
})(Constants || (Constants = {}));
export default Constants;
