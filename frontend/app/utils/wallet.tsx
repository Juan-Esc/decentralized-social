import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { ethers } from "ethers6";
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
import ec from 'elliptic';
import bs58check from 'bs58check'

export interface ISecrets {
    seedPhrase: string;
    ethereumAddress: string;
    ethereumPrivateKey: string;
    desoPublicKey: string;
    desoPrivateKey: string;
}

export function getSecrets(window : Window): ISecrets | null {
    const secretsString = window.localStorage.getItem("secrets");
    if (!secretsString) return null;
    return JSON.parse(secretsString) as ISecrets;
}

// to-do: call this function when user logs in or enters website after closing browser
export function setWalletOnWindow(window : Window) : PrivateKeyWallet {
    const wallet = new PrivateKeyWallet(
        getSecrets(window)?.ethereumPrivateKey || "",
    );

    (window as any).wallet = wallet;
    return wallet;
};

export function getThirdwebWallet(window : Window) : PrivateKeyWallet {
    const wallet = (window as any).wallet as PrivateKeyWallet;
    if (!wallet) throw new Error("Wallet not set on window");

    return wallet;
}

/**
 * Generates a wallet and stores it in localStorage and window context
 * @param window 
 * @returns 
 */
export function generateWallet(window : Window) : string {
    (window as any).Buffer = Buffer; // Buffer for browser
    const seedPhrase = ethers.Wallet.createRandom().mnemonic?.phrase;
    if (!seedPhrase) throw new Error('Failed to generate seed phrase')
    //const mnemonic = ''; // Recover phrases

    console.log('Mnemonic phrase:', seedPhrase);
    const seed = bip39.mnemonicToSeedSync(seedPhrase, '');
    const { desoPubKey, desoPrivateKey } = generateDeSoKey(seed)
    // Return the data to expose through useLoaderData()

    //const ethereumRoot = pgk. .fromMasterSeed(seed);
    //const ethereumChild = ethereumRoot.derivePath(`m/44'/60'/0'/0/0`);
    const ethereumWallet = ethers.HDNodeWallet.fromSeed(seed).derivePath(`m/44'/60'/0'/0/0`);

    console.log('ETHEREUM ADDRESS')
    console.log(`Ethereum public address: ${ethereumWallet.address}`);
    console.log(`Ethereum private key: ${ethereumWallet.privateKey}`);

    window.localStorage.setItem("secrets", JSON.stringify({
        seedPhrase: seedPhrase,
        ethereumAddress: ethereumWallet.address,
        ethereumPrivateKey: ethereumWallet.privateKey,
        desoPublicKey: desoPubKey,
        desoPrivateKey: desoPrivateKey
    }))
    setWalletOnWindow(window);
    return seedPhrase;
}

// Util functions

const network = 'mainnet';
function generateDeSoKey(seed : Buffer) {
    const nonStandard = false;
    const i = 0;
    const keychain = ethers.HDNodeWallet.fromSeed(seed).derivePath(`m/44'/0'/0'/0/${i}`);

    // @ts-ignore TODO: add "identifier" to type definition
    const seedHex = keychain.privateKey.toString('hex');
    const privateKey = seedHexToPrivateKey(seedHex);
    const publicKey = privateKeyToDeSoPublicKey(privateKey, network);

    console.log(`ADDRESS PAIR ${i + 1}`);
    console.log(`DeSo address: ${publicKey}`);
    console.log(`DeSo private key: ${privateKey.getPrivate('hex')}`);
    return { desoPubKey: publicKey, desoPrivateKey: privateKey.getPrivate('hex') };
}

function seedHexToPrivateKey(seedHex : string) {
    const ec2 = new ec.ec('secp256k1');
    return ec2.keyFromPrivate(seedHex);
}

function privateKeyToDeSoPublicKey(privateKey : ec.KeyPair, network : string) {
    const prefix = getPublicKeyPrefixes(network)?.deso;
    if (!prefix) throw new Error('Invalid network')
    const key = privateKey.getPublic().encode('array', true);
    const prefixAndKey = Uint8Array.from([...prefix, ...key]);

    return bs58check.encode(prefixAndKey);
}

function getPublicKeyPrefixes(network : string) {
    if (network == 'mainnet') {
        return {
            bitcoin: [0x00],
            deso: [0xcd, 0x14, 0x0]
        };
    } else if (network == 'testnet') {
        return {
            bitcoin: [0x6f],
            deso: [0x11, 0xc2, 0x0]
        };
    }
}

/**
 * Recovers a wallet from a seed phrase and stores it in localStorage and window context
 * @param window 
 * @param seedPhrase 
 * @returns 
 */
export function recoverWallet(window : Window, seedPhrase: string) : string {
    (window as any).Buffer = Buffer; // Buffer for browser

    // Check if seedPhrase is valid
    if (!bip39.validateMnemonic(seedPhrase)) {
        throw new Error('Invalid seed phrase');
    }

    console.log('Mnemonic phrase:', seedPhrase);
    const seed = bip39.mnemonicToSeedSync(seedPhrase, '');
    const { desoPubKey, desoPrivateKey } = generateDeSoKey(seed)

    const ethereumWallet = ethers.HDNodeWallet.fromSeed(seed).derivePath(`m/44'/60'/0'/0/0`);

    console.log('ETHEREUM ADDRESS')
    console.log(`Ethereum public address: ${ethereumWallet.address}`);
    console.log(`Ethereum private key: ${ethereumWallet.privateKey}`);

    window.localStorage.setItem("secrets", JSON.stringify({
        seedPhrase: seedPhrase,
        ethereumAddress: ethereumWallet.address,
        ethereumPrivateKey: ethereumWallet.privateKey,
        desoPublicKey: desoPubKey,
        desoPrivateKey: desoPrivateKey
    }))
    setWalletOnWindow(window);
    return seedPhrase;
}