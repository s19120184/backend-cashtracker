import { Router } from "express";

import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import {
  existBudget,
  hasAccess,
  validateBudgetInpunt,
  validateId
} from "../middleware/existBuget";
import { ExpensesController } from "../controllers/ExpenseController";
import { belongsToBudget, expensesExist, validateExpenseId, validateExpenseInpunt } from "../middleware/expense";
import { autheticate } from "../middleware/auth";

const router = Router();
//protejemos las rutas solo usuarios autenticados
router.use(autheticate)

//para evitar repetri codigo podemos verificar que exitan los parametros desde este punto
router.param("budgetId", validateId);
router.param("budgetId", existBudget);
router.param("budgetId", hasAccess)//verificamos que el usuario tenga acceso a los presupuestos

//verificar que el expenseId sea valido y que exista el expense
router.param("expensesId", validateExpenseId)
router.param("expensesId", expensesExist)
router.param("expensesId", belongsToBudget)


//obtener todos los budgets
router.get("/", BudgetController.getAll);
//crear budget
router.post(
  "/",
  validateBudgetInpunt,
  handleInputErrors,
  BudgetController.create
);
//obtener budget por id
router.get("/:budgetId", handleInputErrors, BudgetController.getById);

//acutalizar budget
router.put(
  "/:budgetId",
  validateBudgetInpunt,
  handleInputErrors,

  BudgetController.updatedById
);

//eliminar budget
router.delete(
  "/:budgetId",

  handleInputErrors,
  BudgetController.deleteById
);

//Expenses

router.get("/:budgetId/expenses", ExpensesController.getAll);

router.post(
  "/:budgetId/expenses",
  validateExpenseInpunt,
  handleInputErrors,
  ExpensesController.create
);

router.get("/:budgetId/expenses/:expensesId", ExpensesController.getById);

router.put("/:budgetId/expenses/:expensesId", 
  validateExpenseInpunt,
  handleInputErrors,
  ExpensesController.updateById);

router.delete("/:budgetId/expenses/:expensesId",
  
  ExpensesController.delteById);

export default router;
