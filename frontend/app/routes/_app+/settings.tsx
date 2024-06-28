import { GetProfilePosts } from "@/interfaces/queries/posts";
import type { GetProfileByUsername } from "@/interfaces/queries/profiles";
import { Await, ClientLoaderFunctionArgs, Form, Link, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Post } from "~/components/Post";
import { PostsSkeleton } from "~/components/PostsSkeleton";
import { ProfileSkeleton } from "~/components/ProfileSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { API_URL } from "~/utils/config";
import { DesoService } from "~/utils/deso";
import { AuthSession } from "~/utils/session";

export const clientLoader = ({ request, params }: ClientLoaderFunctionArgs) => {
    const authSession = new AuthSession(window);

    let userPromise = fetch(`${API_URL}/profiles/by-user/${authSession.authData.username}`).then((response) => response.json())
    return { userPromise: userPromise }
};

export const clientAction = async ({ request }: ClientLoaderFunctionArgs) => {
    const body = await request.formData();
    const bio = body.get("bio");
    if (!bio) return null;

    const profilePic = body.get("profilePic");
    if (!profilePic) return null;

    const desoService = new DesoService(window);
    const authSession = new AuthSession(window);
    const submittedPost = await desoService.updateDeSoProfile(authSession.authData.desoUsername || "", authSession.authData.username, bio.toString(), null);

    return redirect(`/u/${authSession.authData.username}`);
};

export default function UserSettingsPage() {
    const { userPromise } = useLoaderData<typeof clientLoader>()

    const navigation = useNavigation();

    const isSubmitting =
        navigation.formAction === `/settings`;

    return (
        <Suspense fallback={<ProfileSkeleton />}>
            <Await resolve={userPromise}>
                {(data: GetProfileByUsername) => (
                    <>
                        <div className="flex flex-col items-center justify-center min-h-dvh py-2">
                            <div className="flex flex-col w-full px-4 py-6 shadow-md rounded-lg">
                                <div className="flex flex-col items-center justify-center mb-4">
                                    <Link to={`/photo-selector`}>
                                        <Avatar className="w-24 h-24 mb-2">
                                            <AvatarImage alt={data.name} src={data.profileImageUrl} />
                                            <AvatarFallback>{data.username.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{data.username}</h2>
                                    {/*<p className="text-sm text-gray-500 dark:text-gray-300">{data.username}</p>*/}
                                </div>
                                <div className="mb-4 leading-relaxed break-words break-all whitespace-pre-wrap">
                                    <Form method="POST">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Bio</h3>
                                        <input type="hidden" name="profilePic" value={data.profileImageUrl} />
                                        <Textarea
                                            name="bio"
                                            placeholder="What's on your mind?"
                                            defaultValue={data.bio}
                                            className="resize-none focus:outline-none mb-3 w-full"
                                        />
                                        <Button
                                            className="px-4 mt-5 float-right"
                                            disabled={isSubmitting}
                                        >
                                            {!!isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                                            {isSubmitting ? "Please wait..." : "Save"}
                                        </Button>
                                    </Form>
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