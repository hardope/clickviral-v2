import connect from "mongoose";
import { MONGODB_URI } from "./utils/environment";
import { User, securityPreferences, UserImage } from "./apps/user/models/userModel"; // Replace "YourModel" with your actual model name
import Otp from "./apps/user/models/otp"; // Replace "YourModel" with your actual model name

const connectDB = async () => {
    try {
        await connect.connect(MONGODB_URI);
        console.log('--------------MongoDB connected--------------');

        console.log('--------------Deleting all data--------------');

        await User.deleteMany({});
        await securityPreferences.deleteMany({});
        await UserImage.deleteMany({});
        await Otp.deleteMany({});

        await connect.disconnect();
        console.log('--------------MongoDB disconnected--------------');
    } catch (error) {
        console.log('----------MongoDB connection failed----------');
        console.error(error);
        process.exit(1);
    }
};

connectDB();