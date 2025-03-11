import { Table,Column, Model,DataType,ForeignKey,BelongsTo, AllowNull } from "sequelize-typescript";
import Budget from "./Budget";


@Table({
    tableName:'expense'
})
class Expense extends Model{
    @AllowNull(false)
    @Column({
        type:DataType.STRING(100)
    })
    declare name: string
    @AllowNull(false)
    @Column({
        type:DataType.DECIMAL
    })
    declare amount:number

    @ForeignKey(()=> Budget)//llave foranea
    declare budgetId:number

    @BelongsTo(()=>Budget)//el gasto pertenece a un  presupuesto
    declare budget:Budget
}

export default Expense