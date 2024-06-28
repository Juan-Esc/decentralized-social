import { GetProfilePosts } from "@/interfaces/queries/posts";
import type { GetProfileByUsername } from "@/interfaces/queries/profiles";
import { Await, ClientLoaderFunctionArgs, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Post } from "~/components/Post";
import { PostsSkeleton } from "~/components/PostsSkeleton";
import { ProfileSkeleton } from "~/components/ProfileSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { API_URL } from "~/utils/config";
import { AuthSession } from "~/utils/session";

export const clientLoader = ({ request, params }: ClientLoaderFunctionArgs) => {
    let query = `${API_URL}/posts/by-user/${params.username}`
    let authSession = new AuthSession(window)
    if (authSession.authData.desoPubAddress) query += `?DesoReaderHashHex=${authSession.authData.desoPubAddress}`
    let profilePostsPromise = fetch(query).then((response) => response.json())
    let userPromise = fetch(`${API_URL}/profiles/by-user/${params.username}`).then((response) => response.json())

    return { profilePostsPromise: profilePostsPromise, userPromise: userPromise, myUsername: authSession.authData.username, visitingUsername: params.username  }
};

export default function UserPage() {
    const { profilePostsPromise, userPromise, myUsername, visitingUsername } = useLoaderData<typeof clientLoader>()

    return (
        <Suspense fallback={<ProfileSkeleton />}>
            <Await resolve={userPromise}>
                {(data: GetProfileByUsername) => (
                    <>
                        <div className="flex flex-col items-center justify-center min-h-dvh py-2">
                            <div className="flex flex-col w-full px-4 py-6 shadow-md rounded-lg">
                                <div className="flex flex-col items-center justify-center mb-4">
                                    <Avatar className="w-24 h-24 mb-2">
                                        <AvatarImage alt={data.name} src={data.profileImageUrl} />
                                        <AvatarFallback>{data.username.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{data.username}</h2>
                                    {/*<p className="text-sm text-gray-500 dark:text-gray-300">{data.username}</p>*/}
                                </div>
                                <div className="mb-4 leading-relaxed break-words break-all whitespace-pre-wrap">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Bio</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">
                                        {data.bio || ""}
                                    </p>
                                </div>
                                {myUsername && visitingUsername && myUsername == visitingUsername && (
                                <Link to={'/settings'} className="mx-auto w-full">
                                    <Button className="mb-4 w-full">Edit Profile</Button>
                                </Link>
                                )}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Recent Activity</h3>
                                    <div className="space-y-2">
                                        <Suspense fallback={<PostsSkeleton />}>
                                            <Await resolve={profilePostsPromise}>
                                                {(datap: GetProfilePosts) =>
                                                (datap.posts && datap.posts.map((post, index) => {
                                                    return <Post
                                                        key={index} source={post.source} id={post.id}
                                                        text={post.text} dateNanos={post.dateNanos} username={post.username} profileImg={data.profileImageUrl}
                                                        likesCount={post.likesCount} liked={post.isLikedByReader}
                                                        commentsCount={post.commentsCount}
                                                        imagesUrls={post.imagesUrls} />
                                                }))
                                                }
                                            </Await>
                                        </Suspense>

                                        {/*
                        <div>
                            <div className="flex items-center space-x-2">
                                <TextIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                <p className="text-sm text-gray-500 dark:text-gray-300">Commented on a post</p>
                            </div>
                            <Post />
                        </div>
                        <div className="flex items-center space-x-2">
                            <HeartIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                            <p className="text-sm text-gray-500 dark:text-gray-300">Liked a post</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <UploadIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                            <p className="text-sm text-gray-500 dark:text-gray-300">Uploaded a new post</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TextIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                            <p className="text-sm text-gray-500 dark:text-gray-300">Replied to a comment</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <HeartIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                            <p className="text-sm text-gray-500 dark:text-gray-300">Liked a comment</p>
                        </div>
                        */}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Await>
        </Suspense>
    )
}

export function HydrateFallback() {
    return <ProfileSkeleton />;
}