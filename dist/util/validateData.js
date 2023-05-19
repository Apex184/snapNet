"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Joi schema for input validation
exports.createAdminUserSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
//# sourceMappingURL=validateData.js.map