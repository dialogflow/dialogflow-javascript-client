# Development

* Checkout from this repository, do not forget to switch to "v2" branch
* run `$ npm install`
* run `$ typings install`
* run `$ webpack -w`
* develop! (webpack will automatically compile SDK to ./target/ApiAi.js file on each change, just include it into some test HTML file (./demo/index.html will probably do the job) and test it).

# Testing

run `$ mocha-phantomjs --web-security=no spec/testRunner.html` or just open spec/testRunner file.

### Notice

Command `$ webpack` compiles ./target/ApiAi.js file that can be used in browser.

Command `$ webpack --env.compress=true` compiles ./target/ApiAi.min.js file

# Usage

Currently only simple `textRequest` method is available through this SDK

It looks like:

```javascript

var client = new ApiAi.Client('YOUR_ACCESS_TOKEN');
var promise = client.textRequest(longTextRequest);

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
