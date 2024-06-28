import type { DrizzleD1Database } from "drizzle-orm/d1";
import { posts, users } from "../models/user.model";
import { eq, sql } from "drizzle-orm";
import { getDesoProcessedProfileByAddress, getProfile } from "./profile";
import { getDesoAddress, getEthAddress } from "./blockchain";
import type { EnvBindings } from "../global";
import type { Variables } from "hono/types";
import { desoGraphClient } from "./deso/graphql";
import { getDSocialRecentFeedQuery } from "../utils/graphqlQueries";
import type { IPost } from "@/interfaces/IPost";

export class FeedService {
    private static instance: FeedService;

    constructor(private readonly db: DrizzleD1Database<Record<string, never>>, private readonly env: EnvBindings) { }

    public static getInstance(db: DrizzleD1Database<Record<string, never>>, env: EnvBindings) {
        if (!this.instance) this.instance = new FeedService(db, env);
        return this.instance;
    }

    public async getDSocialRecentFeed(DesoReaderHashHex?: string) : Promise<IPost[]> {
        let postsDb = await this.db.select().from(posts).orderBy(sql`id DESC`).limit(10).execute();
        let postHashes = postsDb.map((post) => post.desoAddress);
        const variables : any = {
            "filter": {
                "postHash": {
                    "in": postHashes
                }
            },
            "condition": {
                "publicKey": DesoReaderHashHex || null
            },
            "orderBy": "TIMESTAMP_DESC"
        }

        const data = await desoGraphClient.request(getDSocialRecentFeedQuery, variables) as unknown as any;
        const postsToReturn = data.query.posts.nodes;

        return await Promise.all(postsToReturn.map(async (post : any, index : number) => {
            let user = await this.db.select().from(users).where(eq(users.desoPubKey, post.poster.publicKey)).get();

            return {
                source: 'deso',
                id: post.postHash || "",
                username: user?.username || post.poster.username + ".deso" || "",
                profileImg: `https://diamondapp.com/api/v0/get-single-profile-picture/${post.poster.publicKey}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`,
                text: post.body || "",
                dateNanos: new Date(post.timestamp + 'Z').getTime()*1000000 || 0,
                likesCount: post.likes.totalCount || 0,
                isLikedByReader: post.likesByReaders.totalCount > 0,
                commentsCount: post.replies.totalCount || 0,
                imagesUrls: post.imageURLs || []
            }
        }))

    }
}