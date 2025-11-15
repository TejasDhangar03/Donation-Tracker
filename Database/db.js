import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = () => {
    const db_string = process.env.MONGO_URI_LOCAL;

    try {
        mongoose.connect(db_string)

        const mongodb = mongoose.connection;

        mongodb.on('connected', () => {
            console.log("Connected to MongoDB");
        });

        mongodb.on('error', () => {
            console.log("Error to connect with MongoDB");
        });

        mongodb.on('disconnected', () => {
            console.log("Disconnected from MongoDB");
        });

    }
    catch (err) {
        console.log("Error to connect with MongoDB", err);
    }
}

export default db;