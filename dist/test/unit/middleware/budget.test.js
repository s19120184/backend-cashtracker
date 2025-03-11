"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const existBuget_1 = require("../../../middleware/existBuget");
const Budget_1 = __importDefault(require("../../../models/Budget"));
const butgets_1 = require("../../mocks/butgets");
jest.mock("../../../models/Budget", () => ({
    findByPk: jest.fn()
}));
describe('budget - validate BudgetExistes', () => {
    it('should handle non-existent budget', async () => {
        Budget_1.default.findByPk.mockResolvedValue(null);
        const req = (0, node_mocks_http_1.createRequest)({
            params: {
                budgetId: 1
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, existBuget_1.existBudget)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: "Presupuesto no encontrado" });
        expect(next).not.toHaveBeenCalled();
    });
    it('should procced to next middeleware if budget exists', async () => {
        Budget_1.default.findByPk.mockResolvedValue(butgets_1.budgets[0]);
        const req = (0, node_mocks_http_1.createRequest)({
            params: {
                budgetId: 1
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, existBuget_1.existBudget)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.budget).toEqual(butgets_1.budgets[0]);
    });
    it('should handle non-existent budget', async () => {
        Budget_1.default.findByPk.mockRejectedValue(new Error);
        const req = (0, node_mocks_http_1.createRequest)({
            params: {
                budgetId: 1
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, existBuget_1.existBudget)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: 'Hubo un error' });
        expect(next).not.toHaveBeenCalled();
    });
});
describe('budget - validate access User', () => {
    it('should validate user - no validt user', () => {
        const req = (0, node_mocks_http_1.createRequest)({
            budget: { userId: 1 },
            user: { id: 3 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        (0, existBuget_1.hasAccess)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(401);
        expect(data).toEqual({ error: "Accion no valida" });
        expect(next).not.toHaveBeenCalled();
    });
    it('should continue next fuction', () => {
        const req = (0, node_mocks_http_1.createRequest)({
            budget: { userId: 1 },
            user: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        (0, existBuget_1.hasAccess)(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(next).toHaveBeenCalled();
    });
});
//# sourceMappingURL=budget.test.js.map