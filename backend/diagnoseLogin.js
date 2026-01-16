const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_project')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

async function diagnoseLogin() {
    try {
        // Get all users
        const users = await User.find({});
        console.log('\n=== Database Users ===');

        if (users.length === 0) {
            console.log('❌ No users found in database!');
            console.log('You need to register a user first.');
            mongoose.connection.close();
            return;
        }

        for (const user of users) {
            console.log(`\nUser: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Password Hash: ${user.password.substring(0, 30)}...`);

            // Check if password looks like a bcrypt hash
            const isBcryptHash = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
            if (!isBcryptHash) {
                console.log('⚠️  WARNING: Password does NOT appear to be a bcrypt hash!');
                console.log('   This user was likely created with a bug and needs to be re-registered.');
            } else {
                console.log('✓ Password appears to be properly hashed');
            }
        }

        console.log('\n=== Recommendations ===');
        console.log('1. Try the diagnostic test with your credentials');
        console.log('2. If password is not hashed, delete the user and re-register');
        console.log('3. Make sure backend server is restarted after the User.js fix');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

diagnoseLogin();
