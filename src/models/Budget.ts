import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
  AllowNull
} from "sequelize-typescript";
import Expense from "./Expense";
import { User } from "./User";


@Table({
  tableName: "budget"
})
class Budget extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100)
  })
  declare name: string;
  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL
  })
  declare amount: number;

  @HasMany(() => Expense, {  //un presupuesto puede tener muchos gastos
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare expenses:Expense[]

  @ForeignKey(()=> User)//un presupuesto pertenece a un usuario
  declare userId:number

  @BelongsTo(()=>User)
  declare user:User
}

export default Budget;
