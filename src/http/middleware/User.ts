import {Request, Response, NextFunction} from "express"; 
import jwt from "jsonwebtoken"; 
import { JWT_PASSWORD } from "../config"; 
import { ObjectId } from "mongodb";

// Auth Middleware // 
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]; 
    const token = header?.split(" ")[1]; 

    if (!token) {
        res.status(403).json({message: "Unauthorized"})
        return; 
    }

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as { userId: ObjectId, username: string }   
        req.userId = decoded.userId;  
        next(); 

    } catch(e) {
        res.status(401).json({message: "Unauthorized"})
        return; 
    }
}






