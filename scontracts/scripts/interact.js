const ethers = require('ethers');
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/Username.sol/UsernameNFT.json");

console.log(JSON.stringify(contract.abi));

// Provider
const alchemyProvider = new ethers.providers.JsonRpcProvider(API_URL);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// Contract
const usernameContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    // Example username to claim
    const username = "test1";
    const desoAddress = "BC1YLjLmbnz1dACvykjAMcuPCFvwspb4ekhg9GTGKj2QbbGVQpHcPo4"; // Example Deso address

    // Claim the username
    /*try {
        const tx = await usernameContract.claimUsername(username);
        console.log("Transaction hash:", tx.hash);

        // Wait for the transaction to be mined
        await tx.wait();
        console.log(`Username "${username}" claimed successfully!`);
    } catch (error) {
        console.error("Error claiming username:", error);
    }*/

    // Set the Deso address
    try {
        const tx = await usernameContract.setDesoAddress(desoAddress);
        console.log("Transaction hash:", tx.hash);

        // Wait for the transaction to be mined
        await tx.wait();
        console.log(`Deso address set successfully!`);
    } catch (error) {
        console.error("Error setting Deso address:", error);
    }

    // Check if the username exists
    try {
        const exists = await usernameContract.usernameExists(username);
        console.log(`Does the username "${username}" exist?`, exists);
    } catch (error) {
        console.error("Error checking if username exists:", error);
    }

    // Get the owner of the username
    try {
        const owner = await usernameContract.getUsernameOwner(username);
        console.log(`Owner of username "${username}":`, owner);
    } catch (error) {
        console.error("Error getting username owner:", error);
    }

    // Get the Deso address linked to the username
    try {
        const desoAddress = await usernameContract.getDesoAddress(username);
        console.log(`Deso address linked to username "${username}":`, desoAddress);
    } catch (error) {
        console.error("Error getting Deso address:", error);
    }
}

main();
