/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useContext } from "react";
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
import { MessageContext } from "../../utils/Context";

const CategoryPosts = () => {

    const [username, setUsername] = useState("");
    const { type } = useParams();
    const [posts,setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const guest = localStorage.getItem("Guest");
    const [unread, setUnread] = useState(0);
    const guestMessage = useContext(MessageContext);

    useEffect(() => {
        const fetch = async() => {
            try{
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else setUsername("Guest");
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

    const createPost = (props) => {

        const addReaction = async(e, post) => {
            try {
                await addReactionToPost(e.target.name, post.name, post);
                const filteredPosts = await getFilteredPosts(type);
                setPosts(filteredPosts);
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
        <Navbar page = "home" unread = {unread}/>
        <Heading />
        <Container className="container text-center mt-3"> <h3 className="margin"> All Posts </h3> </Container>
        <CategoryMenu category_type = {type} message = "all" />
        <SearchBar type = {type} message = "all" />
        {posts.map(createPost)}
        <Footer />
    </div>
}

export default CategoryPosts;