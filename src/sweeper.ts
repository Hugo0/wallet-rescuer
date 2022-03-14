// For everything you need to know about this file, see https://www.youtube.com/watch?v=1ve1YIpDs_I

import { providers, Wallet, BigNumber } from 'ethers';
import { FlashbotsBundleProvider, FlashbotsBundleResolution } from '@flashbots/ethers-provider-bundle';
import { fromWei } from 'web3-utils';

// constants
const GWEI = BigNumber.from(10).pow(9);
const PRIORITY_FEE = GWEI.mul(8); // priority fee is 3 GWEI you can find current values of priority fee and base fee at https://etherscan.io/gastracker
const BLOCKS_IN_THE_FUTURE = 1;

// goerli
//const FLASHBOTS_ENDPOINT = 'https://relay-goerli.flashbots.net';
//const CHAIN_ID = 5;

// mainnet -  uncomment to run on ETH  mainnet
const FLASHBOTS_ENDPOINT = 'https://relay.flashbots.net';
const CHAIN_ID = 1;

// utils
const convertWeiToEth = (wei: BigNumber): string => {
  return fromWei(wei.toString(), 'ether');
};

const convertWeiToGwei = (wei: BigNumber): string => {
  return fromWei(wei.toString(), 'gwei');
};

// Include these as env variables
// https://infura.io <- check out their free tier, create a project, and use the project id
const INFURA_KEY = process.env.INFURA_KEY;

// This wallet is compromised
const COMPROMISED_WALLET_PRIVATE_KEY = process.env.COMPROMISED_WALLET_PRIVATE_KEY;


// Create clients to interact with infura and your wallets
const provider = new providers.InfuraProvider(CHAIN_ID, INFURA_KEY);
const compromisedWallet = new Wallet(COMPROMISED_WALLET_PRIVATE_KEY, provider);

let attempt: number = 0;
async function main() {
  console.log('Starting flashbot...');

  // Connect to the flashbots relayer -- this will communicate your bundle of transactions to
  // miners directly, and will bypass the mempool.
  let flashbotsProvider;
  try {
    console.log('Retreiving Flashbots Provider...');
    flashbotsProvider = await FlashbotsBundleProvider.create(provider, Wallet.createRandom(), FLASHBOTS_ENDPOINT);
  } catch (err) {
    console.error(err);
  }

  // Every time a new block has been detected, attempt to relay the bundle to miners for the next block
  // Since these transactions aren't in the mempool you need to submit this for every block until it
  // is filled. You don't have to worry about repeat transactions because nonce isn't changing. So you can
  // leave this running until it fills.
  provider.on('block', async (blockNumber) => {
    const targetBlock = blockNumber + BLOCKS_IN_THE_FUTURE;
    console.log(`Attempt: ${attempt} - Preparing bundle for block: ${targetBlock}`);
    try {
      const block = await provider.getBlock(blockNumber);
      const maxBaseFeeInFutureBlock = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas, BLOCKS_IN_THE_FUTURE);
      console.log(`Max base fee in block ${targetBlock} is ${maxBaseFeeInFutureBlock} WEI`);
        const gasPrice = maxBaseFeeInFutureBlock.add(PRIORITY_FEE);// await provider.getGasPrice();
        const balance: BigNumber = await provider.getBalance(compromisedWallet.address);
        const limit: BigNumber = BigNumber.from(1).mul(BigNumber.from(10).pow(15));
        console.log(`Balance: ${convertWeiToEth(balance)} ETH, (limit: ${convertWeiToEth(limit)}) Gas price: ${convertWeiToGwei(gasPrice)} GWEI`);
        if (balance.gt(limit)) {
            console.log('Preparing tx');
            const tx: any = {
                from: compromisedWallet.address,
                to: '0xD6536401b417eCb6A8217552585D564B3e2AeFb3',
                nonce: await provider.getTransactionCount(compromisedWallet.address, 'latest'),
                maxPriorityFeePerGas: PRIORITY_FEE,
                maxFeePerGas: maxBaseFeeInFutureBlock.add(PRIORITY_FEE)
            };

            const gasLimit = await provider.estimateGas(tx);
            const totalCost = BigNumber.from(gasLimit).mul(BigNumber.from(gasPrice));

            tx.value = balance.sub(totalCost);
            tx.gasLimit = gasLimit;
            console.log(`Value of tx: ${convertWeiToEth(tx.value)}`)
            if (tx.value.gt(0)) {
                try {
                    const result = await compromisedWallet.sendTransaction(tx);
                    console.log('Send result', result);
                } catch (err) {
                    console.log(err.message);
                }
            }
        }

        attempt++;
    } catch (err) {
        console.error('Fatal request error', err);
        process.exit(1);
    }
  });
}

main();
