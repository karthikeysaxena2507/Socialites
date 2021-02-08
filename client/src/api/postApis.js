import axios from "axios";

const getAllPosts = async() => {
    const posts = await axios.get("/posts");
    return posts.data;
}

const getFilteredPosts = async(type) => {
    const posts = await axios.get("/posts");
    return posts.data.reverse().filter((post) => {
        return (post.category === type);
    });
}

const getPostsByUser = async(username) => {
    const posts = await axios.get(`/posts/list/${username}`);
    return posts.data;
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

export {  getAllPosts, getPostsByUser, getFilteredPosts, getPostById, getPostForEdit, getCommentData }