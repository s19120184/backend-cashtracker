"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genrateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genrateJWT = (id) => {
    //el primer parametro del sig deve ser un objeto
    const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    return token;
};
exports.genrateJWT = genrateJWT;
//# sourceMappingURL=jwt.js.map