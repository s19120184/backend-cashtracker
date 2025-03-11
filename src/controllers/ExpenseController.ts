import type { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpensesController {
  static getAll = async (req: Request, res: Response) => {
    const expenses = await Expense.findAll({
      where: { budgetId: req.params.budgetId }
    });

    res.status(200).json(expenses);
  };

  static create = async (req: Request, res: Response) => {
    try {
      const expense = await Expense.create(req.body);
      //req.budget ya lo tememos regisrtrado cuano usamos el middleware
      // para revisar el id del budget
      expense.budgetId = req.budget.id;
      await expense.save();
      res.status(201).json("Gasto agregado correctamente");
    } catch (error) {
      // res.status(500).json(error);
      res.status(500).json({ message: "Hubo un error" });
    }
  };

  static getById = async (req: Request, res: Response) => {
    res.status(200).json(req.expense);
  };

  static updateById = async (req: Request, res: Response) => {
        await req.expense.update(req.body)
        res.json('Actualizado correctamente')
  };

  static delteById = async (req: Request, res: Response) => {
    try {
      await req.expense.destroy();
      res.json("Eliminado correctamente");
    } catch (error) {
      res.status(500).json({ message: "Hubo un error" });
    }
  };
}
