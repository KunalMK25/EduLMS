const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_project')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

async function testLogin() {
    try {
        // Get all users
        const users = await User.find({}).select('name email');
        console.log('\n=== All Users in Database ===');
        users.forEach(user => {
            console.log(`- ${user.name} (${user.email})`);
        });

        // Prompt for email to test
        console.log('\n=== Testing Login ===');
        console.log('Enter the email and password you are trying to use:');

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Email: ', async (email) => {
            readline.question('Password: ', async (password) => {
                const user = await User.findOne({ email });

                if (!user) {
                    console.log('\n❌ User not found with this email');
                } else {
                    console.log(`\n✓ User found: ${user.name}`);
                    console.log(`Stored password hash: ${user.password.substring(0, 20)}...`);

                    const isMatch = await user.matchPassword(password);

                    if (isMatch) {
                        console.log('✅ Password matches! Login should work.');
                    } else {
                        console.log('❌ Password does NOT match!');
                        console.log('\nPossible issues:');
                        console.log('1. You are entering the wrong password');
                        console.log('2. The password in database was not properly hashed during registration');
                        console.log('3. There is a mismatch in the hashing algorithm');
                    }
                }

                readline.close();
                mongoose.connection.close();
            });
        });

    } catch (error) {
        console.error('Error:', error);
        mongoose.connection.close();
    }
}

testLogin();
