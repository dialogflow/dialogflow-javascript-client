/**
 * quick ts implementation of http://www.quirksmode.org/js/xmlhttp.html
 * @todo: test
 * @todo: rewrite with promises and normal ts-flow
 * @todo: error handling
 */
export default class XhrRequest {

    public static sendRequest(url, data, headers, callback) {
        var req : XMLHttpRequest = XhrRequest.createXMLHTTPObject();
        if (!req) return;
        //var method = (postData) ? "POST" : "GET";
        var method = 'POST';
        req.open(method, url, true);
        //req.setRequestHeader('User-Agent','XMLHTTP/1.0');

        for (var key in headers) {
            req.setRequestHeader(key, headers[key])
        }
        req.setRequestHeader('Content-Type', 'application/json');

        //if (postData)
        //    req.setRequestHeader('Content-type','application/x-www-form-urlencoded');

        req.onreadystatechange = function () {
            if (req.readyState != 4) return;
            if (req.status != 200 && req.status != 304) {
//          alert('HTTP error ' + req.status);
                return;
            }
            callback(req);
        };
        if (req.readyState == 4) return;
        req.send(JSON.stringify(data));
    }

    private static XMLHttpFactories = [
        function () {return new XMLHttpRequest()},
        function () {return new ActiveXObject("Msxml2.XMLHTTP")},
        function () {return new ActiveXObject("Msxml3.XMLHTTP")},
        function () {return new ActiveXObject("Microsoft.XMLHTTP")}
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