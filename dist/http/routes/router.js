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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const connection_1 = require("../../services/connection");
const cors_1 = __importDefault(require("cors"));
exports.userRouter = express_1.default.Router();
exports.userRouter.use(express_1.default.json());
exports.userRouter.use((0, cors_1.default)());
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newUser = req.body;
        const result = yield ((_a = connection_1.collections.users) === null || _a === void 0 ? void 0 : _a.insertOne(newUser));
        result ? res.status(201).send(`Sign up successful, user ID : ${result.insertedId}`)
            : res.status(500).send("Sign up failed.");
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}));
