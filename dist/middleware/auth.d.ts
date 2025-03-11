import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export declare const autheticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const emailExists: (req: Request, res: Response, next: NextFunction) => Promise<void>;
