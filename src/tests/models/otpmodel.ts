import mongoose from 'mongoose';
import ConnectDB from '../../database/connect';
import Otp from '../../database/models/otp';
import { User } from '../../database/models/userModel';

describe('OTP Model', () => {
    beforeAll(async () => {
        await ConnectDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it ("Should Create a new OTP", async () => {

        const UserData = {
            username: "testuser",
            email: "johndoe@test.com",
            first_name: "John",
            last_name: "Doe",
            password: "testpassword"
        };

        const user = new User(UserData);
        const savedUser = await user.save();

        const otp = new Otp({user_id: savedUser._id});
        const savedOTP = await otp.save();

        expect(savedOTP._id).toBeDefined();
        expect(savedOTP.user_id).toBe(savedUser._id);
        expect(savedOTP.otp).toBeDefined();

        await Otp.deleteOne({ _id: savedOTP._id });
        await User.deleteOne({ _id: savedUser._id });
    });
});