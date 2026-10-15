import express from 'express';
import { findUserById, updateUserProfile } from '../../database/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get logged in user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await findUserById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error retrieving user profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address, profilePhoto } = req.body;
    const updated = await updateUserProfile(req.user._id || req.user.id, {
      name,
      phone,
      address,
      profilePhoto
    });

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating user profile' });
  }
});

export default router;
