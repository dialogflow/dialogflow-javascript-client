var ApiAi =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/target/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ApiAiBaseError = (function (_super) {
    __extends(ApiAiBaseError, _super);
    function ApiAiBaseError(message) {
        _super.call(this, message);
        this.message = message;
        this.stack = new Error().stack;
    }
    return ApiAiBaseError;
}(Error));
var ApiAiClientConfigurationError = (function (_super) {
    __extends(ApiAiClientConfigurationError, _super);
    function ApiAiClientConfigurationError(message) {
        _super.call(this, message);
        this.name = "ApiAiClientConfigurationError";
    }
    return ApiAiClientConfigurationError;
}(ApiAiBaseError));
exports.ApiAiClientConfigurationError = ApiAiClientConfigurationError;
var ApiAiRequestError = (function (_super) {
    __extends(ApiAiRequestError, _super);
    function ApiAiRequestError(message, code) {
        if (code === void 0) { code = null; }
        _super.call(this, message);
        this.message = message;
        this.code = code;
        this.name = "ApiAiRequestError";
    }
    return ApiAiRequestError;
}(ApiAiBaseError));
exports.ApiAiRequestError = ApiAiRequestError;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Errors_1 = __webpack_require__(0);
var XhrRequest_1 = __webpack_require__(2);
var Request = (function () {
    function Request(apiAiClient, options) {
        this.apiAiClient = apiAiClient;
        this.options = options;
        this.uri = this.apiAiClient.getApiBaseUrl() + "query?v=" + this.apiAiClient.getApiVersion();
        this.requestMethod = XhrRequest_1.default.Method.POST;
        this.headers = {
            "Authorization": "Bearer " + this.apiAiClient.getAccessToken(),
        };
        this.options.lang = this.apiAiClient.getApiLang();
        this.options.sessionId = this.apiAiClient.getSessionId();
    }
    Request.handleSuccess = function (xhr) {
        return Promise.resolve(JSON.parse(xhr.responseText));
    };
    Request.handleError = function (xhr) {
        var error = null;
        try {
            var serverResponse = JSON.parse(xhr.responseText);
            if (serverResponse.status && serverResponse.status.errorDetails) {
                error = new Errors_1.ApiAiRequestError(serverResponse.status.errorDetails, serverResponse.status.code);
            }
            else {
                error = new Errors_1.ApiAiRequestError(xhr.statusText, xhr.status);
            }
        }
        catch (e) {
            error = new Errors_1.ApiAiRequestError(xhr.statusText, xhr.status);
        }
        return Promise.reject(error);
    };
    Request.prototype.perform = function (overrideOptions) {
        if (overrideOptions === void 0) { overrideOptions = null; }
        var options = overrideOptions ? overrideOptions : this.options;
        return XhrRequest_1.default.ajax(this.requestMethod, this.uri, options, this.headers)
            .then(Request.handleSuccess.bind(this))
            .catch(Request.handleError.bind(this));
    };
    return Request;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Request;


/***/ },
/* 2 */
/***/ function(module, exports) {

"use strict";
"use strict";
/**
 * quick ts implementation of example from
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * with some minor improvements
 * @todo: test (?)
 * @todo: add node.js implementation with node's http inside. Just to make SDK cross-platform
 */
var XhrRequest = (function () {
    function XhrRequest() {
    }
    // Method that performs the ajax request
    XhrRequest.ajax = function (method, url, args, headers, options) {
        if (args === void 0) { args = null; }
        if (headers === void 0) { headers = null; }
        if (options === void 0) { options = {}; }
        // Creating a promise
        return new Promise(function (resolve, reject) {
            // Instantiates the XMLHttpRequest
            var client = XhrRequest.createXMLHTTPObject();
            var uri = url;
            var payload = null;
            // Add given payload to get request
            if (args && (method === XhrRequest.Method.GET)) {
                uri += "?";
                var argcount = 0;
                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        if (argcount++) {
                            uri += "&";
                        }
                        uri += encodeURIComponent(key) + "=" + encodeURIComponent(args[key]);
                    }
                }
            }
            else if (args) {
                if (!headers) {
                    headers = {};
                }
                headers["Content-Type"] = "application/json";
                payload = JSON.stringify(args);
            }
            for (var key in options) {
                if (key in client) {
                    client[key] = options[key];
                }
            }
            // hack: method[method] is somewhat like .toString for enum Method
            // should be made in normal way
            client.open(XhrRequest.Method[method], uri, true);
            // Add given headers
            if (headers) {
                for (var key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        client.setRequestHeader(key, headers[key]);
                    }
                }
            }
            payload ? client.send(payload) : client.send();
            client.onload = function () {
                if (client.status >= 200 && client.status < 300) {
                    // Performs the function "resolve" when this.status is equal to 2xx
                    resolve(client);
                }
                else {
                    // Performs the function "reject" when this.status is different than 2xx
                    reject(client);
                }
            };
            client.onerror = function () {
                reject(client);
            };
        });
    };
    XhrRequest.get = function (url, payload, headers, options) {
        if (payload === void 0) { payload = null; }
        if (headers === void 0) { headers = null; }
        if (options === void 0) { options = {}; }
        return XhrRequest.ajax(XhrRequest.Method.GET, url, payload, headers, options);
    };
    XhrRequest.post = function (url, payload, headers, options) {
        if (payload === void 0) { payload = null; }
        if (headers === void 0) { headers = null; }
        if (options === void 0) { options = {}; }
        return XhrRequest.ajax(XhrRequest.Method.POST, url, payload, headers, options);
    };
    XhrRequest.put = function (url, payload, headers, options) {
        if (payload === void 0) { payload = null; }
        if (headers === void 0) { headers = null; }
        if (options === void 0) { options = {}; }
        return XhrRequest.ajax(XhrRequest.Method.PUT, url, payload, headers, options);
    };
    XhrRequest.delete = function (url, payload, headers, options) {
        if (payload === void 0) { payload = null; }
        if (headers === void 0) { headers = null; }
        if (options === void 0) { options = {}; }
        return XhrRequest.ajax(XhrRequest.Method.DELETE, url, payload, headers, options);
    };
    XhrRequest.createXMLHTTPObject = function () {
        var xmlhttp = null;
        for (var i = 0; i < XhrRequest.XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XhrRequest.XMLHttpFactories[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    };
    XhrRequest.XMLHttpFactories = [
        function () { return new XMLHttpRequest(); },
        function () { return new ActiveXObject("Msxml2.XMLHTTP"); },
        function () { return new ActiveXObject("Msxml3.XMLHTTP"); },
        function () { return new ActiveXObject("Microsoft.XMLHTTP"); }
    ];
    return XhrRequest;
}());
var XhrRequest;
(function (XhrRequest) {
    (function (Method) {
        Method[Method["GET"] = "GET"] = "GET";
        Method[Method["POST"] = "POST"] = "POST";
        Method[Method["PUT"] = "PUT"] = "PUT";
        Method[Method["DELETE"] = "DELETE"] = "DELETE";
    })(XhrRequest.Method || (XhrRequest.Method = {}));
    var Method = XhrRequest.Method;
})(XhrRequest || (XhrRequest = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = XhrRequest;


/***/ },
/* 3 */
/***/ function(module, exports) {

"use strict";
"use strict";
var Constants;
(function (Constants) {
    (function (AVAILABLE_LANGUAGES) {
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["EN"] = "en"] = "EN";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["DE"] = "de"] = "DE";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["ES"] = "es"] = "ES";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["PT_BR"] = "pt-BR"] = "PT_BR";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["ZH_HK"] = "zh-HK"] = "ZH_HK";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["ZH_CN"] = "zh-CN"] = "ZH_CN";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["ZH_TW"] = "zh-TW"] = "ZH_TW";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["NL"] = "nl"] = "NL";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["FR"] = "fr"] = "FR";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["IT"] = "it"] = "IT";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["JA"] = "ja"] = "JA";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["KO"] = "ko"] = "KO";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["PT"] = "pt"] = "PT";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["RU"] = "ru"] = "RU";
        AVAILABLE_LANGUAGES[AVAILABLE_LANGUAGES["UK"] = "uk"] = "UK";
    })(Constants.AVAILABLE_LANGUAGES || (Constants.AVAILABLE_LANGUAGES = {}));
    var AVAILABLE_LANGUAGES = Constants.AVAILABLE_LANGUAGES;
    Constants.VERSION = "2.0.0-beta.8";
    Constants.DEFAULT_BASE_URL = "https://api.api.ai/v1/";
    Constants.DEFAULT_API_VERSION = "20150910";
    Constants.DEFAULT_CLIENT_LANG = AVAILABLE_LANGUAGES.EN;
    // @todo: make configurable, ideally fix non-working v1
    Constants.DEFAULT_TTS_HOST = "https://api.api.ai/api/tts";
})(Constants || (Constants = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Constants;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var ApiAiClient_1 = __webpack_require__(5);
exports.ApiAiClient = ApiAiClient_1.ApiAiClient;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Constants_1 = __webpack_require__(3);
var Errors_1 = __webpack_require__(0);
var EventRequest_1 = __webpack_require__(6);
var TextRequest_1 = __webpack_require__(8);
var TTSRequest_1 = __webpack_require__(7);
// import {UserEntitiesRequest} from "./Request/UserEntitiesRequest";
var XhrRequest_1 = __webpack_require__(2);
exports.XhrRequest = XhrRequest_1.default;
var ApiAiClient = (function () {
    function ApiAiClient(options) {
        if (!options || !options.accessToken) {
            throw new Errors_1.ApiAiClientConfigurationError("Access token is required for new ApiAi.Client instance");
        }
        this.accessToken = options.accessToken;
        this.apiLang = options.lang || Constants_1.default.DEFAULT_CLIENT_LANG;
        this.apiVersion = options.version || Constants_1.default.DEFAULT_API_VERSION;
        this.apiBaseUrl = options.baseUrl || Constants_1.default.DEFAULT_BASE_URL;
        this.sessionId = options.sessionId || this.guid();
        this.streamClientClass = options.streamClientClass || null;
    }
    ApiAiClient.prototype.textRequest = function (query, options) {
        if (options === void 0) { options = {}; }
        if (!query) {
            throw new Errors_1.ApiAiClientConfigurationError("Query should not be empty");
        }
        options.query = query;
        return new TextRequest_1.default(this, options).perform();
    };
    ApiAiClient.prototype.eventRequest = function (eventName, eventData, options) {
        if (eventData === void 0) { eventData = {}; }
        if (options === void 0) { options = {}; }
        if (!eventName) {
            throw new Errors_1.ApiAiClientConfigurationError("Event name can not be empty");
        }
        options.event = { name: eventName, data: eventData };
        return new EventRequest_1.EventRequest(this, options).perform();
    };
    ApiAiClient.prototype.ttsRequest = function (query) {
        if (!query) {
            throw new Errors_1.ApiAiClientConfigurationError("Query should not be empty");
        }
        return new TTSRequest_1.TTSRequest(this).makeTTSRequest(query);
    };
    /*public userEntitiesRequest(options: IRequestOptions = {}): UserEntitiesRequest {
        return new UserEntitiesRequest(this, options);
    }*/
    ApiAiClient.prototype.createStreamClient = function (streamClientOptions) {
        if (streamClientOptions === void 0) { streamClientOptions = {}; }
        if (this.streamClientClass) {
            streamClientOptions.token = this.getAccessToken();
            streamClientOptions.sessionId = this.getSessionId();
            streamClientOptions.lang = this.getApiLang();
            return new this.streamClientClass(streamClientOptions);
        }
        else {
            throw new Errors_1.ApiAiClientConfigurationError("No StreamClient implementation given to ApiAi Client constructor");
        }
    };
    ApiAiClient.prototype.getAccessToken = function () {
        return this.accessToken;
    };
    ApiAiClient.prototype.getApiVersion = function () {
        return (this.apiVersion) ? this.apiVersion : Constants_1.default.DEFAULT_API_VERSION;
    };
    ApiAiClient.prototype.getApiLang = function () {
        return (this.apiLang) ? this.apiLang : Constants_1.default.DEFAULT_CLIENT_LANG;
    };
    ApiAiClient.prototype.getApiBaseUrl = function () {
        return (this.apiBaseUrl) ? this.apiBaseUrl : Constants_1.default.DEFAULT_BASE_URL;
    };
    ApiAiClient.prototype.setSessionId = function (sessionId) {
        this.sessionId = sessionId;
    };
    ApiAiClient.prototype.getSessionId = function () {
        return this.sessionId;
    };
    /**
     * generates new random UUID
     * @returns {string}
     */
    ApiAiClient.prototype.guid = function () {
        var s4 = function () { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); };
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    };
    return ApiAiClient;
}());
exports.ApiAiClient = ApiAiClient;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Request_1 = __webpack_require__(1);
var EventRequest = (function (_super) {
    __extends(EventRequest, _super);
    function EventRequest() {
        _super.apply(this, arguments);
    }
    return EventRequest;
}(Request_1.default));
exports.EventRequest = EventRequest;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Constants_1 = __webpack_require__(3);
var XhrRequest_1 = __webpack_require__(2);
var Request_1 = __webpack_require__(1);
var Errors_1 = __webpack_require__(0);
var TTSRequest = (function (_super) {
    __extends(TTSRequest, _super);
    function TTSRequest(apiAiClient, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        _super.call(this, apiAiClient, options);
        this.apiAiClient = apiAiClient;
        this.resolveTTSPromise = function (data) {
            return _this.speak(data.response);
        };
        this.rejectTTSPromise = function (reason) {
            throw new Errors_1.ApiAiRequestError(reason);
        };
        // this.requestMethod = XhrRequest.Method.GET;
        this.uri = Constants_1.default.DEFAULT_TTS_HOST;
        var AudioContext = window.AudioContext || webkitAudioContext;
        if (!TTSRequest.audioContext) {
            TTSRequest.audioContext = new AudioContext();
        }
    }
    TTSRequest.prototype.makeTTSRequest = function (text) {
        if (!text) {
            throw new Errors_1.ApiAiClientConfigurationError("Request can not be empty");
        }
        var params = {
            lang: "en-US",
            text: encodeURIComponent(text),
            v: this.apiAiClient.getApiVersion()
        };
        var headers = {
            Authorization: "Bearer " + this.apiAiClient.getAccessToken(),
            "Accept-language": "en-US"
        };
        return this.makeRequest(this.uri, params, headers, { responseType: TTSRequest.RESPONSE_TYPE_ARRAYBUFFER })
            .then(this.resolveTTSPromise)
            .catch(this.rejectTTSPromise.bind(this));
    };
    TTSRequest.prototype.makeRequest = function (url, params, headers, options) {
        return XhrRequest_1.default.get(url, params, headers, options);
    };
    TTSRequest.prototype.speak = function (data) {
        var _this = this;
        if (!data.byteLength) {
            return Promise.reject("TTS Server unavailable");
        }
        return new Promise(function (resolve, reject) {
            TTSRequest.audioContext.decodeAudioData(data, function (buffer) {
                return _this.playSound(buffer, resolve);
            }, reject).then(null, function (err) { return reject(err); });
        });
    };
    TTSRequest.prototype.playSound = function (buffer, resolve) {
        var source = TTSRequest.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(TTSRequest.audioContext.destination);
        source.onended = resolve;
        source.start(0);
    };
    ;
    TTSRequest.RESPONSE_TYPE_ARRAYBUFFER = "arraybuffer";
    return TTSRequest;
}(Request_1.default));
exports.TTSRequest = TTSRequest;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Request_1 = __webpack_require__(1);
var TextRequest = (function (_super) {
    __extends(TextRequest, _super);
    function TextRequest() {
        _super.apply(this, arguments);
    }
    return TextRequest;
}(Request_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextRequest;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }
/******/ ]);
//# sourceMappingURL=ApiAi.streamless.js.map