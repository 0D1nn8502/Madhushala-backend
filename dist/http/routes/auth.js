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
const UserModel_1 = require("../../models/UserModel");
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config");
const schemas_1 = require("../schemas");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let numSignedin = 0;
const authRouter = express_1.default.Router();
authRouter.use(express_1.default.json());
authRouter.use((0, cors_1.default)());
// Signup // 
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = schemas_1.signupSchema.safeParse(req.body);
    if (!request.success) {
        res.status(400).json({
            error: "Not parsed"
        });
        console.log(request.error);
        return;
    }
    const { username, email, password } = request.data;
    // Check if the username or email already exists using UserModel
    const existingUser = yield UserModel_1.UserModel.findOne({
        $or: [{ username }, { email }]
    });
    if (existingUser) {
        if (existingUser.username === username) {
            res.status(400).json({ error: "Choose a different username" });
            return;
        }
        // If email exists // 
        if (existingUser.email === email) {
            res.status(400).json({ error: "Email already registered. Try signing in!" });
            return;
        }
    }
    const HashedPass = yield bcrypt_1.default.hash(password, 10);
    if (!HashedPass) {
        res.status(400).json({ error: "Error hashing password" });
        return;
    }
    const newUser = new UserModel_1.UserModel({
        username: username,
        email: email,
        spaces: [],
        description: "A brief intro",
        passwordHash: HashedPass, // Store hashed password // 
        image: "https://madhushala-bucket.s3.ap-south-1.amazonaws.com/profilepics/fallen.jpg",
        avatar: "https://madhushala-bucket.s3.ap-south-1.amazonaws.com/avatars/dude.png"
    });
    const result = yield newUser.save();
    if (result) {
        // Generate JWT token // 
        const token = jsonwebtoken_1.default.sign({ userId: result._id, name: newUser.username }, config_1.JWT_PASSWORD, { expiresIn: "3h" });
        res.status(201).json({
            message: 'Sign up successful',
            token,
            user: {
                username: newUser.username,
                spaces: newUser.spaces,
                image: newUser.image,
                avatar: newUser.avatar
            }
        });
        return;
    }
    else {
        res.status(500).json({ error: "Sign up failed." });
        return;
    }
}));
// Signin //  
authRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = yield schemas_1.signinSchema.safeParse(req.body);
        if (!request.success) {
            res.status(400).json({ error: "Validation failed " });
            return;
        }
        const { username, password } = request.data;
        const user = yield UserModel_1.UserModel.findOne({ username });
        if (!user) {
            res.status(401).json({ error: "Username does not exist" });
            return;
        }
        const passValid = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!passValid) {
            res.status(401).json({ error: "Incorrect password" });
            return;
        }
        // Generate Jwt // 
        const token = jsonwebtoken_1.default.sign({ userId: user._id, name: user.username }, config_1.JWT_PASSWORD, { expiresIn: '3h' });
        numSignedin += 1;
        console.log("Signed in : ", numSignedin);
        res.status(200).json({
            message: 'Success',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                image: user.image,
                spaces: user.spaces,
                description: user.description,
                avatar: user.avatar
            }
        });
    }
    catch (error) {
        console.error('Error during sign in : ', error);
        res.status(500).json({ error: "Sign in unsuccessful" });
    }
}));
exports.default = authRouter;
