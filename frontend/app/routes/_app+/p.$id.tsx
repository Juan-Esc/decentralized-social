import { IPostThread } from "@/interfaces/IPost";
import { Await, ClientLoaderFunctionArgs, Form, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import { Post } from "~/components/Post";
import { PostSkeleton } from "~/components/PostSkeleton";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { API_URL } from "~/utils/config";
import { DesoService } from "~/utils/deso";
import { AuthSession } from "~/utils/session";

export const clientLoader = ({ request, params }: ClientLoaderFunctionArgs) => {
    let query = `${API_URL}/posts/get/${params.id}`
    const authSession = new AuthSession(window);
    let DesoReaderPub = authSession.authData.desoPubAddress;
    if (DesoReaderPub) query += `?DesoReaderHashHex=${DesoReaderPub}`
    let postThreadPromise = fetch(query).then((response) => response.json())
    return { postThreadPromise: postThreadPromise, postId: params.id }
};

export const clientAction = async ({ request }: ClientLoaderFunctionArgs) => {
    const body = await request.formData();
    const bodyText = body.get("bodyText");
    if (!bodyText) return null;
    const ParentStakeID = body.get("ParentStakeID");
    if (!ParentStakeID) return null;

    const desoService = new DesoService(window);
    const submittedPost = await desoService.submitPost(bodyText.toString(), ParentStakeID.toString());

    return redirect(`/p/${submittedPost.TxnHashHex}`);
};

export default function PostDetailed() {
    const { postThreadPromise, postId } = useLoaderData<typeof clientLoader>()

    const navigation = useNavigation();

    const isSubmitting =
        navigation.formAction === `/p/${postId}`;

    // Clear state upon redirect
    useEffect(() => {
        return () => {
            // Perform cleanup tasks here
            // For example, if you have a state variable called `post`, you can clear it like this:
            // setPost(null);
        };
    }, [navigation]);

    return <>
        <Suspense fallback={<PostSkeleton />}>
            <Await resolve={postThreadPromise}>
                {(post: IPostThread) => {
                    return <>
                        {post.parents && post.parents.map((parent, index) => {
                            return <Post
                                key={`${parent.id}-${Date.now()}`} source={parent.source} id={parent.id}
                                text={parent.text} dateNanos={parent.dateNanos} username={parent.username} profileImg={parent.profileImg}
                                likesCount={parent.likesCount} liked={parent.isLikedByReader}
                                commentsCount={parent.commentsCount}
                                imagesUrls={parent.imagesUrls} />
                        })}
                        <Post
                            key={`${post.id}-${Date.now()}`} source={post.source} id={post.id}
                            text={post.text} dateNanos={post.dateNanos} username={post.username} profileImg={post.profileImg}
                            likesCount={post.likesCount} liked={post.isLikedByReader}
                            commentsCount={post.commentsCount}
                            imagesUrls={post.imagesUrls} />
                        <br />
                        <Form method="POST">
                            <div className="mt-3 flex flex-col items-start mx-5">
                                <Textarea
                                    name="bodyText"
                                    placeholder="What's on your mind?"
                                    className="resize-none focus:outline-none mb-3 w-full"
                                />
                                <input type="hidden" name="ParentStakeID" value={post.id} />
                                <Button
                                    className="px-4 ml-auto"
                                    disabled={isSubmitting}
                                >
                                    {!!isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                                    {isSubmitting ? "Please wait..." : "Submit"}
                                </Button>
                            </div>
                        </Form>
                        <br />
                        {post.comments && post.comments.map((comment, index) => {
                            return <Post
                                key={`${comment.id}-${Date.now()}`} source={comment.source} id={comment.id}
                                text={comment.text} dateNanos={comment.dateNanos} username={comment.username} profileImg={comment.profileImg}
                                likesCount={comment.likesCount} liked={comment.isLikedByReader}
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