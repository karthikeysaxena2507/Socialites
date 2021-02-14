/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Navbar from "../helper/Navbar";
import Footer from "../helper/Footer";
import { useParams } from "react-router-dom";
import Post from "../helper/Post";
import Loader from "../helper/Loader";
import CategoryMenu from "../helper/CategoryMenu";
import Heading from "../helper/Heading";
import SearchBar from "../helper/SearchBar";
import { Container } from "react-bootstrap";
import { checkUser } from "../../api/userApis"
import { getFilteredPosts, addReactionToPost } from "../../api/postApis";

const CategoryPosts = () => {

    var [username, setUsername] = useState("");
    var { type } = useParams();
    var [posts,setPosts] = useState([]);
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");
    var [unread, setUnread] = useState(0);

    useEffect(() => {
        const fetch = async() => {
            try{
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else {
                    setUsername("Guest");
                }
                const filteredPosts = await getFilteredPosts(type);
                setPosts(filteredPosts);
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[guest, type]);

    const createPost = (props, index) => {

        const changepost = (event, post) => {
            if(username !== "Guest") {
                const drop = async() => {
                    try{
                        await addReactionToPost(event.target.name, post.name, post);
                        const filteredPosts = await getFilteredPosts(type);
                        setPosts(filteredPosts);
                    }
                    catch(error) {
                        console.log(error);
                    }
                }
                drop();
            }
            else {
                alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
            }
        }

        return <Post 
                key = {index}
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
                show_comments={true}
                imageUrl = {props.imageUrl}
                reactions = {props.reacts}
        />
    }

    if(loading) {
        return <Loader />
    }
    else {
        return (
        <div>
            <Navbar page = "home" unread = {unread}/>
            <Heading />
            <Container className="container text-center mt-3"> <h3 className="margin"> All Posts </h3> </Container>
            <CategoryMenu category_type = {type} message = "all" />
            <SearchBar type = {type} message = "all" />
            {posts.map(createPost)}
            <div className="space"></div>
            <Footer />
        </div>)
    }
}

export default CategoryPosts;