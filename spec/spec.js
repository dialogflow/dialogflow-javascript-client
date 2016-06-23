var assert = chai.assert;
let client = new ApiAi.Client('3485a96fb27744db83e78b8c4bc9e7b7');

describe('api.ai', function() {
    it('should return answer', function (done) {
        client.textRequest('Hello').then((serverAnswer) => assert.equal('greeting', serverAnswer.result.action)).then(done);
    });
});
