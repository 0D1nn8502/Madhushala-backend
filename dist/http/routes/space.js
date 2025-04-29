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
const schemas_1 = require("../schemas");
const mongodb_1 = require("mongodb");
const cors_1 = __importDefault(require("cors"));
const Space_1 = require("../../models/Space");
const UserModel_1 = require("../../models/UserModel");
const Element_1 = require("../../models/Element");
const spaceRouter = express_1.default.Router();
spaceRouter.use(express_1.default.json());
spaceRouter.use((0, cors_1.default)());
spaceRouter.get('/elements', User_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const elements = yield Element_1.ElementModel.find();
        res.status(200).json(elements);
    }
    catch (error) {
        console.error("Error fetching elements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Create New Space // 
spaceRouter.post('/create', User_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = schemas_1.createSpaceSchema.safeParse(req.body);
        if (!parsedData.success) {
            console.log(JSON.stringify(parsedData));
            res.status(400).json({ message: "Validation failed" });
            return;
        }
        // Check spaces quota // 
        const user = yield UserModel_1.UserModel.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user.spaces.length > 0) {
            res.status(400).json({ message: "Only one space per user as of now" });
            return;
        }
        const { name, spaceElements } = parsedData.data;
        // Convert elementId to ObjectId
        const processedElements = spaceElements.map(spaceElement => (Object.assign(Object.assign({}, spaceElement), { elementId: mongodb_1.ObjectId.createFromHexString(spaceElement.elementId) // Convert elementId to ObjectId
         })));
        // Create new space // 
        const newSpace = new Space_1.SpaceModel({
            name,
            ownerId: req.userId,
            spaceElements: processedElements
        });
        const savedSpace = yield newSpace.save();
        // Check if savedSpace is defined
        if (!savedSpace) {
            res.status(500).json({ message: "Failed to create space in the database" });
            return;
        }
        // Add to user's spaces //  
        user.spaces.push({
            spaceId: savedSpace._id,
            spaceName: name
        });
        yield user.save();
        res.status(201).json({
            message: "Space created successfully",
            spaceId: savedSpace._id,
            space: savedSpace
        });
    }
    catch (error) {
        console.error("Error creating space:", error);
        res.status(500).json({ message: error });
    }
}));
// Join Space // 
spaceRouter.get('/join/:spaceId', User_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const spaceId = new mongodb_1.ObjectId(req.params.spaceId);
        const userId = req.userId;
        // Find the space
        const space = yield Space_1.SpaceModel.findById(spaceId);
        if (!space) {
            res.status(404).json({ message: "Space not found" });
            return;
        }
        // TO DO : (Permission Checks) //  
        res.status(200).json({
            spaceId: space._id,
            name: space.name,
            spaceElements: space.spaceElements
        });
    }
    catch (error) {
        console.error("Error joining space:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Get Online Spaces // 
spaceRouter.get('/online', User_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all spaces that are online
        const onlineSpaces = yield Space_1.SpaceModel.find({ isOnline: true })
            .populate('ownerId', 'username')
            .select('name ownerId isOnline');
        // Format the response (userName can later be included) // 
        const formattedSpaces = onlineSpaces.map(space => ({
            _id: space._id,
            name: space.name,
            owner: space.ownerId.username, // Probably not safe // 
            isOnline: space.isOnline
        }));
        res.status(200).json(formattedSpaces);
    }
    catch (error) {
        console.error("Error fetching online spaces:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = spaceRouter;
