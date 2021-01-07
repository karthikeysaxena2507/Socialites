import React from "react";
import  {BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Posts from "./components/Posts";
import Create from "./components/Create";
import Register from "./components/Register";
import Login from "./components/Login";
import MyPosts from "./components/MyPosts";
import Edit from "./components/Edit";
import Profile from "./components/Profile";
import Reactions from "./components/Reactions";
import SearchResult from "./components/SearchResult";
import CompletePost from "./components/CompletePost";
import CompleteComment from "./components/completeComment";
import Verify from "./components/Verify";
import Verified from "./components/Verified";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import CategoryPosts from "./components/CategoryPosts";
import MyCategoryPosts from "./components/MyCategoryPosts";
import Users from "./components/Users";

function App() {
  return (
    <Router>
    <Route exact path="/" component={Home} />
    <Route exact path="/about/:username" component={About}/>
    <Route exact path="/allposts/:username" component={Posts} />
    <Route exact path="/allusers/:username" component={Users} />
    <Route exact path="/create/:username" component={Create} />
    <Route exact path="/myposts/:username" component={MyPosts} />
    <Route exact path="/post/:username/:id" component={Reactions} />
    <Route exact path="/edit/:username/:id" component={Edit} />
    <Route exact path="/profile/:user/:username" component={Profile} />
    <Route exact path="/complete/:username/:id" component={CompletePost} />
    <Route exact path="/categoryposts/:username/:type" component={CategoryPosts} />
    <Route exact path="/mycategoryposts/:username/:type" component={MyCategoryPosts} />
    <Route exact path="/verify/:username" component={Verify} />
    <Route exact path="/verified/:username" component={Verified} />
    <Route exact path="/forgot" component={ForgotPassword} />
    <Route exact path="/reset/:username" component={ResetPassword} />
    <Route exact path="/comment/:username/:commentId/:id" component={CompleteComment} />
    <Route exact path="/result/:username/:searchContent/:message/:type" component={SearchResult} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/login" component={Login} />
    </Router>
  );
}

export default App;
