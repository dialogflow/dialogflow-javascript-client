"use strict";
var assert = chai.assert;
var client = new ApiAi.Client('3485a96fb27744db83e78b8c4bc9e7b7');

var onError = function(msg, trace) {
    console.log(msg);
    console.log(trace);
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
        });
    }
    console.error(msgStack.join('\n'));
};



describe('api.ai', function() {
    it('should return answer', function (done) {
        client.textRequest('Hello')
            .then(function(serverAnswer){
                assert.equal('greeting', serverAnswer.result.action)
            }).then(done).catch(onError);
    });
});
