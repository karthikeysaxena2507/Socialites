/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useContext } from 'react'
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
import { MessageContext } from "../../utils/Context";
var sound = new Howl({src: [music]});

const Profile = () => {

    const [username, setUsername] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [data, setData] = useState([]);
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [likes, setLikes] = useState(0);
    const [loves, setLoves] = useState(0);
    const [laughs, setLaughs] = useState(0);
    const [comments, setComments] = useState(0);
    const [state, setState] = useState("Hide");
    const [about, setAbout] = useState("");
    const [edit, setEdit] = useState("Edit");
    const [text, setText] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [unread, setUnread] = useState(0);
    const guestMessage = useContext(MessageContext);
    const guest = localStorage.getItem("Guest");
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
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const response = await checkUser();
                    (response === "INVALID") ? window.location = "/login" : setUsername(response.username); setUnread(response.totalUnread);;
                }
                else setUsername("Guest")
                const userData = await getUserData(user);
                setImageUrl(userData.imageUrl);
                setAbout(userData.about);
                setText(userData.about);
                const postData = await getPostsByUser(user);
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

    const MyPost = (props) => {
        
        const addReaction = async(event, post) => {
            try {
                await addReactionToPost(event.target.name, post.name, post);
                const postData = await getPostsByUser(user);
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

        const remove = async() => {
            try {
                sound.play();
                await deletePost(props._id);
                window.location = `/myposts`;
            }
            catch(error) {
                console.log(error);
            }
        }

        const update = () => {
            sound.play();
            window.location = `/edit/${props._id}`;
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
            change = {(e, post) => addReaction(e, post)}
            show_comments = {true}
            imageUrl = {props.imageUrl}
            reactions = {props.reacts}
        />
        <div style={ (user !== username) ? {visibility: "hidden"} : null } className="post-options text-center">
            <img src={trash} onClick={() => remove} className="expand one"/>
            <img src={editIcon} onClick={update} className="expand"/>
        </div>
    </div>);
    }

    const createRoom = async() => {
        try {
            var room = (username < user) ? (username + "-" + user) : (user + "-" + username);
            await createChat(room, username, user);
            window.location = `/room/${room}`;
        }
        catch(error) {
            console.log(error);
        }
    }

    const changeState = () => {
        sound.play();
        (state === "Show") ? setState("Hide") : setState("Show")
    }

    const changeEdit = () => {
        sound.play();
        (edit === "Edit") ? setEdit("Back") : setEdit("Edit")
    }

    const updateBio = async() => {
        try {
            const userData = await updateUserBio(user, text);
            setAbout(userData);
            setEdit("Edit");
        }
        catch(error) {
            console.log(error);
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

    const removeImage = async() => {
        try {
            setImageUrl("");
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
                    <form onSubmit={() => (username !== "Guest") ? handleSubmitFile() : alert(guestMessage)}>
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
