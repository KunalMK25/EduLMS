const mongoose = require('mongoose');
require('dotenv').config();

async function approveAll() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_project');
        console.log('Connected to MongoDB\n');

        // Update ALL documents in courses collection
        const db = mongoose.connection.db;
        const result = await db.collection('courses').updateMany(
            {},  // Empty filter = all documents
            { $set: { isApproved: true } }
        );

        console.log(`✅ Updated ${result.modifiedCount} courses`);
        console.log(`   Total matched: ${result.matchedCount}`);

        // Verify
        const approved = await db.collection('courses').countDocuments({ isApproved: true });
        const total = await db.collection('courses').countDocuments({});

        console.log(`\n📊 Status:`);
        console.log(`   Total courses: ${total}`);
        console.log(`   Approved: ${approved}`);
        console.log(`   Pending: ${total - approved}`);

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

approveAll();
