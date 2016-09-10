/**
 * quick ts implementation of example from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * with some minor improvements
 * @todo: test (?)
 * @todo: add node.js implementation with node's http inside. Just to make SDK cross-platform
 */
class XhrRequest {
    // Method that performs the ajax request
    static ajax(method, url, args = null, headers = null) {
        // Creating a promise
        return new Promise(function (resolve, reject) {
            // Instantiates the XMLHttpRequest
            let client = XhrRequest.createXMLHTTPObject();
            let uri = url;
            let payload = null;
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
    }
    static get(url, payload = null, headers = null) {
        return XhrRequest.ajax(XhrRequest.Method.GET, url, payload, headers);
    }
    static post(url, payload = null, headers = null) {
        return XhrRequest.ajax(XhrRequest.Method.POST, url, payload, headers);
    }
    static put(url, payload = null, headers = null) {
        return XhrRequest.ajax(XhrRequest.Method.PUT, url, payload, headers);
    }
    static delete(url, payload = null, headers = null) {
        return XhrRequest.ajax(XhrRequest.Method.DELETE, url, payload, headers);
    }
    static createXMLHTTPObject() {
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
    }
}
XhrRequest.XMLHttpFactories = [
    () => new XMLHttpRequest(),
    () => new ActiveXObject("Msxml2.XMLHTTP"),
    () => new ActiveXObject("Msxml3.XMLHTTP"),
    () => new ActiveXObject("Microsoft.XMLHTTP")
];
(function (XhrRequest) {
    (function (Method) {
        Method[Method["GET"] = 'GET'] = "GET";
        Method[Method["POST"] = 'POST'] = "POST";
        Method[Method["PUT"] = 'PUT'] = "PUT";
        Method[Method["DELETE"] = 'DELETE'] = "DELETE";
    })(XhrRequest.Method || (XhrRequest.Method = {}));
    var Method = XhrRequest.Method;
})(XhrRequest || (XhrRequest = {}));
export default XhrRequest;
