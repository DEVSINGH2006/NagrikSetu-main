import mongoose from 'mongoose';
import User from './models/User.js';
import Issue from './models/Issue.js';
import { seedUsers, seedIssues } from './seedData.js';

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nagriksetu';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log(`🍃 Connected to MongoDB at: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);

    // Check if initial seeding is needed
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      console.log('Seeding initial NagrikSetu MongoDB records...');
      await User.insertMany(seedUsers);
      await Issue.insertMany(seedIssues);
      console.log(`Successfully seeded ${seedUsers.length} users and ${seedIssues.length} issues in MongoDB!`);
    }
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};

// Helper functions for User model
export const findUserByEmail = async (email) => {
  if (!email) return null;
  const user = await User.findOne({ email: email.trim().toLowerCase() }).lean();
  return user;
};

export const findUserById = async (id) => {
  if (!id) return null;
  const user = await User.findById(id).lean();
  return user;
};

export const createUser = async ({ id, name, email, password, role = 'citizen', phone = '', address = '', profilePhoto = '' }) => {
  const userId = id || `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const defaultPhoto = profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const user = new User({
    _id: userId,
    name,
    email: email.trim().toLowerCase(),
    password,
    role,
    phone,
    address,
    profilePhoto: defaultPhoto
  });

  await user.save();
  return user.toObject();
};

export const updateUserProfile = async (id, { name, phone, address, profilePhoto }) => {
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (address !== undefined) updateData.address = address;
  if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

  const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).lean();
  return updated;
};

// Helper functions for Issue model
export const getAllIssues = async () => {
  const issues = await Issue.find().sort({ createdAt: -1 }).lean();
  return issues;
};

export const getIssuesByUserId = async (userId) => {
  const issues = await Issue.find({
    $or: [
      { reportedById: userId },
      { 'reportedBy._id': userId }
    ]
  }).sort({ createdAt: -1 }).lean();
  return issues;
};

export const getIssueById = async (id) => {
  const issue = await Issue.findById(id).lean();
  return issue;
};

export const createIssue = async ({
  title,
  category,
  description,
  status = 'submitted',
  address,
  latitude,
  longitude,
  photos = [],
  reportedById,
  reporterName = 'Citizen User',
  reporterEmail = '',
  reporterPhoto = '',
  aiPriority = 'medium',
  aiCategory,
  aiSuggestion
}) => {
  const id = `issue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const lat = Number(latitude) || 22.3072;
  const lng = Number(longitude) || 73.1812;

  // Retrieve reporter info if available
  let reporter = {
    _id: reportedById || 'citizen_demo_01',
    name: reporterName,
    email: reporterEmail,
    profilePhoto: reporterPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  };

  if (reportedById) {
    const userDoc = await User.findById(reportedById).lean();
    if (userDoc) {
      reporter = {
        _id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        profilePhoto: userDoc.profilePhoto
      };
    }
  }

  const issue = new Issue({
    _id: id,
    title,
    category: category || 'Other',
    description,
    status,
    address: address || 'Vadodara',
    location: {
      address: address || 'Vadodara',
      coordinates: { lat, lng }
    },
    latitude: lat,
    longitude: lng,
    photos: Array.isArray(photos) ? photos : [photos],
    reportedBy: reporter,
    reportedById: reporter._id,
    aiPriority,
    aiCategory: aiCategory || category,
    aiSuggestion: aiSuggestion || '',
    upvotes: []
  });

  await issue.save();
  return issue.toObject();
};

export const updateIssueStatus = async (id, newStatus) => {
  const updated = await Issue.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  ).lean();
  return updated;
};

export const toggleUpvote = async (issueId, userId) => {
  const issue = await Issue.findById(issueId);
  if (!issue) return null;

  const index = issue.upvotes.indexOf(userId);
  if (index === -1) {
    issue.upvotes.push(userId);
  } else {
    issue.upvotes.splice(index, 1);
  }

  await issue.save();
  return issue.toObject();
};

export const getAdminStats = async () => {
  const totalIssues = await Issue.countDocuments();
  const citizenCount = await User.countDocuments({ role: 'citizen' });
  const usersCount = citizenCount + 1410; // aggregate municipal statistic

  const progressCount = await Issue.countDocuments({ status: { $in: ['progress', 'review'] } });
  const submittedCount = await Issue.countDocuments({ status: 'submitted' });
  const resolvedCount = await Issue.countDocuments({ status: 'resolved' });

  const resolvedRate = totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 0;

  return {
    totalIssues,
    resolvedRate,
    statusCounts: {
      progress: progressCount,
      submitted: submittedCount,
      resolved: resolvedCount
    },
    usersCount
  };
};

export { User, Issue };
export default connectDB;
