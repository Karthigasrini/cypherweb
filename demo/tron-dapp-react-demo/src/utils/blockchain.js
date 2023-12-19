import CypherWeb from 'cypherweb';
import Config from '../config';

import { BigNumber, openTransModal, setTransactionsData, randomSleep, myLocal } from './helper';

const chain = Config.chain;

const DATA_LEN = 64;
export const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const privateKey = chain.privateKey;

const mainchain = new CypherWeb({
  fullHost: chain.fullHost,
  privateKey
});

export const triggerSmartContract = async (address, functionSelector, options = {}, parameters = []) => {
  try {
    const cypherweb = window.cypherWeb;
    const transaction = await cypherweb.transactionBuilder.triggerSmartContract(
      address,
      functionSelector,
      Object.assign({ feeLimit: 20 * 1e6 }, options),
      parameters
    );

    if (!transaction.result || !transaction.result.result) {
      throw new Error('Unknown trigger error: ' + JSON.stringify(transaction.transaction));
    }
    return transaction;
  } catch (error) {
    throw new Error(error);
  }
};

export const sign = async transaction => {
  try {
    const cypherweb = window.cypherWeb;
    const signedTransaction = await cypherweb.cyp.sign(transaction.transaction);
    return signedTransaction;
  } catch (error) {
    console.log(error, 'signerr');
    throw new Error(error);
  }
};

export const sendRawTransaction = async signedTransaction => {
  try {
    const cypherweb = window.cypherWeb;
    const result = await cypherweb.cyp.sendRawTransaction(signedTransaction);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const view = async (address, functionSelector, parameters = [], isDappCypherWeb = true) => {
  try {
    let cypherweb = mainchain;
    if (!isDappCypherWeb && window.cypherWeb && window.cypherWeb.ready) {
      cypherweb = window.cypherWeb;
    }
    const result = await cypherweb.transactionBuilder.triggerSmartContract(
      address,
      functionSelector,
      { _isConstant: true },
      parameters
    );
    return result && result.result ? result.constant_result : [];
  } catch (error) {
    console.log(`view error ${address} - ${functionSelector}`, error.message ? error.message : error);
    return [];
  }
};

export const getCypBalance = async (address, isDappCypherWeb = false) => {
  try {
    let cypherWeb = mainchain;
    if (!isDappCypherWeb && window.cypherWeb && window.cypherWeb.ready) {
      cypherWeb = window.cypherWeb;
    }
    const balance = await cypherWeb.cyp.getBalance(address);
    return {
      balance: BigNumber(balance).div(Config.defaultPrecision),
      success: true
    };
  } catch (err) {
    console.log(`getPairBalance: ${err}`, address);
    return {
      balance: BigNumber(0),
      success: false
    };
  }
};

export const getTransactionInfo = tx => {
  const cypherWeb = mainchain;
  return new Promise((resolve, reject) => {
    cypherWeb.cyp.getConfirmedTransaction(tx, (e, r) => {
      if (!e) {
        resolve(r);
      } else {
        reject(e, null);
      }
    });
  });
};

export const getTRC20Balance = async (tokenAddress, userAddress) => {
  console.log('params of getbalance: ', userAddress, tokenAddress);
  const result = await view(tokenAddress, 'balanceOf(address)', [{ type: 'address', value: userAddress }]);
  let value = BigNumber(0);
  let success = false;

  if (result.length) {
    value = new BigNumber(result[0].slice(0, DATA_LEN), 16);
    success = true;
  }

  return {
    value,
    success
  };
};
