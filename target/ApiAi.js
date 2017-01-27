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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ApiAiBaseError = (function (_super) {
    __extends(ApiAiBaseError, _super);
    function ApiAiBaseError(message) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.stack = new Error().stack;
        return _this;
    }
    return ApiAiBaseError;
}(Error));
var ApiAiClientConfigurationError = (function (_super) {
    __extends(ApiAiClientConfigurationError, _super);
    function ApiAiClientConfigurationError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "ApiAiClientConfigurationError";
        return _this;
    }
    return ApiAiClientConfigurationError;
}(ApiAiBaseError));
exports.ApiAiClientConfigurationError = ApiAiClientConfigurationError;
var ApiAiRequestError = (function (_super) {
    __extends(ApiAiRequestError, _super);
    function ApiAiRequestError(message, code) {
        if (code === void 0) { code = null; }
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.code = code;
        _this.name = "ApiAiRequestError";
        return _this;
    }
    return ApiAiRequestError;
}(ApiAiBaseError));
exports.ApiAiRequestError = ApiAiRequestError;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

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
    return XhrRequest;
}());
XhrRequest.XMLHttpFactories = [
    function () { return new XMLHttpRequest(); },
    function () { return new ActiveXObject("Msxml2.XMLHTTP"); },
    function () { return new ActiveXObject("Msxml3.XMLHTTP"); },
    function () { return new ActiveXObject("Microsoft.XMLHTTP"); }
];
(function (XhrRequest) {
    var Method;
    (function (Method) {
        Method[Method["GET"] = "GET"] = "GET";
        Method[Method["POST"] = "POST"] = "POST";
        Method[Method["PUT"] = "PUT"] = "PUT";
        Method[Method["DELETE"] = "DELETE"] = "DELETE";
    })(Method = XhrRequest.Method || (XhrRequest.Method = {}));
})(XhrRequest || (XhrRequest = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = XhrRequest;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Constants;
(function (Constants) {
    var AVAILABLE_LANGUAGES;
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
    })(AVAILABLE_LANGUAGES = Constants.AVAILABLE_LANGUAGES || (Constants.AVAILABLE_LANGUAGES = {}));
    Constants.VERSION = "2.0.0-beta.8";
    Constants.DEFAULT_BASE_URL = "https://api.api.ai/v1/";
    Constants.DEFAULT_API_VERSION = "20150910";
    Constants.DEFAULT_CLIENT_LANG = AVAILABLE_LANGUAGES.EN;
    // @todo: make configurable, ideally fix non-working v1
    Constants.DEFAULT_TTS_HOST = "https://api.api.ai/api/tts";
})(Constants || (Constants = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Constants;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * this module is full copy-paste from v1 sdk. It should be like that while we send 'resempler' to worker as
 * 'function body'
 * @todo: re-make as normal class
 * @private
 */

function _resamplerJs() {
    function Resampler(fromSampleRate, toSampleRate, channels, outputBufferSize, noReturn) {
        this.fromSampleRate = fromSampleRate;
        this.toSampleRate = toSampleRate;
        this.channels = channels | 0;
        this.outputBufferSize = outputBufferSize;
        this.noReturn = !!noReturn;
        this.initialize();
    }
    Resampler.prototype.initialize = function () {
        //Perform some checks:
        if (this.fromSampleRate <= 0 || this.toSampleRate <= 0 || this.channels <= 0) {
            throw (new Error("Invalid settings specified for the resampler."));
        }
        if (this.fromSampleRate == this.toSampleRate) {
            //Setup a resampler bypass:
            this.resampler = this.bypassResampler; //Resampler just returns what was passed through.
            this.ratioWeight = 1;
        }
        else {
            //Resampler is a custom quality interpolation algorithm.
            this.resampler = function (buffer) {
                var bufferLength = Math.min(buffer.length, this.outputBufferSize);
                if ((bufferLength % this.channels) != 0) {
                    throw (new Error("Buffer was of incorrect sample length."));
                }
                if (bufferLength <= 0) {
                    return (this.noReturn) ? 0 : [];
                }
                var weight = 0;
                var output = new Array(this.channels);
                for (var channel = 0; channel < this.channels; ++channel) {
                    output[channel] = 0;
                }
                var actualPosition = 0;
                var amountToNext = 0;
                var alreadyProcessedTail = !this.tailExists;
                this.tailExists = false;
                var outputBuffer = this.outputBuffer;
                var outputOffset = 0;
                var currentPosition = 0;
                var ratioWeight = this.ratioWeight;
                do {
                    if (alreadyProcessedTail) {
                        weight = ratioWeight;
                        for (channel = 0; channel < this.channels; ++channel) {
                            output[channel] = 0;
                        }
                    }
                    else {
                        weight = this.lastWeight;
                        for (channel = 0; channel < this.channels; ++channel) {
                            output[channel] = this.lastOutput[channel];
                        }
                        alreadyProcessedTail = true;
                    }
                    while (weight > 0 && actualPosition < bufferLength) {
                        amountToNext = 1 + actualPosition - currentPosition;
                        if (weight >= amountToNext) {
                            for (channel = 0; channel < this.channels; ++channel) {
                                output[channel] += buffer[actualPosition++] * amountToNext;
                            }
                            currentPosition = actualPosition;
                            weight -= amountToNext;
                        }
                        else {
                            for (channel = 0; channel < this.channels; ++channel) {
                                output[channel] += buffer[actualPosition + ((channel > 0) ? channel : 0)] * weight;
                            }
                            currentPosition += weight;
                            weight = 0;
                            break;
                        }
                    }
                    if (weight == 0) {
                        for (channel = 0; channel < this.channels; ++channel) {
                            outputBuffer[outputOffset++] = output[channel] / ratioWeight;
                        }
                    }
                    else {
                        this.lastWeight = weight;
                        for (channel = 0; channel < this.channels; ++channel) {
                            this.lastOutput[channel] = output[channel];
                        }
                        this.tailExists = true;
                        break;
                    }
                } while (actualPosition < bufferLength);
                return this.bufferSlice(outputOffset);
            };
            this.ratioWeight = this.fromSampleRate / this.toSampleRate;
            this.tailExists = false;
            this.lastWeight = 0;
            this.initializeBuffers();
        }
    };
    Resampler.prototype.bypassResampler = function (buffer) {
        if (this.noReturn) {
            //Set the buffer passed as our own, as we don't need to resample it:
            this.outputBuffer = buffer;
            return buffer.length;
        }
        else {
            //Just return the buffer passsed:
            return buffer;
        }
    };
    Resampler.prototype.bufferSlice = function (sliceAmount) {
        if (this.noReturn) {
            //If we're going to access the properties directly from this object:
            return sliceAmount;
        }
        else {
            //Typed array and normal array buffer section referencing:
            try {
                return this.outputBuffer.subarray(0, sliceAmount);
            }
            catch (error) {
                try {
                    //Regular array pass:
                    this.outputBuffer.length = sliceAmount;
                    return this.outputBuffer;
                }
                catch (error) {
                    //Nightly Firefox 4 used to have the subarray function named as slice:
                    return this.outputBuffer.slice(0, sliceAmount);
                }
            }
        }
    };
    Resampler.prototype.initializeBuffers = function () {
        //Initialize the internal buffer:
        try {
            this.outputBuffer = new Float32Array(this.outputBufferSize);
            this.lastOutput = new Float32Array(this.channels);
        }
        catch (error) {
            this.outputBuffer = [];
            this.lastOutput = [];
        }
    };
    navigator.Resampler = Resampler;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = _resamplerJs;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ApiAiClient_1 = __webpack_require__(6);
exports.ApiAiClient = ApiAiClient_1.ApiAiClient;
var ApiAiStreamClient_1 = __webpack_require__(7);
exports.ApiAiStreamClient = ApiAiStreamClient_1.ApiAiStreamClient;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Constants_1 = __webpack_require__(3);
var Errors_1 = __webpack_require__(0);
var EventRequest_1 = __webpack_require__(8);
var TextRequest_1 = __webpack_require__(10);
var TTSRequest_1 = __webpack_require__(9);
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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StreamClient_1 = __webpack_require__(14);
/**
 * @deprecated
 */
var ApiAiStreamClient = (function (_super) {
    __extends(ApiAiStreamClient, _super);
    function ApiAiStreamClient(streamClientOptions) {
        if (streamClientOptions === void 0) { streamClientOptions = {}; }
        var _this = this;
        if (!streamClientOptions.server) {
            streamClientOptions.server = ""
                + ApiAiStreamClient.STREAM_CLIENT_SERVER_PROTO
                + "://" + ApiAiStreamClient.DEFAULT_STREAM_CLIENT_BASE_URL
                + ApiAiStreamClient.STREAM_CLIENT_SERVER_PATH;
        }
        _this = _super.call(this, streamClientOptions) || this;
        return _this;
    }
    return ApiAiStreamClient;
}(StreamClient_1.default));
ApiAiStreamClient.DEFAULT_STREAM_CLIENT_BASE_URL = "api-ws.api.ai:4435/v1/";
ApiAiStreamClient.STREAM_CLIENT_SERVER_PROTO = "wss";
ApiAiStreamClient.STREAM_CLIENT_SERVER_PATH = "/ws/query";
exports.ApiAiStreamClient = ApiAiStreamClient;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EventRequest;
}(Request_1.default));
exports.EventRequest = EventRequest;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

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
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, apiAiClient, options) || this;
        _this.apiAiClient = apiAiClient;
        _this.resolveTTSPromise = function (data) {
            return _this.speak(data.response);
        };
        _this.rejectTTSPromise = function (reason) {
            throw new Errors_1.ApiAiRequestError(reason);
        };
        // this.requestMethod = XhrRequest.Method.GET;
        _this.uri = Constants_1.default.DEFAULT_TTS_HOST;
        var AudioContext = window.AudioContext || webkitAudioContext;
        if (!TTSRequest.audioContext) {
            TTSRequest.audioContext = new AudioContext();
        }
        return _this;
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
    return TTSRequest;
}(Request_1.default));
TTSRequest.RESPONSE_TYPE_ARRAYBUFFER = "arraybuffer";
exports.TTSRequest = TTSRequest;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TextRequest;
}(Request_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TextRequest;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Resampler_1 = __webpack_require__(4);
var VAD_1 = __webpack_require__(15);
var Processors = (function () {
    function Processors() {
    }
    Processors.bindProcessors = function () {
        Resampler_1.default();
        window.AudioContext = window.AudioContext || webkitAudioContext;
        AudioContext.prototype.createResampleProcessor = function (bufferSize, numberOfInputChannels, numberOfOutputChannels, destinationSampleRate) {
            var script_processor = this.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
            var resampler = new navigator.Resampler(this.sampleRate, destinationSampleRate, numberOfInputChannels, bufferSize, true);
            script_processor.onaudioprocess = function (event) {
                var inp = event.inputBuffer.getChannelData(0);
                var out = event.outputBuffer.getChannelData(0);
                var l = resampler.resampler(inp);
                for (var i = 0; i < l; ++i) {
                    out[i] = resampler.outputBuffer[i];
                }
            };
            return script_processor;
        };
        function MagicBuffer(chunkSize) {
            this.chunkSize = chunkSize;
            this.array_data = [];
            this.callback = null;
        }
        MagicBuffer.prototype.push = function (array) {
            var l = array.length;
            var new_array = new Array(Math.ceil(l / 2));
            for (var i = 0; i < l; i += 2) {
                new_array[i / 2] = array[i];
            }
            Array.prototype.push.apply(this.array_data, new_array);
            this.process();
        };
        MagicBuffer.prototype.process = function () {
            var elements;
            while (this.array_data.length > this.chunkSize) {
                elements = this.array_data.splice(0, this.chunkSize);
                if (this.callback) {
                    this.callback(elements);
                }
            }
        };
        MagicBuffer.prototype.drop = function () {
            this.array_data.splice(0, this.array_data.length);
        };
        AudioContext.prototype['createEndOfSpeechProcessor'] = function (bufferSize) {
            var script_processor = this.createScriptProcessor(bufferSize, 1, 1);
            script_processor.endOfSpeechCallback = null;
            var vad = new VAD_1.default();
            script_processor.vad = vad;
            var buffer = new MagicBuffer(160);
            buffer.callback = function (elements) {
                var vad_result = vad.process(elements);
                if (vad_result !== 'CONTINUE' && script_processor.endOfSpeechCallback) {
                    script_processor.endOfSpeechCallback();
                    buffer.drop();
                }
            };
            script_processor.onaudioprocess = function (event) {
                var inp = event.inputBuffer.getChannelData(0);
                var out = event.outputBuffer.getChannelData(0);
                buffer.push(inp);
                for (var i = 0; i < inp.length; i++) {
                    out[i] = inp[i];
                }
            };
            return script_processor;
        };
    };
    return Processors;
}());
exports.Processors = Processors;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Resampler_1 = __webpack_require__(4);
var RecorderWorker_1 = __webpack_require__(13);
var Recorder = (function () {
    function Recorder(source, config) {
        if (config === void 0) { config = {}; }
        var bufferLen = config.bufferLen || 4096;
        this.context = source.context;
        this.node = this.context.createScriptProcessor(bufferLen, 1, 1);
        var worker = new Worker(this._getRecorderWorkerUrl());
        worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate,
                resamplerInitializerBody: this._getFunctionBody(Resampler_1.default)
            }
        });
        var recording = false, currCallback;
        this.node.onaudioprocess = function (e) {
            if (!recording)
                return;
            worker.postMessage({
                command: 'record',
                buffer: [
                    e.inputBuffer.getChannelData(0)
                ]
            });
        };
        this.configure = function (cfg) {
            for (var prop in cfg) {
                if (cfg.hasOwnProperty(prop)) {
                    config[prop] = cfg[prop];
                }
            }
        };
        this.record = function () {
            recording = true;
        };
        this.stop = function () {
            recording = false;
        };
        this.clear = function () {
            worker.postMessage({ command: 'clear' });
        };
        this.getBuffer = function (cb) {
            currCallback = cb || config.callback;
            worker.postMessage({ command: 'getBuffer' });
        };
        this.export16kMono = function (cb, type) {
            currCallback = cb || config.callback;
            type = type || config.type || 'audio/raw';
            if (!currCallback)
                throw new Error('Callback not set');
            worker.postMessage({
                command: 'export16kMono',
                type: type
            });
        };
        worker.onmessage = function (e) {
            currCallback(e.data);
        };
        source.connect(this.node);
        this.node.connect(this.context.destination);
    }
    Recorder.prototype._getRecorderWorkerUrl = function () {
        var getBlobUrl = window.URL && URL.createObjectURL.bind(URL);
        return getBlobUrl(new Blob([this._getFunctionBody(RecorderWorker_1.default.createRecorderWorker())], { type: 'text/javascript' }));
    };
    Recorder.prototype._getFunctionBody = function (fn) {
        if (typeof fn !== 'function') {
            throw new Error("Illegal argument exception: argument is not a funtion: " + fn);
        }
        var fnStr = fn.toString(), start = fnStr.indexOf('{'), fin = fnStr.lastIndexOf('}');
        return (start > 0 && fin > 0) ? fnStr.substring(start + 1, fin) : fnStr;
    };
    return Recorder;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Recorder;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var RecorderWorker = (function () {
    function RecorderWorker() {
    }
    RecorderWorker.createRecorderWorker = function () {
        return function _recorderWorkerJs() {
            var recLength = 0, recBuffers = [], sampleRate, resampler;
            this.onmessage = function (e) {
                switch (e.data.command) {
                    case 'init':
                        init(e.data.config);
                        break;
                    case 'record':
                        record(e.data.buffer);
                        break;
                    case 'export16kMono':
                        export16kMono(e.data.type);
                        break;
                    case 'getBuffer':
                        getBuffer();
                        break;
                    case 'clear':
                        clear();
                        break;
                }
            };
            function init(config) {
                // Invoke initializer to register Resampler within navigator object
                (new Function(config.resamplerInitializerBody))();
                sampleRate = config.sampleRate;
                //resampler = new Resampler(sampleRate, 16000, 1, 50 * 1024, false);
                resampler = new navigator['Resampler'](sampleRate, 16000, 1, 50 * 1024, false);
            }
            function record(inputBuffer) {
                recBuffers.push(inputBuffer[0]);
                recLength += inputBuffer[0].length;
            }
            function export16kMono(type) {
                var buffer = mergeBuffers(recBuffers, recLength);
                var samples = resampler.resampler(buffer);
                var dataview = encodeRAW(samples);
                var audioBlob = new Blob([dataview], { type: type });
                this.postMessage(audioBlob);
            }
            function getBuffer() {
                var buffers = [];
                buffers.push(mergeBuffers(recBuffers, recLength));
                this.postMessage(buffers);
            }
            function clear() {
                recLength = 0;
                recBuffers = [];
            }
            function mergeBuffers(recBuffers, recLength) {
                var result = new Float32Array(recLength);
                var offset = 0;
                for (var i = 0; i < recBuffers.length; i++) {
                    result.set(recBuffers[i], offset);
                    offset += recBuffers[i].length;
                }
                return result;
            }
            function _floatTo16BitPCM(output, offset, input) {
                for (var i = 0; i < input.length; i++, offset += 2) {
                    var s = Math.max(-1, Math.min(1, input[i]));
                    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                }
            }
            function _writeString(view, offset, string) {
                for (var i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            }
            function encodeWAV(samples) {
                var buffer = new ArrayBuffer(44 + samples.length * 2);
                var view = new DataView(buffer);
                /* RIFF identifier */
                _writeString(view, 0, 'RIFF');
                /* file length */
                view.setUint32(4, 32 + samples.length * 2, true);
                /* RIFF type */
                _writeString(view, 8, 'WAVE');
                /* format chunk identifier */
                _writeString(view, 12, 'fmt ');
                /* format chunk length */
                view.setUint32(16, 16, true);
                /* sample format (raw) */
                view.setUint16(20, 1, true);
                /* channel count */
                view.setUint16(22, 2, true);
                /* sample rate */
                view.setUint32(24, sampleRate, true);
                /* byte rate (sample rate * block align) */
                view.setUint32(28, sampleRate * 4, true);
                /* block align (channel count * bytes per sample) */
                view.setUint16(32, 4, true);
                /* bits per sample */
                view.setUint16(34, 16, true);
                /* data chunk identifier */
                _writeString(view, 36, 'data');
                /* data chunk length */
                view.setUint32(40, samples.length * 2, true);
                _floatTo16BitPCM(view, 44, samples);
                return view;
            }
            function encodeRAW(samples) {
                var buffer = new ArrayBuffer(samples.length * 2);
                var view = new DataView(buffer);
                _floatTo16BitPCM(view, 0, samples);
                return view;
            }
        };
    };
    return RecorderWorker;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RecorderWorker;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Recorder_1 = __webpack_require__(12);
var Processors_1 = __webpack_require__(11);
/**
 * this is mostly copy-paste of v1 API.AI JS SDK. Todo: finish and make it work .
 */
var StreamClient = (function () {
    function StreamClient(config) {
        if (config === void 0) { config = {}; }
        Processors_1.Processors.bindProcessors();
        this.server = config.server || '';
        this.token = config.token || '';
        this.sessionId = config.sessionId || '';
        this.lang = config.lang || 'en';
        this.contentType = config.contentType || StreamClient.CONTENT_TYPE;
        this.readingInterval = config.readingInterval || StreamClient.INTERVAL;
        this.onOpen = config.onOpen && config.onOpen.bind(this) || _noop;
        this.onClose = config.onClose && config.onClose.bind(this) || _noop;
        this.onInit = config.onInit && config.onInit.bind(this) || _noop;
        this.onStartListening = config.onStartListening && config.onStartListening.bind(this) || _noop;
        this.onStopListening = config.onStopListening && config.onStopListening.bind(this) || _noop;
        this.onResults = config.onResults && config.onResults.bind(this) || _noop;
        this.onEvent = config.onEvent && config.onEvent.bind(this) || _noop;
        this.onError = config.onError && config.onError.bind(this) || _noop;
        function _noop() { }
    }
    StreamClient.prototype.init = function () {
        var _this = this;
        this.onEvent(StreamClient.Events.MSG_WAITING_MICROPHONE, "Waiting for approval to access your microphone ...");
        try {
            window.AudioContext = window.AudioContext || webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            window.URL = window.URL || window['webkitURL'];
            this.audioContext = new AudioContext();
        }
        catch (e) {
            // Firefox 24: TypeError: AudioContext is not a constructor
            // Set media.webaudio.enabled = true (in about:config) to fix this.
            this.onError(StreamClient.ERROR.ERR_CLIENT, "Error initializing Web Audio browser: " + JSON.stringify(e));
        }
        if (navigator.getUserMedia) {
            navigator.getUserMedia({ audio: true }, this.startUserMedia.bind(this, this.onInit), function (e) {
                _this.onError(StreamClient.ERROR.ERR_CLIENT, "No live audio input in this browser: " + JSON.stringify(e));
            });
        }
        else {
            this.onError(StreamClient.ERROR.ERR_CLIENT, "No user media support");
        }
    };
    StreamClient.prototype.startUserMedia = function (onInit, stream) {
        this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
        //this.onEvent(MSG_MEDIA_STREAM_CREATED, 'Media stream created');
        this.userSpeechAnalyser = this.audioContext.createAnalyser();
        this.mediaStreamSource.connect(this.userSpeechAnalyser);
        this.recorder = new Recorder_1.default(this.mediaStreamSource);
        this.onEvent(StreamClient.Events.MSG_INIT_RECORDER, 'Recorder initialized');
        onInit && onInit();
    };
    StreamClient.prototype.isInitialise = function () {
        return !!this.recorder;
    };
    StreamClient.prototype.sendJson = function (json) {
        this.socketSend(JSON.stringify(json));
        this.socketSend(StreamClient.TAG_END_OF_SENTENCE);
    };
    ;
    StreamClient.prototype.startListening = function () {
        var _this = this;
        if (!this.recorder) {
            this.onError(StreamClient.ERROR.ERR_AUDIO, 'Recorder undefined');
            return;
        }
        if (!this.ws) {
            this.onError(StreamClient.ERROR.ERR_AUDIO, 'No web socket connection');
            return;
        }
        var _useVad = function (endOfSpeechCallback) {
            _this.resampleProcessor = _this.audioContext['createResampleProcessor'](256, 1, 1, 16000);
            _this.mediaStreamSource.connect(_this.resampleProcessor);
            var endOfSpeechProcessor = _this.audioContext['createEndOfSpeechProcessor'](256);
            endOfSpeechProcessor.endOfSpeechCallback = endOfSpeechCallback;
            _this.resampleProcessor.connect(endOfSpeechProcessor);
        };
        _useVad(function () { return _this.stopListening(); });
        this.ws.send("{'timezone':'America/New_York', 'lang':'" + this.lang + "', 'sessionId':'" + this.sessionId + "'}");
        this.intervalKey = setInterval(function () {
            _this.recorder.export16kMono(function (blob) {
                _this.socketSend(blob);
                _this.recorder.clear();
            }, 'audio/x-raw');
        }, this.readingInterval);
        // Start recording
        this.recorder.record();
        this.onStartListening(); // call interface method
    };
    ;
    StreamClient.prototype.stopListening = function () {
        var _this = this;
        this.resampleProcessor && this.resampleProcessor.disconnect();
        // Stop the regular sending of audio
        clearInterval(this.intervalKey);
        var recorder = this.recorder;
        if (!recorder) {
            this.onError(StreamClient.ERROR.ERR_AUDIO, 'Recorder undefined');
            return;
        }
        // Stop recording
        recorder.stop();
        this.onEvent(StreamClient.Events.MSG_STOP, 'Stopped recording');
        // Push the remaining audio to the server
        recorder.export16kMono(function (blob) {
            _this.socketSend(blob);
            _this.socketSend(StreamClient.TAG_END_OF_SENTENCE);
            recorder.clear();
        }, 'audio/x-raw');
        this.onStopListening();
    };
    ;
    StreamClient.prototype.isOpen = function () {
        return !!this.ws;
    };
    ;
    StreamClient.prototype.openWebSocket = function () {
        if (!this.recorder) {
            this.onError(StreamClient.ERROR.ERR_AUDIO, "Recorder undefined");
            return;
        }
        if (this.ws) {
            this.close();
        }
        try {
            this.ws = this.createWebSocket();
        }
        catch (e) {
            this.onError(StreamClient.ERROR.ERR_CLIENT, "No web socket support in this browser!");
        }
    };
    ;
    StreamClient.prototype.createWebSocket = function () {
        var _this = this;
        var url = this.server + '?' + this.contentType + '&access_token=' + this.token;
        var ws = new WebSocket(url);
        ws.onmessage = function (e) {
            var data = e.data;
            _this.onEvent(StreamClient.Events.MSG_WEB_SOCKET, data);
            if (data instanceof Object && !(data instanceof Blob)) {
                _this.onError(StreamClient.ERROR.ERR_SERVER, 'WebSocket: onEvent: got Object that is not a Blob');
            }
            else if (data instanceof Blob) {
                _this.onError(StreamClient.ERROR.ERR_SERVER, 'WebSocket: got Blob');
            }
            else {
                _this.onResults(JSON.parse(data)); // call interface method
            }
        };
        // Start recording only if the socket becomes open
        ws.onopen = function (e) {
            // send first request for initialisation dialogue
            //ws.send("{'timezone':'America/New_York', 'lang':'en'}");
            _this.onOpen(); // call interface method
            _this.onEvent(StreamClient.Events.MSG_WEB_SOCKET_OPEN, e);
        };
        // This can happen if the blob was too big
        // E.g. "Frame size of 65580 bytes exceeds maximum accepted frame size"
        // Status codes
        // http://tools.ietf.org/html/rfc6455#section-7.4.1
        // 1005:
        // 1006:
        ws.onclose = function (e) {
            // The server closes the connection (only?)
            // when its endpointer triggers.
            _this.onClose(); // call interface method
            _this.onEvent(StreamClient.Events.MSG_WEB_SOCKET_CLOSE, e.code + "/" + e.reason + "/" + e.wasClean);
        };
        ws.onerror = function (e) {
            _this.onError(StreamClient.ERROR.ERR_NETWORK, JSON.stringify(e.data));
        };
        return ws;
    };
    StreamClient.prototype.open = function () {
        if (!this.recorder) {
            this.init();
        }
        else {
            this.openWebSocket();
        }
    };
    ;
    StreamClient.prototype.close = function () {
        // Stop the regular sending of audio (if present)
        clearInterval(this.intervalKey);
        if (this.recorder) {
            this.recorder.stop();
            this.recorder.clear();
            this.onEvent(StreamClient.Events.MSG_STOP, 'Stopped recording');
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    };
    ;
    StreamClient.prototype.socketSend = function (item) {
        if (!this.ws) {
            this.onError(StreamClient.ERROR.ERR_CLIENT, 'No web socket connection: failed to send: ' + item);
            return;
        }
        var state = this.ws.readyState;
        if (state != 1) {
            var errorMsg = 'WebSocket: ';
            switch (state) {
                case 0:
                    errorMsg += 'The connection is not yet open.';
                    break;
                //case 1:break;// OPEN
                case 2:
                    errorMsg += 'The connection is in the process of closing.';
                    break;
                case 3:
                    errorMsg += 'The connection is closed or couldn\'t be opened.';
                    break;
            }
            errorMsg += ' readyState=' + state + ' (!=1) failed to send: ' + item;
            this.onError(StreamClient.ERROR.ERR_NETWORK, errorMsg);
        }
        // If item isn't an audio blob it's the EOS tag or json data (string)
        if (!(item instanceof Blob)) {
            this.ws.send(item);
            this.onEvent(StreamClient.Events.MSG_SEND_EOS_OR_JSON, 'Send string: ' + item);
        }
        else if (item.size > 0) {
            this.ws.send(item);
            this.onEvent(StreamClient.Events.MSG_SEND, 'Send: blob: ' + item.type + ', ' + item.size);
        }
        else {
            this.onEvent(StreamClient.Events.MSG_SEND_EMPTY, 'Send: blob: ' + item.type + ', EMPTY');
        }
    };
    ;
    return StreamClient;
}());
StreamClient.CONTENT_TYPE = "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1";
StreamClient.INTERVAL = 250;
StreamClient.TAG_END_OF_SENTENCE = "EOS";
(function (StreamClient) {
    var ERROR;
    (function (ERROR) {
        ERROR[ERROR["ERR_NETWORK"] = 0] = "ERR_NETWORK";
        ERROR[ERROR["ERR_AUDIO"] = 1] = "ERR_AUDIO";
        ERROR[ERROR["ERR_SERVER"] = 2] = "ERR_SERVER";
        ERROR[ERROR["ERR_CLIENT"] = 3] = "ERR_CLIENT";
    })(ERROR = StreamClient.ERROR || (StreamClient.ERROR = {}));
    var Events;
    (function (Events) {
        Events[Events["MSG_WAITING_MICROPHONE"] = 0] = "MSG_WAITING_MICROPHONE";
        Events[Events["MSG_MEDIA_STREAM_CREATED"] = 1] = "MSG_MEDIA_STREAM_CREATED";
        Events[Events["MSG_INIT_RECORDER"] = 2] = "MSG_INIT_RECORDER";
        Events[Events["MSG_RECORDING"] = 3] = "MSG_RECORDING";
        Events[Events["MSG_SEND"] = 4] = "MSG_SEND";
        Events[Events["MSG_SEND_EMPTY"] = 5] = "MSG_SEND_EMPTY";
        Events[Events["MSG_SEND_EOS_OR_JSON"] = 6] = "MSG_SEND_EOS_OR_JSON";
        Events[Events["MSG_WEB_SOCKET"] = 7] = "MSG_WEB_SOCKET";
        Events[Events["MSG_WEB_SOCKET_OPEN"] = 8] = "MSG_WEB_SOCKET_OPEN";
        Events[Events["MSG_WEB_SOCKET_CLOSE"] = 9] = "MSG_WEB_SOCKET_CLOSE";
        Events[Events["MSG_STOP"] = 10] = "MSG_STOP";
        Events[Events["MSG_CONFIG_CHANGED"] = 11] = "MSG_CONFIG_CHANGED";
    })(Events = StreamClient.Events || (StreamClient.Events = {}));
})(StreamClient || (StreamClient = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StreamClient;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var VAD = (function () {
    function VAD() {
        this.reset();
    }
    VAD.prototype.process = function (frame) {
        var active = this.frameActive(frame);
        this.time = this.frameNumber * 160.0 / 16000.0;
        if (active) {
            if (this.lastActiveTime >= 0 && (this.time - this.lastActiveTime) < this.silenceLengthMilis) {
                this.sequenceCounter++;
                if (this.sequenceCounter >= this.minSequenceCount) {
                    this.lastSequenceTime = this.time;
                    this.silenceLengthMilis = Math.max(this.minSilenceLengthMilis, this.silenceLengthMilis - (this.maxSilenceLengthMilis - this.minSilenceLengthMilis) / 4.0);
                }
            }
            else {
                this.sequenceCounter = 1;
            }
            this.lastSequenceTime = this.time;
        }
        else {
            if (this.time - this.lastSequenceTime > this.silenceLengthMilis) {
                if (this.lastSequenceTime > 0) {
                    return 'TERMINATE';
                }
                else {
                    return 'NO_SPEECH';
                }
            }
        }
        return 'CONTINUE';
    };
    ;
    VAD.prototype.frameActive = function (frame) {
        var energy = 0;
        var czCount = 0;
        var lastsign = 0;
        var frame_length = frame.length;
        for (var i = 0; i < frame_length; i++) {
            energy += (frame[i] * frame[i]) / 160.0;
            var sign = 0;
            if (frame[i] > 0) {
                sign = 1;
            }
            else {
                sign = -1;
            }
            if (lastsign != 0 && sign != lastsign) {
                czCount++;
            }
            lastsign = sign;
        }
        this.frameNumber += 1;
        var result = false;
        if (this.frameNumber < this.noiseFrames) {
            this.noiseEnergy += energy / this.noiseFrames;
            console.log('noiseEnergy=', this.noiseEnergy);
        }
        else {
            if (czCount >= this.minCZ && czCount <= this.maxCZ) {
                if (energy > Math.max(0.01, this.noiseEnergy) * this.energyFactor) {
                    result = true;
                }
            }
        }
        return result;
    };
    ;
    VAD.prototype.reset = function () {
        this.minCZ = 5;
        this.maxCZ = 15;
        this.frameLengthMilis = 10.0;
        this.maxSilenceLengthMilis = 3.5;
        this.minSilenceLengthMilis = 0.8;
        this.silenceLengthMilis = this.maxSilenceLengthMilis;
        this.sequenceLengthMilis = 0.03;
        this.minSequenceCount = 3;
        this.energyFactor = 3.1;
        this.noiseFrames = Math.round(150. / this.frameLengthMilis);
        this.noiseEnergy = 0.0;
        this.frameNumber = 0;
        this.lastActiveTime = -1.0;
        this.lastSequenceTime = 0.0;
        this.sequenceCounter = 0;
        this.time = 0.0;
    };
    ;
    return VAD;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VAD;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ })
/******/ ]);
//# sourceMappingURL=ApiAi.js.map