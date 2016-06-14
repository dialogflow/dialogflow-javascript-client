import {IStringMap} from "./interfaces/IStringMap";
/**
 * quick ts implementation of example from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * with some minor improvements
 * @todo: test (?)
 */
class XhrRequest {


    // Method that performs the ajax request
    public static ajax (
        method,
        url : string,
        args : IStringMap = null,
        headers : IStringMap = null
    ) : Promise<any> {

        // Creating a promise
        return new Promise(function (resolve, reject) {

            // Instantiates the XMLHttpRequest
            let client : XMLHttpRequest = XhrRequest.createXMLHTTPObject();
            let uri : string = url;
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
            } else if (args) {
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
                } else {
                    // Performs the function "reject" when this.status is different than 2xx
                    reject(this);
                }
            };
            client.onerror = function () {
                reject(this);
            };
        });

    }

    public static get (url, payload: IStringMap = null, headers: IStringMap = null) {
        return XhrRequest.ajax(XhrRequest.Method.GET, url, payload, headers);
    }

    public static post (url: string, payload: IStringMap = null, headers: IStringMap = null) : Promise<{}> {
        return XhrRequest.ajax(XhrRequest.Method.POST, url, payload, headers);
    }

    public static put (url: string, payload: IStringMap = null, headers: IStringMap = null) {
        return XhrRequest.ajax(XhrRequest.Method.PUT, url, payload, headers);
    }

    public static delete (url: string, payload: IStringMap = null, headers: IStringMap = null) {
        return XhrRequest.ajax(XhrRequest.Method.DELETE, url, payload, headers);
    }

    private static XMLHttpFactories = [
        () => new XMLHttpRequest(),
        () => new ActiveXObject("Msxml2.XMLHTTP"),
        () => new ActiveXObject("Msxml3.XMLHTTP"),
        () => new ActiveXObject("Microsoft.XMLHTTP")
    ];

    private static createXMLHTTPObject() : XMLHttpRequest {
        var xmlhttp : XMLHttpRequest = null;
        for (var i=0;i<XhrRequest.XMLHttpFactories.length;i++) {
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

module XhrRequest {
    export enum Method {
        GET = <any> 'GET',
        POST = <any> 'POST',
        PUT = <any> 'PUT',
        DELETE = <any> 'DELETE'
    }
}

export default XhrRequest;
