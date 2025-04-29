import mongoose, { Schema, Document } from 'mongoose';
import { number } from 'zod';


// Every user gets an avatar field at some point //  

// Define the interface for a space reference
interface ISpaceReference {
    spaceId: mongoose.Types.ObjectId;
    spaceName: string;
} 

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    spaces: ISpaceReference[];  
    description: string;
    image: string;
    avatar: string;   
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    spaces: [{ 
        spaceId: { type: Schema.Types.ObjectId, ref: 'Space' },
        spaceName: { type: String, required: true }
    }],  
    description: { type: String, default: "A brief intro" },
    image: { type: String, default: "" }, 
    avatar: { type: String, default: ""}    
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);




