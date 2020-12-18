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


function Reactions() {

    let { username,id } = useParams();
    var [like,setlike] = useState(false);
    var [love,setlove] = useState(false);
    var [laugh,setlaugh] = useState(false);
    var [searchContent,setsearchContent] = useState("");
    var [reactions,setreactions] = useState([]);
    var [allreactions,setallreactions] = useState([]);
    var [tempreactions,settempreactions] = useState([]);

    useEffect(function() {
        axios.get("/posts/" + id)
            .then((response) => {
                setallreactions(response.data[0].reacts.reverse());
                setreactions(response.data[0].reacts.reverse());
                settempreactions(response.data[0].reacts.reverse());
            })
            .catch((response) => {
                console.log(response);
            });
    },[id]);

    function changeLike() {
        if(!like) {
            setlike(true);    
            setlove(false);
            setlaugh(false);
            setreactions(allreactions.filter(function(reaction) {
                return (reaction.type === "like");
            }));
            settempreactions(allreactions.filter(function(reaction) {
                return (reaction.type === "like");
            }));
        }
    }
    function changeLove() {
        if(!love) {
            setlike(false);    
            setlove(true);
            setlaugh(false);
            setreactions(allreactions.filter(function(reaction) {
                return (reaction.type === "love");
            }));
            settempreactions(allreactions.filter(function(reaction) {
                return (reaction.type === "love");
            }));
        }
    }
    function changeLaugh() {
        if(!laugh) {
            setlike(false);    
            setlove(false);
            setlaugh(true);
            setreactions(allreactions.filter(function(reaction) {
                return (reaction.type === "laugh");
            }));
            settempreactions(allreactions.filter(function(reaction) {
                return (reaction.type === "laugh");
            }));
        }
    }

    function changeAll() {
        setlike(false);    
        setlove(false);
        setlaugh(false);
        setreactions(allreactions);
        settempreactions(allreactions);
    }

    function change(event) {
        setsearchContent(event.target.value);
    }

    function renderUsers(props, index) {
        return (<div className="container user" key={index}>
            <li> {props.name} </li>
        </div>);
    }

    function searchIt(event) {
        event.preventDefault();
        setreactions(tempreactions.filter(function(reaction) {
            return (reaction.name.indexOf(searchContent) !== -1);
        }));
    }

    var style1 = (like) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}
    var style2 = (love) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}
    var style3 = (laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"}
    var style4 = (!like && !love && !laugh) ? {backgroundColor: "white"}:{backgroundColor: "rgb(211, 115, 36)"} 

    return(<div>
        <Navbar 
            name={username}
            page="reactions"
        />
        <div className="center-text container">
            <h2 className="upper-margin"> Users who Reacted: </h2>
            <div>
                <button className="btn expand margin one" onClick={changeAll} style={style4}> All </button> 
                <button className="btn expand margin one" onClick={changeLike} style={style1}> <img src={liked} name="like" className="expand"/> </button> 
                <button className="btn expand margin one" onClick={changeLove} style={style2}> <img src={loved} name="love" className="expand"/> </button> 
                <button className="btn expand margin one" onClick={changeLaugh} style={style3}> <img src={laughed} name="laugh" className="expand"/> </button> 
            </div>
            <div>
                <input type="text" value={searchContent} onChange={change} placeholder="Search" autoComplete="off"/>
                <button className="btn expand" onClick={searchIt}> <img src={search} /> </button>
            </div>
        </div>    
        <div className="margin">
            {reactions.map(renderUsers)}    
        </div>
        <Footer />
    </div>);
}

export default Reactions;