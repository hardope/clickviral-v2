import mongoose from 'mongoose';
import ConnectDB from '../../database/connect';
import { User } from '../../database/models/userModel';
import request from 'supertest';
import { app } from '../../index';

describe('Create User', () => {
    beforeAll(async () => {
        await ConnectDB();
    });

    afterAll(async () => {
        // Cleanup any test data that might have been created
        await User.deleteMany({ email: /test.com$/ });
        await mongoose.connection.close();
    });

    it('should create a new user', async () => {
        const userData = {
            username: 'JohnDoe',
            email: 'johndoe' + Date.now() + '@test.com', // Unique email for every test run
            password: 'password',
            first_name: 'John',
            last_name: 'Doe',
        };

        try {
            const response = await request(app)
                .post('/user/create')
                .send(userData)
                .expect(201); // Checks if the status code is 201

            const userObject = await User.findOne({ email: userData.email });

            // Assertions to check if the response from the app is correct
            expect(userObject).toBeDefined();
            expect(response.body.data).toBeDefined();
            expect(response.body.data.id).toBe(userObject?._id.toString());
            expect(response.body.data.email).toBe(userData.email);
            expect(response.body.data.username).toBe(userData.username);
            expect(response.body.data.first_name).toBe(userData.first_name);
            expect(response.body.data.last_name).toBe(userData.last_name);

            // Ensure password is not returned in the response for security
            expect(response.body.data.password).toBeUndefined();
        } catch (error) {
            console.error('Testing error:', error);
            throw error; // Rethrow after logging
        }
    });
});
