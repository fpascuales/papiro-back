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
            return res.status(404).json("El post no existe");
        }
        return res.status(200).json(post);
    } catch (error) {
        return next(error);
    }
}
const createPost = async (req, res, next) => {
    try {
        const newPost = await new Post(req.body);
        if(req.file){
            newPost.image = req.file.path;
        }
        await newPost.save();
        return res.status(200).json(newPost);
    } catch (error) {
        return next(error);
    }
}
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json("El post no existe");
        }
        const userPost = post.user.toString();
        const idUser = JSON.stringify(req.user.id);
        const idUserParsed = idUser.slice(1, -1);
        if(req.user.rol === "admin" || idUserParsed === userPost){
            if(req.file){
                req.body.image = req.file.path;
            }
            const postUpdated = await Post.findByIdAndUpdate(id, req.body, {new: true});
            return res.status(200).json(postUpdated);
        }
        else{
            return res.json("Solo los administradores pueden modificar post de otros usuarios");
        }
    } catch (error) {
        return next(error);
    }
}
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json("El post no existe");
        }
        const userPost = post.user.toString();
        const idUser = JSON.stringify(req.user.id);
        const idUserParsed = idUser.slice(1, -1);
        if(req.user.rol === "admin" || idUserParsed === userPost){
            const postDeleted = await Post.findByIdAndDelete(id);
            return res.status(200).json(postDeleted);
        }
        else{
            return res.json("Solo los administradores pueden eliminar post de otros usuarios");
        }
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