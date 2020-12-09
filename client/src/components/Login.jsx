import React, { useState } from "react";
import axios from "axios";

function Login() {

    var [user, setUser] = useState({username:"", password:""});
    var [message, setMessage] = useState(" ");

    function change(event) {
        var {name, value} = event.target;

        setUser((prevUser) => {
        return {
          ...prevUser,
          [name]: value
        };
      });
    }

    function add(event) {
        event.preventDefault();

        axios.post("/users/", user)
            .then(function(response) {
                if(response.data === "user not found") {
                    setMessage(response.data);
                }
                else {
                    window.location = "/posts/" + user.username;
                }
            });
        
    }

    return (<div className="center-text upper-margin">
        <h2> Log In to Your Account </h2>
        <form onSubmit={add}>
            <div>
                <input 
                    type="text" 
                    name="username" 
                    value={user.username}
                    className="margin" 
                    onChange={change}
                    placeholder="Username" 
                    autoComplete="off" 
                    required 
                />
            </div>
            <div>
                <input 
                    type="password" 
                    name="password" 
                    value={user.password}
                    onChange={change}
                    className="margin" 
                    placeholder="Password" 
                    required 
                />
            </div>
            <div>
                <p className="margin"> {message} </p>
            </div>
            <div>
                <input type="submit" className="btn btn-dark expand margin" value="Log In"/> 
            </div>
            <div className="margin">
                <a href="/register"> Create an account </a>
            </div>
        </form>
        
</div>);
}

export default Login;

