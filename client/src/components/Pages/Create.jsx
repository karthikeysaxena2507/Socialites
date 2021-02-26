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
import music from "../../sounds/button.mp3";
import { checkUser } from "../../api/userApis"
import { addPost } from "../../api/postApis";
import { MessageContext } from "../../utils/Context";
var sound = new Howl({src: [music]});

const Create = () => {

    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Select Category");
    const [preview, setPreview] = useState(""); 
    const guest = localStorage.getItem("Guest");
    const [unread, setUnread] = useState(0);
    const guestMessage = useContext(MessageContext);

    useEffect(()=> {
        const fetch = async() => {
            try {
                if(guest !== "true") {
                    const user = await checkUser();
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

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreview(reader.result);
        }
    }

    const handleSubmitFile = (e) => {
        e.preventDefault();
        sound.play();
        uploadImage(preview);
    }

    const uploadImage = async (imageSource) => {
        try {
            let value;
            (category === "Select Category") ? value = "Other" : value = category;
            const body = JSON.stringify({
                data: imageSource,
                author: username,
                title, content, category: value
            });
            await addPost(body);
            window.location = "/allposts";
        }
        catch(error) {
            console.log(error);
        }
    }
 
    return (loading) ? <Loader /> :
    <div className="text-center">
        <Navbar name={username} page = "create" unread = {unread}/>
        <Heading />
        <div> 
        <h1 className="margin"> Create Your Post Here </h1>
        </div> 
        <div className="dropdown text-center">
            <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false">
                {category}
            </button>
            <div className="dropdown-menu">
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> Art </a>
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> Motivational </a>
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> Political </a>
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> Funny </a>
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> Music </a>
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> Food </a>
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> Fashion </a>
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> General Knowledge </a>
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> Lifestyle </a>
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> Travel </a>
                <a className="dropdown-item" href="#" onClick={(e)=> {sound.play(); setCategory(e.target.innerText)}}> Other </a>
            </div>
        </div>
        <form onSubmit={() => (username !== "Guest") ? handleSubmitFile() : alert(guestMessage)}>
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
                    style={{visibility: "hidden"}}
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
                <button className="btn btn-lg expand margin" type="submit"> Create </button> 
            </div>
        </form>
    <Footer />
    </div>
}

export default Create;