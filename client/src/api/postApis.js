import axios from "axios";

const getAllPosts = async() => {
    const posts = await axios.get("/posts");
    return posts.data.reverse();
}

const getFilteredPosts = async(type) => {
    const posts = await axios.get("/posts");
    return posts.data.reverse().filter((post) => {
        return (post.category === type);
    });
}

const getPostsByUser = async(username) => {
    const posts = await axios.get(`/posts/list/${username}`);
    return posts.data.reverse();
}

const getPostById = async(id) => {
    const posts = await axios.get(`/posts/${id}`);
    return posts.data[0];
}

const getPostForEdit = async(id) => {
    const post = await axios.get(`/posts/edit/${id}`);
    return post.data;
}

const getCommentData = async(commentId, id) => {
    const comment = await axios.get(`/posts/getcomment/${commentId}/${id}`);
    return comment.data;
}

const addPost = async(body) => {
    const post = await fetch("/posts/add", {
        method: "POST",
        body,
        headers: {"Content-type": "application/json"}                
    });
    return post;
}

const editPost = async(body, id) => {
    const post = await fetch(`/posts/edit/${id}`, {
        method: "POST", 
        body,
        headers: {"Content-type": "application/json"}                
    });
    return post;
}

const addCommentToPost = async(id, comment) => {
    await axios.post(`/posts/add/${id}`, comment);
}

const addReactionToPost = async(reactionType, username, body) => {
    await axios.post(`/posts/update/${reactionType}/${username}`, body);
}

const addReactionToComment = async(reactionType, postId, username, body) => {
    await axios.post(`/posts/comment/${reactionType}/${postId}/${username}`, body);
}

const deleteComment = async(id, body) => {
    await axios.post(`/posts/remove/${id}`, body);
}

const deletePost = async(id) => {
    await axios.delete(`/posts/delete/${id}`);
}

export {  getAllPosts, getPostsByUser, getFilteredPosts, getPostById, getPostForEdit, getCommentData, addPost, editPost, addReactionToPost, addReactionToComment, deleteComment, deletePost, addCommentToPost }