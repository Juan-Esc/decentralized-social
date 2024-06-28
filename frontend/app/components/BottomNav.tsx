import { Icon } from "@iconify/react/dist/iconify.js"
import { Link } from "@remix-run/react"
import { useEffect, useState } from "react";
import { AuthSession } from "~/utils/session";

export default function BottomNav() {
    const [username, setUsername] = useState('')
    useEffect(() => {
        const authSession = new AuthSession(window);
        setUsername(authSession.authData.username);
    }, [])

    return (
        <nav className="fixed inset-x-0 bottom-0 p-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around gap-4 w-full h-16">
            <Link className="flex flex-col items-center justify-center" to={`/home`}>
                <Icon icon="heroicons:home" className="w-6 h-6" />
                <span className="text-xs font-medium leading-none">Home</span>
            </Link>
            <Link className="flex flex-col items-center justify-center" to={`/explore`}>
                <Icon icon="teenyicons:compass-outline" className="w-6 h-6" />
                <span className="text-xs font-medium leading-none">Explore</span>
            </Link>
            <Link className="flex flex-col items-center justify-center" to={`/post`}>
                <Icon icon="heroicons:plus-16-solid" className="w-6 h-6" />
                <span className="text-xs font-medium leading-none">Post</span>
            </Link>
            <Link className="flex flex-col items-center justify-center" to={`/u/${username}`}>
                <Icon icon="heroicons:user-circle" className="w-6 h-6" />
                <span className="text-xs font-medium leading-none">Profile</span>
            </Link>
        </nav>
    )
}
