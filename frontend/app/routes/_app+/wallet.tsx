import { IPostThread } from "@/interfaces/IPost";
import { Await, ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Post } from "~/components/Post";
import { PostSkeleton } from "~/components/PostSkeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { API_URL } from "~/utils/config";

export const clientLoader = ({ request, params }: ClientLoaderFunctionArgs) => {
    return null;
};

export default function WalletPage() {

    return <>
        <div className="mt-3">
            <Card>
                <CardHeader>
                    <CardTitle>Your balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <Card className="bg-zinc-900 my-2">
                        <CardHeader>
                            <CardTitle>0.000 $MATIC</CardTitle>
                            <CardDescription>$MATIC</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="bg-zinc-900 my-2">
                        <CardHeader>
                            <CardTitle>0.000 $DESO</CardTitle>
                            <CardDescription>$DESO</CardDescription>
                        </CardHeader>
                    </Card>
                </CardContent>
            </Card>
            <Tabs defaultValue="account" className="w-full my-4">
                <CardTitle className="my-3">Last transactions</CardTitle>
                <TabsList>
                    <TabsTrigger value="account" className="w-[50%]">Polygon</TabsTrigger>
                    <TabsTrigger value="password" className="w-[50%]">Deso</TabsTrigger>
                </TabsList>
                <TabsContent value="account">...</TabsContent>
                <TabsContent value="password">...</TabsContent>
            </Tabs>
        </div>

    </>
}

export function HydrateFallback() {
    return <PostSkeleton />;
}