"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addElementsSchema = exports.addMemberSchema = exports.joinSpaceSchema = exports.createSpaceSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    username: zod_1.z.string().nonempty(),
    email: zod_1.z.string().nonempty(),
    password: zod_1.z
        .string()
        .nonempty()
});
exports.signinSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string().min(8, "Password will be at least 8 characters long"),
});
// Will be added to spaceElements //  
const elementSchema = zod_1.z.object({
    elementName: zod_1.z.string(),
    elementId: zod_1.z.string(),
    x: zod_1.z.number(),
    y: zod_1.z.number()
});
// Space Related // 
exports.createSpaceSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Too small a name").max(20, "Too long a name"),
    spaceElements: zod_1.z.array(elementSchema) // 20 trees, 7 signposts // 
});
exports.joinSpaceSchema = zod_1.z.object({
    spaceId: zod_1.z.string(), //min?
    userId: zod_1.z.string()
});
// Currently, only owner can add members // 
exports.addMemberSchema = zod_1.z.object({
    ownerId: zod_1.z.string(),
    spaceId: zod_1.z.string(),
    userId: zod_1.z.string()
});
exports.addElementsSchema = zod_1.z.object({
    spaceId: zod_1.z.string(),
    elementId: zod_1.z.string(),
});
