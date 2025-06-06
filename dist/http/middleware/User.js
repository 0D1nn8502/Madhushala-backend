"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
// Auth Middleware // 
const authenticateToken = (req, res, next) => {
    const header = req.headers["authorization"];
    const token = header === null || header === void 0 ? void 0 : header.split(" ")[1];
    if (!token) {
        res.status(403).json({ message: "Unauthorized" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        req.userId = decoded.userId;
        next();
    }
    catch (e) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
};
exports.authenticateToken = authenticateToken;
