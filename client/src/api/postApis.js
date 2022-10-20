import axios from "axios";

let backendUrl = "/";

/**
 * The function to get all posts
 */
let getAllPosts = async() => {
    let posts = await axios.get(backendUrl + "posts");
    return posts.data.reverse();
}

/**
 * The function to get the posts filtered by category
 * @param {String} type 
 */
let getFilteredPosts = async(type) => {
    let posts = await axios.get(backendUrl + "posts");
    return posts.data.reverse().filter((post) => {
        return (post.category === type);
    });
}

/**
 * The function to get all posts of a particular user
 * @param {String} username 
 */
let getPostsByUser = async(username) => {
    let posts = await axios.get(backendUrl + `posts/list/${username}`);
    return posts.data.reverse();
}

/**
 * The function to get the post by unique post id
 * @param {String} id 
 */
let getPostById = async(id) => {
    let posts = await axios.get(backendUrl + `posts/${id}`);
    return posts.data[0];
}

/**
 * The function to get the post by unique post id for editing
 * @param {String} id 
 */
let getPostForEdit = async(id) => {
    let post = await axios.get(backendUrl + `posts/edit/${id}`);
    return post.data;
}

/**
 * The function to get a particular comment of a post
 * @param {String} commentId 
 * @param {String} id 
 */
let getCommentData = async(commentId, id) => {
    let comment = await axios.get(backendUrl + `posts/getcomment/${commentId}/${id}`);
    return comment.data;
}

/**
 * The function to add a new post
 * @param {Object} body 
 */
let addPost = async(body, options) => {
    let post = await axios.post(backendUrl + "posts/add", body, options);
    return post;
}

/**
 * The function to edit a post
 * @param {Object} body 
 * @param {String} id 
 */
let editPost = async(body, id, options) => {
    let post = await axios.post(backendUrl + `posts/edit/${id}`, body, options);
    return post;
}

/**
 * The function to add a comment to a post
 * @param {String} id 
 * @param {String} comment 
 */
let addCommentToPost = async(id, comment) => {
    await axios.post(backendUrl + `posts/add/${id}`, comment);
}

/**
 * The function to add a reaction to a post
 * @param {String} reactionType 
 * @param {String} username 
 * @param {Object} body 
 */
let addReactionToPost = async(reactionType, username, body) => {
    await axios.post(backendUrl + `posts/update/${reactionType}/${username}`, body);
}

/**
 * The function to add a reaction to a comment
 * @param {String} reactionType 
 * @param {String} postId 
 * @param {String} username 
 * @param {Object} body 
 */
let addReactionToComment = async(reactionType, postId, username, body) => {
    await axios.post(backendUrl + `posts/comment/${reactionType}/${postId}/${username}`, body);
}

/**
 * The function to delete a comment
 * @param {String} id 
 * @param {Object} body 
 */
let deleteComment = async(id, body, username) => {
    await axios.post(backendUrl + `posts/remove/${id}/${username}`, body);
}

/**
 * The function to delete a post
 * @param {String} id 
 */
let deletePost = async(id, username) => {
    await axios.delete(backendUrl + `posts/delete/${id}/${username}`);
}

export {  getAllPosts, getPostsByUser, getFilteredPosts, getPostById, getPostForEdit, getCommentData, addPost, editPost, addReactionToPost, addReactionToComment, deleteComment, deletePost, addCommentToPost }