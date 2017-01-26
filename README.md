# Usage

## .textRequest

```javascript

const client = new ApiAi.ApiAiClient('YOUR_ACCESS_TOKEN');
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

## .eventRequest

```javascript
let promise = client.eventRequest("EVENT_NAME", options);
```

## StreamClient

An old (ported from V1 SDK) stream client (you can stream audio from mic with it):

```javascript
const client = new ApiAi.Client({accessToken: "ACCESS_TOKEN", streamClientClass: ApiAi.ApiAiStreamClient});
const streamClient = client.createStreamClient(); // in that case some default settings will be applied
streamClient.onInit = function () {
    console.log("> ON INIT use direct assignment property");
    streamClient.open();
};

// or using 'options': 

const streamClient = client.createStreamClient({
    onInit: () => {
                console.log("> ON INIT use direct assignment property");
                streamClient.open();
            }
});

streamClient.init();
streamClient.startListening();
streamClient.stopListening();
```

# TypeScript and ES6

This SDK written with Typescript and all it's sources are available in this package. So basically if you are using something like *webpack* or *browserify* with ES6 imports and so on, you can just install this SDK with `$ npm install api-ai-javascript --save-dev` command and then import original sources with something like:

```javascript

import {ApiAiClient, ApiAiStreamClient} from "api-ai-javascript";

const client = new ApiAiClient('YOUR_ACCESS_TOKEN', {streamClientClass: ApiAiStreamClient});
client
    .textRequest('Hello!')
    .then((response) => /* do something */ )
    .catch((error) => /* do something here too */)

```

Code above should work for both TypeScript and simple ES6

# Development

* Checkout from this repository, do not forget to switch to "v2" branch
* run `$ npm install`
* run `$ webpack -w` or just `$ webpack-dev-server` (as an option for non globally installed dev-server - `$ ./node_modules/.bin/webpack-dev-server`)
* develop! (webpack will automatically compile SDK to ./target/ApiAi.js file on each change, just include it into some test HTML file (./demo/index.html will probably do the job) and test it).

# Building

`$ npm run-script build` command will build everything

# Testing

`$ npm test`
