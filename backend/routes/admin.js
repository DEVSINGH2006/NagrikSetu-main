import express from 'express';
import { getAdminStats } from '../../database/db.js';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get administrative dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error retrieving admin statistics' });
  }
});

export default router;
