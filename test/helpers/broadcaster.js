const cypherWebBuilder = require('../helpers/cypherWebBuilder');

module.exports = async function (func, pk, transaction) {
    const cypherWeb = cypherWebBuilder.createInstance();
    if( !transaction) {
        transaction = await func;
    }
    const signedTransaction = await cypherWeb.cyp.sign(transaction, pk);
    const result = {
        transaction,
        signedTransaction,
        receipt: await cypherWeb.cyp.sendRawTransaction(signedTransaction)
    };
    return Promise.resolve(result);
}
