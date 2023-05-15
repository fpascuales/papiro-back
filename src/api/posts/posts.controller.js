const { deleteFile } = require("../../middlewares/deleteFile");
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
            return res.status(404).json("Post no encontrado");
        }
        return res.status(200).json(post);
    } catch (error) {
        return next(error);
    }
}
const createPost = async (req, res, next) => {
    try {
        const newPost = new Post(req.body);
        if(req.file){
            newPost.image = req.file.path;
        }
        if(!req.body.title){
            return res.status(400).json("El título es obligatorio");
        }
        if(!req.body.body){
            return res.status(400).json("El mensaje es obligatorio");
        }
        await newPost.save();
        return res.status(200).json(newPost);
    } catch (error) {
        return next(error);
    }
}
const likeThisPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const postUpdated = await Post.findByIdAndUpdate(id, req.body, {new: true});
        return res.status(200).json(postUpdated);
    } catch (error) {
        return next(error);
    }
}
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json("Post no encontrado");
        }
        const userPost = post.user.toString();
        const idUser = JSON.stringify(req.user.id);
        const idUserParsed = idUser.slice(1, -1);
        if(req.user.rol === "admin" || idUserParsed === userPost){
            if(req.file){
                if(post.image){
                    deleteFile(post.image);
                }
                req.body.image = req.file.path;
            }
            else if(post.image && (req.file === undefined || req.file === null)){
                deleteFile(post.image);
                req.body.image = null;
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
            return res.status(404).json("Post no encontrado");
        }
        const userPost = post.user.toString();
        const idUser = JSON.stringify(req.user.id);
        const idUserParsed = idUser.slice(1, -1);
        if(req.user.rol === "admin" || idUserParsed === userPost){
            if(post.image) {
                deleteFile(post.image);
            }
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
    likeThisPost,
    updatePost,
    deletePost
}