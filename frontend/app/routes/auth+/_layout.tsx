import { Link, Outlet } from "@remix-run/react";
import { ThemeToggle } from "../resources.theme-toggle";

export default function Layout() {
    return (
        <section className="w-full min-h-dvh flex flex-col">
            <nav className="flex items-center justify-between p-4 w-full">
                <Link to="/" className="flex items-center space-x-2">
                    <h1 className="text-xl font-semibold">DSocial</h1>
                </Link>
                {/*<ThemeToggle />*/}
            </nav>

            <div className="flex items-center justify-center flex-1 w-full">
                <Outlet />
            </div>
        </section>
    )
}