"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.checkPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = async (password) => {
    //salt cadena de caracters aleatorea ,10 rondas cantida de veces que re ejecuata el hash
    const salt = await bcrypt_1.default.genSalt(10);
    return await bcrypt_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
const checkPassword = async (password, passwordDb) => {
    const result = await bcrypt_1.default.compare(password, passwordDb);
    return result;
};
exports.checkPassword = checkPassword;
const generateToken = () => Math.floor(100000 + Math.random() * 900000).toString();
exports.generateToken = generateToken;
//# sourceMappingURL=auth.js.map