var client = new ApiAi.Client('YOUR_ACCESS_TOKEN');

//will work (well, somehow)
var request = 'test';
//will not work, too long, should throw error
var longTextRequest = 'test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test ';

var promise = client.textRequest(longTextRequest);
promise.then(
    function (serverResponse) {
        console.log(serverResponse);
    }
).catch(
    function (serverError) {
        console.log(serverError);
    }
);