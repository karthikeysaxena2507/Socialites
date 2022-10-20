/* eslint-disable jsx-a11y/alt-text */
import React from "react";

let ReceivedMessage = (props) => {
    return (
    <div key={props._id}>
        <div className="messageContainer justifyStart mt-3">
        <div>
            <div> {props.name} </div>
            <div className="messageBox backgroundLight">
                <p className="messageText" style={(props.content !== "") ? {display: "none"} : null}> <i> message deleted </i> </p>
                <p className="messageText" style={(props.content === "") ? {display: "none"} : null}> {props.content} </p>
                <img 
                    src={props.imageUrl} 
                    style={(props.imageUrl === "" || props.imageUrl === null || props.imageUrl === undefined) ? {display: "none"} : 
                    {
                        width: "100%",
                        marginBottom: "15px",
                        borderRadius: "10px",
                        border: "1.5px solid brown"
                    }} 
                />
            </div>
            <div> {props.time} </div>
        </div>
        </div>
    </div>);
}

export default ReceivedMessage;