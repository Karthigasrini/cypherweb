const chalk = require('chalk')
const CypherWeb = require('../setup/CypherWeb');
const jlog = require('./jlog')

const {FULL_NODE_API, SOLIDITY_NODE_API, EVENT_API, PRIVATE_KEY, SUN_NETWORK, SIDE_CHAIN} = require('./config')


const createInstanceSide = (extraOptions = {}, sideExtraOptions = {}) => {
    let options = Object.assign({
        fullHost: SIDE_CHAIN.fullNode,
        privateKey: PRIVATE_KEY,
    }, extraOptions)
    let sideOptions = Object.assign({
        fullHost: SIDE_CHAIN.sideOptions.fullNode,
        mainGatewayAddress: SIDE_CHAIN.sideOptions.mainGatewayAddress,
        sideGatewayAddress: SIDE_CHAIN.sideOptions.sideGatewayAddress,
        sideChainId: SIDE_CHAIN.sideOptions.sideChainId
    }, sideExtraOptions);
    return new CypherWeb(options, sideOptions);
}

const createInstance = (extraOptions = {}, sideExtraOptions = {}) => {
    let options = Object.assign({
        fullHost: FULL_NODE_API,
        privateKey: PRIVATE_KEY,
    }, extraOptions)
    return new CypherWeb(options);
}

let instance

const getInstance = () => {
    if (!instance) {
        instance = createInstance()
    }
    return instance
}

const newTestAccounts = async (amount) => {
    const cypherWeb = createInstance();

    console.log(chalk.blue(`Generating ${amount} new accounts...`))
    await cypherWeb.fullNode.request('/admin/temporary-accounts-generation?accounts=' + amount);
    const lastCreated = await getTestAccounts(-1)
    jlog(lastCreated.b58)
}

const getTestAccounts = async (block) => {
    const accounts = {
        b58: [],
        hex: [],
        pks: []
    }
    const cypherWeb = createInstance();
    const accountsJson = await cypherWeb.fullNode.request('/admin/accounts-json');
    const index = typeof block === 'number'
        ? (block > -1 && block < accountsJson.more.length ? block : accountsJson.more.length - 1)
        : undefined
    accounts.pks = typeof block === 'number'
        ? accountsJson.more[index].privateKeys
        : accountsJson.privateKeys;
    for (let i = 0; i < accounts.pks.length; i++) {
        let addr = cypherWeb.address.fromPrivateKey(accounts.pks[i]);
        accounts.b58.push(addr);
        accounts.hex.push(cypherWeb.address.toHex(addr));
    }
    return Promise.resolve(accounts);
}

module.exports = {
    createInstance,
    getInstance,
    createInstanceSide,
    newTestAccounts,
    getTestAccounts,
    CypherWeb
}

