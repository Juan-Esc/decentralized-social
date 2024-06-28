import { ClientLoaderFunctionArgs, Link, defer, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import { API_URL } from "~/utils/config";
import { DesoService } from "~/utils/deso";
import { AuthSession } from "~/utils/session";
import { generateWallet, getSecrets, setWalletOnWindow } from "~/utils/wallet";
import { Web3 } from "~/utils/web3";

export function HydrateFallback() {
    return <p>Loading...</p>;
}

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
    console.log("Claiming username...");
    const username = localStorage.getItem("wantedUsername");
    if (!username) return;

    console.log("Trying to claim ", username);

    const web3 = new Web3(window);
    const desoService = new DesoService(window);

    const askForCoins = web3.askForFeesCoins();
    const claimUsername = askForCoins.then(() => {
        return web3.claimUsername(username.toString());
    });

    const setDesoAddress = claimUsername.then(() => {
        return web3.setDesoAddress(getSecrets(window)?.desoPublicKey || '');
    });

    const generateRandomProfile = setDesoAddress.then(() => {
        return desoService.generateRandomProfile();
    });

    const registerReq = generateRandomProfile.then(() => {
        return fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                ethPubKey: getSecrets(window)?.ethereumAddress,
                desoPubKey: getSecrets(window)?.desoPublicKey
            })
        });
    });

    return defer({
        askForCoins,
        claimUsername,
        setDesoAddress,
        generateRandomProfile,
        registerReq
    });
}

export default function CreateAccountStep4() {
    const data = useLoaderData<typeof clientLoader>();
    const [claimStatus, setClaimStatus] = useState('Preparing...');
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setClaimStatus('Preparing to claim username...');
        setIsLoading(true);

        data?.askForCoins.then(() => {
            setClaimStatus('Asking for initial coins...');
        }).catch((error) => {
            console.error("Error asking for coins:", error);
            setClaimStatus('Error asking for coins...');
        });

        data?.claimUsername.then(() => {
            setClaimStatus('Claiming username...');
            const authSession = new AuthSession(window);
            authSession.authData = {
                username: localStorage.getItem("wantedUsername") || '',
                desoPubAddress: getSecrets(window)?.desoPublicKey || '',
                ethPubAddress: getSecrets(window)?.ethereumAddress || ''
            }
            setClaimStatus('Setting Deso address...');
        }).catch((error) => {
            console.error("Error claiming username:", error);
            if (error.message === "Username already exists") {
                setClaimStatus('Username already exists...');
                return navigate('/');
            }
            setClaimStatus('Unexpected error while claiming username...');
        });

        data?.setDesoAddress.then(() => {
            setClaimStatus('Generating profile...');
        }).catch((error) => {
            console.error("Error setting Deso address:", error);
            setClaimStatus('Error setting Deso address...');
            setIsLoading(false);
        });

        data?.generateRandomProfile.then((desoUsername) => {
            const authSession = new AuthSession(window);
            authSession.authData.desoUsername = desoUsername;
            setClaimStatus('Final tweaks...');
        }).catch((error) => {
            console.error("Error generating profile:", error);
            setClaimStatus('Error generating profile...');
            setIsLoading(false);
        });

        data?.registerReq.then(() => {
            setClaimStatus('Account created!');
            setIsSuccess(true);
            setIsLoading(false);
        }).catch((error) => {
            console.error("Error registering user:", error);
            setClaimStatus('Error registering user...');
            setIsLoading(false);
        });
    }, []);

    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>{claimStatus}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <>
                        <p>Please wait, this can take up to 1 minute...</p>
                        <Skeleton className="h-4 w-full my-3" />
                        <Skeleton className="h-4 w-full my-3" />
                        <Skeleton className="h-4 w-full my-3" />
                    </>
                )}
                {!isLoading && isSuccess && (
                    <>
                        <p>Your account is ready!</p>
                        <br />
                        <p>Now you can start using DSocial!</p>
                    </>
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
                {!isLoading && (
                    <Button asChild variant={'secondary'} className="mx-3">
                        <Link
                            to="/photo-selector"
                            onClick={(e) => isLoading && e.preventDefault()}
                            style={{ color: isLoading ? 'gray' : 'white', pointerEvents: isLoading ? 'none' : 'auto' }}
                        >
                            Choose profile photo
                        </Link>
                    </Button>
                )}
                <Button asChild>
                    <Link
                        to="/home"
                        onClick={(e) => isLoading && e.preventDefault()}
                        style={{ color: isLoading ? 'gray' : 'black', pointerEvents: isLoading ? 'none' : 'auto' }}
                    >
                        {isLoading ? 'Wait...' : 'Finish'}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}