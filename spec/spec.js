"use strict";
var assert = chai.assert;
var client = new ApiAi.Client({ accessToken: '3485a96fb27744db83e78b8c4bc9e7b7'});
var userEntitiesReq = client.userEntitiesRequest();
var userEntity_1 = {
    name: 'dwarfs',
    entries: [{value: 'test', synonyms: ['test1', 'test2']}]
};

var entries_2 =[{value: 'test2', synonyms: ['test2', 'test3']}];


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

    it('should create custom entities', function (done) {
        userEntitiesReq.create(userEntity_1).then(function(){done()}).catch(onError);
    });

    it('should return user entities', function (done) {
        userEntitiesReq.retrieve('dwarfs')
            .then(function (response) {
                assert.equal(response.entries[0].value, 'test');
            })
            .then(done)
            .catch(onError);
    });

    it('should update custom entities', function (done) {
        userEntitiesReq.update('dwarfs', entries_2).then(function () {
            userEntitiesReq.retrieve('dwarfs')
                .then(function (response) {
                    assert.equal(response.entries[0].value, 'test2');
                })
                .then(done)
                .catch(onError);
        }).catch(onError);
    })

    it('should delete user entity', function (done) {
        userEntitiesReq.delete('dwarfs').then(function () {
            userEntitiesReq.retrieve('dwarfs')
                .then(function (response) {
                    console.log(response);
                    //assert.equal(response.entries[0].value, 'test2');
                })
                .then(done)
                .catch(onError);
        }).catch(onError);
    })
});
