const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all users (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Get user stats (Admin only)
router.get('/stats', protect, authorize('admin'), async (req, res) => {
    try {
        const count = await User.countDocuments({});
        res.json({ totalUsers: count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

module.exports = router;
