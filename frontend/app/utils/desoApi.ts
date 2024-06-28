import { signTx } from 'deso-protocol';

export class DesoApi {

    constructor(private nodeUrl : string, private pubKey : string, private seedHex : string) {}

    public async sendDeso(receiverPubKey : string, amountNanos : number) {
        if (!receiverPubKey || receiverPubKey == '') return;
        const response = await fetch(
            `${this.nodeUrl}/send-deso`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "SenderPublicKeyBase58Check": this.pubKey,
                    "RecipientPublicKeyOrUsername": receiverPubKey,
                    "AmountNanos": amountNanos,
                    "MinFeeRateNanosPerKB": 1000
                })
            }
        );
        const data = await response.json() as unknown as any;
        return data.TransactionHex;
    }

    public async updateProfile(username : string, description : string, profilePic : string) {
        const response = await fetch(
            `${this.nodeUrl}/update-profile`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "IsHidden": false,
                    "MinFeeRateNanosPerKB": 1000,
                    "NewCreatorBasisPoints": 10000,
                    "NewDescription": description,
                    "NewProfilePic": profilePic,
                    "NewStakeMultipleBasisPoints": 12500,
                    "NewUsername": username,
                    "ProfilePublicKeyBase58Check": this.pubKey,
                    "UpdaterPublicKeyBase58Check": this.pubKey,
                })
            }
        );
        const data = await response.json() as unknown as any;
        return data.TransactionHex;
    }

    public async likePost(likedPostHashHex : string, isUnlike : boolean = false) {
        const response = await fetch(
            `${this.nodeUrl}/create-like-stateless`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "LikedPostHashHex": likedPostHashHex,
                    "MinFeeRateNanosPerKB": 1000,
                    "IsUnlike": isUnlike,
                    "ReaderPublicKeyBase58Check": this.pubKey,
                })
            }
        );
        const data = await response.json() as unknown as any;
        return data.TransactionHex;
    }
    
    public async signAndSubmit(txHex : string) {
        if (!this.seedHex) {
            throw new Error('SEED_HEX env variable not set');
        }
        const signedTx = await signTx(txHex, this.seedHex);
    
        const response = await fetch(
            `${this.nodeUrl}/submit-transaction`,
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
        const data = await response.json() as unknown as any;
        return { TxnHashHex: data.TxnHashHex }
    }

    public async submitPost(text : string, ParentStakeID? : string) {
        const body : any = {
            UpdaterPublicKeyBase58Check: this.pubKey,
            BodyObj: {
                Body: text,
                ImageURLs: [],
                VideoURLs: []
            },
            MinFeeRateNanosPerKB: 1000,
        }
        if (ParentStakeID) {
            body.ParentStakeID = ParentStakeID;
        }
        const response = await fetch(
            `${this.nodeUrl}/submit-post`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        );
        const data = await response.json() as unknown as any;
        return { TransactionHex: data.TransactionHex, PostHashHex: data.PostHashHex };
    }
}