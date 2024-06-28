import { getSingleProfile, type GetSingleProfileResponse } from "deso-protocol"
import type { GetProfileByUsername } from '@/interfaces/queries/profiles'
import { desoPostsToIPosts } from "./deso/posts"
import { getUsernameWithoutSuffix } from "../utils/usernames"

export async function getProfile(username: string, desoPubAddress? : string | null): Promise<GetProfileByUsername> {
    if (username.endsWith(".deso")) return getProfileDeSo(username)
    else return getProfileDeSo(username, desoPubAddress)
}

async function getProfileDeSo(username: string, PublicKeyBase58Check? : string | null): Promise<GetProfileByUsername> {
    const { username: userNoSuffix, ogUsername } = getUsernameWithoutSuffix(username)
    console.log("public key ", PublicKeyBase58Check)
    let desoProfile: GetSingleProfileResponse | null = null;
    if (username.endsWith(".deso")) {
        desoProfile = await getSingleProfile({ Username: userNoSuffix })
    } else if (PublicKeyBase58Check) {
        console.log("public key ", PublicKeyBase58Check)
        desoProfile = await getSingleProfile({ PublicKeyBase58Check: PublicKeyBase58Check })
    }
    console.log("profile ", desoProfile)

    desoProfile = desoProfile as unknown as GetSingleProfileResponse;
    return {
        username: ogUsername || "",
        name: "",
        bio: desoProfile.Profile?.Description || "",
        followers: 0,
        posts: (desoProfile.Profile?.Posts) ? desoPostsToIPosts(desoProfile.Profile?.Posts) : [],
        profileImageUrl: desoProfile?.Profile?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${desoProfile?.Profile?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
    }
}

export async function getDesoProcessedProfileByAddress(address: string, username?: string): Promise<GetProfileByUsername> {
    const desoProfile = await getSingleProfile({ PublicKeyBase58Check: address })
    return {
        username: username || desoProfile.Profile?.Username || "",
        name: "",
        bio: desoProfile.Profile?.Description || "",
        followers: 0,
        posts: (desoProfile.Profile?.Posts) ? desoPostsToIPosts(desoProfile.Profile?.Posts) : [],
        profileImageUrl: desoProfile?.Profile?.ExtraData?.LargeProfilePicURL || `https://diamondapp.com/api/v0/get-single-profile-picture/${desoProfile?.Profile?.PublicKeyBase58Check}?fallback=https://diamondapp.com/assets/img/default-profile-pic.png`
    }
}