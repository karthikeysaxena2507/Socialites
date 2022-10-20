/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { Pie } from "react-chartjs-2";
import { Howl } from "howler";
import Navbar from "../helper/Navbar";
import { ProgressBar } from "react-bootstrap";
import axios from "axios";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import like from "../../images/like.png";
import love from "../../images/love.png";
import laugh from "../../images/laugh.png";
import trash from "../../images/trash.png";
import editIcon from "../../images/edit.png";
import Post from "../helper/Post";
import blank from "../../images/blank.png";
import Loader from "../helper/Loader";
import music from "../../sounds/button.mp3";
import { checkUser, getUserData, updateUserBio, updateUserImage } from "../../api/userApis"
import { getPostsByUser, addReactionToPost, deletePost } from "../../api/postApis";
import { createChat } from "../../api/roomApis";
import { MessageContext } from "../../utils/Context";
var sound = new Howl({src: [music]});

let Profile = () => {

    let [username, setUsername] = useState("");
    let [imageUrl, setImageUrl] = useState("");
    let [data, setData] = useState([]);
    let [posts, setPosts] = useState([]);
    let [postCount, setPostCount] = useState(0);
    let [likes, setLikes] = useState(0);
    let [loves, setLoves] = useState(0);
    let [laughs, setLaughs] = useState(0);
    let [comments, setComments] = useState(0);
    let [message, setMessage] = useState("");
    let [state, setState] = useState("Hide");
    let [about, setAbout] = useState("");
    let [edit, setEdit] = useState("Edit");
    let [text, setText] = useState("");
    let [show, setShow] = useState(false);
    let [loading, setLoading] = useState(true);
    let [unread, setUnread] = useState(0);
    let [percentage, setPercentage] = useState(0);
    let guestMessage = useContext(MessageContext);
    let guest = localStorage.getItem("Guest");
    let { user } = useParams();
    let chartData = {
        labels: ["Likes", "Loves", "Laughs", "Comments", "Reactions"],
            datasets: [
                {
                    backgroundColor: ['#B21F00','#C9DE00','#2FDE00','#00A6B4','#6800B4'],
                    hoverBackgroundColor: ['#501800','#4B5000','#175000','#003350','#35014F'],
                    data: data
                }
            ]
    }
    
    useEffect(() => {
        let fetch = async() => {
            try {
                if(guest !== "true") {
                    let response = await checkUser();
                    (response === "INVALID") ? window.location = "/login" : setUsername(response.username); setUnread(response.totalUnread);;
                }
                else setUsername("Guest")
                let userData = await getUserData(user);
                setImageUrl(userData.imageUrl);
                setAbout(userData.about);
                setText(userData.about);
                let postData = await getPostsByUser(user);
                setPostCount(postData.length);
                setPosts(postData.reverse());
                let cmct = 0, lkct = 0, lvct = 0, lgct = 0;
                for(let post of postData) {
                    cmct+=post.comment_count;
                    lkct+=post.like;
                    lvct+=post.love;
                    lgct+=post.laugh;
                }
                setData((data) => {return [...data, lkct, lvct, lgct, cmct, lkct + lvct + lgct]});
                setLikes(lkct);
                setLoves(lvct);
                setLaughs(lgct);
                setComments(cmct);
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[guest, user]);

    let MyPost = (props) => {
        
        let addReaction = async(event, post) => {
            try {
                await addReactionToPost(event.target.name, post.name, post);
                let postData = await getPostsByUser(user);
                setPosts(postData);
                let cmct = 0, lkct = 0, lvct = 0, lgct = 0;
                for(let post of postData) {
                    cmct+=post.comment_count;
                    lkct+=post.like;
                    lvct+=post.love;
                    lgct+=post.laugh;
                }
                setData((data) => {return [...data, lkct, lvct, lgct, cmct, lkct + lvct + lgct]});
                setLikes(lkct);
                setLoves(lvct);
                setLaughs(lgct);
                setComments(cmct);
            }
            catch(error) {
                console.log(error);
            }
        }

        let remove = async() => {
            try {
                sound.play();
                await deletePost(props._id, username);
                let postData = await getPostsByUser(user);
                setPosts(postData);
                let cmct = 0, lkct = 0, lvct = 0, lgct = 0;
                for(let post of postData) {
                    cmct+=post.comment_count;
                    lkct+=post.like;
                    lvct+=post.love;
                    lgct+=post.laugh;
                }
                setData((data) => {return [...data, lkct, lvct, lgct, cmct, lkct + lvct + lgct]});
                setLikes(lkct);
                setLoves(lvct);
                setLaughs(lgct);
                setComments(cmct);
            }
            catch(error) {
                console.log(error);
            }
        }

        return (<div className="container" key ={props._id}>
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
            change = {(e, post) => (username !== "Guest") ? addReaction(e, post) : alert(guestMessage)}
            show_comments = {true}
            imageUrl = {props.imageUrl}
            reactions = {props.reacts}
        />
        <div style={ (user !== username) ? {visibility: "hidden"} : null } className="post-options text-center">
            <img src={trash} onClick={remove} className="expand one"/>
            <img src={editIcon} onClick={() => {sound.play(); window.location = `/edit/${props._id}`}} className="expand"/>
        </div>
    </div>);
    }

    let createRoom = async() => {
        try {
            var room = (username < user) ? (username + "-" + user) : (user + "-" + username);
            await createChat(room, username, user);
            window.location = `/room/${room}`;
        }
        catch(error) {
            console.log(error);
        }
    }

    let changeState = () => {
        sound.play();
        (state === "Show") ? setState("Hide") : setState("Show")
    }

    let changeEdit = () => {
        sound.play();
        (edit === "Edit") ? setEdit("Back") : setEdit("Edit")
    }

    let updateBio = async() => {
        try {
            let userData = await updateUserBio(user, text);
            setAbout(userData);
            setEdit("Edit");
        }
        catch(error) {
            console.log(error);
        }
    }

    let handleFileInputChange = (e) => {
        sound.play();
        let file = e.target.files[0];
        let reader = new FileReader();
        setMessage("Profile Pic Preview, Click on save to update profile pic");
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImageUrl(reader.result);
        }
        setShow(true);
    }

    let handleSubmitFile = (e) => {
        e.preventDefault();
        sound.play();
        uploadImage(imageUrl);
    }

    let uploadImage = async (imageSource) => {
        try {
            setMessage("Updating Profile Pic");
            let body = JSON.stringify({
                data: imageSource,
                user: user
            });
            let options = {
                onUploadProgress: (ProgressEvent) => {
                    let { loaded, total } = ProgressEvent;
                    let percent = Math.floor( (loaded * 100) / total );
                    if(percent <= 100) {
                        setPercentage(percent-1);
                    }
                },
                headers: {"Content-type": "application/json"}
            }
            updateUserImage(body, options)
            .then(() => {
                setMessage("Profile Pic Updated")
                setPercentage(0);
                setShow(false);
            });
        }
        catch(error) {
            console.log(error);
        }
    }

    let removeImage = async() => {
        try {
            setMessage("Removing Profile Pic");
            let body = JSON.stringify({
                data: "",
                user: user
            });
            let options = {
                onUploadProgress: (ProgressEvent) => {
                    let { loaded, total } = ProgressEvent;
                    let percent = Math.floor( (loaded * 100) / total );
                    if(percent <= 100) {
                        setPercentage(percent-1);
                    }
                },
                headers: {"Content-type": "application/json"}
            }
            axios.post("/users/updateimage", body, options)
            .then(() => {
                setTimeout(() => {
                    setMessage("Profile Pic Removed");
                    setImageUrl("");
                    setPercentage(0);
                    setShow(false);
                }, 500);
            });
        }
        catch(error) {
            console.log(error);
        }
    } 

    return (loading) ? <Loader /> :
    <div>
    <Navbar name={username} page = "profile" unread = {unread}/>
    <Heading />
    {loading}
    <div className="text-center"> <h3 className="margin"> {user}'s Profile </h3> </div>
        <div className="mt-5 container">
            <div className="row">
                <div className="col-md-6">
                    <div className="margin text-center" style={imageUrl === "" ? {display: "none"} : null}>
                        <img src={imageUrl} className="profile-pic" alt="image not found"/>
                    </div>
                    <div className="margin text-center" style={imageUrl !== "" ? {display: "none"} : null}>
                        <img src={blank} className="profile-pic" alt="image not found"/>
                    </div>
                    <div className="mt-2">
                    { (percentage > 0) && <ProgressBar striped animated now={percentage} label={`${percentage}%`} />}
                    </div>
                    <div className="mt-2 mb-2 text-center"> {message} </div>
                    <form onSubmit={(e) => (username !== "Guest") ? handleSubmitFile(e) : alert(guestMessage)}>
                    <div className="text-center">
                        <div> <button style={ (!show) ? {display: "none"} : null } className="btn mt-1 expand"> Save </button> </div>
                        <div style={(username !== user) ? {display: "none"} : null}>
                            <label for="file"> 
                                <span className="btn expand"> Select Image </span>
                            </label>
                            <span className="text-center margin">
                                <span
                                    className="btn expand" 
                                    onClick={() => (username !== "Guest") ? (sound.play(), removeImage()) : (sound.play(), alert(guestMessage))}> 
                                    Remove Image 
                                </span> 
                            </span>
                        </div>
                    </div>
                        <input
                            type="file" 
                            name="image" 
                            style={{visibility: "hidden"}}
                            id="file"
                            onChange={handleFileInputChange}
                        />
                    </form>
                </div>
                <div className="col-md-6 text-left pl-5 pr-5 userinfo">
                    <h4 className="text-center"> About {user} </h4>
                    <div className="bio" style={(edit === "Back") ? {display: "none"} : null}> 
                        {about} 
                    </div>
                    <textarea 
                        className="bio-text" 
                        style={(edit === "Edit") ? {display: "none"} : null}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="text-center mt-3">
                        <button 
                            style={ (user === username) ? {display: "none"} : null } 
                            onClick={() => (username === "Guest") ? (sound.play(), alert(guestMessage)) : (sound.play(), createRoom())} 
                            className="btn mt-1 expand"> 
                            Message {user} 
                        </button>
                        <button 
                            style={ (user !== username) ? {display: "none"} : null } 
                            onClick={changeEdit} 
                            className="btn mt-1 expand"> 
                            {edit} 
                        </button>
                        <button 
                            style={ (edit === "Edit") ? {display: "none"} : null } 
                            onClick={() => (username !== "Guest") ? (sound.play(), updateBio()) : (sound.play(), alert(guestMessage))}
                            className="btn mt-1 expand"> 
                            Save 
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="text-center"> <button onClick={changeState} className="btn mt-3 expand"> {state} Stats </button> </div>
        <div className="text-center mt-5 userinfo container" style={(state==="Show") ? {display: "none"} : null}>
            <h3 className="margin"> {user}'s Socialites Stats </h3>
            <div className="row">
                <div className="col-md-6">
                    <ul className="text-left mt-5 ml-2">
                        <li className="mt-1"> No. of Posts : {postCount} </li>
                        <li className="mt-1"> Total Comments on Posts : {comments} </li>
                        <li className="mt-1"> No. of <img className="ml-2 mr-2" src={like} /> on Posts:  {likes} </li>
                        <li className="mt-1"> No. of <img className="ml-2 mr-2" src={love} /> on Posts:  {loves} </li>
                        <li className="mt-1"> No. of <img className="ml-2 mr-2" src={laugh} /> on Posts:  {laughs} </li>
                        <li className="mt-1"> Total Reactions on Posts: {likes + loves + laughs} </li>
                    </ul>
                </div>
                <div className="col-md-6">
                    <Pie
                        data={chartData}
                        options={{
                            title:{
                            display:true,
                            fontSize:20
                            },
                            legend:{
                            display:true,
                            position:'right'
                            }
                        }}
                    />
                </div>
        </div>
        </div>
        <div className="text-center mt-5"> <h3 className="margin"> {user}'s Posts </h3> </div>
        {posts.map(MyPost)}
        <Footer />
    </div>
}

export default Profile;
