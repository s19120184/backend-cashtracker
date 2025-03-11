
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  Default,
  Unique,
  AllowNull
} from "sequelize-typescript";
import Budget from "./Budget";

@Table({ tableName: "users" })
export class User extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50)
  })
  declare name: string;
  @AllowNull(false) //no puede ir vacio
  @Column({
    type: DataType.STRING(60)
  })
  declare password: string;
  @AllowNull(false) //no puede ir vacio
  @Unique(true) //evitar valores duplicados
  @Column({
    type: DataType.STRING(50)
  })
  declare email: string;
  @Column({
    type: DataType.STRING(6)
  })
  declare token: string;
  @Default(false) // valor por default
  @Column({
    type: DataType.BOOLEAN
  })
  declare confirmed: boolean;

  @HasMany(() => Budget, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  declare budget: Budget[];
}
