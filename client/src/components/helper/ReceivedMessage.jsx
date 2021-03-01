import React from "react";

const ReceivedMessage = (props) => {
    return (
    <div>
        <div className="messageContainer justifyStart mt-3">
        <div>
            <div> {props.name} </div>
            <div className="messageBox backgroundLight">
                <p className="messageText"> {props.content} </p>
            </div>
            <div> {props.time} </div>
        </div>
        </div>
    </div>);
}

export default ReceivedMessage;