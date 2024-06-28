import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { CardContent } from "./ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"

interface PostImagesProps {
    imagesUrls?: string[]
}

export const PostImages = ({ imagesUrls = [] }: PostImagesProps) => {
    return (
        <>
            {imagesUrls.length > 1 && (
                <Carousel className="max-w-[80%]">
                    <CarouselContent className=" p-6" >
                        {imagesUrls.map((imageUrl: string, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <img src={imageUrl} alt="Image" className="rounded-md object-cover" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            )}
            {imagesUrls.length == 1 && (
                <div className="p-1 max-w-[80%]">
                    <img src={imagesUrls[0]} alt="Image" className="rounded-md object-cover" />
                </div>
            )}
        </>
    )
}