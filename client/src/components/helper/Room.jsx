/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import trash from "../../images/trash.png";

const Room = (props) => {
    return (
    <div className="container user">
        <li className="profile">
            <span> {props.roomName} ({props.unreadCount}) </span>
            <img 
                src={trash} 
                onClick={() => props.remove()} 
                className="move-right expand ml-1 mt-1" 
            />
            <button onClick={() => props.joinRoom()} className="move-right btn-dark expand"> Join </button>
        </li>
    </div>);
}

export default Room;