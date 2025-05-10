import mongoose, {Schema, Document} from "mongoose";
import { ObjectId } from "mongodb";


export interface IElement extends Document {
    name: string; 
    imageUrl: string; 
    scale?: number; 
    spaces?: mongoose.Types.ObjectId[]; 
}


export interface ISpaceElement extends Document {
    elementId: mongoose.Types.ObjectId; // Reference to the Element
    spaceId: mongoose.Types.ObjectId; // Reference to the Space
    x: number; // X position in the space
    y: number; // Y position in the space
    link?: string; 
    hoverText?: string; 
}


const ElementSchema: Schema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    scale: { type: Number, default: 1 },
    spaces: [{ type: Schema.Types.ObjectId, ref: 'Space' }] // Reference to spaces
});


const SpaceElementSchema: Schema = new Schema({
    elementId: {type: Schema.Types.ObjectId, ref: 'Element', required: true},
    spaceId: {type: Schema.Types.ObjectId, ref: 'Space', required: true}, 
    x: {type: Number, required: true}, 
    y: {type: Number, required: true}, 
    link: {type: String, default: null, required: false},   
    hoverText: {type: String, default: null, required: false}  
})


export const SpaceElementModel = mongoose.model<ISpaceElement>('SpaceElement', SpaceElementSchema);

export const ElementModel = mongoose.model<IElement> ('Element', ElementSchema); 
