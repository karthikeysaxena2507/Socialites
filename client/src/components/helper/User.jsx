import React, { useContext } from "react";
import { Howl } from "howler";
import music from "../../sounds/button.mp3";
import { createChat } from "../../api/roomApis";
import { MessageContext } from "../../utils/Context";
var sound = new Howl({src: [music]});

const User = (props) => {

    const guestMessage = useContext(MessageContext);

    const createRoom = () => {
        sound.play();
        if(props.user1 === "Guest") {
            alert(guestMessage);
        }
        else {
            const drop = async() => {
                try {
                    var room = (props.user1 < props.user2) ? (props.user1 + "-" + props.user2) : (props.user2 + "-" + props.user1);
                    await createChat(room, props.user1, props.user2);
                    window.location = `/room/${room}`;
                }
                catch(error) {
                    console.log(error);
                }
            }
            drop();
        }
    }

    const SeeProfile = (e) => {
        sound.play();
        window.location = `/profile/${e.target.innerText}`;
    }

    return (<div className="container user">
        <li className="profile">
            <span onClick={SeeProfile}> {props.user2} </span>
            <span style={props.unreadCount < 0 ? {display: "none"} : null}> ({props.unreadCount}) </span>
            <button 
                onClick={createRoom} 
                style={props.user2 === props.user1 ? {display: "none"} : null} 
                className="move-right btn-dark expand">
                Chat 
            </button>
        </li>
    </div>);
}

export default User;