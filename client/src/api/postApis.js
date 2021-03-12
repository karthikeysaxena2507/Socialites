import axios from "axios";

/**
 * The function to get all posts
 */
const getAllPosts = async() => {
    const posts = await axios.get("/posts");
    return posts.data.reverse();
}

/**
 * The function to get the posts filtered by category
 * @param {String} type 
 */
const getFilteredPosts = async(type) => {
    const posts = await axios.get("/posts");
    return posts.data.reverse().filter((post) => {
        return (post.category === type);
    });
}

/**
 * The function to get all posts of a particular user
 * @param {String} username 
 */
const getPostsByUser = async(username) => {
    const posts = await axios.get(`/posts/list/${username}`);
    return posts.data.reverse();
}

/**
 * The function to get the post by unique post id
 * @param {String} id 
 */
const getPostById = async(id) => {
    const posts = await axios.get(`/posts/${id}`);
    return posts.data[0];
}

/**
 * The function to get the post by unique post id for editing
 * @param {String} id 
 */
const getPostForEdit = async(id) => {
    const post = await axios.get(`/posts/edit/${id}`);
    return post.data;
}

/**
 * The function to get a particular comment of a post
 * @param {String} commentId 
 * @param {String} id 
 */
const getCommentData = async(commentId, id) => {
    const comment = await axios.get(`/posts/getcomment/${commentId}/${id}`);
    return comment.data;
}

/**
 * The function to add a new post
 * @param {Object} body 
 */
const addPost = async(body) => {
    const post = await fetch("/posts/add", {
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
    const post = await fetch(`/posts/edit/${id}`, {
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
    await axios.post(`/posts/add/${id}`, comment);
}

/**
 * The function to add a reaction to a post
 * @param {String} reactionType 
 * @param {String} username 
 * @param {Object} body 
 */
const addReactionToPost = async(reactionType, username, body) => {
    await axios.post(`/posts/update/${reactionType}/${username}`, body);
}

/**
 * The function to add a reaction to a comment
 * @param {String} reactionType 
 * @param {String} postId 
 * @param {String} username 
 * @param {Object} body 
 */
const addReactionToComment = async(reactionType, postId, username, body) => {
    await axios.post(`https://socialites-karthikey.herokuapp.com/posts/comment/${reactionType}/${postId}/${username}`, body);
}

/**
 * The function to delete a comment
 * @param {String} id 
 * @param {Object} body 
 */
const deleteComment = async(id, body) => {
    await axios.post(`/posts/remove/${id}`, body);
}

/**
 * The function to delete a post
 * @param {String} id 
 */
const deletePost = async(id) => {
    await axios.delete(`/posts/delete/${id}`);
}

export {  getAllPosts, getPostsByUser, getFilteredPosts, getPostById, getPostForEdit, getCommentData, addPost, editPost, addReactionToPost, addReactionToComment, deleteComment, deletePost, addCommentToPost }