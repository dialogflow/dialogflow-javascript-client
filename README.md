
# Installation

You can use this library as common pre-built .js ([choose there](target)).

Or you can install it with nodejs and that import as es6 (or .ts) module. See below. 

`npm install api-ai-javascript@2.0.0-beta.14`


# Usage

## .textRequest

```javascript

const client = new ApiAi.ApiAiClient({accessToken: 'YOUR_ACCESS_TOKEN'});
const promise = client.textRequest(longTextRequest);

promise
    .then(handleResponse)
    .catch(handleError);

function handleResponse(serverResponse) {
        console.log(serverResponse);
}
function handleError(serverError) {
        console.log(serverError);
}

```

## .eventRequest

```javascript
const promise = client.eventRequest("EVENT_NAME", options);
```

# TypeScript and ES6

This SDK written with Typescript and all it's sources are available in this package. So basically if you are using something like *webpack* or *browserify* with ES6 imports and so on, you can just install this SDK with `$ npm install api-ai-javascript --save-dev` command and then import original sources with something like:

```javascript

import {ApiAiClient} from "api-ai-javascript";

const client = new ApiAiClient({accessToken: 'YOUR_ACCESS_TOKEN'})

.textRequest('Hello!')
    .then((response) => {/* do something */})
    .catch((error) => {/* do something here too */})

```

*Note:* If you are going to build es5 version of your bundle with ApiAiClient inside, please add some typings for promises (e.g. @types/es6-promise)

You also can import and use all defined interfaces and ApiAiConstants:

```javascript
import {IRequestOptions, IServerResponse, ApiAiConstants} from "api-ai-javascript/ApiAiClient"
const lang = ApiAiConstants.AVAILABLE_LANGUAGES.EN;
```

You can find full list of interfaces [here](ts/Interfaces.ts)

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

## 2.0.0-beta.21
* tts and asr support removed (discontinued on API.AI side)
## 2.0.0-beta.19
* minor typings changes
## 2.0.0-beta.18
* some minor typings changes
## 2.0.0-beta.17
* dependencies updated
* webrtc typings removed (now part of typescript default lib)
## 2.0.0-beta.16
* some linting (ionic2 compatibility issues)
## 2.0.0-beta.15
* minor fixes, minor readme updates
* exported constants
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
