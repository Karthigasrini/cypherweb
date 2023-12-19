## What is cypherWeb?

[CypherWeb] aims to deliver a unified, seamless development experience influenced by Ethereum's [Web3](https://github.com/ethereum/web3.js/) implementation. We have taken the core ideas and expanded upon it to unlock the functionality of CYPHER's unique feature set along with offering new tools for integrating DApps in the browser, Node.js and IoT devices.

**Project scope**

Any new CYPHER feature will be incorporated into CypherWeb. Changes to the API to improve quality-of-life are in-scope for the project. We will not necessarilly maintain feature parity with Web3.js going forward as this is a separate project, not a synchronized fork.

## Compatibility
- Version built for Node.js v6 and above
- Version built for browsers with more than 0.25% market share

You can access either version specifically from the [dist](dist) folder.

CypherWeb is also compatible with frontend frameworks such as:
- Angular
- React
- Vue.

You can also ship CypherWeb in a Chrome extension.

## Installation

### Node.js
```bash
npm install cypherweb
```

### Browser

Then easiest way to use CypherWeb in a browser is to install it as above and copy the dist file to your working folder. For example:
```
cp node_modules/cypherweb/dist/CypherWeb.js ./js/cypherweb.js
```
so that you can call it in your HTML page as
```
<script src="./js/cypherweb.js"><script>
```

This project is also published on NPM and you can access CDN mirrors of this release (please use sub-resource integrity for any `<script>` includes).

## Creating an Instance

First off, in your javascript file, define CypherWeb:

```js
const CypherWeb = require('cypherweb')
```

When you instantiate CypherWeb you can define

* fullNode
* solidityNode
* eventServer
* privateKey

you can also set a

* fullHost

which works as a jolly. If you do so, though, the more precise specification has priority.

```js
const cypherWeb = new CypherWeb({
    fullNode: 'https://some-node.tld',
    solidityNode: 'https://some-other-node.tld',
    eventServer: 'https://some-event-server.tld',
    privateKey: 'your private key'
  }
)
```
