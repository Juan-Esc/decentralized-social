import { IPostThread } from "@/interfaces/IPost";
import { Await, ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Post } from "~/components/Post";
import { PostSkeleton } from "~/components/PostSkeleton";
import { API_URL } from "~/utils/config";

export const clientLoader = ({ request, params }: ClientLoaderFunctionArgs) => {
    let postThreadPromise = fetch(`${API_URL}/posts/get/${params.username}/${params.id}`).then((response) => response.json())
    return { postThreadPromise: postThreadPromise }
};

export default function PostDetailed() {
    const { postThreadPromise } = useLoaderData<typeof clientLoader>()

    return <>
        <Suspense fallback={<PostSkeleton />}>
            <Await resolve={postThreadPromise}>
                {(post: IPostThread) => {
                    return <>
                    {post.parents && post.parents.map((parent, index) => {
                        return <Post
                            key={index} source={parent.source} id={parent.id}
                            text={parent.text} dateNanos={parent.dateNanos} username={parent.username} profileImg={parent.profileImg}
                            likesCount={parent.likesCount}
                            commentsCount={parent.commentsCount}
                            imagesUrls={parent.imagesUrls} />
                    })}
                    <Post
                        source={post.source} id={post.id}
                        text={post.text} dateNanos={post.dateNanos} username={post.username} profileImg={post.profileImg}
                        likesCount={post.likesCount}
                        commentsCount={post.commentsCount}
                        imagesUrls={post.imagesUrls} />
                    <br />
                    {post.comments && post.comments.map((comment, index) => {
                        return <Post
                            key={index} source={comment.source} id={comment.id}
                            text={comment.text} dateNanos={comment.dateNanos} username={comment.username} profileImg={comment.profileImg}
                            likesCount={comment.likesCount}
                            commentsCount={comment.commentsCount}
                            imagesUrls={comment.imagesUrls} />
                    })}
                    </>
                }}
            </Await>
        </Suspense>
    </>
}

export function HydrateFallback() {
    return <PostSkeleton />;
}