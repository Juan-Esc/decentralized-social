import type { IPost } from "./IPost";

export interface IProfile {
    username : string
    name : string
    bio : string
    followers : number
    posts : IPost[]
    profileImageUrl : string
}