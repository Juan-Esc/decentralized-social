import { getHotFeed, getPostsForUser, getSinglePost, type GetPostsForPublicKeyResponse, type PostEntryResponse } from "deso-protocol"
import type { GetHotFeedPosts, GetProfilePosts } from '@/interfaces/queries/posts'
import type { IPost, IPostThread } from "@/interfaces/IPost"
import { getUsernameWithoutSuffix } from "../../utils/usernames"

export async function getHotFeedPosts(DesoReaderHashHex? : string): Promise<GetHotFeedPosts> {
    const parameters : any = {};
    if (DesoReaderHashHex) {
        parameters["ReaderPublicKeyBase58Check"] = DesoReaderHashHex
    }
    let desoPosts = await getHotFeedDeSo(parameters)

    let mixedPosts = [];
    for (let i = 0; i < desoPosts.length; i++) {
        mixedPosts.push(desoPosts[i]);
    }

    const response = { hotPosts: mixedPosts }
    return response
}

export async function getPostsByUser(username: string, desoPubKey: string | null, DesoReaderHashHex = "") {
    let posts: IPost[] = []
    if (username.endsWith(".deso")) posts = await getPostsForUserDeSo(username, DesoReaderHashHex)
    else {
        posts = await getPostsForUserDeSo(username, desoPubKey, DesoReaderHashHex)
    }
    return { posts: posts }
}

async function getHotFeedDeSo(parameters : any = {}): Promise<IPost[]> {
    let hotFeedPosts = await getHotFeed({ ...parameters, ResponseLimit: 20, SortByNew: true })
    let hotPosts: IPost[] = []
    if (!hotFeedPosts.HotFeedPage) throw new Error("No posts found")
    for (const post of hotFeedPosts.HotFeedPage) {
        const username = post.ProfileEntryResponse?.Username + ".deso" || ""
        const profileImg = post.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${post.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
        hotPosts.push({
            source: 'deso',
            id: post.PostHashHex || "",
            username: username || "",
            profileImg: profileImg,
            text: post.Body || "",
            dateNanos: post.TimestampNanos || 0,
            likesCount: post.LikeCount || 0,
            isLikedByReader: post.PostEntryReaderState?.LikedByReader || false,
            commentsCount: post.CommentCount || 0,
            imagesUrls: post.ImageURLs || []
        })
    }
    return hotPosts
}

async function getPostsForUserDeSo(username: string, PublicKeyBase58Check?: string | null, DesoReaderHashHex?: string | null): Promise<IPost[]> {
    // if params.username ends with .deso, then remove it
    const { username: userNoSuffix, ogUsername } = getUsernameWithoutSuffix(username)
    let filters : any = { NumToFetch: 20 }
    if (username.endsWith(".deso")) filters["Username"] = userNoSuffix
    else if (PublicKeyBase58Check) filters["PublicKeyBase58Check"] = PublicKeyBase58Check
    if (DesoReaderHashHex) filters["ReaderPublicKeyBase58Check"] = DesoReaderHashHex

    let data: GetPostsForPublicKeyResponse | undefined = await getPostsForUser(filters)
    let response: IPost[] = []

    if (!data || !data.Posts) return [];
    for (const post of data.Posts) {
        const profileImg = post.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${post.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`

        response.push({
            source: 'deso',
            id: post.PostHashHex || "",
            username: ogUsername || "",
            profileImg: profileImg,
            text: post.Body || "",
            dateNanos: post.TimestampNanos || 0,
            likesCount: post.LikeCount || 0,
            isLikedByReader: post.PostEntryReaderState?.LikedByReader || false,
            commentsCount: post.CommentCount || 0,
            imagesUrls: post.ImageURLs || []
        })
    }
    return response
}

export async function getPostById(id: string, username?: string) {
        return getPostByDeSoId(id)
}

export async function getPostByDeSoId(PostHashHex: string): Promise<IPostThread> {
    let post = await getSinglePost({ PostHashHex: PostHashHex, FetchParents: true, CommentLimit: 20 })
    const username = post.PostFound?.ProfileEntryResponse?.Username + ".deso" || ""
    const profileImg = post.PostFound?.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${post.PostFound?.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`

    return {
        source: 'deso',
        id: post.PostFound?.PostHashHex || "",
        username: username || "",
        profileImg: profileImg,
        text: post.PostFound?.Body || "",
        dateNanos: post.PostFound?.TimestampNanos || 0,
        likesCount: post.PostFound?.LikeCount || 0,
        commentsCount: post.PostFound?.CommentCount || 0,
        imagesUrls: post.PostFound?.ImageURLs || [],
        comments: post.PostFound?.Comments?.map((comment) => {
            const username = comment.ProfileEntryResponse?.Username + ".deso" || ""
            const profileImg = comment.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${comment.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
            return {
                source: 'deso',
                id: comment.PostHashHex || "",
                username: username || "",
                profileImg: profileImg,
                text: comment.Body || "",
                dateNanos: comment.TimestampNanos || 0,
                likesCount: comment.LikeCount || 0,
                commentsCount: comment.CommentCount || 0,
                imagesUrls: comment.ImageURLs || []
            }
        }) || [],
        parents: post.PostFound?.ParentPosts?.map((parent) => {
            const username = parent.ProfileEntryResponse?.Username + ".deso" || ""
            const profileImg = parent.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${parent.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
            return {
                source: 'deso',
                id: parent.PostHashHex || "",
                username: username || "",
                profileImg: profileImg,
                text: parent.Body || "",
                dateNanos: parent.TimestampNanos || 0,
                likesCount: parent.LikeCount || 0,
                commentsCount: parent.CommentCount || 0,
                imagesUrls: parent.ImageURLs || []
            }
        }) || []
    }
}

// Util functions
export function desoPostsToIPosts(posts: PostEntryResponse[]) {
    let response: IPost[] = []
    console.log(posts)
    for (const post of posts) {
        const username = post.ProfileEntryResponse?.Username + ".deso" || ""
        const profileImg = post.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${post.ProfileEntryResponse?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
        response.push({
            source: 'deso',
            id: post.PostHashHex || "",
            username: username || "",
            profileImg: profileImg,
            text: post.Body || "",
            dateNanos: post.TimestampNanos || 0,
            likesCount: post.LikeCount || 0,
            commentsCount: post.CommentCount || 0,
            imagesUrls: post.ImageURLs || []
        })
    }
    return response
}