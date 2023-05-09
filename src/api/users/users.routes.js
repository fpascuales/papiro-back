const { isAuth, isAdmin } = require("../../middlewares/auth");
const uploadImage = require("../../middlewares/file");
const { signUp, updateUser, deleteUser, login, getAllUsers, getUserById, checkSession } = require("./users.controller");

const usersRoutes = require("express").Router();

usersRoutes.post("/", uploadImage.single('image'), signUp);
usersRoutes.put("/:id", [isAuth], uploadImage.single('image'), updateUser);
usersRoutes.delete("/:id", [isAdmin], deleteUser);
usersRoutes.post("/login", login);
usersRoutes.get("/", getAllUsers);
usersRoutes.get("/check", [isAuth], checkSession);
usersRoutes.get("/:id", getUserById);

module.exports = usersRoutes;