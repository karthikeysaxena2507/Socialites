import axios from "axios";

axios.defaults.withCredentials = true;

// const backendUrl = "https://socialites-karthikey.herokuapp.com/";
const backendUrl = "/";

/**
 * The function to get all posts
 */
const getAllPosts = async() => {
    const posts = await axios.get(backendUrl + "posts");
    return posts.data.reverse();
}

/**
 * The function to get the posts filtered by category
 * @param {String} type 
 */
const getFilteredPosts = async(type) => {
    const posts = await axios.get(backendUrl + "posts");
    return posts.data.reverse().filter((post) => {
        return (post.category === type);
    });
}

/**
 * The function to get all posts of a particular user
 * @param {String} username 
 */
const getPostsByUser = async(username) => {
    const posts = await axios.get(backendUrl + `posts/list/${username}`);
    return posts.data.reverse();
}

/**
 * The function to get the post by unique post id
 * @param {String} id 
 */
const getPostById = async(id) => {
    const posts = await axios.get(backendUrl + `posts/${id}`);
    return posts.data[0];
}

/**
 * The function to get the post by unique post id for editing
 * @param {String} id 
 */
const getPostForEdit = async(id) => {
    const post = await axios.get(backendUrl + `posts/edit/${id}`);
    return post.data;
}

/**
 * The function to get a particular comment of a post
 * @param {String} commentId 
 * @param {String} id 
 */
const getCommentData = async(commentId, id) => {
    const comment = await axios.get(backendUrl + `posts/getcomment/${commentId}/${id}`);
    return comment.data;
}

/**
 * The function to add a new post
 * @param {Object} body 
 */
const addPost = async(body) => {
    const post = await fetch(backendUrl + "posts/add", {
        method: "POST",
        body,
        headers: {"Content-type": "application/json"}                
    });
    return post;
}

/**
 * The function to edit a post
 * @param {Object} body 
 * @param {String} id 
 */
const editPost = async(body, id) => {
    const post = await fetch(backendUrl + `posts/edit/${id}`, {
        method: "POST", 
        body,
        headers: {"Content-type": "application/json"}                
    });
    return post;
}

/**
 * The function to add a comment to a post
 * @param {String} id 
 * @param {String} comment 
 */
const addCommentToPost = async(id, comment) => {
    await axios.post(backendUrl + `posts/add/${id}`, comment);
}

/**
 * The function to add a reaction to a post
 * @param {String} reactionType 
 * @param {String} username 
 * @param {Object} body 
 */
const addReactionToPost = async(reactionType, username, body) => {
    await axios.post(backendUrl + `posts/update/${reactionType}/${username}`, body);
}

/**
 * The function to add a reaction to a comment
 * @param {String} reactionType 
 * @param {String} postId 
 * @param {String} username 
 * @param {Object} body 
 */
const addReactionToComment = async(reactionType, postId, username, body) => {
    await axios.post(backendUrl + `posts/comment/${reactionType}/${postId}/${username}`, body);
}

/**
 * The function to delete a comment
 * @param {String} id 
 * @param {Object} body 
 */
const deleteComment = async(id, body, username) => {
    await axios.post(backendUrl + `posts/remove/${id}/${username}`, body);
}

/**
 * The function to delete a post
 * @param {String} id 
 */
const deletePost = async(id, username) => {
    await axios.delete(backendUrl + `posts/delete/${id}/${username}`);
}

export {  getAllPosts, getPostsByUser, getFilteredPosts, getPostById, getPostForEdit, getCommentData, addPost, editPost, addReactionToPost, addReactionToComment, deleteComment, deletePost, addCommentToPost }