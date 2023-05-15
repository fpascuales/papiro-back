const { isAuth } = require("../../middlewares/auth");
const uploadImage = require("../../middlewares/file");
const { getAllPosts, getPostById, createPost, updatePost, deletePost, likeThisPost } = require("./posts.controller");

const postsRoutes = require("express").Router();

postsRoutes.get("/", getAllPosts);
postsRoutes.get("/:id", getPostById);
postsRoutes.post("/", [isAuth], uploadImage.single('image'), createPost);
postsRoutes.put("/:id/like", [isAuth], likeThisPost);
postsRoutes.put("/:id", [isAuth], uploadImage.single('image'), updatePost);
postsRoutes.delete("/:id", [isAuth], deletePost);

module.exports = postsRoutes;