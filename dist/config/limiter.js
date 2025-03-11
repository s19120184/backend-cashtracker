"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000, // cada cunto tiempo pueden hacer peticioens
    limit: process.env.NODE_ENV === 'production' ? 5 : 100, //cuatas peticiones se pueden hacer
    message: { "error": "Has alcanzado el limite de peticiones" }
});
//# sourceMappingURL=limiter.js.map