# Development

* Checkout from this repository, do not forget to switch to "v2" branch
* run `$ npm install`
* run `$ webpack -w  --env.compress=false`
* develop! (webpack will automatically compile SDK to ./target/ApiAi.js file on each change, just include it into some test HTML file (./demo/index.html will probably do the job) and test it).

# Testing

run `$ mocha-phantomjs --web-security=no spec/testRunner.html` or just open spec/testRunner file.

### Notice


Command `$ webpack --env.compress=false` compiles ./target/ApiAi.js file that can be used in browser.

Command `$ webpack --env.compress=true` compiles ./target/ApiAi.min.js file

Command `$ webpack --env.compress=true --env.target=commonjs2` compiles ./target/ApiAi.commonjs2.min.js - same library that can be included with any commonjs2-compatible loader (including webpack).

You also can just compile project code from .ts to es6 js and use it directly via ES6 import.

# Usage

Currently only simple `textRequest` method is available through this SDK

It looks like:

```javascript

const client = new ApiAi.Client('YOUR_ACCESS_TOKEN');
let promise = client.textRequest(longTextRequest);

promise
    .then(handleResponse)
    .catch(heandleError);

function handleResponse(serverResponse) {
        console.log(serverResponse);
}
function heandleError(serverError) {
        console.log(serverError);
}
```

And old (ported from V1 SDK) stream client (you can stream audio from mic with it):

```javascript

const SERVER_PROTO = 'wss';
const SERVER_DOMAIN = 'api.api.ai';
const SERVER_PORT = '4435';
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

const config = {
    server: SERVER_PROTO + '://' + SERVER_DOMAIN + ':' + SERVER_PORT + '/api/ws/query',
    token: ACCESS_TOKEN,// Use Client access token there (see agent keys).
    sessionId: '123',
    lang: 'en',
    onInit: function () {
        console.log("> ON INIT use config");
    }
};

const streamClient = new ApiAi.StreamClient(config);

streamClient.onInit = function () {
    console.log("> ON INIT use direct assignment property");
    streamClient.open();
};

streamClient.init();

...

streamClient.startListening();
streamClient.stopListening();

```
