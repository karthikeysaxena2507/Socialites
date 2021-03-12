/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Post from "../helper/Post";
import Navbar from "../helper/Navbar";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import Loader from "../helper/Loader";
import Comment from "../helper/Comment";
import { checkUser } from "../../api/userApis";
import { MessageContext } from "../../utils/Context";
import { getPostById, addReactionToPost, addReactionToComment, deleteComment } from "../../api/postApis";

const CompletePost = () => {
    
    const [username, setUsername] = useState("");
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const guest = localStorage.getItem("Guest");
    const [post,setPost] = useState({});
    const [unread, setUnread] = useState(0);
    const guestMessage = useContext(MessageContext);

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else setUsername("Guest");
                const postData = await getPostById(id);
                setPost(postData);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetch();
    },[guest, id]);

    const addReaction = async(e, post) => {
        try {
            await addReactionToPost(e.target.name, post.name, post);
            const postData = await getPostById(id);
            setPost(postData);
        }
        catch(error) {
            console.log(error);
        }
    }

    const printComments = (props) => {

        const reactToComment = async(e) => {
            try {
                await addReactionToComment(e.target.name, id, username, props);
                const postData = await getPostById(id);
                setPost(postData);
            }
            catch(error) {
                console.log(error);
            }
        }

        const removeComment = async() => {
            try {
                await deleteComment(id, props, username);
                const postData = await getPostById(id);
                setPost(postData);
            }
            catch(error) {
                console.log(error);
            }
        }

        return <Comment
            key = {props._id}
            _id = {props._id}
            id = {id}
            username = {username}
            content = {props.content}
            name = {props.name}
            reacts = {props.reacts}
            likes = {props.likes}
            loves = {props.loves}
            laughs = {props.laughs}
            remove = {removeComment}
            guestMessage = {guestMessage}
            change = {(e) => (username !== "Guest") ? reactToComment(e) : alert(guestMessage)}
        />

    }

    return (loading) ? <Loader /> :
    <div className="container">
        <Navbar name={username} page = "complete" unread = {unread}/>
        <Heading />
        <Post 
            key = {id}
            name = {username}
            _id = {id}
            author = {post.author}
            title = {post.title}
            content = {post.content}
            category = {post.category}
            like = {post.like}
            love = {post.love}
            laugh = {post.laugh}
            comment_count = {post.comments.length}
            change = {(e, post) => (username !== "Guest") ? addReaction(e, post) : alert(guestMessage)}
            show_comments = {false}
            imageUrl = {post.imageUrl}
            reactions = {post.reacts}
        />
        <h3 className="margin text-center"> Comments </h3>
        {post.comments.map(printComments)}
        <Footer />
    </div>
}

export default CompletePost;