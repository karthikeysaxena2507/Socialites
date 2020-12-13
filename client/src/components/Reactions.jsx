/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import liked from "./images/like.png"
import loved from "./images/love.png";
import laughed from "./images/laugh.png";
import axios from "axios";


function Reactions() {

    let { id } = useParams();
    var [like,setlike] = useState(false);
    var [love,setlove] = useState(false);
    var [laugh,setlaugh] = useState(false);
    var [reactions,setreactions] = useState([]);

    useEffect(function() {
        axios.get("/posts/" + id)
            .then(function(response) {
                if(like) {
                    setreactions(response.data[0].reacts.reverse().filter(function(reaction) {
                        return (reaction.type === "like");
                    }));
                }
                else if(love) {
                    setreactions(response.data[0].reacts.reverse().filter(function(reaction) {
                        return (reaction.type === "love");
                    }));
                }
                else if(laugh) {
                    setreactions(response.data[0].reacts.reverse().filter(function(reaction) {
                        return (reaction.type === "laugh");
                    }));
                }
                else {
                    setreactions(response.data[0].reacts.reverse());
                }
            });
    });

    function changeLike() {
        if(!like) {
            setlike(true);    
            setlove(false);
            setlaugh(false);
        }
    }
    function changeLove() {
        if(!love) {
            setlike(false);    
            setlove(true);
            setlaugh(false);
        }
    }
    function changeLaugh() {
        if(!laugh) {
            setlike(false);    
            setlove(false);
            setlaugh(true);
        }
    }

    function changeAll() {
        setlike(false);    
        setlove(false);
        setlaugh(false);
    }

    function renderUsers(props, index) {
        return (<div className="container user" key={index}>
            <li> {props.name} </li>
        </div>);
    }

    return(<div>
        <div className="center-text">
            <h2 className="margin"> USERS who Reacted </h2>
            <button className={"btn expand margin one "+(like ? "btn-warning":"btn-dark")} onClick={changeLike} > <img src={liked} name="like" className="expand"/> </button> 
            <button className={"btn expand margin one "+(love ? "btn-warning":"btn-dark")} onClick={changeLove}> <img src={loved} name="love" className="expand"/> </button> 
            <button className={"btn expand margin one "+(laugh ? "btn-warning":"btn-dark")} onClick={changeLaugh}> <img src={laughed} name="laugh" className="expand"/> </button> 
            <button className={"btn expand margin one "+((!like && !love && !laugh) ? "btn-warning":"btn-dark")} onClick={changeAll}> All </button> 
            {reactions.map(renderUsers)}
        </div>        
    </div>);
}

export default Reactions;