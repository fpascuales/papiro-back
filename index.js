require("dotenv").config();
const PORT = process.env.PORT;

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const cors = require("cors");
const express = require("express");
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

const db = require("./src/utils/db.js");
db.connectDB();

const postsRoutes = require("./src/api/posts/posts.routes.js");
const usersRoutes = require("./src/api/users/users.routes.js");
server.use("/posts", postsRoutes);
server.use("/posts", usersRoutes);

server.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || "Error")
})
server.use("*", (req, res, next) => {
    return res.status(404).json("Route not found");
})
server.use("/", (req, res) => {
    res.send("It Works!")
})
server.listen(PORT, () => {
    console.log("Server is running!");
})