import React from "react";

var date = new Date();
var year = date.getFullYear();

const Footer = () => {
    return (<div>
    <div className="space"></div>
    <footer className="text-center container">
        Copyright @ Karthikey Saxena {year}
    </footer>
    </div>);
}

export default Footer;