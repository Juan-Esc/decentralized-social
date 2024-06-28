import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export default function CreateAccountStep1() {
    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Great!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Unlike traditional apps, there's no password to login here. Instead, you login with a 12-words-long phrase, which will be your only way to login into the app.</p>
                <br />
                <p>Never share this phrase with anyone. And always store it safely somewhere, as it's your only way to recover the account.</p>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button asChild>
                    <Link to="/auth/reg_3phrase">See the phrase</Link>
                </Button>
            </CardFooter>
        </Card>

    )
}