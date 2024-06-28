import { Skeleton } from "./ui/skeleton"

export const ProfileSkeleton = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-dvh py-2">
            <div className="flex flex-col w-full px-4 py-6 shadow-md rounded-lg">
                <div className="flex flex-col items-center justify-center mb-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <br />
                    <Skeleton className="h-10 w-[50%]" />
                </div>
                <div className="mb-4 leading-relaxed break-words break-all whitespace-pre-wrap">
                    <Skeleton className="h-16 w-full" />
                </div>
                <div>
                    <div className="space-y-2">
                        <Skeleton className="h-[50vh] w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}