"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BudgetController_1 = require("../controllers/BudgetController");
const validation_1 = require("../middleware/validation");
const existBuget_1 = require("../middleware/existBuget");
const ExpenseController_1 = require("../controllers/ExpenseController");
const expense_1 = require("../middleware/expense");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
//protejemos las rutas solo usuarios autenticados
router.use(auth_1.autheticate);
//para evitar repetri codigo podemos verificar que exitan los parametros desde este punto
router.param("budgetId", existBuget_1.validateId);
router.param("budgetId", existBuget_1.existBudget);
router.param("budgetId", existBuget_1.hasAccess); //verificamos que el usuario tenga acceso a los presupuestos
//verificar que el expenseId sea valido y que exista el expense
router.param("expensesId", expense_1.validateExpenseId);
router.param("expensesId", expense_1.expensesExist);
router.param("expensesId", expense_1.belongsToBudget);
//obtener todos los budgets
router.get("/", BudgetController_1.BudgetController.getAll);
//crear budget
router.post("/", existBuget_1.validateBudgetInpunt, validation_1.handleInputErrors, BudgetController_1.BudgetController.create);
//obtener budget por id
router.get("/:budgetId", validation_1.handleInputErrors, BudgetController_1.BudgetController.getById);
//acutalizar budget
router.put("/:budgetId", existBuget_1.validateBudgetInpunt, validation_1.handleInputErrors, BudgetController_1.BudgetController.updatedById);
//eliminar budget
router.delete("/:budgetId", validation_1.handleInputErrors, BudgetController_1.BudgetController.deleteById);
//Expenses
router.get("/:budgetId/expenses", ExpenseController_1.ExpensesController.getAll);
router.post("/:budgetId/expenses", expense_1.validateExpenseInpunt, validation_1.handleInputErrors, ExpenseController_1.ExpensesController.create);
router.get("/:budgetId/expenses/:expensesId", ExpenseController_1.ExpensesController.getById);
router.put("/:budgetId/expenses/:expensesId", expense_1.validateExpenseInpunt, validation_1.handleInputErrors, ExpenseController_1.ExpensesController.updateById);
router.delete("/:budgetId/expenses/:expensesId", ExpenseController_1.ExpensesController.delteById);
exports.default = router;
//# sourceMappingURL=budgetRouter.js.map