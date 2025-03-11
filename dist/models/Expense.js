"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Budget_1 = __importDefault(require("./Budget"));
let Expense = class Expense extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100)
    }),
    __metadata("design:type", String)
], Expense.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL
    }),
    __metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Budget_1.default) //llave foranea
    ,
    __metadata("design:type", Number)
], Expense.prototype, "budgetId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Budget_1.default) //el gasto pertenece a un  presupuesto
    ,
    __metadata("design:type", Budget_1.default)
], Expense.prototype, "budget", void 0);
Expense = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'expense'
    })
], Expense);
exports.default = Expense;
//# sourceMappingURL=Expense.js.map