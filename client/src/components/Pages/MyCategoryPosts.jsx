/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Navbar from "../helper/Navbar";
import Footer from "../helper/Footer";
import { useParams } from "react-router-dom";
import Post from "../helper/Post";
import trash from "../../images/trash.png";
import edit from "../../images/edit.png";
import CategoryMenu from "../helper/CategoryMenu";
import Heading from "../helper/Heading";
import SearchBar from "../helper/SearchBar";
import Loader from "../helper/Loader";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis";
import { getPostsByUser, addReactionToPost, deletePost } from "../../api/postApis";
var sound = new Howl({src: [music]});

const MyCategoryPosts = () => {

    var [username, setUsername] = useState("");
    var { type } = useParams();
    var [posts,setPosts] = useState([]);
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");
    var [unread, setUnread] = useState(0);

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                    const postsData = await getPostsByUser(user.username);
                    setPosts(postsData.filter((post) => {
                        return (post.category === type);
                    }));
                }
                else {
                    setUsername("Guest");
                }
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[guest, type, username]);

    const MyPost = (props, index) => {

        const changepost = (event, post) => {
            const drop = async() => {
                try {
                    await addReactionToPost(event.target.name, post.name, post);
                    const postsData = await getPostsByUser(post.name);
                    setPosts(postsData.filter((post) => {
                        return (post.category === type);
                    }));
                }   
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }

        const remove = () => {
            sound.play();
            const del = async() => {
                try {
                    await deletePost(props._id);
                    window.location = `/myposts`;
                }
                catch(error) {
                    console.log(error);
                }
            }
            del();
        }

        const update = () => {
            sound.play();
            window.location = `/edit/${props._id}`;
        }

        return (<div className="container" key ={index}>
         <Post 
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
                change = {changepost}
                show_comments = {true}
                imageUrl = {props.imageUrl}
                reactions = {props.reacts}
        />
        <div className="post-options text-center">
            <img src={trash} onClick={remove} className="expand one"/>
            <img src={edit} onClick={update} className="expand"/>
        </div>
    </div>);
    }

    if(loading) {
        return <Loader />
    }
    else {
        return (<div>
            <Navbar name={username} page = "myposts" unread = {unread}/>
            <Heading />
            <div className="text-center"> <h3 className="margin"> My Posts </h3> </div>
            <CategoryMenu category_type = {type} message = "my" />
            <SearchBar type = {type} message = "personal"/>
            {posts.map(MyPost)}
            <div className="space"></div>
            <Footer />
            </div>
        );
    }
}

export default MyCategoryPosts;