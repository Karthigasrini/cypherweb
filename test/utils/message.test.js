const chai = require('chai');
const cypherWebBuilder = require('../helpers/cypherWebBuilder');
const CypherWeb = cypherWebBuilder.CypherWeb;

const assert = chai.assert;

const messageCases = require('../testcases/src/sign-message');
const tests = messageCases.tests;

describe('CypherWeb.utils.message', function () {

    describe('#hashMessage()', function () {

        tests.forEach(function(test) {
            it(('hashes a message "' + test.name + '"'), function() {
                let hash = CypherWeb.utils.message.hashMessage(test.message);
                assert.equal(hash, test.messageHash, 'calculates message hash');
            });
        });
    });

    describe('#signMessage()', function () {

        tests.forEach(function(test) {
            it('signs a message "' + test.name + '"', function () {
                const signature = CypherWeb.utils.message.signMessage(test.message, test.privateKey);
                assert.equal(signature, test.signature, 'computes message signature');
            });
        });
    });

    describe('#verifyMessage()', function () {

        tests.forEach(function(test) {
            it('verify a message "' + test.name + '"', function () {
                const address = CypherWeb.utils.message.verifyMessage(test.message, test.signature);
                assert.equal(address, test.address, 'verifies message signature');
            });
        });
    });
});
