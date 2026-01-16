const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_project')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

async function testSpecificLogin(email, password) {
    try {
        console.log(`\n=== Testing Login for: ${email} ===`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found with this email');
            mongoose.connection.close();
            return;
        }

        console.log(`✓ User found: ${user.name}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Password hash: ${user.password.substring(0, 30)}...`);

        const isMatch = await user.matchPassword(password);

        console.log(`\n=== Password Test ===`);
        console.log(`Entered password: "${password}"`);
        console.log(`Match result: ${isMatch}`);

        if (isMatch) {
            console.log('\n✅ SUCCESS! Password matches. Login should work.');
            console.log('\nIf login still fails in browser, check:');
            console.log('1. Backend server is running on http://localhost:5000');
            console.log('2. CORS is properly configured');
            console.log('3. Browser console for network errors');
        } else {
            console.log('\n❌ FAILED! Password does NOT match.');
            console.log('\nPossible solutions:');
            console.log('1. Double-check you are entering the correct password');
            console.log('2. Try resetting the password or creating a new user');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.log('Usage: node testSpecificLogin.js <email> <password>');
    console.log('Example: node testSpecificLogin.js student@gmail.com password123');
    process.exit(1);
}

testSpecificLogin(email, password);
