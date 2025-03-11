import { Model } from "sequelize-typescript";
import Budget from "./Budget";
export declare class User extends Model {
    name: string;
    password: string;
    email: string;
    token: string;
    confirmed: boolean;
    budget: Budget[];
}
