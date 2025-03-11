import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from './routes/budgetRouter'
import authRouter from './routes/authRouter'



export async function connectDB(){
    try {
        await db.authenticate()
        db.sync()

        // db.close()
        console.log(colors.blue.bold("Atenticacion exitosa "))
        
    } catch (error) {
         console.log(error)
    }
}

connectDB()

const app = express()

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/budgets',budgetRouter)//rutat para budgets
app.use('/api/auth',authRouter)

export default app


