"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../middleware/User");
const UserModel_1 = require("../../models/UserModel");
const userRouter = express_1.default.Router();
userRouter.use(express_1.default.json());
// Route to fetch user profile
userRouter.get('/profile', User_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user and exclude email and password fields
        const user = yield UserModel_1.UserModel.findById(req.userId).select('-email -passwordHash');
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
userRouter.get("/profile/:userId", User_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        // Exclude sensitive fields (email, passwordHash) — keep username/image/desc/spaces
        const user = yield UserModel_1.UserModel.findById(userId).select("-email -passwordHash -__v");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching other user’s profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = userRouter;
