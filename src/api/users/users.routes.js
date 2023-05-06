const { isAuth, isAdmin } = require("../../middlewares/auth");
const { signUp, updateUser, deleteUser, login, getAllUsers, getUserById } = require("./users.controller");

const usersRoutes = require("express").Router();

usersRoutes.post("/", signUp);
usersRoutes.put("/:id", [isAuth], updateUser);
usersRoutes.delete("/:id", [isAdmin], deleteUser);
usersRoutes.post("/login", login);
usersRoutes.get("/", [isAdmin], getAllUsers);
usersRoutes.get("/:id", getUserById);

module.exports = usersRoutes;