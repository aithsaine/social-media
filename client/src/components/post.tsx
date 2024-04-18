
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid"
import axios from "axios";
import { useEffect, useState } from "react";
import { EllipsisHorizontalIcon, ChatBubbleBottomCenterTextIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from "react-redux";
import api from "../tools/api";
import { Link } from "react-router-dom";
import VideoPlayer from "./videoPlayer";
import Comment from "./comment";
import { appendNewPost } from "../redux/actions/actionCreators";

export default function Post({ post }: any) {
    const dispatch = useDispatch()
    const { auth, isDarkMode } = useSelector((state: any) => state)
    const [lks, setLikes] = useState(post.likes)
    const [dsl, setDislikes] = useState(post.dislikes)
    const [reactType, setReactType] = useState(post.reaction)
    const [commentsCnt, setCommentsCnt] = useState(post.commentsCount)
    const submitHandler = async (e: any, type: String) => {
        e.preventDefault()
        const resp = await api.post("api/reaction/store", { type, user_id: auth.id, post_id: post.id })
        setLikes(resp.data.post.likes)
        setDislikes(resp.data.post.dislikes)
        setReactType(resp.data.post.reaction)
        dispatch(appendNewPost(resp.data.post))


    }
    const [load, setLoad] = useState(false)




    const [image, setImage] = useState("")
    // useEffect(() => {
    //     const getPict = async () => {

    //         const response = await api.get(`api/storage/picture/${post.user_picture}`, {
    //             responseType: 'blob',
    //         })
    //         if (response.status == 200) {

    //             const blobUrl = URL.createObjectURL(response.data);
    //             setImage(blobUrl)
    //         }

    //     }
    //     post.user_picture && getPict();

    // }, [])

    const videoExtensions = ["mp4", "mkv"]
    const imageExtensions = ["jpg", "png", "webp"]
    const fileExt = post.files[0] && post.files[0].split(".").slice(-1)
    return (
        <>

            <div style={{ minHeight: "20px" }}
                className={`w-full my-4 p-2 relative flex  flex-col items-start mt-4 rounded-xl ${isDarkMode ? "bg-slate-900 text-white shadow-md shadow-white" : "text-black bg-white shadow-xl"} lg:w-3/4`}>
                <Link to={`/user/${auth.id}`} className="flex items-center">
                    <img className="rounded-full object-cover h-10 w-10" src={post.user_picture} />
                    <div className="ml-2 flex flex-col items-start">
                        <div className={`leading-snug text-sm ${isDarkMode ? "text-white" : ""}  font-bold`}>{post.user_name?.toUpperCase()}</div>
                        <div className={`leading-snug text-xs ${isDarkMode ? "text-gray-400" : ""} `}>{post.date}</div>
                    </div>
                </Link>

                <button className={"right-0 absolute "}><EllipsisHorizontalIcon className={"w-10 h-6 font-bold   inline-block cursor-pointer"} /></button>
                <p className={"m-4"}>{post.title}</p>
                {
                    fileExt && videoExtensions.includes(fileExt[0]) ?

                        < VideoPlayer file={`http://localhost:8000/${post.files[0]}`} /> :
                        fileExt && imageExtensions.includes(fileExt[0]) ?
                            < img className={` w-full  border-2 `} src={`http://localhost:8000/storage/posts/${post.id}/${post.files[0]}`} /> : <></>}



                <div className={"m-4 flex items-center justify-between w-full"}>
                    <div>

                        <span className={"text-sm"}>{lks}</span>
                        <label title={"like"} onClick={e => submitHandler(e, "like")} htmlFor={"like"}><HandThumbUpIcon
                            className={`w-10 h-6 inline-block cursor-pointer transform transition duration-300 hover:scale-125 ${reactType == 'like' ? "text-green-800" : "text-green-100"}`} /></label>
                        <label title={"dislike"} onClick={e => submitHandler(e, "dislike")} htmlFor={"dislike"} ><HandThumbDownIcon
                            className={`w-10 h-6 inline-block cursor-pointer transform transition duration-300 hover:scale-125 ${reactType == "dislike" ? 'text-red-800' : "text-red-100"}`} /></label>
                        <span className={"text-sm"}>{dsl}</span>
                    </div>

                    <div className={"me-6 t text-sky-600"}>
                        <button className="flex space-x-2" onClick={e => setLoad(true)} title={"comments"}><span className={`${isDarkMode ? "text-white" : "text-black"} `}>{commentsCnt}</span><ChatBubbleBottomCenterTextIcon className={"bg-sk w-6"} /></button>  {/*"comments button"*/}
                        {load && (

                            <Comment setLoad={setLoad} commentsCnt={commentsCnt} setCommentsCnt={setCommentsCnt} user_id={auth.id} post_id={post.id} />
                        )}
                    </div>

                </div>

            </div>
        </>
    )
}
