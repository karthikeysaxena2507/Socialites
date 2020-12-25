import axios from "axios";
import React, { useState } from "react";
import Heading from "./Heading";

const ForgotPassword = () => {

    var [email, setEmail] = useState("");

    const change = (event) => {
        setEmail(event.target.value);
    }

    const reset = () => {
        const user = {mail: email};
        const drop = async() => {
            try {
                const response = await axios.post("/users/forgot", user);
                alert(response.data);
            }
            catch(error) {
                console.log(error);
            }
        }
        drop();
    }

    return (<div className="container center-text">
        <Heading />
        <h5 className="margin"> Enter your registered email to reset password </h5>
        <input 
                    type="email" 
                    value={email}
                    className="margin" 
                    onChange={change}
                    placeholder="Enter Email" 
                    autoComplete="off" 
                    required 
                />
        <div className="margin"><button className="btn btn-lg expand margin" onClick={reset}> Send </button> </div>
    </div>);
}

export default ForgotPassword;