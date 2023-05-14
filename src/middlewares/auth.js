const User = require("../api/users/users.model")
const { verifyJwt } = require("../utils/jwt")

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json("No estás autorizado");
        }
        const parsedToken = token.replace("Bearer ", "");
        const validToken = verifyJwt(parsedToken);
        const userLoged = await User.findById(validToken.id);
        userLoged.password = null;
        req.user = userLoged;
        next();
    } catch (error) {
        return res.json(error);
    }
}
const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json("No estás autorizado");
        }
        const parsedToken = token.replace("Bearer ", "");
        const validToken = verifyJwt(parsedToken);
        const userLogged = await User.findById(validToken.id);
        if(userLogged.rol === "admin"){
            userLogged.password = null;
            req.user = userLogged;
            next();
        }
        else{
            return res.json("No eres administrador");
        }
    } catch (error) {
        return res.json(error);
    }
}
module.exports = {
    isAuth,
    isAdmin
}