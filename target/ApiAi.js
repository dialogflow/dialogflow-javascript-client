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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var TextRequest_1 = __webpack_require__(2);
	var Constants_1 = __webpack_require__(5);
	var XhrRequest_1 = __webpack_require__(4);
	exports.XhrRequest = XhrRequest_1.default;
	var Client = (function () {
	    function Client(accessToken) {
	        this.accessToken = accessToken;
	        if (!this.sessionId) {
	            this.setSessionId(this.guid());
	        }
	    }
	    Client.prototype.textRequest = function (query, options) {
	        if (query === void 0) { query = ''; }
	        if (options === void 0) { options = {}; }
	        options['query'] = query;
	        return new TextRequest_1.default(this, options).perform();
	    };
	    Client.prototype.createStream = function () {
	        //new StreamClient();
	        //@todo
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
	        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	            s4() + '-' + s4() + s4() + s4();
	    };
	    return Client;
	}());
	exports.Client = Client;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Request_1 = __webpack_require__(3);
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var XhrRequest_1 = __webpack_require__(4);
	var Request = (function () {
	    function Request(apiAiClient, options) {
	        this.apiAiClient = apiAiClient;
	        this.options = options;
	        this.uri = this.apiAiClient.getApiBaseUrl() + 'query?v=' + this.apiAiClient.getApiVersion();
	        this.requestMethod = 'POST';
	        this.options['lang'] = this.apiAiClient.getApiLang();
	        this.options['sessionId'] = this.apiAiClient.getSessionId();
	        this.headers = {
	            'Authorization': 'Bearer ' + this.apiAiClient.getAccessToken()
	        };
	    }
	    /**
	     * @todo: deal with Access-Control headers, probably on server-side
	     */
	    Request.prototype.perform = function () {
	        console.log('performing test request on URI', this.uri, 'with options:', this.options, 'with headers', this.headers);
	        return XhrRequest_1.default.post(this.uri, this.options, this.headers)
	            .then(Request.handleSuccess.bind(this))
	            .catch(Request.handleError.bind(this));
	    };
	    Request.handleSuccess = function (xhr) {
	        return Promise.resolve(JSON.parse(xhr.responseText));
	    };
	    Request.handleError = function (xhr) {
	        return Promise.reject(JSON.parse(xhr.responseText));
	    };
	    return Request;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Request;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * quick ts implementation of example from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
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
	                uri += '?';
	                var argcount = 0;
	                for (var key in args) {
	                    if (args.hasOwnProperty(key)) {
	                        if (argcount++) {
	                            uri += '&';
	                        }
	                        uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
	                    }
	                }
	            }
	            else if (args) {
	                if (!headers) {
	                    headers = {};
	                }
	                headers['Content-Type'] = 'application/json';
	                payload = JSON.stringify(args);
	            }
	            client.open(method, uri);
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
	        Method[Method["GET"] = 'GET'] = "GET";
	        Method[Method["POST"] = 'POST'] = "POST";
	        Method[Method["PUT"] = 'PUT'] = "PUT";
	        Method[Method["DELETE"] = 'DELETE'] = "DELETE";
	    })(XhrRequest.Method || (XhrRequest.Method = {}));
	    var Method = XhrRequest.Method;
	})(XhrRequest || (XhrRequest = {}));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = XhrRequest;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var Constants = (function () {
	    function Constants() {
	    }
	    Constants.VERSION = '2.0.0';
	    Constants.DEFAULT_BASE_URL = 'https://api.api.ai/v1/';
	    Constants.DEFAULT_API_VERSION = '20150204';
	    Constants.DEFAULT_CLIENT_LANG = 'en';
	    return Constants;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Constants;


/***/ }
/******/ ]);
//# sourceMappingURL=ApiAi.js.map