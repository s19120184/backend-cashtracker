import { Request, Response, NextFunction } from 'express'
import Budget from '../models/Budget'
import { body, param, validationResult } from 'express-validator'




declare global{
    namespace Express{
        interface Request{
            budget?: Budget
        }
    }
}

export const existBudget  = async(req:Request, res:Response ,next:NextFunction)=>{
    const {budgetId} = req.params
        try {
            const butget= await Budget.findByPk(budgetId)

            if(!butget) {
                const errro = new Error('Presupuesto no encontrado')
                res.status(404).json({error: errro.message});
                return
            }
            req.budget= butget
            next()
            
        } catch (error) {
            res.status(500).json({error: "Hubo un error"});
        }
}


export const hasAccess= (req: Request, res: Response,next: NextFunction) =>{
           
    if(req.budget.userId !== req.user.id){
        const error = new Error('Accion no valida')
        res.status(401).json({error:error.message})
        return
    }
    next()
}

export const validateId= async (req: Request, res: Response, next: NextFunction) => {
    await param("budgetId")
        .isInt()
        .withMessage("Id no valido")
        .custom((value) => value > 0)
        .withMessage("Id no valido").run(req)
       
         let errors = validationResult(req)
            if (!errors.isEmpty()) {
                 res.status(400).json({ errors: errors.array() })
                 return
            }
        next()

}

export const validateBudgetInpunt =async (req: Request, res:Response, next: NextFunction) => {
      await body("name")
         .notEmpty()
         .withMessage("El nombre del presupuesto no puede ir vacio").run(req)
      await body("amount")
         .notEmpty()
         .withMessage("La cantidad del presupuesto no puede ir vacia")
         .isNumeric()
         .withMessage("cantidad no valida")
         .custom((value) => value > 0)
         .withMessage("El presupuesto deve ser mayor a 0").run(req)

        next()
}