import { GetProfilePosts } from "@/interfaces/queries/posts";
import type { GetProfileByUsername } from "@/interfaces/queries/profiles";
import { Await, ClientLoaderFunctionArgs, Form, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { Suspense, useState } from "react";
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
    return {}
};

export const clientAction = async ({ request }: ClientLoaderFunctionArgs) => {
    const body = await request.formData();
    const selectedImage = body.get("selectedImage");
    if (!selectedImage) return null;

    const desoService = new DesoService(window);
    const authSession = new AuthSession(window);
    console.log(authSession.authData.username)

    // Convert image to base64
    const response = await fetch(`/${selectedImage}.jpg`);
    const blob = await response.blob();
    const base64Image : string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    const updatedProfile = await desoService.updateDeSoProfile(authSession.authData.desoUsername || "", authSession.authData.username, null, base64Image);

    return window.location.href = `/u/${authSession.authData.username}` // instead of redirect. With a full page reload, more chances of profile picture updating
};

export default function PhotoSelectorPage() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    function setImage(id: number) {
        setSelectedImage(id);
        console.log(id)
    }

    const navigation = useNavigation();

    const isSubmitting =
        navigation.formAction === `/photo-selector`;

    return (
        <div className="flex flex-col items-center justify-center min-h-dvh p-4">
            <div className="text-center">
                <h2 className="text-3xl">Choose a profile</h2>
                <h2 className="text-3xl font-bold">picture</h2>
            </div>

            <div className="flex flex-col w-full px-4 py-6 shadow-md rounded-lg">
                <div className="flex justify-center gap-4 mb-4">
                    <Avatar className={`w-24 h-24 ${selectedImage === 1 ? 'border-2 border-white' : ''}`} onClick={() => setImage(1)}>
                        <AvatarImage src={`/1.jpg`} />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <Avatar className={`w-24 h-24 ${selectedImage === 2 ? 'border-2 border-white' : ''}`} onClick={() => setImage(2)}>
                        <AvatarImage src={`/2.jpg`} />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <Avatar className={`w-24 h-24 ${selectedImage === 3 ? 'border-2 border-white' : ''}`} onClick={() => setImage(3)}>
                        <AvatarImage src={`/3.jpg`} />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex justify-center gap-4 mb-4">
                    <Avatar className={`w-24 h-24 ${selectedImage === 4 ? 'border-2 border-white' : ''}`} onClick={() => setImage(4)}>
                        <AvatarImage src={`/4.jpg`} />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <Avatar className={`w-24 h-24 ${selectedImage === 5 ? 'border-2 border-white' : ''}`} onClick={() => setImage(5)}>
                        <AvatarImage src={`/5.jpg`} />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <Avatar className={`w-24 h-24 ${selectedImage === 6 ? 'border-2 border-white' : ''}`} onClick={() => setImage(6)}>
                        <AvatarImage src={`/6.jpg`} />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <Form className="w-full" method="POST">
                <input type="hidden" value={selectedImage?.toString()} name="selectedImage" />
                <Button
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {!!isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)}
                    {isSubmitting ? "Please wait..." : "Save"}
                </Button>
                <p className="text-center my-2 text-sm">It may take some time for your picture to update. <br />Reload browser if it does not update after Save</p>
            </Form>

        </div>
    )
}

export function HydrateFallback() {
    return <ProfileSkeleton />;
}