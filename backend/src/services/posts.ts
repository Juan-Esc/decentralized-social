import type { DrizzleD1Database } from "drizzle-orm/d1";
import { posts, users } from "../models/user.model";
import { eq } from "drizzle-orm";
import { getDesoProcessedProfileByAddress, getProfile } from "./profile";
import { getDesoAddress, getEthAddress } from "./blockchain";
import type { EnvBindings } from "../global";
import type { Variables } from "hono/types";
import { getSinglePost, type GetSinglePostResponse } from "deso-protocol";
import type { IPost, IPostThread } from "@/interfaces/IPost";

export class PostsService {
    private static instance: PostsService;

    constructor(private readonly db: DrizzleD1Database<Record<string, never>>, private readonly env: EnvBindings) { }

    public static getInstance(db: DrizzleD1Database<Record<string, never>>, env: EnvBindings) {
        if (!this.instance) this.instance = new PostsService(db, env);
        return this.instance;
    }

    public async getPostById(PostHashHex: string, DesoReaderHashHex? : string) {
        let post : GetSinglePostResponse;
        if (DesoReaderHashHex) {
            post = await getSinglePost({ PostHashHex: PostHashHex, FetchParents: true, CommentLimit: 20, ReaderPublicKeyBase58Check: DesoReaderHashHex })
        } else {
            post = await getSinglePost({ PostHashHex: PostHashHex, FetchParents: true, CommentLimit: 20 })
        }

        let userHexPubKey = post.PostFound?.ProfileEntryResponse?.PublicKeyBase58Check || ""
        let user = await this.db.select().from(users).where(eq(users.desoPubKey, userHexPubKey)).get();
        const username = user?.username || post.PostFound?.ProfileEntryResponse?.Username + ".deso" || ""
        const profileImg = post.PostFound?.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${post.PostFound?.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
        let post_ : IPostThread = {
            source: 'deso',
            id: post.PostFound?.PostHashHex || "",
            username: username || "",
            profileImg: profileImg,
            text: post.PostFound?.Body || "",
            dateNanos: post.PostFound?.TimestampNanos || 0,
            likesCount: post.PostFound?.LikeCount || 0,
            isLikedByReader: post.PostFound?.PostEntryReaderState?.LikedByReader || false,
            commentsCount: post.PostFound?.CommentCount || 0,
            imagesUrls: post.PostFound?.ImageURLs || [],
            comments: post.PostFound?.Comments ? await Promise.all(post.PostFound.Comments.map(async (comment) => {
                let user = await this.db.select().from(users).where(eq(users.desoPubKey, comment.PosterPublicKeyBase58Check)).get();
                const username = user?.username || comment.ProfileEntryResponse?.Username + ".deso" || ""
                const profileImg = comment.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${comment.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
                return {
                    source: 'deso',
                    id: comment.PostHashHex || "",
                    username: username || "",
                    profileImg: profileImg,
                    text: comment.Body || "",
                    dateNanos: comment.TimestampNanos || 0,
                    likesCount: comment.LikeCount || 0,
                    isLikedByReader: comment.PostEntryReaderState?.LikedByReader || false,
                    commentsCount: comment.CommentCount || 0,
                    imagesUrls: comment.ImageURLs || []
                }
            })) : [],
            parents: post.PostFound?.ParentPosts ? await Promise.all(post.PostFound.ParentPosts.map(async (parent) => {
                let user = await this.db.select().from(users).where(eq(users.desoPubKey, parent.PosterPublicKeyBase58Check)).get();
                const username = user?.username || parent.ProfileEntryResponse?.Username + ".deso" || ""
                const profileImg = parent.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${parent.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
                return {
                    source: 'deso',
                    id: parent.PostHashHex || "",
                    username: username || "",
                    profileImg: profileImg,
                    text: parent.Body || "",
                    dateNanos: parent.TimestampNanos || 0,
                    likesCount: parent.LikeCount || 0,
                    isLikedByReader: parent.PostEntryReaderState?.LikedByReader || false,
                    commentsCount: parent.CommentCount || 0,
                    imagesUrls: parent.ImageURLs || []
                }
            })) : []
        }

        // Only index if post has no parents (hence, it's not a comment)
        if (!post_.parents || post_.parents.length == 0) {
            await this.indexPost(PostHashHex, post_);
        }

        return post_;
    }

    public async indexPost(PostHasHex : string, desoPost : IPostThread) {
        let postExists = await this.db.select().from(posts).where(eq(posts.desoAddress, PostHasHex)).get();
        if (postExists) return;
        if (desoPost.username.endsWith('.deso')) return;
        let user = await this.db.select().from(users).where(eq(users.username, desoPost.username)).get();
        let postDb = await this.db.insert(posts).values({
            authorId: user?.ethPubKey || "",
            desoAddress: PostHasHex || "",
            body: desoPost.text,
        }).execute();

        return true;
    }
}