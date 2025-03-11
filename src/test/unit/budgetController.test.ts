import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocks/butgets";
import { BudgetController } from "../../controllers/BudgetController";
import Budget from "../../models/Budget";

jest.mock("../../models/Budget", () => ({
  //agregamos los metodos que queremos sumular de nuestro modelo
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn()
}));

describe("BudgetController.getAll", () => {
  //funcion que se ejecuta antes de que cada test se ejecute
  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset();
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const updatedBudgets = budgets.filter(
        (budget) => budget.userId === options.where.userId
      );
      return Promise.resolve(updatedBudgets);
    });
  });

  it("should retrive 2 budgets", async () => {
    //creamos el reques y el responso con mocks
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 1 }
    });
    const res = createResponse();


    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(2);
    expect(res.statusCode).toBe(200);
  });



  it("shoud retrive 1 budget", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 2 }
    });
    const res = createResponse();

    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(1);
    expect(res.statusCode).toBe(200);
  });

  it("shoud retrive 0 budget", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 10 }
    });

    const res = createResponse();
    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(0);
    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
  });

  //forsamos el catch
  it("should handle errors  when fetching budgets", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 10 }
    });

    const res = createResponse();

    (Budget.findAll as jest.Mock).mockRejectedValue(new Error());
    await BudgetController.getAll(req, res);

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

    (Budget.create as jest.Mock).mockResolvedValue(mockBudget);

    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: { id: 1 },
      body: { name: "Presupesto Prueba", amount: 1000 }
    });
    const res = createResponse();
    await BudgetController.create(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(201);
    expect(data).toBe("Presupuesto creado correctamente");
    expect(mockBudget.save).toHaveBeenCalled(); //verificar si la funcion se llamo
    expect(mockBudget.save).toHaveBeenCalledTimes(1);
    expect(Budget.create).toHaveBeenCalledWith(req.body); //se instancia con req.body?
  });

  it("should handle budget creation error", async () => {
    //para simular la funcion de save
    const mockBudget = {
      save: jest.fn()
    };

    (Budget.create as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: { id: 1 },
      body: { name: "Presupesto Prueba", amount: 1000 }
    });
    const res = createResponse();
    await BudgetController.create(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toEqual({ error: "Hubo un error" });
    expect(mockBudget.save).not.toHaveBeenCalled(); //verificar si la funcion se llamo
    expect(Budget.create).toHaveBeenCalledWith(req.body);
  });
});

describe("BudgetController.getById", () => {
  //funcion que se ejecuta antes de que cada test se ejecute
  beforeEach(() => {
    (Budget.findByPk as jest.Mock).mockReset();
    (Budget.findByPk as jest.Mock).mockImplementation((id) => {
      const budget = budgets.filter((bud) => bud.id === id)[0];
      return Promise.resolve(budget);
    });
  });

  it("should return a budget Id 1 and 3 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets:id",
      budget: { id: 1 }
    });
    const res = createResponse();
    await BudgetController.getById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(3);
    expect(Budget.findByPk).toHaveBeenCalledTimes(1)
  });
  
  it("should return a budget Id 2 and 2 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets:id",
      budget: { id: 2 }
    });
    const res = createResponse();
    await BudgetController.getById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(2);
    expect(Budget.findByPk).toHaveBeenCalledTimes(1)
  });
});

describe('BudgetController.updateById',()=>{
    it('should update the budget and return a success message',async()=>{
        const budgetMock= {
            update:jest.fn().mockResolvedValue(true)
        }

        const req = createRequest({
            method: "PUT",
            url: "/api/budgets:BudgetId",
            budget: budgetMock,
            body:{name: 'presupuesto actualizado', amount:5000}
          });
          const res = createResponse();
          await BudgetController.updatedById(req, res);
        
          const data= res._getJSONData()
          expect(res.statusCode).toBe(200);
          expect(data).toEqual("Presupuesto actualizado correctamente")
          expect(budgetMock.update).toHaveBeenCalled()
          expect(budgetMock.update).toHaveBeenCalledTimes(1)
    })
})

describe('BudgetController.deleteById',()=>{
    it('should delete the budget and return a success message',async()=>{
        const budgetMock= {
            destroy:jest.fn().mockResolvedValue(true)
        }

        const req = createRequest({
            method: "DELETE",
            url: "/api/budgets:BudgetId",
            budget: budgetMock,
            
          });
          const res = createResponse();
          await BudgetController.deleteById(req, res);
        
          const data= res._getJSONData()
          expect(res.statusCode).toBe(200);
          expect(data).toEqual("Presupuesto eliminado")
          expect(budgetMock.destroy).toHaveBeenCalled()
          expect(budgetMock.destroy).toHaveBeenCalledTimes(1)
    });
    it('update the budget return error 500',async()=>{
        const budgetMock= {
            destroy:jest.fn()
        }

        
        budgetMock.destroy.mockRejectedValue(new Error());
        const req = createRequest({
            method: "POST",
            url: "/api/budgets:BudgetId",
            budget: budgetMock,
            
          });
          const res = createResponse();
          await BudgetController.deleteById(req, res);
        
          const data= res._getJSONData()
          expect(res.statusCode).toBe(500);
          expect(data).toEqual({ error: "Hubo un error" })
          
    })
})