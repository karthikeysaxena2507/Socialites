import axios from "axios";
import React, { useState } from "react";

function ForgotPassword() {

    var [email, setEmail] = useState("");

    function change(event) {
        setEmail(event.target.value);
    }

    function reset() {
        const user = {mail: email};
        axios.post("/users/forgot", user)
            .then((response) => {
                alert(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (<div className="upper-margin container center-text">
    <div className="center-text"> <h1 className="main"> Socialites </h1> </div>
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