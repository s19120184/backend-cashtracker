import { Sequelize } from  'sequelize-typescript'
import dotenv from 'dotenv'

dotenv.config() 

export const db = new Sequelize( process.env.DATABASE_URL,{
       models:[__dirname + '/../models/**/*'],//para que encuetre los modelos
       define:{
              timestamps:false,// quitar cuado se creo 
       },
       logging: false,
       dialectOptions:{
         SSL:{
            require:false
        }
       }
})
