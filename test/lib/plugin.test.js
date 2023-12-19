const chai = require('chai');
const {FULL_NODE_API} = require('../helpers/config');
const assertThrow = require('../helpers/assertThrow');
const cypherWebBuilder = require('../helpers/cypherWebBuilder');
const CypherWeb = cypherWebBuilder.CypherWeb;
const GetNowBlock = require('../helpers/GetNowBlock');
const BlockLib = require('../helpers/BlockLib');
const jlog = require('../helpers/jlog')

const assert = chai.assert;

describe('CypherWeb.lib.plugin', async function () {

    let cypherWeb;

    before(async function () {
        cypherWeb = cypherWebBuilder.createInstance();
    });

    describe('#constructor()', function () {

        it('should have been set a full instance in cypherWeb', function () {

            assert.instanceOf(cypherWeb.plugin, CypherWeb.Plugin);
        });

    });

    describe("#plug GetNowBlock into cypherWeb.cyp", async function () {

        it('should register the plugin GetNowBlock', async function () {

            const someParameter = 'someValue'

            let result = cypherWeb.plugin.register(GetNowBlock, {
                someParameter
            })
            assert.isTrue(result.skipped.includes('_parseToken'))
            assert.isTrue(result.plugged.includes('getCurrentBlock'))
            assert.isTrue(result.plugged.includes('getLatestBlock'))

            result = await cypherWeb.cyp.getCurrentBlock()
            assert.isTrue(result.fromPlugin)
            assert.equal(result.blockID.length, 64)
            assert.isTrue(/^00000/.test(result.blockID))

            result = await cypherWeb.cyp.getSomeParameter()
            assert.equal(result, someParameter)

        })

    });

    describe("#plug BlockLib into cypherWeb at first level", async function () {

        it('should register the plugin and call a method using a promise', async function () {

            let result = cypherWeb.plugin.register(BlockLib)
            assert.equal(result.libs[0], 'BlockLib')
            result = await cypherWeb.blockLib.getCurrent()
            assert.isTrue(result.fromPlugin)
            assert.equal(result.blockID.length, 64)
            assert.isTrue(/^00000/.test(result.blockID))

        })

        it('should register and call a method using callbacks', async function () {

            cypherWeb.plugin.register(BlockLib)
            return new Promise(resolve => {
                cypherWeb.blockLib.getCurrent((err, result) => {
                    assert.isTrue(result.fromPlugin)
                    assert.equal(result.blockID.length, 64)
                    assert.isTrue(/^00000/.test(result.blockID))
                    resolve()
                })
            })
        })

        it('should not register if cypherWeb is instantiated with the disablePlugins option', async function () {

            let cypherWeb2 = cypherWebBuilder.createInstance({disablePlugins: true});
            let result = cypherWeb2.plugin.register(BlockLib);
            assert.isTrue(typeof result.error === 'string');

        })


    });

});
