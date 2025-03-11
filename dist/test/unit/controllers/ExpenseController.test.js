"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const Expense_1 = __importDefault(require("../../../models/Expense"));
const ExpenseController_1 = require("../../../controllers/ExpenseController");
const expenses_1 = require("../../mocks/expenses");
jest.mock("../../../models/Expense", () => ({
    create: jest.fn()
}));
describe("ExpensesController.create", () => {
    it("should create a new expense", async () => {
        const expenseMock = {
            save: jest.fn().mockResolvedValue(true)
        };
        Expense_1.default.create.mockReturnValue(expenseMock);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "api/budget/:budgetId/expenses",
            body: { name: "test expense", amount: 500 },
            budget: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpensesController.create(req, res);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual("Gasto agregado correctamente");
        expect(expenseMock.save).toHaveBeenCalledTimes(1);
        expect(Expense_1.default.create).toHaveBeenCalledWith(req.body);
    });
    it("should error to create a new expense", async () => {
        const expenseMock = {
            save: jest.fn()
        };
        Expense_1.default.create.mockRejectedValue(new Error());
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "api/budget/:budgetId/expenses",
            body: { name: "test expense", amount: 500 },
            budget: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpensesController.create(req, res);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Hubo un error" });
        expect(expenseMock.save).not.toHaveBeenCalled();
        expect(Expense_1.default.create).toHaveBeenCalledWith(req.body);
    });
});
describe("ExpensesController.getbyId", () => {
    it("should returr expense with ID 1", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: "GET",
            url: "/api/budgets/:budgetId/expenses/:expenseId",
            expense: expenses_1.expenses[0]
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpensesController.getById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual(expenses_1.expenses[0]);
    });
});
describe("ExpensesController.updateById", () => {
    it("should updated expense", async () => {
        const expenseMock = {
            ...expenses_1.expenses[0],
            update: jest.fn()
        };
        const req = (0, node_mocks_http_1.createRequest)({
            method: "PUT",
            url: "/api/budgets/:budgetId/expenses/:expenseId",
            expense: expenseMock,
            body: { name: "party", amount: 2000 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpensesController.updateById(req, res);
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
            ...expenses_1.expenses[0],
            destroy: jest.fn()
        };
        const req = (0, node_mocks_http_1.createRequest)({
            method: "DELETE",
            url: "/api/budgets/:budgetId/expenses/:expenseId",
            expense: expenseMock,
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpensesController.delteById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual("Eliminado correctamente");
        expect(expenseMock.destroy).toHaveBeenCalled();
        expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=ExpenseController.test.js.map