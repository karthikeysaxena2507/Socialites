import React from "react";

const Heading = () => {

    var username = localStorage.getItem("username");

    return (<div className="center-text upper-margin">
        <h1 className="main margin"> Socialites </h1>
        <h4> Hello {username} </h4>
    </div>);
} 

export default Heading;