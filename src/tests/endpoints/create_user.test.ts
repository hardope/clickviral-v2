import mongoose from 'mongoose';
import ConnectDB from '../../database/connect';
import { User, securityPreferences } from '../../apps/user/models/userModel';
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
            username: 'JohnDoe' + Date.now(),
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

    it('should create create security preferences for all users', async () => {
        const userData = {
            username: 'JohnDoe' + Date.now(),
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
            let securityPreferencesObject = await securityPreferences.findOne({ user_id: userObject?._id });
            if (!securityPreferencesObject) {
                throw new Error('Security preferences not created');
            }

            // Assertions to check if the response from the app is correct
            expect(securityPreferencesObject).toBeDefined();
            expect(response.body.data).toBeDefined();

            expect(securityPreferencesObject?.user_id.toString()).toBe(response.body.data.id);
            expect(securityPreferencesObject?.two_factor_auth).toBe(false);
            expect(securityPreferencesObject?.login_notifications).toBe(true);
        } catch (error) {
            console.error('Testing error:', error);
            throw error; // Rethrow after logging
        }
    });

    it('should return 400 if email is missing', async () => {
        const userData = {
            username: 'JohnDoe',
            password: 'password',
            first_name: 'John',
            last_name: 'Doe',
        };

        try {
            const response = await request(app)
                .post('/user/create')
                .send(userData)
                .expect(400); // Checks if the status code is 400

            // Assertions to check if the response from the app is correct
            expect(response.body.message).toBeDefined();
            expect(response.body.status).toBeDefined();
            expect(response.body.message).toBe('\"email\" is required');
            expect(response.body.status).toBe('error');
        } catch (error) {
            console.error('Testing error:', error);
            throw error; // Rethrow after logging
        }
    });

    it('should prevent creating a user with an existing email', async () => {
        const userData = {
            username: 'JohnDoe' + Date.now(),
            email: 'johndoe' + Date.now() + '@test.com', // Unique email for every test run
            password: 'password',
            first_name: 'John',
            last_name: 'Doe',
        };

        try {
            // Create a user with the same email
            await request(app).post('/user/create').send(userData).expect(201);

            // Try to create another user with the same email
            const response = await request(app)
                .post('/user/create')
                .send(
                    Object.assign({}, userData, {
                        username: 'JaneDoe',
                        first_name: 'Jane',
                        last_name: 'Doe',
                    })
                )
                .expect(400); // Checks if the status code is 400

            // Assertions to check if the response from the app is correct
            expect(response.body.message).toBeDefined();
            expect(response.body.status).toBeDefined();
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('email already exists');
        } catch (error) {
            console.error('Testing error:', error);
            throw error; // Rethrow after logging
        }
    });
});
