"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLoginToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateLoginToken = (user) => {
    const pass = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(user, pass, { expiresIn: '1d' });
};
exports.generateLoginToken = generateLoginToken;
//# sourceMappingURL=utils.js.map