import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";
import { expensesExist } from "../../../middleware/expense";
import { hasAccess } from "../../../middleware/existBuget";
import { budgets } from "../../mocks/butgets";

jest.mock("../../../models/Expense", () => ({
    findByPk: jest.fn()
}));
describe("Expenses Middleware - validateExpenseExists", () => {

  beforeEach(() => {
    (Expense.findByPk as jest.Mock).mockImplementation((expenseId) => {
      const expense = expenses.filter((e) => e.id === expenseId)[0] ?? null;
      return Promise.resolve(expense)
    });
  });

  it("should handle a non_existent budget ", async () => {
    const req = createRequest({
      params: { expensesId: 120 }
    });
    const res = createResponse();
    const next = jest.fn();
 
    await expensesExist(req, res, next);
    const data = res._getJSONData()
    expect(res.statusCode).toBe(404);
    expect(data).toEqual({error:'El gasto no Existe'})
    expect(next).not.toHaveBeenCalled()

  });

  it("should call next middleware if expense exists ", async () => {
    const req = createRequest({
      params: { expensesId: 1 }
    });
    const res = createResponse();
    const next = jest.fn();
 
    await expensesExist(req, res, next);
  
    expect(next).toHaveBeenCalled()

  });

  it("should hanndle internal server error ", async () => {

    (Expense.findByPk as jest.Mock).mockRejectedValue(new Error)
    const req = createRequest({
      params: { expensesId: 1 }
    });
    const res = createResponse();
    const next = jest.fn();
 
    await expensesExist(req, res, next);
  
    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toEqual({error: "Hubo un Error"})

  });

  it("should prevent unauthorized user form adding expenses", async() => {
    const req= createRequest({
        method: "POST",
        url:'/api/bugets/:budgetId/expenses',
        budget:budgets[0],
        user:{id: 20 },
        body:{name: 'Expense test ', amount:3000}
    })
    const res = createResponse()
    const next = jest.fn()

    hasAccess(req, res, next)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(401)
    expect(data).toEqual({error:"Accion no valida"})
    expect(next).not.toHaveBeenCalled()
  })


});
