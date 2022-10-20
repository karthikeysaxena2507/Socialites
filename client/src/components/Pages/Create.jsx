/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-lone-blocks */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useContext } from "react";
import Navbar from "../helper/Navbar";
import Footer from "../helper/Footer";
import Heading from "../helper/Heading";
import Loader from "../helper/Loader";
import { Howl } from "howler";
import { ProgressBar } from "react-bootstrap";
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis"
import { addPost } from "../../api/postApis";
import { MessageContext } from "../../utils/Context";
import Dropdown from "../helper/Dropdown";
var sound = new Howl({src: [music]});

let Create = () => {

    let [username, setUsername] = useState("");
    let [loading, setLoading] = useState(true);
    let [title, setTitle] = useState("");
    let [content, setContent] = useState("");
    let [category, setCategory] = useState("Select Category");
    let [preview, setPreview] = useState(""); 
    let [message, setMessage] = useState("");
    let guest = localStorage.getItem("Guest");
    let [unread, setUnread] = useState(0);
    let guestMessage = useContext(MessageContext);
    let [percentage, setPercentage] = useState(0);

    useEffect(()=> {
        let fetch = async() => {
            try {
                if(guest !== "true") {
                    let user = await checkUser();
                    (user === "INVALID") ? window.location = "/login" : setUsername(user.username); setUnread(user.totalUnread);
                }
                else setUsername("Guest");
                setLoading(false);
            }
            catch(error) {
                console.log(error);
            }
        }
        fetch();
    },[guest]);

    let handleFileInputChange = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreview(reader.result);
        }
    }

    let handleSubmitFile = (e) => {
        e.preventDefault();
        sound.play();
        uploadImage(preview);
    }

    let uploadImage = async (imageSource) => {
        try {
            setMessage("Creating your Post, Please wait ...")
            let value;
            (category === "Select Category") ? value = "Other" : value = category;
            let body = JSON.stringify({
                data: imageSource,
                author: username,
                title, content, category: value
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
            await addPost(body, options)
            .then(() => {
                setMessage("Post Created Successfully")
                setPercentage(0);
                window.location = "/allposts";
            });
        }
        catch(error) {
            console.log(error);
        }
    }

    let changeCategory = (e) => {
        sound.play();
        setCategory(e.target.innerText);
    }
 
    return (loading) ? <Loader /> :
    <div className="text-center container">
        <Navbar name={username} page = "create" unread = {unread}/>
        <Heading />
        <div> <h1 className="margin"> Create Your Post Here </h1> </div> 
        <div className="dropdown text-center">
            <button 
                className="btn dropdown-toggle" 
                type="button" 
                id="dropdownMenuButton" 
                data-toggle="dropdown" 
                aria-expanded="false">
                {category}
            </button>
            <Dropdown change={(e) => changeCategory(e)} />
        </div>
        <form onSubmit={(e) => (username !== "Guest") ? handleSubmitFile(e) : alert(guestMessage)}>
            <div className="text-center margin">
                <textarea
                    name="title"
                    value={title}
                    placeholder="Title of your Post"
                    rows="1"
                    cols="50"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="text-center margin">
                <textarea
                    name="content"
                    value={content}
                    placeholder="Content of your Post"
                    rows="9"
                    cols="50"
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <div className="margin">
            <div className="text-center">
                <label for="file"> 
                    <span className="btn expand"> 
                        Select Image 
                    </span>
                </label>
                <span className="text-center margin">
                    <span className="btn expand" onClick={() => {sound.play(); setPreview("")}}> Remove Image </span> 
                </span>
            </div>
                <input
                    type="file" 
                    name="image" 
                    style={{display: "none"}}
                    id="file"
                    onChange={handleFileInputChange}
                />
            </div>
            <div className="margin text-center"> Current Image </div>
            <div className="margin text-center" style={(!preview) ? {visibility: "visible"} : {visibility: "hidden"}}>
                Image preview will be shown here
            </div>
            <div className="text-center">
            <img 
                src={preview} 
                alt="invalid image" 
                className="preview margin"
                style={(preview) ? {visibility: "visible"} : {visibility: "hidden"}} 
                />
            </div>
            <div className="text-center margin">
                <div className="text-center" style={{width: "50%", margin: "30px auto"}}>
                    { (percentage > 0) && <ProgressBar striped animated now={percentage} label={`${percentage}%`} />}
                </div>
                <div className="mt-2 mb-2 text-center"> {message} </div>
                <button className="btn btn-lg expand margin" type="submit"> Create </button> 
            </div>
        </form>
    <Footer />
    </div>
}

export default Create;