import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `issue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      default: 'Other'
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['submitted', 'review', 'progress', 'resolved'],
      default: 'submitted'
    },
    location: {
      address: {
        type: String,
        default: 'Vadodara'
      },
      coordinates: {
        lat: { type: Number, default: 22.3072 },
        lng: { type: Number, default: 73.1812 }
      }
    },
    latitude: {
      type: Number,
      default: 22.3072
    },
    longitude: {
      type: Number,
      default: 73.1812
    },
    photos: {
      type: [String],
      default: []
    },
    reportedBy: {
      _id: { type: String },
      name: { type: String, default: 'Citizen User' },
      email: { type: String, default: '' },
      profilePhoto: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }
    },
    reportedById: {
      type: String,
      ref: 'User'
    },
    aiPriority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    aiCategory: {
      type: String
    },
    aiSuggestion: {
      type: String
    },
    upvotes: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for fast searching, filtering, and map pin rendering
issueSchema.index({ createdAt: -1 });
issueSchema.index({ status: 1 });
issueSchema.index({ category: 1 });
issueSchema.index({ latitude: 1, longitude: 1 });

export const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
