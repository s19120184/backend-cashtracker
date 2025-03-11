"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
class ExpensesController {
    static getAll = async (req, res) => {
        const expenses = await Expense_1.default.findAll({
            where: { budgetId: req.params.budgetId }
        });
        res.status(200).json(expenses);
    };
    static create = async (req, res) => {
        try {
            const expense = await Expense_1.default.create(req.body);
            //req.budget ya lo tememos regisrtrado cuano usamos el middleware
            // para revisar el id del budget
            expense.budgetId = req.budget.id;
            await expense.save();
            res.status(201).json("Gasto agregado correctamente");
        }
        catch (error) {
            // res.status(500).json(error);
            res.status(500).json({ message: "Hubo un error" });
        }
    };
    static getById = async (req, res) => {
        res.status(200).json(req.expense);
    };
    static updateById = async (req, res) => {
        await req.expense.update(req.body);
        res.json('Actualizado correctamente');
    };
    static delteById = async (req, res) => {
        try {
            await req.expense.destroy();
            res.json("Eliminado correctamente");
        }
        catch (error) {
            res.status(500).json({ message: "Hubo un error" });
        }
    };
}
exports.ExpensesController = ExpensesController;
//# sourceMappingURL=ExpenseController.js.map