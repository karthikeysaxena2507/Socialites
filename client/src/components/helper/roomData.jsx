import React from "react";

const RoomData = (props) => {
    return (
    <div className="text-center"> 
        <h5 className="mt-1" style={!props.isGroup ? {display: "none"} : null}> Room ID: {props.roomId} </h5>
        <h5 className="mt-1" style={!props.isGroup ? {display: "none"} : null}> Room Name: {props.roomName} </h5>
        <h5 className="mt-1" style={!props.isGroup ? {display: "none"} : null}> Room Creator: {props.creator} </h5>
        <h5 className="mt-1" style={!props.isGroup ? {display: "none"} : null}> Share the above room id with users whom you want to join <strong> {props.roomName} </strong> </h5>
        <h5 className="mt-1" style={props.isGroup ? {display: "none"} : null}> Chat between {props.roomId} </h5>
        <button className="btn" onClick={props.change} style={!props.isGroup ? {display: "none"} : null}> {props.state} All Users in {props.roomName} </button>
        <button className="btn" onClick={props.change} style={props.isGroup ? {display: "none"} : null}> {props.state} Status </button>
    </div>
    )
}

export default RoomData;