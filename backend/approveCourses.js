const mongoose = require('mongoose');
require('dotenv').config();

// Define User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String
});
const User = mongoose.model('User', userSchema);

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    thumbnail: String,
    price: Number,
    isApproved: Boolean,
    lessons: Array,
    quizzes: Array,
    assignments: Array,
    createdAt: Date,
    updatedAt: Date
});

const Course = mongoose.model('Course', courseSchema);

async function approveAllCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_project');
        console.log('Connected to MongoDB\n');

        const pendingCourses = await Course.find({ isApproved: false });
        console.log(`Found ${pendingCourses.length} pending courses\n`);

        if (pendingCourses.length === 0) {
            console.log('✅ All courses are already approved!');
        } else {
            // Approve all courses
            const result = await Course.updateMany(
                { isApproved: false },
                { $set: { isApproved: true } }
            );

            console.log(`✅ Approved ${result.modifiedCount} courses!\n`);

            // Show approved courses
            const approvedCourses = await Course.find({ isApproved: true });
            console.log('📚 Now available courses:');
            approvedCourses.forEach((course, idx) => {
                console.log(`   ${idx + 1}. ${course.title} - ₹${course.price}`);
            });
        }

        await mongoose.connection.close();
        console.log('\n✅ Done!');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

approveAllCourses();
