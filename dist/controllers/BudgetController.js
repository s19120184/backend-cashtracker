"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
const Expense_1 = __importDefault(require("../models/Expense"));
class BudgetController {
    static getAll = async (req, res) => {
        try {
            const budgets = await Budget_1.default.findAll({
                order: [["amount", "ASC"]],
                //todo: filtrar por el usuario autenticado
                where: {
                    userId: req.user.id,
                }
            });
            res.json(budgets);
        }
        catch (error) {
            //res.send(error)
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static create = async (req, res) => {
        try {
            const butget = await Budget_1.default.create(req.body);
            //asigamos la relacion del usuario al presupuesto
            butget.userId = req.user.id;
            await butget.save();
            res.status(201).json("Presupuesto creado correctamente");
        }
        catch (error) {
            //res.send(error)
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static getById = async (req, res) => {
        //todo
        //obtenemos el presupuesto incluyendo los sus gastos
        const budget = await Budget_1.default.findByPk(req.budget.id, {
            include: [Expense_1.default]
        });
        res.json(budget);
    };
    static updatedById = async (req, res) => {
        //const {name, amount, id} = req.budget
        await req.budget.update(req.body);
        res.json("Presupuesto actualizado correctamente");
    };
    static deleteById = async (req, res) => {
        try {
            await req.budget.destroy();
            res.json("Presupuesto eliminado");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
}
exports.BudgetController = BudgetController;
//# sourceMappingURL=BudgetController.js.map