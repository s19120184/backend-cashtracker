"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.belongsToBudget = exports.validateExpenseId = exports.validateExpenseInpunt = exports.expensesExist = void 0;
const express_validator_1 = require("express-validator");
const Expense_1 = __importDefault(require("../models/Expense"));
const expensesExist = async (req, res, next) => {
    try {
        const { expensesId } = req.params;
        const expense = await Expense_1.default.findByPk(expensesId);
        if (!expense) {
            res.status(404).json({ error: 'El gasto no Existe' });
            return;
        }
        req.expense = expense;
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un Error" });
    }
};
exports.expensesExist = expensesExist;
const validateExpenseInpunt = async (req, res, next) => {
    await (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("El nombre del gasto no puede ir vacio").run(req);
    await (0, express_validator_1.body)("amount")
        .notEmpty()
        .withMessage("La cantidad del gasto no puede ir vacio")
        .isNumeric()
        .withMessage("cantidad no valida")
        .custom((value) => value > 0)
        .withMessage("El gasto deve ser mayor a 0").run(req);
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateExpenseInpunt = validateExpenseInpunt;
const validateExpenseId = async (req, res, next) => {
    await (0, express_validator_1.param)('expensesId').isInt().custom(value => value > 0).withMessage("ID no valido").run(req);
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ erros: errors.array() });
        return;
    }
    next();
};
exports.validateExpenseId = validateExpenseId;
const belongsToBudget = async (req, res, next) => {
    if (req.budget.id !== req.expense.budgetId) {
        const error = new Error('Accion no valida');
        return res.status(403).json({ errro: error.message });
    }
    next();
};
exports.belongsToBudget = belongsToBudget;
//# sourceMappingURL=expense.js.map