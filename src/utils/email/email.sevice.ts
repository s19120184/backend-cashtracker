import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
}

export class EmailService {
  private trasporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MAILER_SECRET_KEY
    }
  });

  constructor() {}

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody } = options;
    try {
      const sentInformation = await this.trasporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody
      });

      return true;
      
    } catch (error) {
      return false;
    }
  }

  async sendEmailWithToken(to: string | string[], user: String, token: string) {
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
