import type { Request, Response } from "express";
export declare class BudgetController {
    static getAll: (req: Request, res: Response) => Promise<void>;
    static create: (req: Request, res: Response) => Promise<void>;
    static getById: (req: Request, res: Response) => Promise<void>;
    static updatedById: (req: Request, res: Response) => Promise<void>;
    static deleteById: (req: Request, res: Response) => Promise<void>;
}
