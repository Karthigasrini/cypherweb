const chai = require('chai');
const assert = chai.assert;
const wait = require('../../helpers/wait');
const assertThrow = require('../../helpers/assertThrow');
const broadcaster = require('../../helpers/broadcaster');
const _ = require('lodash');
const cypherWebBuilder = require('../../helpers/cypherWebBuilder');
const CypherWeb = cypherWebBuilder.CypherWeb;

const testCustomError = require('../../fixtures/contracts').testCustomError;

describe('#contract.index', function () {

    let accounts;
    let cypherWeb;
    let emptyAccount;

    before(async function () {
        cypherWeb = cypherWebBuilder.createInstance();
        // ALERT this works only with Cypher Quickstart:
        accounts = await cypherWebBuilder.getTestAccounts(-1);
        emptyAccount = await CypherWeb.createAccount();
    });

    describe('#customError', function () {
        let customError;

        before(async function () {
            const tx = await broadcaster(cypherWeb.transactionBuilder.createSmartContract({
                abi: testCustomError.abi,
                bytecode: testCustomError.bytecode
            }, accounts.b58[0]), accounts.pks[0]);
            customError = await cypherWeb.contract(testCustomError.abi, tx.transaction.contract_address);
        })

        it('should revert with custom error', async () => {
            const txid = await customError.test(111).send();
            await wait(10);
            const data = await cypherWeb.cyp.getTransactionInfo(txid);
            const errorData = data.contractResult;
            const expectedErrorData = 
                CypherWeb.sha3('CustomError(uint256,uint256)', false).slice(0, 8) +
                '000000000000000000000000000000000000000000000000000000000000006f' + // 111
                '0000000000000000000000000000000000000000000000000000000000000001'; // 1
            assert.equal(errorData, expectedErrorData);
        })
    })
});
