
import mongoose from 'mongoose';
import User from '../models/User.js';
import { hashPassword } from '../utils/auth.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/thehood';

const seedUser = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'test@gotham.com';
        const password = 'gotham123';
        const hashedPassword = await hashPassword(password);

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists, updating...');
            existingUser.password = hashedPassword;
            existingUser.role = 'council';
            existingUser.city = 'gotham';
            existingUser.name = 'Gotham Council Test';
            await existingUser.save();
            console.log('User updated successfully');
        } else {
            const newUser = new User({
                name: 'Gotham Council Test',
                email,
                password: hashedPassword,
                role: 'council',
                city: 'gotham',
            });
            await newUser.save();
            console.log('User created successfully');
        }
        
    } catch (error) {
        console.error('Error seeding user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

seedUser();
