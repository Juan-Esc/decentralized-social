export interface IPost {
    source: 'deso' | 'bsky'
    id: string
    username: string
    profileImg: string
    dateNanos: number
    text: string
    likesCount: number
    isLikedByReader?: boolean | undefined
    commentsCount: number
    imagesUrls?: string[]
}

export interface IPostThread extends IPost {
    comments: IPost[]
    parents: IPost[] | undefined
}

export interface IPostUser {
    username: string
    profileImg: string
}