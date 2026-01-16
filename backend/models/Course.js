const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'pdf', 'text'], required: true },
    content: { type: String }, // URL for video/pdf or text content
    duration: { type: Number }, // In minutes (for videos)
    isFree: { type: Boolean, default: false } // Preview option
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true } // Index of options array
    }]
});

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date }
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    thumbnail: { type: String }, // URL to image
    price: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
    lessons: [lessonSchema],
    quizzes: [quizSchema],
    assignments: [assignmentSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
