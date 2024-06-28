import type { DrizzleD1Database } from "drizzle-orm/d1";
import { users } from "../models/user.model";
import { eq } from "drizzle-orm";
import { getDesoProcessedProfileByAddress, getProfile } from "./profile";
import { getDesoAddress, getEthAddress, getUsernames } from "./blockchain";
import type { EnvBindings } from "../global";
import type { Variables } from "hono/types";
import { getSingleProfile } from "deso-protocol";

export class UsersService {
    private static instance: UsersService;

    constructor(private readonly db: DrizzleD1Database<Record<string, never>>, private readonly env: EnvBindings) { }

    public static getInstance(db: DrizzleD1Database<Record<string, never>>, env: EnvBindings) {
        if (!this.instance) this.instance = new UsersService(db, env);
        return this.instance;
    }

    public async getDesoAddressFromUsername(username: string) {
        let user = await this.db.select().from(users).where(eq(users.username, username)).get();
        if (user) return user.desoPubKey;

        let desoAddress = await getDesoAddress(username, this.env.API_URL, this.env.CONTRACT_ADDRESS);
        return desoAddress;
    }

    /**
     * Returns the profile of a user, both from the DB and the DeSo blockchain
     * @param username 
     * @returns 
     */
    public async getProfile(username: string) {
        const desoPubKey = await this.getDesoAddressFromUsername(username)
        console.log(`Deso address for ${username} is ${desoPubKey}`);
        if (!desoPubKey) return getProfile(username, undefined);

        const desoProfile = await getDesoProcessedProfileByAddress(desoPubKey, username)
        return desoProfile;
    }

    public async createUser(username: string, ethPubKey: string, desoPubKey: string) {
        console.log("rghdrhdrh")
        // Verify that username actually exists in the blockchain
        const ethAddress = await getEthAddress(username, this.env.API_URL, this.env.CONTRACT_ADDRESS);
        if (!ethAddress || Number(ethAddress) === 0) return false;

        // Verify that the desoPubKey is valid
        const desoAddress = await getDesoAddress(username, this.env.API_URL, this.env.CONTRACT_ADDRESS);
        if (!desoAddress || desoAddress === '') return false;

        console.log(`Creating user ${username} with ethPubKey ${ethPubKey} and desoPubKey ${desoPubKey}`);
        console.log(`Verifications: ethAddress ${ethAddress}, desoAddress ${desoAddress}`);

        // Create user
        const user = await this.db.insert(users).values({
            username,
            ethPubKey,
            desoPubKey
        }).execute();
        return user;
    }

    public async getLoginDataWithEthPubKey(ethPubKey: string, desoPubKey:string) : Promise<AuthData | null> {
        let user = await this.db.select().from(users).where(eq(users.ethPubKey, ethPubKey)).get();
        let username = "";
        if (!user) {
            const usernames = await getUsernames(ethPubKey, this.env.API_URL, this.env.CONTRACT_ADDRESS);
            username = usernames[0];
        } else {
            username = user.username || "";
        }

        const desoUser =  await getSingleProfile({ PublicKeyBase58Check: desoPubKey || "" })

        if (!user) {
            await this.createUser(username, ethPubKey, desoPubKey);
        }

        return {
            username: username || "",
            desoPubAddress: desoPubKey || "",
            ethPubAddress: ethPubKey,
            desoUsername: desoUser?.Profile?.Username || ""
        }
    }

    public async indexUser() {}
}

interface AuthData {
    username : string;
    desoPubAddress : string;
    desoUsername? : string;
    ethPubAddress : string;
    // profilePicUrl? : string;
}