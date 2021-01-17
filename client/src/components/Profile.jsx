/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import Navbar from "./Navbar";
import Footer from "./Footer";
import Heading from "./Heading";
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";
import axios from 'axios';
import like from "./images/like.png";
import love from "./images/love.png";
import laugh from "./images/laugh.png";
import trash from "./images/trash.png";
import editIcon from "./images/edit.png";
import Post from "./Post";
import blank from "./images/blank.png";


const Profile = () => {

    const username = localStorage.getItem("username");
    let { user } = useParams();
    var [imageUrl, setImageUrl] = useState("");
    var [posts, setPosts] = useState([]);
    var [postCount, setPostCount] = useState(0);
    var [likes, setLikes] = useState(0);
    var [loves, setLoves] = useState(0);
    var [laughs, setLaughs] = useState(0);
    var [comments, setComments] = useState(0);
    var [state, setState] = useState("Hide");
    var history = useHistory();
    var [about, setAbout] = useState("");
    var [edit, setEdit] = useState("Edit");
    var [text, setText] = useState("");
    var [show, setShow] = useState(false);

    useEffect(() => {
        const fetch = async() => {
            try {
                const userData = await axios.get(`/users/find/${user}`)
                setImageUrl(userData.data.imageUrl);
                setAbout(userData.data.about);
                setText(userData.data.about);
                const postData = await axios.get(`/posts/list/${user}`)
                setPostCount(postData.data.length);
                setPosts(postData.data.reverse());
                var cmct = 0, lkct = 0, lvct = 0, lgct = 0;
                postData.data.forEach((post) => {
                    cmct+=post.comment_count;
                    lkct+=post.like;
                    lvct+=post.love;
                    lgct+=post.laugh;
                });
                setLikes(lkct);
                setLoves(lvct);
                setLaughs(lgct);
                setComments(cmct);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[user]);

    const MyPost = (props, index) => {

        const changepost = (event, post) => {
            const drop = async() => {
                try {
                    const res = await axios.post(`/posts/update/${event.target.name}/${post.name}`, post);
                    console.log(res.data);
                    const postData = await axios.get(`/posts/list/${user}`);
                    setPosts(postData.data.reverse());
                    var cmct = 0, lkct = 0, lvct = 0, lgct = 0;
                    postData.data.forEach((post) => {
                        cmct+=post.comment_count;
                        lkct+=post.like;
                        lvct+=post.love;
                        lgct+=post.laugh;
                    });
                    console.log(cmct, lkct, lvct, lgct);
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

        const remove = () => {
            const del = async() => {
                try {
                    const response = await axios.delete(`/posts/delete/${props._id}`);
                    console.log(response.data.reverse());
                }
                catch(error) {
                    console.log(error);
                }
            }
            del();
            history.push(`/myposts`);
        }

        const update = () => {
            history.push(`/edit/${props._id}`);
        }

        return (<div className="container" key ={index}>
         <Post 
                name = {user}
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
        />
        <div style={ (user !== username) ? {visibility: "hidden"} : null } className="post-options text-center">
            <img src={trash} onClick={remove} className="expand one"/>
            <img src={editIcon} onClick={update} className="expand"/>
        </div>
    </div>);
    }

    const createRoom = (e) => {
        localStorage.setItem("otheruser", user);
        history.push(`/chat/`);   
    }

    const changeState = () => {
        if(state === "Show") setState("Hide");
        else setState("Show");
    }

    const changeEdit = () => {
        if(edit === "Edit") setEdit("Back");
        else setEdit("Edit");
    }

    const updateBio = () => {
        if(username !== "Guest" && username !== null) {
            const drop = async() => {
                try {
                    const userData = await axios.post(`/users/updatebio`,{user, text});
                    console.log(userData);
                    setAbout(userData.data);
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
        uploadImage(imageUrl);
    }

    const uploadImage = async (imageSource) => {
        if(username !== "Guest" && username !== null) {
            try {
                console.log(imageSource);
                await fetch("/users/updateimage", {
                    method: "POST",
                    body: JSON.stringify({
                        data: imageSource,
                        user: user
                    }),
                    headers: {"Content-type": "application/json"}                
                });
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
        setImageUrl("");
        if(username !== "Guest" && username !== null) {
            try {
                await fetch("/users/updateimage", {
                    method: "POST",
                    body: JSON.stringify({
                        data: "",
                        user: user
                    }),
                    headers: {"Content-type": "application/json"}                
                });
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

    return (<div>
        <Navbar page = "profile"/>
        <Heading />
        <div className="text-center"> <h3 className="margin"> {user}'s Profile </h3> </div>
            <Container className="mt-5">
                <Row>
                    <Col sm={6} >
                    <div className="margin text-center" style={imageUrl === "" ? {display: "none"} : null}>
                        <img src={imageUrl} className="profile-pic" alt="image not found"/>
                    </div>
                    <div style={imageUrl !== "" ? {display: "none"} : null}>
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
                    </Col>
                    <Col sm={6} className="text-left pl-5 pr-5 userinfo">
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
                    </Col>
                </Row>
            </Container>
            <div className="text-center mt-5 userinfo container"> 
                <button onClick={changeState} className="btn mt-3 expand"> {state} Stats </button>
                <div style={(state==="Show") ? {display: "none"} : null}>
                    <h3 className="margin"> {user}'s Socialites Stats </h3>
                    <ul className="text-left mt-5 ml-2">
                        <li className="mt-1"> No. of Posts : {postCount} </li>
                        <li className="mt-1"> Total Comments on Posts : {comments} </li>
                        <li className="mt-1"> No. of <img className="ml-2 mr-2" src={like} /> on Posts:  {likes} </li>
                        <li className="mt-1"> No. of <img className="ml-2 mr-2" src={love} /> on Posts:  {loves} </li>
                        <li className="mt-1"> No. of <img className="ml-2 mr-2" src={laugh} /> on Posts:  {laughs} </li>
                        <li className="mt-1"> Total Reactions on Posts: {likes + loves + laughs} </li>
                    </ul>
               </div>
            </div>
            <div className="text-center mt-5"> <h3 className="margin"> {user}'s Posts </h3> </div>
            {posts.map(MyPost)}
            <div className="space"></div>
            <Footer />
    </div>);
}
export default Profile;
