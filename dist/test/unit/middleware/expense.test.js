"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const Expense_1 = __importDefault(require("../../../models/Expense"));
const expenses_1 = require("../../mocks/expenses");
const expense_1 = require("../../../middleware/expense");
const existBuget_1 = require("../../../middleware/existBuget");
const butgets_1 = require("../../mocks/butgets");
jest.mock("../../../models/Expense", () => ({
    findByPk: jest.fn()
}));
describe("Expenses Middleware - validateExpenseExists", () => {
    beforeEach(() => {
        Expense_1.default.findByPk.mockImplementation((expenseId) => {
            const expense = expenses_1.expenses.filter((e) => e.id === expenseId)[0] ?? null;
            return Promise.resolve(expense);
        });
    });
    it("should handle a non_existent budget ", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            params: { expensesId: 120 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, expense_1.expensesExist)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: 'El gasto no Existe' });
        expect(next).not.toHaveBeenCalled();
    });
    it("should call next middleware if expense exists ", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            params: { expensesId: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, expense_1.expensesExist)(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    it("should hanndle internal server error ", async () => {
        Expense_1.default.findByPk.mockRejectedValue(new Error);
        const req = (0, node_mocks_http_1.createRequest)({
            params: { expensesId: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, expense_1.expensesExist)(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: "Hubo un Error" });
    });
    it("should prevent unauthorized user form adding expenses", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: '/api/bugets/:budgetId/expenses',
            budget: butgets_1.budgets[0],
            user: { id: 20 },
            body: { name: 'Expense test ', amount: 3000 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        (0, existBuget_1.hasAccess)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(401);
        expect(data).toEqual({ error: "Accion no valida" });
        expect(next).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=expense.test.js.map