import { Outlet } from "@remix-run/react";
import BottomNav from "~/components/BottomNav";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { RightSidebar } from "~/components/RightSidebar";
import { Sidebar } from "~/components/Sidebar";

export default function Index() {
    return (
        <>
            <div className="md:hidden">
                {/*<image
                    src=""
                    width={1280}
                    height={1114}
                    alt="Music"
                    className="block dark:hidden"
                />
                <image
                    src=""
                    width={1280}
                    height={1114}
                    alt="Music"
                    className="hidden dark:block"
    />*/}
            </div>
            <div className="hidden md:block mx-auto" style={{ maxWidth: '1200px' }}>
                <div className="bg-background">
                    <div className="grid lg:grid-cols-5">
                        <Sidebar className="hidden lg:block" />
                        <div className="col-span-3 lg:col-span-3 lg:border-l">
                            <div className="h-full px-4 py-6 lg:px-8">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:hidden">
                <Outlet />
                <BottomNav />
            </div>
        </>
    )
}