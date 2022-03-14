// For everything you need to know about this file, see https://www.youtube.com/watch?v=1ve1YIpDs_I
import { providers, Wallet, BigNumber, Contract } from 'ethers';
import { FlashbotsBundleProvider, FlashbotsBundleResolution } from '@flashbots/ethers-provider-bundle';
import { fromWei } from 'web3-utils';
import { readFileSync } from 'fs';

// constants
const STRONG_DECIMALS = BigNumber.from(10).pow(18);
const GWEI = BigNumber.from(10).pow(9);
const PRIORITY_FEE = GWEI.mul(2); // priority fee is 3 GWEI you can find current values of priority fee and base fee at https://etherscan.io/gastracker
const BLOCKS_IN_THE_FUTURE = 1;

// goerli
//const FLASHBOTS_ENDPOINT = 'https://relay-goerli.flashbots.net';
//const CHAIN_ID = 5;

// mainnet -  uncomment to run on ETH  mainnet
const FLASHBOTS_ENDPOINT = 'https://relay.flashbots.net';
const CHAIN_ID = 1;

const STRONG_TOKEN_ADDR = '0x990f341946A3fdB507aE7e52d17851B87168017c';
const STRONG_SERVICE_ADDR = '0xFbdDaDD80fe7bda00B901FbAf73803F2238Ae655';
const STRONG_SERVICE_ABI = JSON.parse(readFileSync('./src/strongServiceAbi.json', 'utf-8'));

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

// Don't put much more than you need in this wallet
const FUNDING_WALLET_PRIVATE_KEY = process.env.FUNDING_WALLET_PRIVATE_KEY;

// This wallet is compromised
const COMPROMISED_WALLET_PRIVATE_KEY = process.env.COMPROMISED_WALLET_PRIVATE_KEY;

if (!(INFURA_KEY || FUNDING_WALLET_PRIVATE_KEY || COMPROMISED_WALLET_PRIVATE_KEY)) {
  console.log('Please include INFURA_KEY, FUNDING_WALLET_PRIVATE_KEY, and COMPROMISED_WALLET_PRIVATE_KEY as env variables.');
  process.exit(1);
}

if (FUNDING_WALLET_PRIVATE_KEY.endsWith('52')) {
  //throw Error('This is your wallet');
}

// In default setting run only simulation - set SEND_BUNDLE=true to send bundle
const SEND_BUNDLE: string = process.env.SEND_BUNDLE;
if (SEND_BUNDLE === 'true') {
  console.log('Sending bundle');
} else {
  console.log('Running only simulation, please set SEND_BUNDLE=true to send bundle');
}

const SKIP_SIM: string = process.env.SKIP_SIM;
if (SKIP_SIM === 'true') {
  console.log('Skip simulation');
}

// Create clients to interact with infura and your wallets
const provider = new providers.InfuraProvider(CHAIN_ID, INFURA_KEY);
const fundingWallet = new Wallet(FUNDING_WALLET_PRIVATE_KEY, provider);
const compromisedWallet = new Wallet(COMPROMISED_WALLET_PRIVATE_KEY, provider);

// Cut down on some boilerplate
const tx = (args) => ({
  chainId: CHAIN_ID,
  type: 2, // EIP 1559
  maxPriorityFeePerGas: PRIORITY_FEE,
  data: '0x',
  value: 0n,
  ...args,
});

const getRewardAll = async (blockNumber: number): Promise<BigNumber> => {
  // We connect to the Contract using a Provider, so we will only
  // have read-only access to the Contract
  let contract = new Contract(STRONG_SERVICE_ADDR, STRONG_SERVICE_ABI, provider);
  return BigNumber.from(await contract.getRewardAll(compromisedWallet.address, blockNumber));
}

/*
  The basic idea here is that you want to you group together the
  following transactions such that no one can get in the middle of
  things and siphon off the ETH:
    1. Fund the compromised wallet
    2. Perform all the actions you need on that wallet (e.g. transfer nfts to safe account, or claim and transfer your SOS tokens, or unstake and transfer some staked tokens)

  This means that you will be executing transactions signed by at least two different wallets,
  and will likely be transfering assets to a third wallet.
*/

