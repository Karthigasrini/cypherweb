const cypherWebBuilder = require('./cypherWebBuilder');
const cypherWeb = cypherWebBuilder.createInstance();

const amount = process.argv[2] || 10;

(async function () {
    await cypherWebBuilder.newTestAccounts(amount)
})()

