/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../helper/Navbar";
import Post from "../helper/Post";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import Fuse from "fuse.js";
import Loader from "../helper/Loader";
import { checkUser } from "../../api/userApis";
import { MessageContext } from "../../utils/Context";
import { getAllPosts, getPostsByUser, addReactionToPost } from "../../api/postApis";

const Result = () => {

    const [username, setUsername] = useState("");
    const { searchContent,message,type } = useParams();
    const [foundPosts,setfoundPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const guest = localStorage.getItem("Guest");
    const [unread, setUnread] = useState(0);
    const guestMessage = useContext(MessageContext);

    useEffect(() => {
        if(message === "all") {
            const fetch = async() => {
                try {
                    if(guest !== "true") {
                        const user = await checkUser();
                        (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                    }
                    else setUsername("Guest");
                    const postsData = await getAllPosts();
                    setLoading(false);
                    const fuse = new Fuse(postsData, {
                        keys: ['author', 'title', 'content'],
                        includeScore: true,
                        includeMatches: true
                    });
                    const results = fuse.search(searchContent);
                    setfoundPosts(results);
                    (type !== "none") && (setfoundPosts(results.filter((post) => {return (post.item.category === type)})))
                }
                catch(error) {
                    console.log(error);
                }
            }
            fetch();
        }
        else if(message === "personal") {
            const fetch = async() => {
                try {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username);
                    const postsData = await getPostsByUser(user.username);
                    setLoading(false);
                    const fuse = new Fuse(postsData, {
                        keys: ['author', 'title', 'content'],
                        includeScore: true,
                        includeMatches: true
                    });
                    const results = fuse.search(searchContent);
                    setfoundPosts(results.reverse());
                    (type !== "none") (setfoundPosts(results.filter((post) => {return (post.item.category === type)})))
                }
                catch(error) {
                    console.log(error);
                }
            }
            fetch();
        }
    },[guest, message, searchContent, type, username]);

    const createPost = (props, index) => {

        const addReaction = async(event, post) => {
            try {
                await addReactionToPost(event.target.name, post.name, post);
                let response;
                (message === "all") ? response = await getAllPosts() : response = await getPostsByUser(username)
                const fuse = new Fuse(response, {
                    keys: ['author', 'title', 'content'],
                    includeScore: true,
                    includeMatches: true
                });
                const results = fuse.search(searchContent);
                setfoundPosts(results);
                (type !== "none") && (setfoundPosts(results.filter((post) => {return (post.item.category === type)})))
            }
            catch(error) {
                console.log(error);
            }
        }

        return <Post 
            key = {index}
            name = {username}
            _id = {props.item._id}
            author = {props.item.author}
            title = {props.item.title}
            content = {props.item.content}
            category = {props.item.category}
            like = {props.item.like}
            love = {props.item.love}
            laugh = {props.item.laugh}
            comment_count = {props.item.comment_count}
            change = {(e, post) => (username !== "Guest") ? addReaction(e, post) : alert(guestMessage)}
            show_comments = {true}
            imageUrl = {props.item.imageUrl}
            reactions = {props.item.reacts}
        />
    }

    (loading) ? <Loader /> :
    <div>
        <Navbar name={username} page = "result" unread = {unread}/>
        <Heading />
        <div className="text-center"> <h2 className="margin"> Search Results </h2> </div>
        {foundPosts.reverse().map(createPost)}
        <Footer />
    </div>
}

export default Result;


