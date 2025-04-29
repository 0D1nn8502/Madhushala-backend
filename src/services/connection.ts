import mongoose from "mongoose";
import dotenv from "dotenv";
import {UserModel, IUser } from "../models/UserModel"; // Import UserModel
import {SpaceModel, ISpace } from "../models/Space"; // Import SpaceModel

// Global Variables // 
export const collections: {
    users?: mongoose.Collection<IUser>;
    spaces?: mongoose.Collection<ISpace>; 
} = {};

// Initialize Connection // 
export async function connectToDatabase() {
    dotenv.config();

    const MongoConnString = process.env.DB_CONN_STRING;  

    if (!MongoConnString) {
        throw new Error("MongoDB connection string not defined");
    }

    console.log(MongoConnString); 

    try {
        await mongoose.connect(MongoConnString); 
      } catch (error) {
        console.log(error); 
    }
    

    const db = mongoose.connection;  

    // Check if the connection is successful
    db.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    db.once('open', () => {
        console.log("Connected to MongoDB successfully");
    }); 

    // Assign the collections
    collections.users = db.collection(UserModel.collection.name);
    collections.spaces = db.collection(SpaceModel.collection.name);

    console.log(`Successfully connected to database: ${db.name}`);
}



