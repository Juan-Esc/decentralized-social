import { Icon } from "@iconify/react/dist/iconify.js"
import { Card } from "./ui/card"
import { useState } from "react"
import { Link, useLocation, useNavigate, useNavigation } from "@remix-run/react"
import { PostImages } from "./PostImages"
import moment from "moment"
import { DesoService } from "~/utils/deso"

interface PostProps {
    source?: 'deso' | 'bsky'
    id?: string
    username?: string
    profileImg?: string
    text?: string
    dateNanos?: number
    likesCount?: number;
    liked?: boolean;
    commentsCount?: number
    imagesUrls?: string[]
}

export const Post = ({
    source = 'deso',
    id = "1",
    username = "Test User",
    text = "I really like this social media",
    dateNanos = 0,
    profileImg = "https://placehold.co/400",
    likesCount = 0,
    commentsCount = 0,
    imagesUrls = [],
    liked = false }: PostProps) => {

    let textShort = text;
    let textLongPart;
    const [isShowMore, setIsShowMore] = useState(false);
    const toggleReadMoreLess = (e: any) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event from bubbling up
        setIsShowMore(!isShowMore);
    };

    if (text.length > 256) {
        textShort = text.substring(0, 256);
        textLongPart = text.substring(256);
    }

    let postThreadUrl = `/p/${id}`;
    if (source === 'bsky') {
        postThreadUrl = `/p/${username}/${id}`
    }

    const [isLiked, setIsLiked] = useState(liked);
    const [likes, setLikes] = useState(likesCount);
    const location = useLocation();
    const navigate = useNavigate()

    return (
        <Card className="w-full max-w-full rounded-xl border-2 border-gray-200 dark:border-gray-800">
            <div className="flex p-4 w-full max-w-full">
                <Link to={postThreadUrl} >
                    <div className="flex-shrink-0 mr-4">
                        <Link to={`/u/${username}`}>
                            <img
                                alt="User avatar"
                                className="rounded-full"
                                height="48"
                                src={profileImg}
                                style={{
                                    aspectRatio: "48/48",
                                    objectFit: "cover",
                                }}
                                width="48"
                            />
                        </Link>
                    </div>
                </Link>
                <div className="flex flex-col min-h-0 text-sm w-full max-w-full break-words" style={{ wordWrap: "break-word" }}>
                        <div className="flex">
                            <Link to={`/u/${username}`}>
                                <div className="font-semibold">{username}</div>
                            </Link>
                            <div className="flex items-center gap-1 text-xs ml-auto dark:text-gray-300">
                                <span>{moment(new Date(dateNanos / 1000000)).fromNow()}</span>
                            </div>
                        </div>
                        <div className="flex-1 my-2 leading-relaxed break-words break-all whitespace-pre-wrap hover:cursor-pointer" style={{ wordWrap: "break-word" }} onClick={() => navigate(postThreadUrl)}>
                            <p>{textShort}{!isShowMore && text.length > 256 && "..."}{isShowMore && textLongPart}
                                {text.length > 256 && (<span className='cursor-pointer' onClick={toggleReadMoreLess}>{isShowMore ? " Read Less" : " Read More"}</span>)}
                            </p>
                            {!!imagesUrls && imagesUrls.length > 0 && <PostImages imagesUrls={imagesUrls} />}
                
                    </div>
                    <div className="flex gap-4 text-xs font-medium border-t border-gray-200 pt-4 dark:border-gray-800">
                        <div className="flex items-center gap-1.5"  >
                            {!isLiked &&
                                <Icon style={{ fontSize: "1.3rem" }} icon="heroicons:heart" onClick={() => { likePost(id, false, setIsLiked); setLikes(likes + 1) }} />
                            }
                            {!!isLiked &&
                                <Icon style={{ fontSize: "1.3rem" }} icon="heroicons:heart-solid" onClick={() => { likePost(id, true, setIsLiked); setLikes(likes - 1) }} />
                            }
                            <span>{likes} Likes</span>
                        </div>
                        <Link to={postThreadUrl} >
                        <div className="flex items-center gap-1.5">
                            <Icon style={{ fontSize: "1.2rem" }} icon="heroicons:chat-bubble-bottom-center" />
                            <span>{commentsCount} Comments</span>
                        </div>

                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    )
}

function likePost(postHashHex: string, liked: boolean, setIsLiked: any) {
    const desoService = new DesoService(window)
    const signedTx = desoService.likePost(postHashHex, liked)
    setIsLiked(!liked)
    return signedTx;
}