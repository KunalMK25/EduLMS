const express = require('express');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new course (Instructor only)
router.post('/', protect, authorize('instructor'), async (req, res) => {
    try {
        const { title, description, category, price, thumbnail } = req.body;
        const course = new Course({
            title,
            description,
            category,
            price,
            thumbnail,
            instructor: req.user._id
        });
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({}).populate('instructor', 'name email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
});

// Get instructor's created courses with enrollment count
router.get('/my-created-courses', protect, authorize('instructor'), async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id });
        const Enrollment = require('../models/Enrollment');

        const courseData = await Promise.all(courses.map(async (course) => {
            const count = await Enrollment.countDocuments({ course: course._id });
            return { ...course.toObject(), enrollmentCount: count };
        }));

        res.json(courseData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your courses', error: error.message });
    }
});

// Get enrolled students for a course (Instructor only)
router.get('/:id/students', protect, authorize('instructor'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const Enrollment = require('../models/Enrollment');
        const enrollments = await Enrollment.find({ course: req.params.id })
            .populate('user', 'name email');

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
});

// Get student's enrolled courses
router.get('/my-enrolled-courses', protect, authorize('student'), async (req, res) => {
    try {
        const Enrollment = require('../models/Enrollment');
        const enrollments = await Enrollment.find({ user: req.user._id }).populate({
            path: 'course',
            populate: { path: 'instructor', select: 'name' }
        });

        // Return just the course info, maybe with progress? 
        // Or return the full enrollment object which contains the course
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enrolled courses', error: error.message });
    }
});

// Get single course details
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name').populate('lessons');
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
});

// Add lesson to course (Instructor only)
router.post('/:id/lessons', protect, authorize('instructor'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            // Check if user is the instructor of this course or admin
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to update this course' });
            }

            const { title, type, content, duration, isFree } = req.body;
            const lesson = { title, type, content, duration, isFree };
            course.lessons.push(lesson);
            await course.save();
            res.status(201).json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding lesson', error: error.message });
    }
});

// Add Quiz (Instructor only)
router.post('/:id/quizzes', protect, authorize('instructor'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }
            course.quizzes.push(req.body);
            await course.save();
            res.status(201).json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding quiz', error: error.message });
    }
});

// Add Assignment (Instructor only)
router.post('/:id/assignments', protect, authorize('instructor'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }
            course.assignments.push(req.body);
            await course.save();
            res.status(201).json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding assignment', error: error.message });
    }
});

// Update Course (Instructor/Admin)
router.put('/:id', protect, authorize('instructor'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to update this course' });
            }

            course.title = req.body.title || course.title;
            course.description = req.body.description || course.description;
            course.category = req.body.category || course.category;
            course.price = req.body.price !== undefined ? req.body.price : course.price;
            course.thumbnail = req.body.thumbnail || course.thumbnail;

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error: error.message });
    }
});

// Delete Course (Instructor/Admin)
router.delete('/:id', protect, authorize('instructor'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to delete this course' });
            }
            await course.deleteOne();
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
});

// Enroll in course
router.post('/:id/enroll', protect, authorize('student'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const Enrollment = require('../models/Enrollment');
        const existingEnrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        const enrollment = await Enrollment.create({
            user: req.user._id,
            course: req.params.id
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Enrollment failed', error: error.message });
    }
});

// Check enrollment status
router.get('/:id/enrollment', protect, authorize('student'), async (req, res) => {
    try {
        const Enrollment = require('../models/Enrollment');
        const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id });
        res.json({ enrolled: !!enrollment });
    } catch (error) {
        res.status(500).json({ message: 'Error checking enrollment', error: error.message });
    }
});

// Submit Quiz
router.post('/:id/quizzes/:quizId/submit', protect, authorize('student'), async (req, res) => {
    try {
        const Enrollment = require('../models/Enrollment');
        const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id });
        if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });

        const course = await Course.findById(req.params.id);
        const quiz = course.quizzes.id(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        const { answers } = req.body; // Array of selected indices
        let score = 0;
        quiz.questions.forEach((q, index) => {
            if (answers[index] === q.correctAnswer) score++;
        });
        const percentage = (score / quiz.questions.length) * 100;

        // Update enrollment
        const existingSubmission = enrollment.completedQuizzes.find(q => q.quizId.toString() === req.params.quizId);
        if (existingSubmission) {
            existingSubmission.score = percentage;
            existingSubmission.completedAt = Date.now();
        } else {
            enrollment.completedQuizzes.push({ quizId: req.params.quizId, score: percentage });
        }

        // Recalculate total progress (simplified: lessons * 1, quizzes * 1)
        // Ideally should be weighted, but simple average for now
        // This is complex, will do a simple progress update in a separate helper or here if brief

        await enrollment.save();
        res.json({ message: 'Quiz submitted', score: percentage });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting quiz', error: error.message });
    }
});

// Submit Assignment
router.post('/:id/assignments/:assignmentId/submit', protect, authorize('student'), async (req, res) => {
    try {
        const Enrollment = require('../models/Enrollment');
        const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id });
        if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });

        const { content } = req.body;

        const existingSubmission = enrollment.submittedAssignments.find(a => a.assignmentId.toString() === req.params.assignmentId);
        if (existingSubmission) {
            existingSubmission.content = content;
            existingSubmission.submittedAt = Date.now();
        } else {
            enrollment.submittedAssignments.push({ assignmentId: req.params.assignmentId, content });
        }

        await enrollment.save();
        res.json({ message: 'Assignment submitted' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting assignment', error: error.message });
    }
});

// Delete Lesson
router.delete('/:id/lessons/:lessonId', protect, authorize('instructor'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course.instructor.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        course.lessons = course.lessons.filter(l => l._id.toString() !== req.params.lessonId);
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lesson' });
    }
});

// Delete Quiz
router.delete('/:id/quizzes/:quizId', protect, authorize('instructor'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course.instructor.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        course.quizzes = course.quizzes.filter(q => q._id.toString() !== req.params.quizId);
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quiz' });
    }
});

// Delete Assignment
router.delete('/:id/assignments/:assignmentId', protect, authorize('instructor'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course.instructor.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        course.assignments = course.assignments.filter(a => a._id.toString() !== req.params.assignmentId);
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assignment' });
    }
});

module.exports = router;
