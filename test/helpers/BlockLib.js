
const injectPromise = require('injectpromise')

class BlockLib {

    constructor(cypherWeb = false) {
        if (!cypherWeb)
            throw new Error('Expected instances of CypherWeb and utils');
        this.cypherWeb = cypherWeb;
        this.injectPromise = injectPromise(this);
    }

    async getCurrent(callback = false) {

        if (!callback)
            return this.injectPromise(this.getCurrent);

        this.cypherWeb.fullNode.request('wallet/getnowblock').then(block => {
            block.fromPlugin = true
            callback(null, block);
        }).catch(err => callback(err));
    }

    pluginInterface() {
        return {
            requires: '^5.3.0',
            fullClass: true
        }
    }
}

module.exports = BlockLib
