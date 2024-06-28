import { ClientLoaderFunctionArgs, Form, Link, redirect } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { API_URL } from "~/utils/config";
import { AuthSession } from "~/utils/session";
import { getSecrets, recoverWallet } from "~/utils/wallet";

export const clientLoader = async ({ request, params }: ClientLoaderFunctionArgs) => {
    const authSession = new AuthSession(window);
    if (authSession.isLoggedIn()) {
        return redirect('/home');
    }
    return null;
};

export const clientAction = async ({ request }: ClientLoaderFunctionArgs) => {
    const body = await request.formData();
    const seedPhrase_ = body.get('phrase') as string;
    if (!seedPhrase_) throw new Error('Seed phrase is required');

    const seedPhrase = recoverWallet(window, seedPhrase_)
    const authData = await (await fetch(`${API_URL}/users/getData/${getSecrets(window)?.ethereumAddress}/${getSecrets(window)?.desoPublicKey}`)).json()
    if (!authData) throw new Error('Server and blockchain do not have information about this user');

    const authSession = new AuthSession(window);
    authSession.authData = authData;
    
    return redirect('/home');
}

export default function Login() {
    return (
        <Card className="w-96">
            <Form method="POST">
                <CardHeader>
                    <CardTitle>Login with your seed phrase</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Remember your seed phrase? Use it to login or recover your account here!</p>
                    <Textarea className="w-full my-5" name="phrase" required />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button >
                        Login
                    </Button>
                </CardFooter>
            </Form>
        </Card>
    )
}