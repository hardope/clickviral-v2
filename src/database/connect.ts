import connect from "mongoose";
import { MONGODB_URI } from "../utils/environment";

const connectDB = async () => {
    
    try {
        await connect.connect(MONGODB_URI);
        console.log('--------------MongoDB connected--------------');
    } catch (error) {
        console.log('----------MongoDB connection failed----------');
        console.error(error);
        process.exit(1);
    }
};

export default connectDB;