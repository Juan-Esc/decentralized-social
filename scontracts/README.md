# Contracts Hardhat project

This subproject contains the contract and scripts for the Decentralized Social project.

## Configuration

1. Copy and paste the `.env.example` file and rename it to `.env`
2. Create an account on Alchemy if you haven't yet
3. Export your Metamask or Brave Wallet private key. [Instructions](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)
4. Modify both the API_URL with your Alchemy's API key and PRIVATE_KEY with your Metamask private key

## Contract deployment

In order to deploy the contract, you will first need to have some currency in your wallet. For Amoy Testnet, use [this faucet](https://faucet.polygon.technology/) to claim some $MATIC

Compile the contract
```sh
npx hardhat compile
```

Then, deploy it
```sh
npx hardhat run scripts/deploy.js --network amoy
```

After the contract is deployed, modify your `.env` file with your CONTRACT_ADDRESS

## Testing the contract with scripts

Once you've configured the `.env` file, you can run the scripts inside `/scripts` to test the smart contract. You may want to look inside the scripts and adjust them before running them.

```sh
npx hardhat run scripts/interact.js --network amoy

npx hardhat run scripts/interac2.js --network amoy

```