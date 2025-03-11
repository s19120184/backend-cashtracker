import { Request, Response, NextFunction } from 'express'
import { body, param, validationResult } from 'express-validator'
import Expense from '../models/Expense'




declare global{
   namespace Express{
       interface Request{
           expense?: Expense
       }
   }
}

export const expensesExist =async (req: Request, res: Response,next: NextFunction) => {

   try {
      const {expensesId} = req.params
      const expense = await Expense.findByPk(expensesId)
      
      if(!expense){
         res.status(404).json({error:'El gasto no Existe'})
         return
      }
      req.expense = expense
      next()
      
   } catch (error) {
      res.status(500).json({error: "Hubo un Error"})
   }
      
}

export const validateExpenseInpunt =async (req: Request, res:Response, next: NextFunction) => {
    await body("name")
       .notEmpty()
       .withMessage("El nombre del gasto no puede ir vacio").run(req)
    await body("amount")
       .notEmpty()
       .withMessage("La cantidad del gasto no puede ir vacio")
       .isNumeric()
       .withMessage("cantidad no valida")
       .custom((value) => value > 0)
       .withMessage("El gasto deve ser mayor a 0").run(req)

       let errors = validationResult(req)
       if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
            return
       }
       next()
     
}

export const validateExpenseId= async (req: Request, res: Response, next: NextFunction) => {
   await param('expensesId').isInt().custom(value=> value> 0).withMessage("ID no valido").run(req)
   
   let errors= validationResult(req)
   if(!errors.isEmpty()) {
      res.status(400).json({erros:errors.array()})
      return
   }
   next()
}


export const belongsToBudget= async(req: Request, res: Response, next: NextFunction)=>{
    if(req.budget.id !== req.expense.budgetId){
       const error = new Error('Accion no valida')
       return res.status(403).json({errro: error.message})
    }
    next()
}
