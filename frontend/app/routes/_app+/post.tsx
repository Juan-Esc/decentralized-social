import { IPostThread } from "@/interfaces/IPost";
import { Await, ClientLoaderFunctionArgs, Form, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Post } from "~/components/Post";
import { PostSkeleton } from "~/components/PostSkeleton";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { API_URL } from "~/utils/config";
import { DesoService } from "~/utils/deso";

export const clientLoader = ({ request, params }: ClientLoaderFunctionArgs) => {
    return null;
};

export const clientAction = async ({ request }: ClientLoaderFunctionArgs) => {
    const body = await request.formData();
    const bodyText = body.get("bodyText");
    if (!bodyText) return null;

    const desoService = new DesoService(window);
    const submittedPost = await desoService.submitPost(bodyText.toString());

    return redirect(`/p/${submittedPost.TxnHashHex}`);
};

export default function PostPage() {
    const navigation = useNavigation();

    const isSubmitting =
        navigation.formAction === "/post";

    return (
        <Form method="POST">
            <div className="mt-3 flex flex-col items-start mx-5">
                <Textarea
                    name="bodyText"
                    placeholder="What's on your mind?"
                    className="resize-none focus:outline-none mb-3 w-full"
                />
                <Button
                    className="px-4 ml-auto"
                    disabled={isSubmitting}
                >
                    {!!isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                    {isSubmitting ? "Please wait..." : "Submit"}
                </Button>
            </div>
        </Form>
    );
}
export function HydrateFallback() {
    return <PostSkeleton />;
}