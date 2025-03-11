import type { Request,Response,NextFunction } from "express"
import { User } from "../models/User";
import jwt from "jsonwebtoken";

declare global{
    namespace Express{
        interface Request{
            user?: User
        }
    }
}

export const autheticate= async (req: Request, res: Response, next: NextFunction)=>{
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
          const decode = jwt.verify(token, process.env.JWT_SECRET);
    
          if (typeof decode === "object" && decode.id) {
             req.user= await User.findByPk(decode.id, {
              attributes: ["id", "name", "email"]
            });
            next()
          }
        } catch (error) {
          res.status(500).json({ error: "Token no valido" });
        }
}


//middleware para verificar que no exista el email
export const emailExists=async(req:Request, res:Response, next:NextFunction)=>{

    const { email } = req.body;

    const userExists = await User.findOne({ where: { email: email } });

    // console.log(userExists.id)
    // console.log(req.user.id)

    if (userExists.id !== req.user.id) {
      const error = new Error("El email ya esta registrado por otro usuario");
      res.status(409).json({ error: error.message });
      return;
    }

    next();
}