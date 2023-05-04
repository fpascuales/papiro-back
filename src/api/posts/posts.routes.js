const { isAuth } = require("../../middlewares/auth");
const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require("./posts.controller");

const postsRoutes = require("express").Router();

postsRoutes.get("/", getAllPosts);
postsRoutes.get("/:id", getPostById);
postsRoutes.post("/", [isAuth], createPost);
postsRoutes.put("/:id", [isAuth], updatePost);
postsRoutes.delete("/:id", [isAuth], deletePost);

module.exports = postsRoutes;