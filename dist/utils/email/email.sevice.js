"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    trasporter = nodemailer_1.default.createTransport({
        service: process.env.MAILER_SERVICE,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.MAILER_SECRET_KEY
        }
    });
    constructor() { }
    async sendEmail(options) {
        const { to, subject, htmlBody } = options;
        try {
            const sentInformation = await this.trasporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async sendEmailWithToken(to, user, token) {
        const subject = "Token de verificacion";
        const htmlBody = `
         <p>Hola ${user}, has creado tu cuenta en CashTracker ya casi esta todo listo , solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="http://localhost:5173/auth/confirm-account" >Confirmar Cuenta</a>
            <p>E ingresa el codigo: <b>${token}</b></p>
            <p>Este token expira en 10 minutos</p>
         `;
        return this.sendEmail({ to, subject, htmlBody });
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email.sevice.js.map