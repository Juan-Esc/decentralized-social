import { cn } from "~/lib/utils"
import { Button } from "./ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link, useLocation } from "@remix-run/react" // Import useLocation
import { useEffect, useState } from "react"
import { AuthSession } from "~/utils/session"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const [username, setUsername] = useState('')
  const location = useLocation(); // Use the useLocation hook

  useEffect(() => {
      const authSession = new AuthSession(window);
      setUsername(authSession.authData.username);
  }, [])
  
  // Function to determine button variant
  const getButtonVariant = (path: string) => location.pathname === path ? "secondary" : "ghost";

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h1 className="mb-2 px-4 text-2xl font-bold tracking-tight">
            DSocial
          </h1>
          <div className="space-y-1">
            <Button variant={getButtonVariant('/home')} className="w-full justify-start" asChild>
              <Link to={'/home'} >
                <Icon icon="heroicons:home-solid" className="mr-1" />
                Home
              </Link>
            </Button>
            <Button variant={getButtonVariant('/explore')} className="w-full justify-start" asChild >
              <Link to={'/explore'} >
                <Icon icon="teenyicons:compass-outline" className="mr-1" />
                Explore
              </Link>
            </Button>
            <Button variant={getButtonVariant('/post')} className="w-full justify-start" asChild >
              <Link to={`/post`} >
                <Icon icon="heroicons:plus-16-solid" className="mr-1" />
                Post
              </Link>
            </Button>
            <Button variant={getButtonVariant(`/u/${username}`)} className="w-full justify-start" asChild >
              <Link to={`/u/${username}`} >
                <Icon icon="heroicons:user-20-solid" className="mr-1"/>
                Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div >
  )
}