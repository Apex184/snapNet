"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const userSchema_1 = __importStar(require("../models/userSchema"));
const secret = process.env.JWT_SECRET || 'examples';
async function auth(req, res, next) {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                Error: 'Kindly sign in as a user',
            });
            return;
        }
        let verified = jsonwebtoken_1.default.verify(token, secret);
        const { id } = verified;
        if (!verified) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({ Error: 'User not verified, you cannot access this route' });
        }
        req.user = id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_1.default.FORBIDDEN).json({ Error: 'User is not logged in' });
    }
}
exports.auth = auth;
async function checkAdmin(req, res, next) {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({
                error: 'Kindly sign in',
            });
        }
        let verified;
        try {
            verified = jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({ error: 'Invalid token' });
        }
        const { id } = verified;
        if (!verified) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({ error: 'User not verified, you cannot access this route' });
        }
        const user = await userSchema_1.default.findOne({ email: req.body.email });
        if (!user || user.userType !== userSchema_1.UserType.Admin) {
            return res.status(http_status_1.default.FORBIDDEN).json({ error: 'You are not authorized to access this resource' });
        }
        req.user = id;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
}
exports.checkAdmin = checkAdmin;
//# sourceMappingURL=auth.js.map