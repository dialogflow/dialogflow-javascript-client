var client = new ApiAi.Client('YOUR_ACCESS_TOKEN');
//will work (well, somehow)
var request = 'test';
//will not work, too long, should throw error
var longTextRequest = 'test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test ';

client.textRequest(longTextRequest)
    .then(handleResponse)
    .catch(heandleError);

function handleResponse(serverResponse) {
    console.log(serverResponse);
}
function heandleError(serverError) {
    console.log(serverError);
}