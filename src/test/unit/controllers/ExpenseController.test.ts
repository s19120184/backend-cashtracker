import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { ExpensesController } from "../../../controllers/ExpenseController";
import { expenses } from "../../mocks/expenses";


jest.mock("../../../models/Expense", () => ({
  create: jest.fn()
}));

describe("ExpensesController.create", () => {

  it("should create a new expense", async () => {
    const expenseMock = {
      save: jest.fn().mockResolvedValue(true)
    };

    (Expense.create as jest.Mock).mockReturnValue(expenseMock);

    const req = createRequest({
      method: "POST",
      url: "api/budget/:budgetId/expenses",
      body: { name: "test expense", amount: 500 },
      budget: { id: 1 }
    });

    const res = createResponse();
    await ExpensesController.create(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual("Gasto agregado correctamente");
    expect(expenseMock.save).toHaveBeenCalledTimes(1);
    expect(Expense.create).toHaveBeenCalledWith(req.body);
  });

  it("should error to create a new expense", async () => {
    const expenseMock = {
      save: jest.fn()
    };

    (Expense.create as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "api/budget/:budgetId/expenses",
      body: { name: "test expense", amount: 500 },
      budget: { id: 1 }
    });

    const res = createResponse();
    await ExpensesController.create(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: "Hubo un error" });
    expect(expenseMock.save).not.toHaveBeenCalled();
    expect(Expense.create).toHaveBeenCalledWith(req.body);
  });
});

describe("ExpensesController.getbyId", () => {
  it("should returr expense with ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenses[0]
    });

    const res = createResponse();
    await ExpensesController.getById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual(expenses[0]);
  });
});

describe("ExpensesController.updateById", () => {
  it("should updated expense", async () => {
    const expenseMock = {
      ...expenses[0],
      update: jest.fn()
    };

    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
      body: { name: "party", amount: 2000 }
    });

    const res = createResponse();

    await ExpensesController.updateById(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toEqual("Actualizado correctamente");
    expect(expenseMock.update).toHaveBeenCalled();
    expect(expenseMock.update).toHaveBeenCalledTimes(1);
  });
});

describe("ExpensesController.deleteById", () => {
  it("should updated expense", async () => {
    const expenseMock = {
      ...expenses[0],
      destroy: jest.fn()
    };

    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
    
    });

    const res = createResponse();

    await ExpensesController.delteById(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toEqual("Eliminado correctamente");
    expect(expenseMock.destroy).toHaveBeenCalled();
    expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
  });
});
