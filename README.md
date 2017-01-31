**This is the V2 version of api.ai JS SDK. If you are looking for old one, please visit 'v1-deprecated' branch**

# Installation

You can use this library as common pre-built .js ([choose there](target)).

.streamless version does not have bundled ApiAiStreamClient inside and because of that have smaller size.

Or you can install it with nodejs and that import as es6 (or .ts) module. See below. 

`npm install api-ai-javascript@2.0.0-beta.13`


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
    .then((response) => {/* do something */})
    .catch((error) => {/* do something here too */})

```

Or (to include only http client, without stream, to save some extra kilobytes ): 

```javascript
import {ApiAiClient} from "api-ai-javascript/ApiAiClient"

const client = new ApiAiClient('YOUR_ACCESS_TOKEN');

```

in that case `client.createStreamClient()` # will throw ApiAiConfigurationError
Code above should work for both TypeScript and simple ES6

*Note:* If you are going to build es5 version of your bundle with ApiAiClient inside, please add some typings for promises (e.g. @types/es6-promise)

# Development

* Checkout from this repository, do not forget to switch to "v2" branch
* run `$ npm install`
* run `$ webpack -w` or just `$ npm start` (as an option for non globally installed dev-server - `$ ./node_modules/.bin/webpack-dev-server`)
* develop! (webpack will automatically compile SDK to ./target/ApiAi.js file on each change, just include it into some test HTML file (./demo/index.html will probably do the job) and test it).

# Building

`$ npm run-script build` command will build everything

# Testing

`$ npm test`

## Changelog

## 2.0.0-beta.14
* minor fixes
* GainNode removed (for now) as non-working in current setup

## 2.0.0-beta.13
* IStreamClient is aligned with StreamClient needs, thanks to @muuki88 (#26)
* Callbacks in IStremClientOptions are now typed properly
* Added IStreamClient.getGain(): GainNode (#25) to allow set up gain of listener
* Fixed UTF8 requests, thanks to @elaval (#24)

## 2.0.0-beta.12

* Possibility to import ApiAiClient separately from ApiAiStreamClient 
* Typescript project demo setup added 

## 2.0.0-beta.8
### Breaking changes:
* Main class renamed from Client to ApiAiClient
* StreamClient renamed (in exports at least) to ApiAiStreamClient
* StreamClient class is no longer available inside main ApiAiClient class and now should be passed directly in ApiAiClient constructor: `const client = new ApiAiClient("ACCESS_TOKEN", {streamClientClass: ApiAiStreamClient})`.That was made to allow building your applications without streamclient at all (streamclient now takes about 70% of whole library). And also there will be other implementation of streamClient in the future

### Non-breaking changes:
* Demo updated
