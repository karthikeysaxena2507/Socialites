/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useContext } from "react";
import Navbar from "../helper/Navbar";
import Post from "../helper/Post";
import Footer from "../helper/Footer";
import CategoryMenu from "../helper/CategoryMenu";
import Heading from "../helper/Heading";
import SearchBar from "../helper/SearchBar";
import Loader from "../helper/Loader";
import { checkUser } from "../../api/userApis"
import { MessageContext } from "../../utils/Context";
import { getAllPosts, addReactionToPost,  } from "../../api/postApis";

const Posts = () => {

    const [username, setUsername] = useState("");
    const [posts,setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const guest = localStorage.getItem("Guest");
    const [unread, setUnread] = useState(0);
    const guestMessage = useContext(MessageContext);

    useEffect(() => {
        const fetch = async () => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else setUsername("Guest");
                const postsData = await getAllPosts();
                setPosts(postsData);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetch(); 
    },[guest]);

    const createPost = (props) => {

        const addReaction = async(event, post) => {
            try {
                await addReactionToPost(event.target.name, post.name, post);
                const postsData = await getAllPosts();
                setPosts(postsData);
            }
            catch(error) {
                console.log(error);
            }
        }

        return <Post 
            key = {props._id}
            name = {username}
            _id = {props._id}
            author = {props.author}
            title = {props.title}
            content = {props.content}
            category = {props.category}
            like = {props.like}
            love = {props.love}
            laugh = {props.laugh}
            comment_count = {props.comment_count}
            change = {(e, post) => (username !== "Guest") ? addReaction(e, post) : alert(guestMessage)}
            show_comments={true}
            imageUrl = {props.imageUrl}
            reactions = {props.reacts}
        />
    }

    return (loading) ? <Loader /> :
    <div>
        <Navbar name={username} page = "home" unread = {unread}/>
        <Heading />
        <div className="text-center"> <h3 className="margin"> All Posts </h3> </div>
        <CategoryMenu category_type = "Select Category" message = "all" />
        <SearchBar message = "all" type = "none" />
        {posts.map(createPost)}
        <Footer />
    </div>
}

export default Posts;