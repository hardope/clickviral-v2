import mongoose from 'mongoose';
import { User, securityPreferences } from './database/models/userModel';
import connectDB from './database/connect';
import readlineSync from 'readline-sync';

async function createAdmin() {
    try {
        await connectDB(); // Connect to the database

        let username = readlineSync.question('Enter username: ');

        // Check if the username exists
        let existingUsername = await User.findOne({ username });
        while (existingUsername) {
            console.log('Username already exists. Please choose another.');
            username = readlineSync.question('Enter username: ');
            existingUsername = await User.findOne({ username });
        }

        let email = readlineSync.question('Enter email: ');

        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        while (!emailRegex.test(email)) {
            console.log('Invalid email. Please enter a valid email address.');
            email = readlineSync.question('Enter email: ');
        }

        // Check if the email exists
        let existingEmail = await User.findOne({ email });
        while (existingEmail) {
            console.log('Email already exists. Please choose another.');
            email = readlineSync.question('Enter email: ');
            existingEmail = await User.findOne({ email });
        }

        const password = readlineSync.question('Enter password: ', {
            hideEchoBack: true, // Hide the password input
        });
        const firstName = readlineSync.question('Enter first name: ');
        const lastName = readlineSync.question('Enter last name: ');

        let twoFactorAuth = readlineSync.question('Enable two-factor authentication? (yes/no): ');
        while (twoFactorAuth !== 'yes' && twoFactorAuth !== 'no') {
            console.log('Invalid input. Please enter "yes" or "no".');
            twoFactorAuth = readlineSync.question('Enable two-factor authentication? (yes/no): ');
        }

        let loginNotifications = readlineSync.question('Enable login notifications? (yes/no): ');
        while (loginNotifications !== 'yes' && loginNotifications !== 'no') {
            console.log('Invalid input. Please enter "yes" or "no".');
            loginNotifications = readlineSync.question('Enable login notifications? (yes/no): ');
        }

        const admin = new User({
            username: username,
            password: password,
            first_name: firstName,
            last_name: lastName,
            email: email,
            is_admin: true,
            is_active: true,
        });

        const securityPreference = new securityPreferences({
            user_id: admin._id,
            two_factor_auth: twoFactorAuth === 'yes',
            login_notifications: loginNotifications === 'yes',
        });

        await admin.save();
        await securityPreference.save();
        console.log('Admin user created successfully!');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

createAdmin();
