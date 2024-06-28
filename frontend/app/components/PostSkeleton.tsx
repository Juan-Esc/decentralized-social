import { Skeleton } from "./ui/skeleton"

export const PostSkeleton = () => {
    return (
        <div className="flex flex-col space-y-3">
        <Skeleton className="h-[20vh] w-[100%] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[50%]" />
          <Skeleton className="h-4 w-[50%]" />
        </div>
      </div>
    )
}