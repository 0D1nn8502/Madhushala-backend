import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface ISpaceElement {
    elementId: ObjectId;
    x: number;
    y: number;
}

export interface ISpace extends Document {
    name: string;
    ownerId: ObjectId;
    members?: ObjectId[]; 
    spaceElements: ISpaceElement[];
    createdAt: Date; 
    isOnline: boolean; 
}

const SpaceSchema: Schema = new Schema({
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    spaceElements: [{
        elementId: { type: Schema.Types.ObjectId, ref: 'Element', required: true },
        x: { type: Number, required: true },
        y: { type: Number, required: true }, 
        link: {type: String, required: false}  
    }],
    createdAt: { type: Date, default: Date.now },
    isOnline: {type: Boolean, default: true}  
}); 

// Index for efficient queries // 
SpaceSchema.index({ ownerId: 1 });  


export const SpaceModel = mongoose.model<ISpace>('Space', SpaceSchema);




