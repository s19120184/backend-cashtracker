"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBudgetInpunt = exports.validateId = exports.hasAccess = exports.existBudget = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
const express_validator_1 = require("express-validator");
const existBudget = async (req, res, next) => {
    const { budgetId } = req.params;
    try {
        const butget = await Budget_1.default.findByPk(budgetId);
        if (!butget) {
            const errro = new Error('Presupuesto no encontrado');
            res.status(404).json({ error: errro.message });
            return;
        }
        req.budget = butget;
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
};
exports.existBudget = existBudget;
const hasAccess = (req, res, next) => {
    if (req.budget.userId !== req.user.id) {
        const error = new Error('Accion no valida');
        res.status(401).json({ error: error.message });
        return;
    }
    next();
};
exports.hasAccess = hasAccess;
const validateId = async (req, res, next) => {
    await (0, express_validator_1.param)("budgetId")
        .isInt()
        .withMessage("Id no valido")
        .custom((value) => value > 0)
        .withMessage("Id no valido").run(req);
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateId = validateId;
const validateBudgetInpunt = async (req, res, next) => {
    await (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("El nombre del presupuesto no puede ir vacio").run(req);
    await (0, express_validator_1.body)("amount")
        .notEmpty()
        .withMessage("La cantidad del presupuesto no puede ir vacia")
        .isNumeric()
        .withMessage("cantidad no valida")
        .custom((value) => value > 0)
        .withMessage("El presupuesto deve ser mayor a 0").run(req);
    next();
};
exports.validateBudgetInpunt = validateBudgetInpunt;
//# sourceMappingURL=existBuget.js.map