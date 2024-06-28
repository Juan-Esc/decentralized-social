import { signTx } from 'deso-protocol';

const nodeUrl = 'https://node.deso.org/api/v0';

async function sendDeso(receiverPubKey : string, amountNanos : number, pubKey : string) {
    if (!receiverPubKey || receiverPubKey == '') return;
    const response = await fetch(
        `${nodeUrl}/send-deso`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "SenderPublicKeyBase58Check": pubKey,
                "RecipientPublicKeyOrUsername": receiverPubKey,
                "AmountNanos": amountNanos,
                "MinFeeRateNanosPerKB": 1000
            })
        }
    );
    const data = await response.json() as unknown as any;
    return data.TransactionHex;
}

async function signAndSubmit(txHex : string, seedHex : string) {
    if (!seedHex) {
        throw new Error('SEED_HEX env variable not set');
    }
    const signedTx = await signTx(txHex, seedHex);

    const response = await fetch(
        `${nodeUrl}/submit-transaction`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "TransactionHex": signedTx
            })
        }
    );
}

export async function sendSponsoredDeso(amount: number, receiverAddress: string, privateKey : string, apiUrl: string, pubKey : string) {
    const sendDesoTx = await sendDeso(receiverAddress, amount, pubKey);
    if (!sendDesoTx) throw new Error('Error sending deso');
    const receipt = await signAndSubmit(sendDesoTx, privateKey);
    return true;
}

export async function sponsorDesoRegistration(receiverAddress: string, privateKey : string, apiUrl: string, pubKey : string) {
    const amount = 50000; // 0.00005 $DESO
    return await sendSponsoredDeso(amount, receiverAddress, privateKey, apiUrl, pubKey);
}