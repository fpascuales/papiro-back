const { deleteFile } = require("../../middlewares/deleteFile");
const { generateSign } = require("../../utils/jwt");
const User = require("./users.model");
const bcrypt = require("bcrypt");

const signUp = async (req, res, next) => {
    //meter comprobación de si ya existe un nombre de usuario en la bbdd
    try {
        if(req.body.rol === "admin"){
            req.body.rol = "user";
        }
        const newUser = new User(req.body);
        if(req.file){
            newUser.image = req.file.path;
        }
        await newUser.save();
        return res.status(201).json(newUser)
    } catch (error) {
        return next(error);
    }
}
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json("Usuario no encontrado");
        }
        if(req.user.rol !== "admin"){
            req.body.rol = "user";
        }
        const idUser = JSON.stringify(req.user.id);
        const idUserParsed = idUser.slice(1, -1);
        if(req.user.rol === "admin" || idUserParsed === id){
            if(req.file){
                if(user.image){
                    deleteFile(user.image);
                }
                req.body.image = req.file.path;
            }
            if(req.body.password) {
                req.body.password = bcrypt.hashSync(req.body.password, 10);
            }
            const userUpdated = await User.findByIdAndUpdate(id, req.body, {new: true});
            return res.json(userUpdated);
        }
        else{
            return res.json("Solo los administradores pueden modificar otros usuarios");
        }
    } catch (error) {
        return next(error);
    }
}
//FUNCIÓN PARA BORRAR USUARIO PERO NO SUS POST
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json("Usuario no encontrado");
        }
        const userToDelete = new User(req.body);
        if(req.user.rol !== "admin"){
            userToDelete.rol = "user";
        }
        const idUser = JSON.stringify(req.user._id);
        const idUserParsed = idUser.slice(1, idUser.length, -1);
        if(req.user.rol === "admin" || idUserParsed === id){
            //TENGO QUE SACAR EL ID DEL ADMIN LOGUEADO, PARA ASIGNAR TODOS LOS POST A ESTE
            const userDeleted = await User.findByIdAndDelete(id)
            return res.json(userDeleted);
        }
        else{
            return res.json("Solo los administradores pueden eliminar usuarios");
        }
    } catch (error) {
        return next(error);
    }
}
const login = async (req, res, next) => {
    try{
        const userToLog = await User.findOne({username: req.body.username});
        if(!userToLog){
            return res.status(400).json("Datos incorrectos");
        }
        if(bcrypt.compareSync(req.body.password, userToLog.password)){
            const token = generateSign(userToLog.id, userToLog.username);
            return res.status(200).json({token, userToLog});
        }
        else{
            return res.status(400).json("Datos incorrectos");
        }
    }
    catch (error) {
        return next(error);
    }
}
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return next(error);
    }
}
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json("Usuario no encontrado");
        }
        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
}
const checkSession = async (req, res, next) => {
    try {
        return res.json(req.user)
    } catch (error) {
        return next(error);
    }
}
// const getUserById = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findById(id);
//         if(!user){
//             return res.status(404).json("El usuario no existe");
//         }
//         else{
//             if(req.user.rol !== "admin"){
//                 user.rol = "user";
//             }
//             const idUser = JSON.stringify(req.user.id);
//             const idUserParsed = idUser.slice(1, -1);
//             if(req.user.rol === "admin" || idUserParsed === id){
//                 user._id = id;
//                 return res.status(200).json(user);
//             }
//             else{
//                 return res.json("Solo los administradores pueden ver otros usuarios");
//             }
//         }
//     } catch (error) {
//         return next(error);
//     }
// }
module.exports = {
    signUp,
    updateUser,
    deleteUser,
    login,
    getAllUsers,
    getUserById,
    checkSession
}