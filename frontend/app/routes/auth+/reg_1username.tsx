import { ClientActionFunctionArgs, Form, Link, redirect } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from 'react';
import { API_URL } from "~/utils/config";
import { Icon } from "@iconify/react/dist/iconify.js"
import { Web3 } from "~/utils/web3";
import { generateWallet } from "~/utils/wallet";

export const clientAction = async ({ request, params }: ClientActionFunctionArgs) => {
    const body = await request.formData();
    const username = body.get("username");
    if (!username) return null;

    localStorage.setItem("wantedUsername", username.toString());

    return redirect("/auth/reg_2advice");
}

export default function RegUsernamePage() {
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: any) => {
        const { value } = e.target;
        setUsername(value);
        setIsLoading(true);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(window.setTimeout(() => {
            checkUsernameAvailability(value);
        }, 500));
    }

    const checkUsernameAvailability = async (username: string) => {
        try {
            const response = await fetch(`${API_URL}/users/usernameInUse/${username}`);
            setIsAvailable(response.status === 200);
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    }

    const isValidUsername = (username: string) => {
        return /^[A-Za-z0-9]+$/.test(username);
    }

    return (
        <Card className="w-96">
            <Form method="POST">
                <CardHeader>
                    <CardTitle>Write your desired username</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>After next step, it will be totally yours. Promise. </p>
                    <br />
                    <Input type="text" name="username" placeholder="Username" onChange={handleInputChange} />
                    {isAvailable && !isLoading && isValidUsername(username) &&
                        <div className="flex items-center text-green-500 mt-3">
                            <Icon icon="heroicons:check-circle-20-solid" />
                            <Label htmlFor="username">Great, that username is available</Label>
                        </div>
                    }
                    {!isAvailable && !isLoading && username !== '' && isValidUsername(username) &&
                        <Label htmlFor="username" className="text-red-500">Sorry, that username is not available</Label>
                    }
                    {!isValidUsername(username) && username !== '' &&
                        <Label htmlFor="username" className="text-red-500">Invalid characters, only A-z and 0-9 are allowed</Label>
                    }
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" variant={"default"} disabled={!isAvailable || isLoading || !isValidUsername(username)}>
                        Next
                    </Button>
                </CardFooter>
            </Form>
        </Card>
    )
}