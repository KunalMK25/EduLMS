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

async function checkCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_project');
        console.log('Connected to MongoDB');

        const allCourses = await Course.find({}).populate('instructor', 'name email');
        console.log(`\nTotal courses in database: ${allCourses.length}`);

        if (allCourses.length === 0) {
            console.log('\n❌ No courses found in database!');
            console.log('You need to create courses first.');
        } else {
            console.log('\n📚 Courses found:\n');
            allCourses.forEach((course, idx) => {
                console.log(`${idx + 1}. ${course.title}`);
                console.log(`   Status: ${course.isApproved ? '✅ APPROVED (Live)' : '⏳ PENDING (Not visible)'}`);
                console.log(`   Instructor: ${course.instructor?.name || 'Unknown'}`);
                console.log(`   Category: ${course.category}`);
                console.log(`   Price: ₹${course.price}`);
                console.log('');
            });

            const approvedCount = allCourses.filter(c => c.isApproved).length;
            const pendingCount = allCourses.filter(c => !c.isApproved).length;

            console.log(`\n📊 Summary:`);
            console.log(`   Approved (visible): ${approvedCount}`);
            console.log(`   Pending (hidden): ${pendingCount}`);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkCourses();
