import { ethers } from 'ethers';

export async function sendSponsoredEth(amount: number, receiverAddress: string, privateKey : string, apiUrl: string) {
    // Check if receiverAddress is a valid Ethereum address
    if (!ethers.isAddress(receiverAddress)) {
        throw new Error('Invalid receiver address');
    }

    const alchemyProvider = new ethers.JsonRpcProvider(apiUrl);
    const signer = new ethers.Wallet(privateKey, alchemyProvider);

    // Convert the amount to Wei, as Ethereum transactions deal with Wei
    const amountInWei = ethers.parseUnits(amount.toString(), 'ether');

    // Create a transaction
    const transaction = {
        to: receiverAddress,
        value: amountInWei
    };

    // Send the transaction
    const txResponse = await signer.sendTransaction(transaction);

    // Wait for the transaction to be mined
    const receipt = await txResponse.wait();

    return receipt;
}

export async function sponsorRegistration(receiverAddress: string, privateKey : string, apiUrl: string) {
    const amount = 0.0005;
    return await sendSponsoredEth(amount, receiverAddress, privateKey, apiUrl);
}