

const API_URL = process.env.API_URL;  // Alchemy API URL
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;  // Your contract address

const provider = new ethers.providers.JsonRpcProvider(API_URL);

const abi = [
    "function getUsernameOwner(string username) view returns (address)",
    "function getDesoAddress(string username) view returns (string)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

async function getUsernameOwner(username) {
    try {
        const owner = await contract.getUsernameOwner(username);
        return owner;
    } catch (error) {
        console.error("Error getting username owner:", error);
        throw error;
    }
}

async function getDesoAddress(username) {
    try {
        const desoAddress = await contract.getDesoAddress(username);
        return desoAddress;
    } catch (error) {
        console.error("Error getting Deso address:", error);
        throw error;
    }
}

async function main() {
    const username = "test8";  // Replace with the username you want to query

    // Get the owner of the username
    try {
        const owner = await getUsernameOwner(username);
        console.log(`Owner of username "${username}":`, owner);
    } catch (error) {
        console.error("Error getting username owner:", error);
    }

    // Get the Deso address linked to the username
    try {
        const desoAddress = await getDesoAddress(username);
        console.log(`Deso address linked to username "${username}":`, desoAddress);
    } catch (error) {
        console.error("Error getting Deso address:", error);
    }
}

main();
