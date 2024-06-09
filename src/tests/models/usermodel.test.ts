import mongoose from 'mongoose';
import ConnectDB from '../../database/connect';
import { User } from '../../apps/user/models/userModel';

describe('User Model', () => {
    beforeAll(async () => {
        await ConnectDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("Should Create a new user", async () => {
        const UserData = {
            username: "testuser",
            email: "testmail@mail.com",
            first_name: "Test",
            last_name: "User",
            password: "testpassword"
        };

        const user = new User(UserData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(UserData.username);
        expect(savedUser.email).toBe(UserData.email);
        expect(savedUser.first_name).toBe(UserData.first_name);
        expect(savedUser.last_name).toBe(UserData.last_name);
        expect(savedUser.password).not.toBe(UserData.password);

        await User.deleteOne({ _id: savedUser._id });
    });
});