const getBundle = async (maxBaseFeeInNextBlock: BigNumber, blockNumber: number, maxGasLimit: BigNumber, reward: BigNumber) => {
  // Max fee in WEI that you want to pay for 1 unit of gas
  const maxFeePerGas: BigNumber = PRIORITY_FEE.add(maxBaseFeeInNextBlock);

  // ADJUST TX properties here
  const claimFeeValue: BigNumber = BigNumber.from(1391314426595000);
  const gasClaimAll = BigNumber.from(1400000);
  const gasTransfer = BigNumber.from(55000);

  // You have to adjust total gas needed for all transactions from compromised wallet
  const totalGasNeeded: BigNumber = gasClaimAll.add(gasTransfer);
  const fundAmount: BigNumber = maxFeePerGas.mul(totalGasNeeded).add(claimFeeValue);
    // fundAmount = fundAmount.sub(GWEI.mul(896478)); - if u have some leftovers in compromised wallet you can adjust funding amount by substracting leftover

  console.log(`Claim gas fee cost : ${convertWeiToEth(gasClaimAll.mul(maxFeePerGas))} ETH`)
  console.log(`Claim fee cost     : ${convertWeiToEth(claimFeeValue)} ETH`)
  console.log(`Transaction cost   : ${convertWeiToEth(gasTransfer.mul(maxFeePerGas))} ETH`)
  console.log('---');
  console.log(`Priority fee:\t\t${PRIORITY_FEE} WEI, ${convertWeiToGwei(PRIORITY_FEE)} GWEI`);
  console.log(`Base fee:\t\t${maxBaseFeeInNextBlock} WEI, ${convertWeiToGwei(maxBaseFeeInNextBlock)} GWEI`);
  console.log(`Max fee per gas:\t${maxFeePerGas} WEI, ${convertWeiToGwei(maxFeePerGas)} GWEI`);
  console.log(`Fund amount:\t\t${convertWeiToEth(fundAmount)} ETH`);
  console.log(`Price at max gas limit:\t${convertWeiToEth(BigNumber.from(maxGasLimit).mul(totalGasNeeded).add(claimFeeValue))} ETH`);

  const bundle = [
    // Example transaction that i have used to rescue NFT on goerli network
    // Send funds for gas to compromised wallet from funding wallet
    // Take care when computing how much to send - eth scavenger will eat any leftovers
    {
      transaction: tx({
        to: compromisedWallet.address,
        maxFeePerGas,
        gasLimit: 21000,
        value: fundAmount,
      }),
      signer: fundingWallet,
    },
    // Transfer NFT
    // You have to make transaction to NFT contract address in order to transfer it
    // You can find out gas limit by simulating transaction and gas limit should be in simulate response
    // You will get transaction data from etherscan -
    //   1. Find NFT contract on etherscan
    //   2. Go to Write contract tab
    //   3. Connect metamask wallet
    //   4. Fill data for transferFrom method
    //   5. Copy hex transacton data from Metamask into data field below
    // claim
    {
      transaction: tx({
        to: STRONG_SERVICE_ADDR,
        maxFeePerGas,
        gasLimit: gasClaimAll,
        value: claimFeeValue,
      //data: '0x00a469170000000000000000000000000000000000000000000000000000000000d8cdd20000000000000000000000000000000000000000000000000000000000000000'
       data: `0x00a46917${blockNumber.toString(16).padStart(64, '0')}0000000000000000000000000000000000000000000000000000000000000000`
      }),
      signer: compromisedWallet,
    },
    // transfer
    {
      transaction: tx({
        to: STRONG_TOKEN_ADDR,
        maxFeePerGas,
        gasLimit: gasTransfer,
      //data: '0xa9059cbb000000000000000000000000f98795c4c539afa1c79bf4be2805e7f8bb6e16a90000000000000000000000000000000000000000000000000a223107fefd8000'
        data: `0xa9059cbb000000000000000000000000f98795c4c539afa1c79bf4be2805e7f8bb6e16a9${reward.toHexString().substring(2).padStart(64, '0')}`
      }),
      signer: compromisedWallet,
    }
  ];
  return bundle;
};

