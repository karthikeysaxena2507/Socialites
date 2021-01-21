import React from "react";
import Footer from "../Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import Heading from "../Heading";

const Verified = () => {

    var { token } = useParams();

    const submit = () => {
        const drop = async() => {
            try {
                const response = await axios.post("/users/verify/", {token});
                if(response.data === "INVALID") {
                    alert("You are not a Registered User, Please go to the site and register yourself Or the Email Verification link has expired");
                }
                else {
                    console.log(response.data);
                    window.location = "/login";
                }
            }
            catch(error) {
                console.log(error);
            }
        }
        drop();
    }

    return <div className="container text-center">
        <Heading />
        <div className="margin"> <button className="btn btn-lg expand" onClick={submit}> Verify Email and Register </button> </div>
        <div className="space"></div>
        <Footer />
    </div>
}

export default Verified;