import express from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  getAllIssues,
  getIssuesByUserId,
  getIssueById,
  createIssue,
  updateIssueStatus,
  toggleUpvote
} from '../../database/db.js';
import { protect } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `issue-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

// @route   GET /api/issues
// @desc    Get all civic issues
router.get('/', async (req, res) => {
  try {
    const issues = await getAllIssues();
    res.json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Server error retrieving issues' });
  }
});

// @route   GET /api/issues/my
// @desc    Get issues reported by logged-in user
router.get('/my', protect, async (req, res) => {
  try {
    const issues = await getIssuesByUserId(req.user._id || req.user.id);
    res.json(issues);
  } catch (error) {
    console.error('Error fetching user issues:', error);
    res.status(500).json({ message: 'Server error retrieving user issues' });
  }
});

// @route   GET /api/issues/:id
// @desc    Get single issue by id
router.get('/:id', async (req, res) => {
  try {
    const issue = await getIssueById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({ message: 'Server error retrieving issue' });
  }
});

// @route   POST /api/issues
// @desc    Create new civic report (supports multipart/form-data with photos)
router.post('/', upload.array('photos', 5), async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      latitude,
      longitude,
      address,
      aiPriority,
      aiCategory,
      aiSuggestion
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Build photo URLs
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = req.files.map(f => `/uploads/${f.filename}`);
    } else if (req.body.photos) {
      photoUrls = Array.isArray(req.body.photos) ? req.body.photos : [req.body.photos];
    } else {
      photoUrls = ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'];
    }

    let reporterId = 'citizen_demo_01';
    let reporterName = 'Citizen User';
    let reporterEmail = '';
    let reporterPhoto = '';

    if (req.user && (req.user._id || req.user.id)) {
      reporterId = req.user._id || req.user.id;
      reporterName = req.user.name || reporterName;
      reporterEmail = req.user.email || reporterEmail;
      reporterPhoto = req.user.profilePhoto || reporterPhoto;
    }

    const created = await createIssue({
      title,
      category: category || 'Other',
      description,
      status: 'submitted',
      address: address || 'Vadodara',
      latitude: Number(latitude) || 22.3072,
      longitude: Number(longitude) || 73.1812,
      photos: photoUrls,
      reportedById: reporterId,
      reporterName,
      reporterEmail,
      reporterPhoto,
      aiPriority: aiPriority || 'medium',
      aiCategory: aiCategory || category,
      aiSuggestion: aiSuggestion || ''
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ message: 'Server error creating issue report' });
  }
});

// @route   PUT /api/issues/:id
// @desc    Update issue status (Admin action)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updated = await updateIssueStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({ message: 'Server error updating issue' });
  }
});

// @route   POST /api/issues/:id/upvote
// @desc    Toggle upvote for issue
router.post('/:id/upvote', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const updated = await toggleUpvote(req.params.id, userId);
    if (!updated) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error upvoting issue:', error);
    res.status(500).json({ message: 'Server error upvoting issue' });
  }
});

export default router;
