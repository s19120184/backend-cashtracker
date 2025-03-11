"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const butgets_1 = require("../mocks/butgets");
const BudgetController_1 = require("../../controllers/BudgetController");
const Budget_1 = __importDefault(require("../../models/Budget"));
jest.mock("../../models/Budget", () => ({
    //agregamos los metodos que queremos sumular de nuestro modelo
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
}));
describe("BudgetController.getAll", () => {
    //funcion que se ejecuta antes de que cada test se ejecute
    beforeEach(() => {
        Budget_1.default.findAll.mockReset();
        Budget_1.default.findAll.mockImplementation((options) => {
            const updatedBudgets = butgets_1.budgets.filter((budget) => budget.userId === options.where.userId);
            return Promise.resolve(updatedBudgets);
        });
    });
    it("should retrive 2 budgets", async () => {
        //creamos el reques y el responso con mocks
        const req = (0, node_mocks_http_1.createRequest)({
            method: "GET",
            url: "/api/budgets",
            user: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getAll(req, res);
        const data = res._getJSONData();
        expect(data).toHaveLength(2);
        expect(res.statusCode).toBe(200);
    });
    it("shoud retrive 1 budget", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: "GET",
            url: "/api/budgets",
            user: { id: 2 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getAll(req, res);
        const data = res._getJSONData();
        expect(data).toHaveLength(1);
        expect(res.statusCode).toBe(200);
    });
    it("shoud retrive 0 budget", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: "GET",
            url: "/api/budgets",
            user: { id: 10 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getAll(req, res);
        const data = res._getJSONData();
        expect(data).toHaveLength(0);
        expect(res.statusCode).toBe(200);
        expect(res.statusCode).not.toBe(404);
    });
    //forsamos el catch
    it("should handle errors  when fetching budgets", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: "GET",
            url: "/api/budgets",
            user: { id: 10 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        Budget_1.default.findAll.mockRejectedValue(new Error());
        await BudgetController_1.BudgetController.getAll(req, res);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: "Hubo un error" });
    });
});
describe("BudgetController.create", () => {
    it("should create a new budget with statusCode 201", async () => {
        //para simular la funcion de save
        const mockBudget = {
            save: jest.fn().mockResolvedValue(true)
        };
        Budget_1.default.create.mockResolvedValue(mockBudget);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/budgets",
            user: { id: 1 },
            body: { name: "Presupesto Prueba", amount: 1000 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.create(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(201);
        expect(data).toBe("Presupuesto creado correctamente");
        expect(mockBudget.save).toHaveBeenCalled(); //verificar si la funcion se llamo
        expect(mockBudget.save).toHaveBeenCalledTimes(1);
        expect(Budget_1.default.create).toHaveBeenCalledWith(req.body); //se instancia con req.body?
    });
    it("should handle budget creation error", async () => {
        //para simular la funcion de save
        const mockBudget = {
            save: jest.fn()
        };
        Budget_1.default.create.mockRejectedValue(new Error());
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/budgets",
            user: { id: 1 },
            body: { name: "Presupesto Prueba", amount: 1000 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.create(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: "Hubo un error" });
        expect(mockBudget.save).not.toHaveBeenCalled(); //verificar si la funcion se llamo
        expect(Budget_1.default.create).toHaveBeenCalledWith(req.body);
    });
});
describe("BudgetController.getById", () => {
    //funcion que se ejecuta antes de que cada test se ejecute
    beforeEach(() => {
        Budget_1.default.findByPk.mockReset();
        Budget_1.default.findByPk.mockImplementation((id) => {
            const budget = butgets_1.budgets.filter((bud) => bud.id === id)[0];
            return Promise.resolve(budget);
        });
    });
    it("should return a budget Id 1 and 3 expenses", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: "GET",
            url: "/api/budgets:id",
            budget: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(3);
        expect(Budget_1.default.findByPk).toHaveBeenCalledTimes(1);
    });
    it("should return a budget Id 2 and 2 expenses", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: "GET",
            url: "/api/budgets:id",
            budget: { id: 2 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(2);
        expect(Budget_1.default.findByPk).toHaveBeenCalledTimes(1);
    });
});
describe('BudgetController.updateById', () => {
    it('should update the budget and return a success message', async () => {
        const budgetMock = {
            update: jest.fn().mockResolvedValue(true)
        };
        const req = (0, node_mocks_http_1.createRequest)({
            method: "PUT",
            url: "/api/budgets:BudgetId",
            budget: budgetMock,
            body: { name: 'presupuesto actualizado', amount: 5000 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.updatedById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual("Presupuesto actualizado correctamente");
        expect(budgetMock.update).toHaveBeenCalled();
        expect(budgetMock.update).toHaveBeenCalledTimes(1);
    });
});
describe('BudgetController.deleteById', () => {
    it('should delete the budget and return a success message', async () => {
        const budgetMock = {
            destroy: jest.fn().mockResolvedValue(true)
        };
        const req = (0, node_mocks_http_1.createRequest)({
            method: "DELETE",
            url: "/api/budgets:BudgetId",
            budget: budgetMock,
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.deleteById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual("Presupuesto eliminado");
        expect(budgetMock.destroy).toHaveBeenCalled();
        expect(budgetMock.destroy).toHaveBeenCalledTimes(1);
    });
    it('update the budget return error 500', async () => {
        const budgetMock = {
            destroy: jest.fn()
        };
        budgetMock.destroy.mockRejectedValue(new Error());
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/budgets:BudgetId",
            budget: budgetMock,
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.deleteById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: "Hubo un error" });
    });
});
//# sourceMappingURL=budgetController.test.js.map