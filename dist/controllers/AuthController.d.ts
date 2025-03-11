import { Response, Request } from "express";
export declare class AuthController {
    static createAcconunt: (req: Request, res: Response) => Promise<void>;
    static confirmAccout: (req: Request, res: Response) => Promise<void>;
    static Login: (req: Request, res: Response) => Promise<void>;
    static forgortPassword: (req: Request, res: Response) => Promise<void>;
    static validateToken: (req: Request, res: Response) => Promise<void>;
    static updatePasswordWithToken: (req: Request, res: Response) => Promise<void>;
    static user: (req: Request, res: Response) => Promise<void>;
    static updateCurrentPassword: (req: Request, res: Response) => Promise<void>;
    static checkPassword: (req: Request, res: Response) => Promise<void>;
    static updateProfile: (req: Request, res: Response) => Promise<void>;
}
