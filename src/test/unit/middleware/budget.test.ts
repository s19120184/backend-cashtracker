import { createRequest, createResponse} from 'node-mocks-http'
import { existBudget, hasAccess } from '../../../middleware/existBuget';
import Budget from '../../../models/Budget';
import { budgets } from '../../mocks/butgets';

jest.mock("../../../models/Budget", () =>({
    findByPk: jest.fn()
}))

describe ('budget - validate BudgetExistes',()=>{

    it('should handle non-existent budget',async ()=>{

        (Budget.findByPk as jest.Mock).mockResolvedValue(null)

        const req = createRequest({
            params:{
                budgetId:1
            }
        })
      
        const res= createResponse()
        const next= jest.fn();
    
        await existBudget(req,res,next)
        const data= res._getJSONData()
        expect(res.statusCode).toBe(404)
        expect(data).toEqual({error: "Presupuesto no encontrado"})
        expect(next).not.toHaveBeenCalled()

    });

    it('should procced to next middeleware if budget exists', async () => {

        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0])

        const req = createRequest({
            params:{
                budgetId:1
            }
        })
      
        const res= createResponse()
        const next= jest.fn();

        await existBudget(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(req.budget).toEqual(budgets[0])

    })
    it('should handle non-existent budget', async()=>{

        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            params:{
                budgetId:1
            }
        })
      
        const res= createResponse()
        const next= jest.fn();

        await existBudget(req, res, next)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(500)
        expect(data).toEqual({error: 'Hubo un error'})
        expect(next).not.toHaveBeenCalled()

    })
})

describe('budget - validate access User',()=>{
    it('should validate user - no validt user',()=>{

        const req = createRequest({
            budget:{ userId: 1 },
            user:{id: 3}
        })
      
        const res= createResponse()
        const next= jest.fn();

      hasAccess(req, res, next)
      const data= res._getJSONData()
      expect(res.statusCode).toBe(401)
      expect(data).toEqual({error : "Accion no valida" })
      expect(next).not.toHaveBeenCalled()

    })

    it('should continue next fuction',()=>{
        const req = createRequest({
            budget:{ userId: 1 },
            user:{id: 1}
        })
      
        const res= createResponse()
        const next= jest.fn();

      hasAccess(req, res, next)
     
      expect(res.statusCode).toBe(200)
      expect(next).toHaveBeenCalled()

    })
})