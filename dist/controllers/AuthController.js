"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../models/User");
const auth_1 = require("../utils/auth");
const authEmail_1 = require("../utils/email/authEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAcconunt = async (req, res) => {
        const { email, password } = req.body;
        const userExists = await User_1.User.findOne({ where: { email: email } });
        if (userExists) {
            const error = new Error("El usuario ya esta registrado");
            res.status(409).json({ error: error.message });
            return;
        }
        try {
            const user = await User_1.User.create(req.body);
            user.password = await (0, auth_1.hashPassword)(password);
            const token = (0, auth_1.generateToken)();
            if (process.env.NODE_ENV !== 'production') {
                //para el testingn en las variables globales de NODE creamos una 
                globalThis.cashTrackerConfirmationToken = token;
            }
            user.token = token;
            // const emailServise = new EmailService();
            // await emailServise.sendEmailWithToken(user.email, user.name, user.token);
            authEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: user.token
            });
            await user.save();
            res.status(201).json("Cuenta  creada , revisa tu email para confirmarla");
        }
        catch (error) {
            res.status(500).json({ error: error });
        }
    };
    static confirmAccout = async (req, res) => {
        const { token } = req.body;
        const user = await User_1.User.findOne({
            where: {
                token: token
            }
        });
        if (!user) {
            const error = new Error("token no valido");
            res.status(401).json({ error: error.message });
            return;
        }
        user.confirmed = true;
        user.token = ""; //borramso el token ya que es de solo un uso
        await user.save();
        res.status(200).json("Cuenta confirmada correctamente");
        console.log(user);
    };
    static Login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.User.findOne({ where: { email: email } });
            if (!user) {
                const error = new Error("Usuario no encontrado");
                res.status(404).json({ error: error.message });
                return;
            }
            if (!user.confirmed) {
                const error = new Error("La cuenta no ha sido confirmada");
                res.status(403).json({ error: error.message });
                return;
            }
            const passwordCorrect = await (0, auth_1.checkPassword)(password, user.password);
            if (!passwordCorrect) {
                const error = new Error("El password no es correcto");
                res.status(401).json({ error: error.message });
                return;
            }
            //retornar jsoWebToken si es correcto
            const jsonWebToken = (0, jwt_1.genrateJWT)(user.id);
            res.json(jsonWebToken);
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static forgortPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User_1.User.findOne({ where: { email: email } });
            if (!user) {
                const error = new Error(`Este correo no esta registrado: ${email}`);
                res.status(404).json({ error: error.message });
                return;
            }
            //generar token
            user.token = (0, auth_1.generateToken)();
            await user.save();
            //enviar email
            authEmail_1.AuthEmail.sendPasswordResetToken(user);
            res.json("Revisa tu E-mail y sigue las instrucciones");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExists = await User_1.User.findOne({ where: { token: token } });
            if (!tokenExists) {
                const error = new Error("token no valido");
                res.status(401).json({ error: error.message });
                return;
            }
            res.json("token valido , define tu nuevo password");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const user = await User_1.User.findOne({ where: { token: token } });
            if (!user) {
                const error = new Error("Token no valido");
                res.status(404).json({ error: error.message });
                return;
            }
            user.password = await (0, auth_1.hashPassword)(req.body.password);
            user.token = "";
            await user.save();
            res.json("El password se modifico correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un Error" });
        }
    };
    static user = async (req, res) => {
        res.json(req.user);
    };
    static updateCurrentPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const { id } = req.user;
        const user = await User_1.User.findByPk(id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const errro = new Error('El password actual es incorrecto');
            res.status(401).json({ errro: errro.message });
            return;
        }
        user.password = await (0, auth_1.hashPassword)(password);
        await user.save();
        res.status(200).json("El password se modifico correctamente");
    };
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const { id } = req.user;
        const user = await User_1.User.findByPk(id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto');
            res.status(401).json({ error: error.message });
            return;
        }
        res.status(200).json("Password Correcto");
    };
    static updateProfile = async (req, res) => {
        req.user.update(req.body);
        res.status(200).json("Perfil actualizado correctamente");
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map