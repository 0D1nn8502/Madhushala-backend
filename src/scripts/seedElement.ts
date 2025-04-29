import mongoose from 'mongoose';
import { ElementModel } from '../models/Element'; 
import dotenv from "dotenv"; 


dotenv.config(); 

const mongoURI = process.env.DB_CONN_STRING; 

if (!mongoURI) {
    throw Error("Connection string gone");  
}

const elements = [
    { name: 'Green Tree', imageUrl: 'https://madhushala-bucket.s3.ap-south-1.amazonaws.com/trees/1.3.png', scale: 0.5 },
    { name: 'Signboard', imageUrl: 'https://madhushala-bucket.s3.ap-south-1.amazonaws.com/props/sign_left.svg' },
    // Add more elements as needed
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(mongoURI); 
        console.log('Connected to MongoDB');

        // Insert elements into the Element model
        await ElementModel.insertMany(elements);

        console.log('Elements added to the database');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

seedDatabase();
