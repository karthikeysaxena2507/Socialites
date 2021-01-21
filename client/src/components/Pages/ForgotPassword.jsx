import axios from "axios";
import React, { useState } from "react";
import Heading from "../Heading";

const ForgotPassword = () => {

    var [email, setEmail] = useState("");

    const reset = () => {
        const drop = async() => {
            try {
                const response = await axios.post("/users/forgot", {email});
                alert(response.data);
            }
            catch(error) {
                console.log(error);
            }
        }
        drop();
    }

    return (<div className="container text-center">
        <Heading />
        <h5 className="margin"> Enter your registered email to reset password </h5>
        <input 
                    type="email" 
                    value={email}
                    className="margin" 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email" 
                    autoComplete="off" 
                    required 
                />
        <div className="margin"><button className="btn btn-lg expand margin" onClick={reset}> Send </button> </div>
    </div>);
}

export default ForgotPassword;