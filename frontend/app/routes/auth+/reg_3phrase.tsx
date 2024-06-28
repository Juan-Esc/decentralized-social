import { ClientLoaderFunctionArgs, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { generateWallet, getSecrets, setWalletOnWindow } from "~/utils/wallet";

export const clientLoader = async ({ request, params }: ClientLoaderFunctionArgs) => {
    const seedPhrase = generateWallet(window);
    return { seedPhrase };
};

export function HydrateFallback() {
    return <p>Loading...</p>;
}

export default function CreateAccountStep1() {
    const data = useLoaderData<typeof clientLoader>();
    const [copySuccess, setCopySuccess] = useState('');

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(data.seedPhrase);
            setCopySuccess('Copied!');
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
    };
    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Store this phrase safely</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This phrase allows anyone to log into your account. Never share it, keep it safe! Moreover, this is the only way to recover your account</p>
                <Textarea placeholder={data.seedPhrase} disabled className="w-full my-5" />
            </CardContent>
            <CardFooter className="flex justify-between">
            <Button onClick={copyToClipboard}>Copy phrase</Button>
            {copySuccess && <div>{copySuccess}</div>}
                <Button asChild>
                    <Link to="/auth/reg_4genacc">I stored this phrase</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

