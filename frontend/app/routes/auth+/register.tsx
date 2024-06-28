import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export default function RegisterPage() {
    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Welcome!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>DSocial is a decentralized blockchain-based social media app.</p>
                <br />
                <p>Unlike on mainstream apps, here you actually own your username handle and all the content you post.</p>
                <br />
                <p>You cannot be censored, and your account cannot be blocked.</p>
                <br />
                <p>It is an open ecosystem and you can even move your profile accross compatible apps. Anyone can build an app.</p>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button asChild>
                    <Link to="/auth/reg_1username">Next</Link>
                </Button>
            </CardFooter>
        </Card>

    )
}