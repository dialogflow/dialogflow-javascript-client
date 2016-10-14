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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
    XhrRequest.ajax = function (method, url, args, headers) {
        if (args === void 0) { args = null; }
        if (headers === void 0) { headers = null; }
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
            // hack: method[method] is somewhat like .toString for enum Method
            // should be made in normal way
            client.open(XhrRequest.Method[method], uri);
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
                if (this.status >= 200 && this.status < 300) {
                    // Performs the function "resolve" when this.status is equal to 2xx
                    resolve(this);
                }
                else {
                    // Performs the function "reject" when this.status is different than 2xx
                    reject(this);
                }
            };
            client.onerror = function () {
                reject(this);
            };
        });
    };
    XhrRequest.get = function (url, payload, headers) {
        if (payload === void 0) { payload = null; }
        if (headers === void 0) { headers = null; }
        return XhrRequest.ajax(XhrRequest.Method.GET, url, payload, headers);
    };
    XhrRequest.post = function (url, payload, headers) {
        if (payload === void 0) { payload = null; }
        if (headers === void 0) { headers = null; }
        return XhrRequest.ajax(XhrRequest.Method.POST, url, payload, headers);
    };
    XhrRequest.put = function (url, payload, headers) {
        if (payload === void 0) { payload = null; }
        if (headers === void 0) { headers = null; }
        return XhrRequest.ajax(XhrRequest.Method.PUT, url, payload, headers);
    };
    XhrRequest.delete = function (url, payload, headers) {
        if (payload === void 0) { payload = null; }
        if (headers === void 0) { headers = null; }
        return XhrRequest.ajax(XhrRequest.Method.DELETE, url, payload, headers);
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Constants_1 = __webpack_require__(3);
var Errors_1 = __webpack_require__(0);
var StubStreamClient_1 = __webpack_require__(6);
exports.StreamClient = StubStreamClient_1.default;
var TextRequest_1 = __webpack_require__(5);
// import {UserEntitiesRequest} from "./Request/UserEntitiesRequest";
var XhrRequest_1 = __webpack_require__(1);
exports.XhrRequest = XhrRequest_1.default;
var Client = (function () {
    function Client(options) {
        if (!options || !options.accessToken) {
            throw new Errors_1.ApiAiClientConfigurationError("Access token is required for new ApiAi.Client instance");
        }
        this.accessToken = options.accessToken;
        this.apiLang = options.lang || Constants_1.default.DEFAULT_CLIENT_LANG;
        this.apiVersion = options.version || Constants_1.default.DEFAULT_API_VERSION;
        this.apiBaseUrl = options.baseUrl || Constants_1.default.DEFAULT_BASE_URL;
        this.sessionId = options.sessionId || this.guid();
    }
    Client.prototype.textRequest = function (query, options) {
        if (options === void 0) { options = {}; }
        if (!query) {
            throw new Errors_1.ApiAiClientConfigurationError("Query should not be empty");
        }
        options.query = query;
        return new TextRequest_1.default(this, options).perform();
    };
    /*public userEntitiesRequest(options: IRequestOptions = {}): UserEntitiesRequest {
        return new UserEntitiesRequest(this, options);
    }*/
    Client.prototype.createStreamClient = function (streamClientOptions) {
        if (streamClientOptions === void 0) { streamClientOptions = {}; }
        streamClientOptions.server = ""
            + Constants_1.default.STREAM_CLIENT_SERVER_PROTO
            + "://" + Constants_1.default.DEFAULT_STREAM_CLIENT_BASE_URL
            + Constants_1.default.STREAM_CLIENT_SERVER_PATH;
        streamClientOptions.token = this.getAccessToken();
        streamClientOptions.sessionId = this.getSessionId();
        streamClientOptions.lang = this.getApiLang();
        return new StubStreamClient_1.default(streamClientOptions);
    };
    Client.prototype.getAccessToken = function () {
        return this.accessToken;
    };
    Client.prototype.getApiVersion = function () {
        return (this.apiVersion) ? this.apiVersion : Constants_1.default.DEFAULT_API_VERSION;
    };
    Client.prototype.getApiLang = function () {
        return (this.apiLang) ? this.apiLang : Constants_1.default.DEFAULT_CLIENT_LANG;
    };
    Client.prototype.getApiBaseUrl = function () {
        return (this.apiBaseUrl) ? this.apiBaseUrl : Constants_1.default.DEFAULT_BASE_URL;
    };
    Client.prototype.setSessionId = function (sessionId) {
        this.sessionId = sessionId;
    };
    Client.prototype.getSessionId = function () {
        return this.sessionId;
    };
    /**
     * generates new random UUID
     * @returns {string}
     */
    Client.prototype.guid = function () {
        var s4 = function () { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); };
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    };
    return Client;
}());
exports.Client = Client;


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
    Constants.VERSION = "2.0.0";
    Constants.DEFAULT_BASE_URL = "https://api.api.ai/v1/";
    Constants.DEFAULT_STREAM_CLIENT_BASE_URL = "api-ws.api.ai:4435/v1/";
    Constants.DEFAULT_API_VERSION = "20150204";
    Constants.DEFAULT_CLIENT_LANG = AVAILABLE_LANGUAGES.EN;
    Constants.STREAM_CLIENT_SERVER_PROTO = "wss";
    Constants.STREAM_CLIENT_SERVER_PATH = "/ws/query";
})(Constants || (Constants = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Constants;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Errors_1 = __webpack_require__(0);
var XhrRequest_1 = __webpack_require__(1);
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Request_1 = __webpack_require__(4);
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Errors_1 = __webpack_require__(0);
var StubStreamClient = (function () {
    function StubStreamClient(options) {
        if (options === void 0) { options = {}; }
        throw new Errors_1.ApiAiClientConfigurationError("You are using SDK version without built-in stream support");
    }
    return StubStreamClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StubStreamClient;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }
/******/ ]);
//# sourceMappingURL=ApiAi.streamless.js.map