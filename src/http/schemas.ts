import { ObjectId } from "mongodb";
import { z } from "zod"; 

export const signupSchema = z.object({
    username: z.string().nonempty(),  
    email: z.string().nonempty(), 
    password: z
             .string()
             .nonempty()   
});


export const signinSchema = z.object({
    username: z.string(), 
    password: z.string().min(8, "Password will be at least 8 characters long"),
}); 

// Will be added to spaceElements //  
const elementSchema = z.object({
    elementName: z.string(), 
    elementId: z.string(), 
    x: z.number(), 
    y: z.number() 
}); 


// Space Related // 
export const createSpaceSchema = z.object({
    name: z.string().min(3, "Too small a name").max(20, "Too long a name"),   
    spaceElements: z.array(elementSchema)  // 20 trees, 7 signposts // 
});


export const joinSpaceSchema = z.object({
    spaceId: z.string(), //min?
    userId: z.string()
});

// Currently, only owner can add members // 
export const addMemberSchema = z.object({
    ownerId : z.string(), 
    spaceId: z.string(), 
    userId: z.string()
});


export const addElementsSchema = z.object({
    spaceId: z.string(), 
    elementId: z.string(),   
});


// Extending Request Object // 
declare global {
    namespace Express {
        export interface Request {
            userId? : ObjectId;  
            spaceId? : ObjectId; 
        }
    }
} 