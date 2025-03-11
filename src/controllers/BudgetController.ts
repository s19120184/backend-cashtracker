import type { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => { 

    try {
      const budgets = await Budget.findAll({
         order: [["amount", "ASC"]],

        //todo: filtrar por el usuario autenticado
        where:{
          userId: req.user.id,
        }
      });

      res.json(budgets);
      
    } catch (error) {
       //res.send(error)
       res.status(500).json({ error: "Hubo un error" });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const butget = await  Budget.create(req.body);

      //asigamos la relacion del usuario al presupuesto
      butget.userId= req.user.id;
      await butget.save();

      res.status(201).json("Presupuesto creado correctamente");
    } catch (error) {
      //res.send(error)
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static getById = async (req: Request, res: Response) => {

    //todo
    //obtenemos el presupuesto incluyendo los sus gastos
    const budget = await Budget.findByPk(req.budget.id, {
      include: [Expense]
    });

    res.json(budget);
  };

  static updatedById = async (req: Request, res: Response) => {
    //const {name, amount, id} = req.budget
    await req.budget.update(req.body);
    res.json("Presupuesto actualizado correctamente");
  };
  
  static deleteById = async (req: Request, res: Response) => {
    try {
      await req.budget.destroy();

      res.json("Presupuesto eliminado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
