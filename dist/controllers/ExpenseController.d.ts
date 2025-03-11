import type { Request, Response } from "express";
export declare class ExpensesController {
    static getAll: (req: Request, res: Response) => Promise<void>;
    static create: (req: Request, res: Response) => Promise<void>;
    static getById: (req: Request, res: Response) => Promise<void>;
    static updateById: (req: Request, res: Response) => Promise<void>;
    static delteById: (req: Request, res: Response) => Promise<void>;
}
