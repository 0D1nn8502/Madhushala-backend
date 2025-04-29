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
const mongoose_1 = __importDefault(require("mongoose"));
const Element_1 = require("../models/Element");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoURI = process.env.DB_CONN_STRING;
if (!mongoURI) {
    throw Error("Connection string gone");
}
const elements = [
    { name: 'Green Tree', imageUrl: 'https://madhushala-bucket.s3.ap-south-1.amazonaws.com/trees/1.3.png', scale: 0.5 },
    { name: 'Signboard', imageUrl: 'https://madhushala-bucket.s3.ap-south-1.amazonaws.com/props/sign_left.svg' },
    // Add more elements as needed
];
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(mongoURI);
        console.log('Connected to MongoDB');
        // Insert elements into the Element model
        yield Element_1.ElementModel.insertMany(elements);
        console.log('Elements added to the database');
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
    finally {
        yield mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
});
seedDatabase();
