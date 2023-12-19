const cypherWebBuilder = require('./cypherWebBuilder');
const cypherWeb = cypherWebBuilder.createInstance();
const wait = require('./wait');
const chalk = require('chalk');
const jlog = require('./jlog');

function log(x) {
    process.stdout.write(chalk.yellow(x))
}

module.exports = async function (type, ...params) {
    let startTimestamp = Date.now();
    let timeLimit = 5000;
    do {
        let data;
        let isFound = false;
        try {
            switch (type) {
                case 'tx': {
                    data = await cypherWeb.cyp.getTransaction(params[0]);
                    isFound = !!data.txID;
                    break;
                }
                case 'account': {
                    data = await cypherWeb.cyp.getUnconfirmedAccount(params[0]);
                    isFound = !!data.address;
                    break;
                }
                case 'accountById': {
                    data = await cypherWeb.cyp.getUnconfirmedAccountById(params[0]);
                    isFound = !!data.address;
                    break;
                }
                case 'token': {
                    data = await cypherWeb.cyp.getTokensIssuedByAddress(params[0]);
                    isFound = !!Object.keys(data).length;
                    break;
                }
                case 'tokenById': {
                    data = await cypherWeb.cyp.getTokenFromID(params[0]);
                    isFound = !!data.name;
                    break;
                }
                case 'sendToken': {
                    data = await cypherWeb.cyp.getUnconfirmedAccount(params[0]);
                    isFound = data && data.assetV2 && data.assetV2.length && data.assetV2[0].value !== params[1];
                    break;
                }
                case 'balance': {
                    data = await cypherWeb.cyp.getUnconfirmedBalance(params[0]);
                    isFound = (data !== params[1]);
                    break;
                }
                case 'freezeBp': {
                    data = await cypherWeb.cyp.getUnconfirmedAccount(params[0]);
                    isFound = data.frozen && (data.frozen[0].frozen_balance !== params[1]);
                    break;
                }
                case 'freezeEnergy': {
                    data = await cypherWeb.cyp.getUnconfirmedAccount(params[0]);
                    isFound = data.account_resource &&
                        data.account_resource.frozen_balance_for_energy &&
                        (data.account_resource.frozen_balance_for_energy.frozen_balance !== params[1]);
                    break;
                }
                case 'contract': {
                    data = await cypherWeb.cyp.getContract(params[0]);
                    isFound = !!data.contract_address;
                    break;
                }
                case 'exchange': {
                    data = await cypherWeb.cyp.getExchangeByID(params[0]);
                    isFound = !!data.exchange_id;
                    break;
                }
                default:
                    isFound = true;

            }
        } catch (e) {
            log(e);
            await wait(1);
            continue;
        }
        // console.log(...params, 'wait for chain data result: ', isFound, data, type);
        if (isFound)
            return;
        log(`waiting for unconfirmed data,${type}...`);
        await wait(1);

    } while (Date.now() - startTimestamp < timeLimit);

    throw new Error('No unconfirmed data found on chain');
};
