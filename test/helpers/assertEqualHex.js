const assert = require('chai').assert;
const cypherWebBuilder = require('./cypherWebBuilder');

module.exports = async function (result, string) {

    assert.equal(
        result,
        cypherWebBuilder.getInstance().toHex(string).substring(2)
    )
}
