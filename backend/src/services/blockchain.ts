import { ethers } from "ethers";

export async function getEthAddress(username : string, apiUrl : string, contractAddress : string) {
    const contract = getContract(contractAddress, apiUrl);
    try {
        const owner = await contract.getUsernameOwner(username);
        return owner;
    } catch (error) {
        console.error("Error getting username owner:", error);
        throw error;
    }
}

export async function getDesoAddress(username : string, apiUrl : string, contractAddress : string) {
    const contract = getContract(contractAddress, apiUrl);
    try {
        const owner = await contract.getDesoAddress(username);
        return owner;
    } catch (error) {
        console.error("Error getting Deso address:", error);
        throw error;
    }
}

export async function getUsernames(ethAddress : string, apiUrl : string, contractAddress : string) : Promise<string> {
    const contract = getContract(contractAddress, apiUrl);
    try {
        const usernames = await contract.getUsernames(ethAddress);
        return usernames;
    } catch (error) {
        console.error("Error getting usernames:", error);
        throw error;
    }
}

function getContract(contractAddress : string, apiUrl : string) {
    const abi = [
        "function getUsernameOwner(string username) view returns (address)",
        "function getDesoAddress(string username) view returns (string)",
        "function getUsernames(address owner) view returns (string[])"
    ];
    const provider = new ethers.JsonRpcProvider(apiUrl);
    return new ethers.Contract(contractAddress, abi, provider);
}