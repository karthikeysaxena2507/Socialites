import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import Heading from "../Heading";
import { Spinner } from "react-bootstrap";

const Verify = () => {

    let { username } = useParams();
    var [loading, setLoading] = useState(true);

    useEffect(() => {
        const drop = async() => {
            try {
                const response = await axios.post("/users/send", {username});
                if(response.data === "INVALID") {
                    alert("You are not a Registered User, Please go to the site and register yourself");
                }
                else {
                    console.log(response.data);
                    alert("Link sent to email");
                }
            }
            catch(error) {
                console.log(error);
            }
        }
        drop();
        setLoading(false);
    },[username])

    const send = () => {
        const drop = async() => {
            try {
                const response = await axios.post("/users/send", {username});
                if(response.data === "INVALID") {
                    alert("You are not a Registered User, Please go to the site and register yourself");
                }
                else {
                    console.log(response.data);
                    alert("Link sent to email");
                }
            }
            catch(error) {
                console.log(error);
            }
        }
        drop();
        alert("Link sent to email");
    }

    if(loading) {
        return (<div className="text-center upper-margin"> 
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> <Spinner animation="grow" variant="dark" className="mr-2"/> </span>
        <span> </span>
    </div>)
    }
    else {
        return (<div className="container text-center">
        <Heading />
        <h3 className="margin">A verification link has been sent to your registered Email, please follow that link to verify your email and register your account </h3>
        <h5> To resend the link, <span onClick={send} className="send expand"> click here </span> </h5>
        <div className="space"></div>
        <Footer />
    </div>);
    }
}

export default Verify;