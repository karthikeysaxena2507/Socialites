/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../helper/Navbar"; 
import liked from "../../images/like.png"
import loved from "../../images/love.png";
import laughed from "../../images/laugh.png";
import search from "../../images/search.png";
import Footer from "../helper/Footer";
import Post from "../helper/Post";
import Heading from "../helper/Heading";
import Fuse from "fuse.js";
import Loader from "../helper/Loader";
import User from "../helper/User";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis"
import { MessageContext } from "../../utils/Context";
import { getPostById, addReactionToPost } from "../../api/postApis";
var sound = new Howl({src: [music]});

const Reactions = () => {

    var [username, setUsername] = useState("");
    var { id } = useParams();
    var [like,setlike] = useState(false);
    var [love,setlove] = useState(false);
    var [laugh,setlaugh] = useState(false);
    var [searchContent,setsearchContent] = useState("");
    var [reactions,setreactions] = useState([]);
    var [allreactions,setallreactions] = useState([]);
    var [tempreactions,settempreactions] = useState([]);
    var [message, setMessage] = useState("");
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");
    var [post,setPost] = useState({});
    var [unread, setUnread] = useState(0);
    const guestMessage = useContext(MessageContext);

    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else {
                    setUsername("Guest");
                }
                const postData = await getPostById(id);
                setallreactions(postData.reacts.reverse());
                setreactions(postData.reacts.reverse());
                settempreactions(postData.reacts.reverse());
                setPost(postData);
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[guest, id]);

    const changeLike = () => {
        sound.play();
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
        sound.play();
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
        sound.play();
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
        sound.play();
        setlike(false);    
        setlove(false);
        setlaugh(false);
        setreactions(allreactions);
        settempreactions(allreactions);
        setMessage("Showing All Users Who Reacted");
    }

    const renderUsers = (props, index) => {

        if(props.name !== undefined) {
            return <User
                    key={index}
                    user1={username}
                    user2={props.name}
                    unreadCount={-1}
            />                     
        }
        else {
            return <User
                    key={index}
                    user1={username}
                    user2={props.item.name}
                    unreadCount={-1}
            />                     
        }
    }

    const searchIt = (event) => {
        sound.play();
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
        if(username === "Guest") {
            alert(guestMessage);
        }
        else {
            const drop = async() => {
                try {
                    await addReactionToPost(event.target.name, post.name, post);
                    const postData = await getPostById(id);
                    setallreactions(postData.reacts.reverse());
                    setreactions(postData.reacts.reverse());
                    settempreactions(postData.reacts.reverse());
                    setPost(postData);
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
    }

    if(loading) {
        return <Loader />
    }
    else {
        return(<div>
            <Navbar name={username} page="reactions" unread = {unread}/>
            <Heading />
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
                        reactions = {post.reacts}
                />
                <div className="text-center">
                    <h2 className="margin"> Users who Reacted: </h2>
                    <div>
                        <button className="expand mb-3 mt-3 mr-3 allbtn" onClick={changeAll} style={(!like && !love && !laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> All </button> 
                        <button className="expand mb-3 mt-3 mr-3" onClick={changeLike} style={(like) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> <img src={liked} name="like" className="expand"/> </button> 
                        <button className="expand mb-3 mt-3 mr-3" onClick={changeLove} style={(love) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> <img src={loved} name="love" className="expand"/> </button> 
                        <button className="expand mb-3 mt-3 mr-3" onClick={changeLaugh} style={(laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}}> <img src={laughed} name="laugh" className="expand"/> </button> 
                    </div>
                    <div>
                        <input type="text" value={searchContent} onKeyPress={(e) => e.key === "Enter" ? searchIt(e) : null} onChange={(e) => setsearchContent(e.target.value)} className="width" placeholder="Search" autoComplete="off"/>
                        <button className="btn expand" onClick={searchIt}> <img src={search} /> </button>
                    </div>
                </div>    
            </div>
            <div className="mt-2 text-center">
                 {message} 
            </div>
            <div className="mt-4">
                {reactions.map(renderUsers)}    
            </div>
            <div className="space"></div>
            <Footer />
        </div>);
    }
}

export default Reactions;
