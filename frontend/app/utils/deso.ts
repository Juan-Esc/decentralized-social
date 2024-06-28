import { GetProfileByUsername } from "@/interfaces/queries/profiles";
import { API_URL } from "./config";
import { DesoApi } from "./desoApi";
import { getSecrets } from "./wallet";
import { signTx } from 'deso-protocol';
const nodeUrl = 'https://node.deso.org/api/v0';

export class DesoService {
    private desoPubKey: string;
    private desoPrivateKey: string;
    private desoApi: DesoApi;

    constructor(private window: Window) {
        this.desoPubKey = getSecrets(this.window)?.desoPublicKey || '';
        this.desoPrivateKey = getSecrets(this.window)?.desoPrivateKey || '';
        if (this.desoPubKey == '' || this.desoPrivateKey == '') {
            throw new Error("No DeSo keys found");
        }
        this.desoApi = new DesoApi(nodeUrl, this.desoPubKey, this.desoPrivateKey);
    }

    /**
     * This function should only be called once to generate a random profile. It will overwrite all existing data.
     * @returns 
     */
    public async generateRandomProfile() {
        let randomUsername = 't_user_' + Math.random().toString(36).substring(2, 14) + '_ds';
        let tx = await this.desoApi.updateProfile(randomUsername, '', '');
        let signedTx = await this.desoApi.signAndSubmit(tx);
        console.log(signedTx)
        return randomUsername;
    }

    public async updateDeSoProfile(desoUsername: string, username : string, description: string | null, profilePic: string | null) {
        if (!description) { 
            let currentProfile = await (await fetch(`${API_URL}/profiles/by-user/${username}`)).json() as unknown as GetProfileByUsername;
            description = currentProfile.bio;
        }
        if (!profilePic) {
            let currentProfile = await (await fetch(`${API_URL}/profiles/profile-image/${username}`)).json() as unknown as GetProfileByUsername;
            profilePic = currentProfile.profileImageUrl; // base 64, not url
        }
        let tx = await this.desoApi.updateProfile(desoUsername, description, profilePic);
        let signedTx = await this.desoApi.signAndSubmit(tx);
        return true;
    }

    public async submitPost(body: string, ParentStakeID? : string) {
        let tx = await this.desoApi.submitPost(body, ParentStakeID)
        let signedTx = await this.desoApi.signAndSubmit(tx.TransactionHex);
        return signedTx;
    }

    public async likePost(postHash: string, isUnlike: boolean = false) {
        let tx = await this.desoApi.likePost(postHash, isUnlike);
        let signedTx = await this.desoApi.signAndSubmit(tx);
        return signedTx;
    }

}