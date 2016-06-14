# Development

* Checkout from this repository, do not forget to switch to "v2" branch
* run `$ npm install`
* run `$ typings install`
* run `$ webpack -w`
* develop! (webpack will automatically compile SDK to ./target/ApiAi.js file on each change, just include it into some test HTML file (./demo/index.html will probably do the job) and test it).

### Notice

Command `$ webpack` compiles ./target/ApiAi.js file that can be used in browser.

Command `$ webpack --minify` or `$ webpack -m` compiles ./target/ApiAi.min.js file

# Usage

Currently only simple 'textRequest' method is available through this SDK

`var client = new ApiAi.Client('YOUR_ACCESS_TOKEN');` will create new ApiAi.Client instanse;

`var promise = client.textRequest(longTextRequest);` will return to you standard JS Deferred object, that can be used with `then` or `catch` or anything else.

For example:

```javascript
promise.then(
    function (serverResponse) {
        console.log(serverResponse);
    }
).catch(
    function (serverError) {
        console.log(serverError);
    }
);
```