const sweepWallet = async (maxBaseFeeInOneMoreBlock: BigNumber) => {
  const FRONTRUN_PRIORITY_FEE = GWEI.mul(BigNumber.from(8));
  const LIMIT: BigNumber = BigNumber.from(1).mul(BigNumber.from(10).pow(15));
  const balance: BigNumber = await provider.getBalance(compromisedWallet.address);
  console.log(`Balance: ${convertWeiToEth(balance)} ETH, (limit: ${convertWeiToEth(LIMIT)})`);
  if (balance.gt(LIMIT)) {
    //const feePerGas = await provider.getGasPrice();
    const feePerGas = maxBaseFeeInOneMoreBlock;
    const feePergasTotal = feePerGas.add(FRONTRUN_PRIORITY_FEE);
    console.log(`Gas price: ${convertWeiToGwei(feePergasTotal)} GWEI`);
    //const gasPrice = maxBaseFeeInFutureBlock.add(FRONTRUN_PRIORITY_FEE);//
    const txNonce = await provider.getTransactionCount(compromisedWallet.address, 'latest');
    console.log('Preparing tx');
    const tx: any = {
        from: compromisedWallet.address,
        to: '0x9Fb3FE660923Fc26AB8B9B47E67Bfc2c16c63824',
        nonce: txNonce,
        maxPriorityFeePerGas: FRONTRUN_PRIORITY_FEE,
        maxFeePerGas: maxBaseFeeInOneMoreBlock.add(FRONTRUN_PRIORITY_FEE)
    };

    const gasLimit = await provider.estimateGas(tx);
    const totalCost = BigNumber.from(gasLimit).mul(BigNumber.from(feePergasTotal));

    tx.value = balance.sub(totalCost);
    tx.gasLimit = gasLimit;
    console.log(`Value of tx: ${convertWeiToEth(tx.value)}`)
    if (tx.value.gt(0)) {
        try {
            const result = await compromisedWallet.sendTransaction(tx);
            console.log('Send result', result);
            return true;
        } catch (err) {
            console.log(err.message);
        }
    }
  }
  return false;
}

let attempt: number = 0;
let STOP = false;
async function main() {
  console.log('Starting flashbot...');
  // ADJUST MAX GAS HERE
  const MAX_GAS_LIMIT = BigNumber.from(19805763720); // under this gas price transaction will be triggered

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
  provider.on('block', async (blockNumber: number) => {
    if (STOP) {
      return;
    }
    const targetBlock = blockNumber + BLOCKS_IN_THE_FUTURE;
    console.log(`========== Attempt: ${attempt} - Preparing bundle for block: ${targetBlock} ==========`);
    try {
      const block = await provider.getBlock(blockNumber);
      const maxBaseFeeInFutureBlock = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas, BLOCKS_IN_THE_FUTURE);
      const maxBaseFeeInOneMoreBlock = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas, BLOCKS_IN_THE_FUTURE+1);
      //await sweepWallet(maxBaseFeeInOneMoreBlock);
      console.log(`Max base fee in block ${targetBlock} is ${convertWeiToGwei(maxBaseFeeInFutureBlock)} GWEI`);

      // Strong reward
      const reward: BigNumber = await getRewardAll(blockNumber);
      const rewardNumber: number = (reward.mul(10000).div(STRONG_DECIMALS).toNumber()) / 10000.0;
      console.log(`Reward in block ${blockNumber}: ${rewardNumber} STRONG`);
      /*if (rewardNumber < 0.5) {
        console.log(`Reward lower than treshold - ${rewardNumber} STRONG`);
        process.exit(0);
      }*/
      // Prepare transactions
      const signedBundle = await flashbotsProvider.signBundle(await getBundle(maxBaseFeeInFutureBlock, blockNumber, MAX_GAS_LIMIT, reward));

      if(maxBaseFeeInFutureBlock.lte(MAX_GAS_LIMIT) && rewardNumber >= 0.5){
        // Simulate the bundle first - it will make dry run and output any errors
        if (!SKIP_SIM) {
          console.log('Running simulation');
          const simulation = await flashbotsProvider.simulate(signedBundle, targetBlock);
          if ('error' in simulation) {
            console.warn(`Simulation Error: ${simulation.error.message}`);
            //process.exit(1);
          } else {
            console.log(`Simulation Success: ${JSON.stringify(simulation, null, 2)}`);
            console.log(simulation);
          }
        }

        if (SEND_BUNDLE) {
          // Run bundle
          console.log('Run bundle');
          const txBundle = await flashbotsProvider.sendRawBundle(signedBundle, targetBlock);
          if ('error' in txBundle) {
            console.error('Fatal error in bundle:', txBundle.error);
            //process.exit(1);
          }

          // Wait for response
          const waitResponse = await txBundle.wait();
          console.log(`Wait Response: ${FlashbotsBundleResolution[waitResponse]}`);
          if (waitResponse === FlashbotsBundleResolution.BundleIncluded) {
            console.log(`Bundle included in block ${targetBlock}`, waitResponse);
            STOP = true;
            let success = false;
            while (!success) {
              success = await sweepWallet(maxBaseFeeInOneMoreBlock);
            }
            process.exit(0);
          } else if (waitResponse === FlashbotsBundleResolution.AccountNonceTooHigh) {
            console.log(`Nonce too high (block: ${targetBlock})`, waitResponse);
            process.exit(0);
          } else if (waitResponse === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
            console.log(`Not included in ${blockNumber}`, waitResponse);
          } else {
            console.log('Unexpected response obtained', waitResponse);
          }
        }
        attempt++;
      }
      } catch (err) {
        console.error('Fatal request error', err);
      }
  });
}

main();
