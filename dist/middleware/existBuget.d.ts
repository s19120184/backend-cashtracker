import { Request, Response, NextFunction } from 'express';
import Budget from '../models/Budget';
declare global {
    namespace Express {
        interface Request {
            budget?: Budget;
        }
    }
}
export declare const existBudget: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const hasAccess: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateBudgetInpunt: (req: Request, res: Response, next: NextFunction) => Promise<void>;
