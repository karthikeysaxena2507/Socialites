import React from "react";
import {BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import PostList from "./components/PostList";
import Create from "./components/Create";
import Register from "./components/Register";
import Login from "./components/Login";
import MyPosts from "./components/MyPosts";

function App() {
  return (
    <Router>
    <Route path="/" exact component={Home} />
    <Route path="/posts/:username" component={PostList} />
    <Route path="/create/:username" component={Create} />
    <Route path="/myposts/:username" component={MyPosts} />
    <Route path="/register" component={Register} />
    <Route path="/login" component={Login} />
    </Router>
  );
}

export default App;
