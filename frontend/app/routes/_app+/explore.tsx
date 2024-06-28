import { Await, ClientLoaderFunctionArgs, Outlet, useFetcher, useLoaderData, useRouteLoaderData } from "@remix-run/react";
import { Post } from "~/components/Post";
import { Sidebar } from "~/components/Sidebar";
import { IPost } from "~/interfaces/IPost";
import { Suspense } from "react";
import { GetHotFeedPosts } from "@/interfaces/queries/posts";
import { API_URL } from "~/utils/config";
import { PostSkeleton } from "~/components/PostSkeleton";
import { AuthSession } from "~/utils/session";

export const clientLoader = ({ request, params }: ClientLoaderFunctionArgs) => {
    let query = `${API_URL}/posts/trending`
    const authSession = new AuthSession(window);
    let DesoReaderPub = authSession.authData.desoPubAddress;
    if (DesoReaderPub) query += `?DesoReaderHashHex=${DesoReaderPub}`
    let trendingPostsPromise = fetch(query).then((response) => response.json())
    return { trendingPostsPromise: trendingPostsPromise }
};

export default function Explore() {
    const { trendingPostsPromise } = useLoaderData<typeof clientLoader>()

    return (
        <>
            <h2 className="text-xl my-3 ml-3" ><span className="font-bold">DSocial</span>: DeSo blockchain trending</h2>
            <div className="space-y-2 w-full">
                <Suspense fallback={<PostSkeleton />}>
                    <Await resolve={trendingPostsPromise}>
                        {(data: GetHotFeedPosts) =>
                        (data.hotPosts && data.hotPosts.map((post, index) => {
                            return <Post 
                            key={index} source={post.source} id={post.id}
                            text={post.text} dateNanos={post.dateNanos} username={post.username} profileImg={post.profileImg}
                            likesCount={post.likesCount} liked={post.isLikedByReader}
                            commentsCount={post.commentsCount}
                            imagesUrls={post.imagesUrls}
                            />
                        }))
                        }
                    </Await>
                </Suspense>
            </div>
        </>
    )
}

export function HydrateFallback() {
    return <p>Loading...</p>;
}