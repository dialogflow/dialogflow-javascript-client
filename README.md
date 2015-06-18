api.ai.js - Javascript SDK for api.ai
=====================================
api.ai.js makes it easy to integrate your web application with [api.ai](http://api.ai) natural language processing service. 


Project on Github [https://github.com/sergeyi-speaktoit-com/api.ai.js](https://github.com/sergeyi-speaktoit-com/api.ai.js)  
Demo application sources [https://github.com/sergeyi-speaktoit-com/api.ai.js/tree/master/demo](https://github.com/sergeyi-speaktoit-com/api.ai.js/tree/master/demo)

# Prepare your agent

Use [https://api.api.ai/api-client/](https://api.api.ai/api-client/) to create your [agent](http://api.ai/docs/getting-started/5-min-guide/).
You could import example agent [PizzaDelivery.zip](https://github.com/sergeyi-speaktoit-com/api.ai.js/blob/master/resources/PizzaDelivery.zip)
You'll need [access_token](http://api.ai/docs/getting-started/quick-start-api.html#step-1-obtain-an-access-token) to let client access to the agent.

# Using

Add [api.ai.min.js](https://github.com/sergeyi-speaktoit-com/api.ai.js/blob/master/target/api.ai.min.js) before your main js script in your html file.
```html
<script type="text/javascript" src="js/api.ai.min.js"></script>
<script type="text/javascript" src="js/main.js"></script>
```

To launch your web application you need deploy the html file and all scripts by using webserver. Using web-server is important because some of browsers don't allow access to microphone if your html file open from file system (URL like "file:///C:/Users/I/Projects/api.ai.js/demo/index.html").


Create instance of ApiAi. 
You can use config to set properties and listeners:

```javascript
var config = {
    server: 'wss://api.api.ai:4435/api/ws/query',
    token: access_token,// Use Client access token there (see agent keys).
    sessionId: sessionId,
    onInit: function () {
        console.log("> ON INIT use config");
    }
};
var apiAi = new ApiAi(config);
```

Or you can assign properties  and listeners directly:

```javascript
apiAi.sessionId = '1234';
apiAi.onInit = function () {
    console.log("> ON INIT use direct assignment property");
    apiAi.open();
};
```

Invoke init() method when you want to ask permissions to use microphone.

```javascript
apiAi.init();
```

After initialisation you could open websocket 
```javascript
apiAi.onInit = function () {
    console.log("> ON INIT use direct assignment property");
    apiAi.open();
};
```

When socket is open you can start listening microphone
 
```javascript
apiAi.onOpen = function () {
    apiAi.startListening();
};
```

To stop listening invoke:
```javascript
apiAi.stopListening();
```

If you use Firefox you don't need interrupt listening manually. End of speech detection do it for you. 

To get access to result use callback onResults(data)

```javascript
apiAi.onResults = function (data) {
    var status = data.status;
    var code;
    if (!(status && (code = status.code) && isFinite(parseFloat(code)) && code < 300 && code > 199)) {
        text.innerHTML = JSON.stringify(status);
        return;
    }
    processResult(data.result);
};
```

[Response object structure](http://api.ai/docs/reference/#response) described in [documentation](http://api.ai/docs/)

# API properties

```javascript
/**
 * 
 * 'wss://api.api.ai:4435/api/ws/query' 
 */
apiAi.server
/**
 * Client access token of your agent. 
 */
apiAi.token
/**
 * Unique session identifier to build dialogue. 
 */
apiAi.sessionId
/**
 * How often reader should send audio-data chunk to the server.
 */
apiAi.readingInterval
```

# API methods

```javascript
/**
 * Initializes audioContext
 * Set up the recorder (incl. asking permission)
 * Can be called multiple times.
 */
apiAi.init();
/**
 * Chck if recorder is initialise.
 * @returns {boolean}
 */
apiAi.isInitialise();
/**
 * Send object as json
 * @param json - javascript map.
 */
apiAi.sendJson(jsObjectOrMap);
/**
 * Start recording and transcribing
 */
apiAi.startListening();
/**
 * Stop listening, i.e. recording and sending of new input.
 */
apiAi.stopListening();
/**
 * Check if websocket is open
 */
apiAi.isOpen();
/**
 * Open websocket
 */
apiAi.open();
/**
 * Cancel everything without waiting on the server
 */
apiAi.close();
```

# API callbacks

```javascript
/**
 * It's triggered after web-socket is open.
 */
apiAi.onOpen = function () {};
/**
 * It's triggered after web-socket is closed. 
 */
apiAi.onClose = function () {};
/**
 * It's triggered after initialisation is finished.
 */
apiAi.onInit = function () {};
/**
 * It's triggered when listening is started. 
 */
apiAi.onStartListening = function () {};
/**
 * It's triggered when listening is stopped.
 */
apiAi.onStopListening = function () {};
/**
 *  It's triggered when result is received;
 */
apiAi.onResults = function (result) {};
/**
 * It's triggered when event is happened; 
 */
apiAi.onEvent = function (code, data) {};
/**
 * It's triggered when error is happened; 
 */
apiAi.onError = function (code, data) {};
```



