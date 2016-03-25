JavaScript SDK for Api.ai
=====================================
api.ai.js makes it easy to integrate [Api.ai](https://api.ai) natural language processing service into your web application. 

## Prepare your agent

You can use [Api.ai developer console](https://console.api.ai/) to create your own [agent](https://docs.api.ai/docs/get-started) or
import our example [Pizza Delivery](https://github.com/sergeyi-speaktoit-com/api.ai.js/blob/master/resources/PizzaDelivery.zip) agent.
You will also need an [access_token and subscription key](https://docs.api.ai/docs/authentication) to let the client access your agent.

## How to use the agent

Add [api.ai.min.js](src/api.ai.min.js) before the main js script in your html file.
```html
<script type="text/javascript" src="js/api.ai.min.js"></script>
<script type="text/javascript" src="js/main.js"></script>
```

To launch your web application, deploy the html file and all scripts using web server. It is important to use web server, as some browsers don't allow access to microphone if an html file is opened using file system (e.g. URL like "/home/johnny/demo/index.html").

### Create instance
There are two options to create instance for api.ai.
You can use config to set properties and listeners like that:

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

Alternatively, assign properties and listeners directly:

```javascript
apiAi.sessionId = 'YOUR_SESSION_ID';
apiAi.onInit = function () {
    console.log("> ON INIT use direct assignment property");
    apiAi.open();
};
```
### Use microphone
To get permission to use the microphone, invoke init() method as shown below.

```javascript
apiAi.init();
```

After initialisation you are able to open websocket.
```javascript
apiAi.onInit = function () {
    console.log("> ON INIT use direct assignment property");
    apiAi.open();
};
```

Once socket is opened, start listening to the microphone.
 
```javascript
apiAi.onOpen = function () {
    apiAi.startListening();
};
```

To stop listening, invoke the following method:
```javascript
apiAi.stopListening();
```

Firefox users don't need to interrupt listening manually. End of speech detection will do it for you. 

To get access to the result, use callback onResults(data).

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

For information about [Response object structure](https://docs.api.ai/docs/query#response), please visit our [documentation](https://docs.api.ai/) page.

## API properties

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
 * How often to send audio data chunk to the server.
 */
apiAi.readingInterval
```

## API methods

```javascript
/**
 * Initialize audioContext
 * Set up the recorder (incl. asking permission)
 * Can be called multiple times
 */
apiAi.init();
/**
 * Check if recorder is initialise
 * @returns {boolean}
 */
apiAi.isInitialise();
/**
 * Send object as json
 * @param json - javascript map
 */
apiAi.sendJson(jsObjectOrMap);
/**
 * Start recording and transcribing
 */
apiAi.startListening();
/**
 * Stop listening, i.e. recording and sending new input
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
 * Cancel everything without waiting for the server
 */
apiAi.close();
```

# API callbacks

```javascript
/**
 * It's triggered after websocket is opened.
 */
apiAi.onOpen = function () {};
/**
 * It's triggered after websocket is closed. 
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
 *  It's triggered when result is received.
 */
apiAi.onResults = function (result) {};
/**
 * It's triggered when event is happened.
 */
apiAi.onEvent = function (code, data) {};
/**
 * It's triggered when error is happened.
 */
apiAi.onError = function (code, data) {};
```



