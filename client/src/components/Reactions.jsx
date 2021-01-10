/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar"; 
import liked from "./images/like.png"
import loved from "./images/love.png";
import laughed from "./images/laugh.png";
import axios from "axios";
import search from "./images/search.png";
import Footer from "./Footer";
import Post from "./Post";
import Heading from "./Heading";
import Fuse from "fuse.js";
import InvalidUser from "./InvalidUser";
import { set } from "mongoose";

const Reactions = () => {

    var username = localStorage.getItem("username");
    var { id } = useParams();
    var [like,setlike] = useState(false);
    var [love,setlove] = useState(false);
    var [laugh,setlaugh] = useState(false);
    var [searchContent,setsearchContent] = useState("");
    var [reactions,setreactions] = useState([]);
    var [allreactions,setallreactions] = useState([]);
    var [tempreactions,settempreactions] = useState([]);
    var [message, setMessage] = useState("");
    var [post,setPost] = useState({author:"", title:"", content:"", comments:[], comment_count:0, like:0, love:0, laugh:0, imageUrl:""});

    useEffect(() => {
        const fetch = async() => {
            try {
                const response = await axios.get(`/posts/${id}`);
                console.log(response.data[0].reacts.reverse());
                setallreactions(response.data[0].reacts.reverse());
                setreactions(response.data[0].reacts.reverse());
                settempreactions(response.data[0].reacts.reverse());
                setPost(response.data[0]);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[id]);

    const changeLike = () => {
        if(!like) {
            setlike(true);    
            setlove(false);
            setlaugh(false);
            setreactions(allreactions.filter((reaction) => {
                return (reaction.type === "like");
            }));
            settempreactions(allreactions.filter((reaction) => {
                return (reaction.type === "like");
            }));
            setMessage("Showing All Users Who Liked");
        }
    }
    const changeLove = () => {
        if(!love) {
            setlike(false);    
            setlove(true);
            setlaugh(false);
            setreactions(allreactions.filter((reaction) => {
                return (reaction.type === "love");
            }));
            settempreactions(allreactions.filter((reaction) => {
                return (reaction.type === "love");
            }));
            setMessage("Showing All Users Who Loved");
        }
    }
    const changeLaugh = () => {
        if(!laugh) {
            setlike(false);    
            setlove(false);
            setlaugh(true);
            setreactions(allreactions.filter((reaction) => {
                return (reaction.type === "laugh");
            }));
            settempreactions(allreactions.filter((reaction) => {
                return (reaction.type === "laugh");
            }));
            setMessage("Showing All Users Who Laughed");
        }
    }

    const changeAll = () => {
        setlike(false);    
        setlove(false);
        setlaugh(false);
        setreactions(allreactions);
        settempreactions(allreactions);
        setMessage("Showing All Users Who Reacted");
    }

    const change = (event) => {
        setsearchContent(event.target.value);
    }

    const renderUsers = (props, index) => {

        if(props.name !== undefined) {
            return (<div className="container user" key={index}>
            <li className="profile"> {props.name} </li>
        </div>);
        }
        else {
            return (<div className="container user" key={index}>
            <li className="profile"> {props.item.name} </li>
        </div>);
        }
    }

    const searchIt = (event) => {
        event.preventDefault();
        if(searchContent === "") {
            setMessage("Showing All Users in this Category");
            setreactions(tempreactions);
        }
        else {
            setMessage(`Showing Search results for: ${searchContent}` )
            const fuse = new Fuse(tempreactions, {
                keys: ["name"],
                includeScore: true,
                includeMatches: true
            });
            const result = fuse.search(searchContent);
            setreactions(result);
        }
    }

    const changepost = (event, post) => {
        const drop = async() => {
            try {
                const res = await axios.post(`/posts/update/${event.target.name}/${post.name}`, post);
                console.log(res.data);
                const response = await axios.get(`/posts/${id}`);
                console.log(response.data[0].reacts.reverse());
                setallreactions(response.data[0].reacts.reverse());
                setreactions(response.data[0].reacts.reverse());
                settempreactions(response.data[0].reacts.reverse());
                setPost(response.data[0]);
                setlike(false);
                setlove(false);
                setlaugh(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        drop();
    }

    var style1 = (like) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}
    var style2 = (love) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}
    var style3 = (laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}
    var style4 = (!like && !love && !laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"} 

    const Check = () => {
        if(username === null) {
            return (
                <InvalidUser />
            )
        }
        else {
            return(<div>
                <Navbar page="reactions"/>
                <Heading />
                <h4 className="margin text-center"> Hello {username} </h4>
                <div className="container">
                    <Post 
                            key = {post._id}
                            name = {username}
                            _id = {post._id}
                            author = {post.author}
                            title = {post.title}
                            content = {post.content}
                            category = {post.category}
                            like = {post.like}
                            love = {post.love}
                            laugh = {post.laugh}
                            comment_count = {post.comments.length}
                            change = {changepost}
                            show_comments = {true}
                            imageUrl = {post.imageUrl}
                    />
                    <div className="text-center">
                        <h2 className="margin"> Users who Reacted: </h2>
                        <div>
                            <button className="btn expand margin one allbtn" onClick={changeAll} style={style4}> All </button> 
                            <button className="btn expand margin one" onClick={changeLike} style={style1}> <img src={liked} name="like" className="expand"/> </button> 
                            <button className="btn expand margin one" onClick={changeLove} style={style2}> <img src={loved} name="love" className="expand"/> </button> 
                            <button className="btn expand margin one" onClick={changeLaugh} style={style3}> <img src={laughed} name="laugh" className="expand"/> </button> 
                        </div>
                        <div>
                            <input type="text" value={searchContent} onKeyPress={(e) => e.key === "Enter" ? searchIt(e) : null} onChange={change} className="width" placeholder="Search" autoComplete="off"/>
                            <button className="btn expand" onClick={searchIt}> <img src={search} /> </button>
                        </div>
                    </div>    
                </div>
                <div className="margin text-center">
                    <p className="margin"> {message} </p>
                </div>
                <div className="margin">
                    {reactions.map(renderUsers)}    
                </div>
                <div className="space"></div>
                <Footer />
            </div>);
        }
    }

    return <Check />;
}

export default Reactions;
