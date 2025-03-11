"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailExists = exports.autheticate = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const autheticate = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error("No Autorizado");
        res.status(401).json({ error: error.message });
        return;
    }
    //posisicion cero no interesa dejamos en blanco para no generar una varibale
    const [, token] = bearer.split(" ");
    if (!token) {
        const error = new Error("Token no valido");
        res.status(400).json({ error: error.message });
        return;
    }
    try {
        //verificamos el jsonWebToken
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decode === "object" && decode.id) {
            req.user = await User_1.User.findByPk(decode.id, {
                attributes: ["id", "name", "email"]
            });
            next();
        }
    }
    catch (error) {
        res.status(500).json({ error: "Token no valido" });
    }
};
exports.autheticate = autheticate;
//middleware para verificar que no exista el email
const emailExists = async (req, res, next) => {
    const { email } = req.body;
    const userExists = await User_1.User.findOne({ where: { email: email } });
    // console.log(userExists.id)
    // console.log(req.user.id)
    if (userExists.id !== req.user.id) {
        const error = new Error("El email ya esta registrado por otro usuario");
        res.status(409).json({ error: error.message });
        return;
    }
    next();
};
exports.emailExists = emailExists;
//# sourceMappingURL=auth.js.map