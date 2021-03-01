import React from "react";
import { Howl } from "howler";
import button from "../../sounds/button.mp3";
var buttonSound = new Howl({src: [button]});

const ChatRoomUser = (props) => {

    const SeeProfile = (e) => 
    {
        buttonSound.play();
        window.location = (`/profile/${e.target.innerText}`);
    }

    const isOnline = () => 
    {
        for (let user of props.onlineUsers) 
        {
            if(user.name === props.name) return true;
        }
        return false;
    }

    return (
    <div className="container user">
        <li className="profile"> 
            <span onClick={SeeProfile}> {props.name} </span>
            <span 
                className="move-right" 
                style={!isOnline() ? 
                {
                    display: "none"
                } : 
                {
                    backgroundColor: "darkgreen", 
                    color: "white", 
                    padding: "4px 8px", 
                    borderRadius: "5px"
                }
            }>
                Online
            </span>
            <span 
                className="move-right" 
                style={isOnline() ? 
                {
                    display: "none"
                } : 
                {
                    backgroundColor: "red", 
                    color: "white", 
                    padding: "4px 8px", 
                    borderRadius: "5px"
                }
            }>
                Offline
            </span>
        </li>
    </div>
    );
} 

export default ChatRoomUser;