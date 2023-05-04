const Post = require("./posts.model");

const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        return res.status(200).json(posts);
    } catch (error) {
        return next(error);
    }
}
const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if(!post){
            return res.json("El post no existe");
        }
        return res.status(200).json(post);
    } catch (error) {
        return next(error);
    }
}
const createPost = async (req, res, next) => {
    try {
        const newPost = await new Post(req.body);
        await newPost.save();
        return res.status(200).json(newPost);
    } catch (error) {
        return next(error);
    }
}
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const postUpdated = await Post.findByIdAndUpdate(id, req.body, {new: true});
        return res.status(200).json(postUpdated);
    } catch (error) {
        return next(error);
    }
}
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const postDeleted = await Post.findByIdAndDelete(id);
        return res.status(200).json(postDeleted);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
}