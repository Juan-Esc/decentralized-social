import { ethers } from 'ethers';
import contract from '../../contracts/UsernameNFT.json';
import { getSecrets } from './wallet';
import { ALCHEMY_API_URL, API_URL, CONTRACT_ADDRESS } from './config';

export class Web3 {

    usernameContract: ethers.Contract;

    constructor(private window: Window) {
        const alchemyProvider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_URL);
        const signer = new ethers.Wallet(getSecrets(this.window)?.ethereumPrivateKey as undefined as any, alchemyProvider);
        this.usernameContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    }

    async claimUsername(username: string) {
        try {
            const tx = await this.usernameContract.claimUsername(username);
            console.log("Transaction hash:", tx.hash);
            await tx.wait();
            console.log(`Username "${username}" claimed successfully!`);
            return tx;
        } catch (error) {
            console.error("Error claiming username:", error);
            if ((await this.usernameExists(username))) {
                console.log(`Username "${username}" already exists!`);
                throw new Error("Username already exists");
            }
            throw error; 
        }
    }

    async setDesoAddress(desoAddress: string) {
        try {
            const tx = await this.usernameContract.setDesoAddress(desoAddress);
            console.log("Transaction hash:", tx.hash);
            await tx.wait();
            console.log(`Deso address set successfully!`);
            return tx;
        } catch (error) {
            console.error("Error setting Deso address:", error);
            throw error;
        }
    }

    async usernameExists(username: string) {
        console.log("Does username exists?")
        try {
            const exists = await this.usernameContract.usernameExists(username);
            console.log(`Does the username "${username}" exist?`, exists);
            return exists;
        } catch (error) {
            console.error("Error checking if username exists:", error);
        }
    }

    async getUsernameOwner(username: string) {
        try {
            const owner = await this.usernameContract.getUsernameOwner(username);
            console.log(`Owner of username "${username}":`, owner);
        } catch (error) {
            console.error("Error getting username owner:", error);
        }
    }

    async getDesoAddress(username: string) {
        try {
            const desoAddress = await this.usernameContract.getDesoAddress(username);
            console.log(`Deso address linked to username "${username}":`, desoAddress);
        } catch (error) {
            console.error("Error getting Deso address:", error);
        }
    }

    async askForFeesCoins() {
        // get sponsored eth for gas fees
        return await fetch(`${API_URL}/users/reg-sponsor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pubAddress: await this.usernameContract.signer.getAddress(), desoPubAddress: getSecrets(this.window)?.desoPublicKey })
        });
    }
}