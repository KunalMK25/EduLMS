const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_project')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

async function resetPassword(email, newPassword) {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`❌ User with email ${email} not found.`);
            mongoose.close();
            return;
        }

        user.password = newPassword;
        await user.save();
        console.log(`✅ Password successfully reset for ${email}`);
        console.log(`New password is now hashed correctly in the database.`);

        // Verification test
        const isMatch = await user.matchPassword(newPassword);
        console.log(`Verification: matchPassword check -> ${isMatch ? 'PASSED' : 'FAILED'}`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error resetting password:', error);
        mongoose.connection.close();
    }
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.log('Usage: node resetPassword.js <email> <newPassword>');
    process.exit(1);
}

resetPassword(email, password);
