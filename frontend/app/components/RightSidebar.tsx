import { cn } from "~/lib/utils"
import { Button } from "./ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"

interface RightSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RightSidebar({ className }: RightSidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h1 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Trending now
          </h1>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
                <Icon icon="heroicons:home" />
               Home
            </Button>
            <Button variant="ghost" className="w-full justify-start">
            <Icon icon="heroicons:user" />
               Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}