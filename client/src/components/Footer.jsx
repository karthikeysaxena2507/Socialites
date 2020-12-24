import React from "react";

var date = new Date();
var year = date.getFullYear();

const Footer = () => {
    return (<footer className="center-text container">
        Copyright @ Karthikey Saxena {year}
    </footer>);
}

export default Footer;