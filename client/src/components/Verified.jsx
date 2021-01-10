import React from "react";
import Footer from "./Footer";
import { useParams,useHistory } from "react-router-dom";
import axios from "axios";
import Heading from "./Heading";

const Verified = () => {

    var { username } = useParams();
    var history = useHistory();

    const submit = () => {
        var user = {name: username};
        const drop = async() => {
            try {
                const response = await axios.post("/users/verify/", user);
                console.log(response.data);
                history.push("/login");
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