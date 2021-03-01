/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import trash from "../../images/trash.png";

const SentMessage = (props) => {
    return (
    <div>
        <div className="messageContainer justifyEnd mt-3">
            <div>
                <div className="text-right"> {props.username} </div>
                <div className="text-right">
                    <div className="messageBox backgroundOrange">
                        <p className="messageText text-white" style={(props.content !== "") ? {display: "none"} : null}> <i> message deleted </i> </p>
                        <p className="messageText text-white" style={(props.content === "") ? {display: "none"} : null}> {props.content} </p>
                    </div>
                    <img 
                        src={trash} 
                        style={(props.content === "") ? {display: "none"} : null}
                        onClick={() => props.delete(props._id)} 
                        className="move-right expand ml-1 mt-1" 
                    />
                </div>
                <div className="text-right"> {props.time} </div>
            </div>
        </div>
    </div>);
}

export default SentMessage;