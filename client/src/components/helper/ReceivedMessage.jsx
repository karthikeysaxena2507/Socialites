import React from "react";

const ReceivedMessage = (props) => {
    return (
    <div key={props._id}>
        <div className="messageContainer justifyStart mt-3">
        <div>
            <div> {props.name} </div>
            <div className="messageBox backgroundLight">
                <p className="messageText" style={(props.content !== "") ? {display: "none"} : null}> <i> message deleted </i> </p>
                <p className="messageText" style={(props.content === "") ? {display: "none"} : null}> {props.content} </p>
            </div>
            <div> {props.time} </div>
        </div>
        </div>
    </div>);
}

export default ReceivedMessage;