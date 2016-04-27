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
	var Client = (function () {
	    function Client(accessToken) {
	        this.accessToken = accessToken;
	    }
	    Client.prototype.textRequest = function (query, options) {
	        if (query === void 0) { query = ''; }
	        if (options === void 0) { options = {}; }
	        options['query'] = query;
	        return new TextRequest_1.default(this, options).perform();
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
	        this.headers = {
	            'Authorization': 'Bearer ' + this.apiAiClient.getAccessToken()
	        };
	    }
	    /**
	     * @todo: deal with Access-Control headers, probably on server-side
	     */
	    Request.prototype.perform = function () {
	        console.log('performing test request on URI', this.uri, 'with options:', this.options, 'with headers', this.headers);
	        XhrRequest_1.default.sendRequest(this.uri, this.options, this.headers, function (resp) {
	            console.log('server responded with', resp);
	        });
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
	 * quick ts implementation of http://www.quirksmode.org/js/xmlhttp.html
	 * @todo: test
	 * @todo: rewrite with promises and normal ts-flow
	 * @todo: error handling
	 */
	var XhrRequest = (function () {
	    function XhrRequest() {
	    }
	    XhrRequest.sendRequest = function (url, data, headers, callback) {
	        var req = XhrRequest.createXMLHTTPObject();
	        if (!req)
	            return;
	        //var method = (postData) ? "POST" : "GET";
	        var method = 'POST';
	        req.open(method, url, true);
	        //req.setRequestHeader('User-Agent','XMLHTTP/1.0');
	        for (var key in headers) {
	            req.setRequestHeader(key, headers[key]);
	        }
	        req.setRequestHeader('Content-Type', 'application/json');
	        //if (postData)
	        //    req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	        req.onreadystatechange = function () {
	            if (req.readyState != 4)
	                return;
	            if (req.status != 200 && req.status != 304) {
	                //          alert('HTTP error ' + req.status);
	                return;
	            }
	            callback(req);
	        };
	        if (req.readyState == 4)
	            return;
	        req.send(JSON.stringify(data));
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