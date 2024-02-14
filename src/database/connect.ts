import connect from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {

    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set');
        process.exit(1);
    }

    try {
        await connect.connect(process.env.MONGODB_URI);
        console.log('--------------MongoDB connected--------------');
    } catch (error) {
        console.log('----------MongoDB connection failed----------');
        console.error(error);
        process.exit(1);
    }
};

export default connectDB;