const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }], // IDs of completed lesson sub-documents
    completedQuizzes: [{
        quizId: { type: mongoose.Schema.Types.ObjectId },
        score: { type: Number },
        completedAt: { type: Date, default: Date.now }
    }],
    submittedAssignments: [{
        assignmentId: { type: mongoose.Schema.Types.ObjectId },
        content: { type: String }, // Text or URL
        submittedAt: { type: Date, default: Date.now },
        grade: { type: String }, // e.g. "A", "90/100", "Pending"
        status: { type: String, enum: ['pending', 'graded'], default: 'pending' }
    }],
    progress: { type: Number, default: 0 }, // Percentage
    isCompleted: { type: Boolean, default: false }
});

// Ensure a user can't enroll in the same course twice
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
