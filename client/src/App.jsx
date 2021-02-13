import React from "react";
import  {BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Pages/Home";
import About from "./components/Pages/About";
import Posts from "./components/Pages/Posts";
import Create from "./components/Pages/Create";
import Register from "./components/Pages/Register";
import Login from "./components/Pages/Login";
import MyPosts from "./components/Pages/MyPosts";
import Edit from "./components/Pages/Edit";
import Reactions from "./components/Pages/Reactions";
import SearchResult from "./components/Pages/SearchResult";
import CompletePost from "./components/Pages/CompletePost";
import CompleteComment from "./components/Pages/completeComment";
import Verify from "./components/Pages/Verify";
import Verified from "./components/Pages/Verified";
import ForgotPassword from "./components/Pages/ForgotPassword";
import ResetPassword from "./components/Pages/ResetPassword";
import CategoryPosts from "./components/Pages/CategoryPosts";
import MyCategoryPosts from "./components/Pages/MyCategoryPosts";
import Users from "./components/Pages/Users";
import Room from "./components/Pages/Room";
import Profile from "./components/Pages/Profile";
import PageNotFound from "./components/Pages/PageNotFound";

import "./App.css";

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/forgot" component={ForgotPassword} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/about" component={About}/>
        <Route exact path="/allposts" component={Posts} />
        <Route exact path="/profile/:user" component={Profile} />
        <Route exact path="/room/:roomId" component={Room} />
        <Route exact path="/allusers" component={Users} />
        <Route exact path="/create" component={Create} />
        <Route exact path="/myposts" component={MyPosts} />
        <Route exact path="/post/:id" component={Reactions} />
        <Route exact path="/edit/:id" component={Edit} />
        <Route exact path="/complete/:id" component={CompletePost} />
        <Route exact path="/categoryposts/:type" component={CategoryPosts} />
        <Route exact path="/mycategoryposts/:type" component={MyCategoryPosts} />
        <Route exact path="/verify/:token" component={Verify} />
        <Route exact path="/verified/:token" component={Verified} />
        <Route exact path="/reset/:token" component={ResetPassword} />
        <Route exact path="/comment/:commentId/:id" component={CompleteComment} />
        <Route exact path="/result/:searchContent/:message/:type" component={SearchResult} />
        <Route path="*" component={PageNotFound} />
      </Switch>
  </Router>
  );
}

export default App;
