/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Pie } from "react-chartjs-2";
import { Howl } from "howler";
import Navbar from "../helper/Navbar";
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
var sound = new Howl({src: [music]});

const Profile = () => {

    var [username, setUsername] = useState("");
    let { user } = useParams();
    var [imageUrl, setImageUrl] = useState("");
    var [data, setData] = useState([]);
    var [posts, setPosts] = useState([]);
    var [postCount, setPostCount] = useState(0);
    var [likes, setLikes] = useState(0);
    var [loves, setLoves] = useState(0);
    var [laughs, setLaughs] = useState(0);
    var [comments, setComments] = useState(0);
    var [state, setState] = useState("Hide");
    var [about, setAbout] = useState("");
    var [edit, setEdit] = useState("Edit");
    var [text, setText] = useState("");
    var [show, setShow] = useState(false);
    var [loading, setLoading] = useState(true);
    var guest = localStorage.getItem("Guest");
    
    useEffect(() => {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const response = await checkUser();
                    (response === "INVALID") ? window.location = "/login" : setUsername(response.username);
                }
                else {
                    setUsername("Guest");
                }
                const userData = await getUserData(user);
                setImageUrl(userData.imageUrl);
                setAbout(userData.about);
                setText(userData.about);
                const postData = await getPostsByUser(user);
                setPostCount(postData.length);
                setPosts(postData.reverse());
                var cmct = 0, lkct = 0, lvct = 0, lgct = 0;
                postData.forEach((post) => {
                    cmct+=post.comment_count;
                    lkct+=post.like;
                    lvct+=post.love;
                    lgct+=post.laugh;
                });
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

    const MyPost = (props, index) => {
        
        const changepost = (event, post) => {
            if(username === "Guest") {
                alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
            }
            else {
                const drop = async() => {
                    try {
                        await addReactionToPost(event.target.name, post.name, post);
                        const postData = await getPostsByUser(user);
                        setPosts(postData);
                        var cmct = 0, lkct = 0, lvct = 0, lgct = 0;
                        postData.forEach((post) => {
                            cmct+=post.comment_count;
                            lkct+=post.like;
                            lvct+=post.love;
                            lgct+=post.laugh;
                        });
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
                drop();
            }
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
        <div style={ (user !== username) ? {visibility: "hidden"} : null } className="post-options text-center">
            <img src={trash} onClick={remove} className="expand one"/>
            <img src={editIcon} onClick={update} className="expand"/>
        </div>
    </div>);
    }

    const createRoom = () => {
        sound.play();
        if(username === "Guest") {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
        else {
            const drop = async() => {
                try {
                    var room = (username < user) ? (username + "-" + user) : (user + "-" + username);
                    await createChat(room);
                    window.location = `/room/${room}`;
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }
    }

    var chartData = {
        labels: ["Likes", "Loves", "Laughs", "Comments", "Reactions"],
            datasets: [
                {
                    backgroundColor: ['#B21F00','#C9DE00','#2FDE00','#00A6B4','#6800B4'],
                    hoverBackgroundColor: ['#501800','#4B5000','#175000','#003350','#35014F'],
                    data: data
                }
            ]
    }

    const changeState = () => {
        sound.play();
        if(state === "Show") setState("Hide");
        else setState("Show");
    }

    const changeEdit = () => {
        sound.play();
        if(edit === "Edit") setEdit("Back");
        else setEdit("Edit");
    }

    const updateBio = () => {
        sound.play();
        if(username !== "Guest" && username !== null) {
            const drop = async() => {
                try {
                    const userData = await updateUserBio(user, text);
                    setAbout(userData);
                    setEdit("Edit");
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

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImageUrl(reader.result);
        }
        setShow(true);
    }

    const handleSubmitFile = (e) => {
        e.preventDefault();
        sound.play();
        uploadImage(imageUrl);
    }

    const uploadImage = async (imageSource) => {
        if(username !== "Guest") {
            try {
                const body = JSON.stringify({
                    data: imageSource,
                    user: user
                });
                await updateUserImage(body);
                window.location = `/profile/${user}`;
            }
            catch(error) {
                console.log(error);
            }
        }
        else {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
    }

    const removeImage = async() => {
        sound.play();
        setImageUrl("");
        if(username !== "Guest" && username !== null) {
            try {
                const body = JSON.stringify({
                    data: "",
                    user: user
                });
                await updateUserImage(body);
                window.location = `/profile/${user}`;
            }
            catch(error) {
                console.log(error);
            }
        }
        else {
            alert("You Logged In as a Guest, Please Register or login with an existing ID to make changes");
        }
    } 

    if(loading) {
        return <Loader />
    }

    else {
        return (
            <div>
            <Navbar name={username} page = "profile"/>
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
                            <form onSubmit={handleSubmitFile}>
                            <div className="text-center">
                                <div> <button style={ (!show) ? {display: "none"} : null } className="btn mt-1 expand"> Save </button> </div>
                                <div style={(username !== user) ? {display: "none"} : null}>
                                    <label for="file"> 
                                        <span className="btn expand"> Select Image </span>
                                    </label>
                                    <span className="text-center margin">
                                        <span className="btn expand" onClick={removeImage}> Remove Image </span> 
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
                                <button style={ (user === username) ? {display: "none"} : null } onClick={createRoom} className="btn mt-1 expand"> Message {user} </button>
                                <button style={ (user !== username) ? {display: "none"} : null } onClick={changeEdit} className="btn mt-1 expand"> {edit} </button>
                                <button style={ (edit === "Edit") ? {display: "none"} : null } onClick={updateBio} className="btn mt-1 expand"> Save </button>
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
                <div className="space"></div>
                <Footer />
        </div>);
    }
}
export default Profile;
