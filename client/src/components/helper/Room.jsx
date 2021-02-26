import React from "react";

const Room = (props) => {
    return (
    <div className="container user">
        <li className="profile">
            <span> {props.roomName} ({props.unreadCount}) </span>
            <button onClick={() => props.joinRoom()} className="move-right btn-dark expand"> Join </button>
        </li>
    </div>);
}

export default Room;