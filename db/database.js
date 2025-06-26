import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () =>{
    try {
        const connect = await mongoose.connect(process.env.DATABASE_URL)
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}