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
exports.collections = void 0;
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const UserModel_1 = require("../models/UserModel"); // Import UserModel
const Space_1 = require("../models/Space"); // Import SpaceModel
// Global Variables // 
exports.collections = {};
// Initialize Connection // 
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv_1.default.config();
        const MongoConnString = process.env.DB_CONN_STRING;
        if (!MongoConnString) {
            throw new Error("MongoDB connection string not defined");
        }
        console.log(MongoConnString);
        try {
            yield mongoose_1.default.connect(MongoConnString);
        }
        catch (error) {
            console.log(error);
        }
        const db = mongoose_1.default.connection;
        // Check if the connection is successful
        db.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });
        db.once('open', () => {
            console.log("Connected to MongoDB successfully");
        });
        // Assign the collections
        exports.collections.users = db.collection(UserModel_1.UserModel.collection.name);
        exports.collections.spaces = db.collection(Space_1.SpaceModel.collection.name);
        console.log(`Successfully connected to database: ${db.name}`);
    });
}
