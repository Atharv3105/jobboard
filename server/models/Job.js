const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description'],
  },
  requirements: {
    type: String,
  },
  responsibilities: {
    type: String,
  },
  company: {
    type: String,
    required: [true, 'Please provide company name'],
  },
  companyLogo: String,
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    required: [true, 'Please specify job type'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'Technology',
      'Marketing',
      'Finance',
      'Healthcare',
      'Education',
      'Design',
      'Sales',
      'Engineering',
      'Customer Service',
      'HR',
      'Legal',
      'Operations',
      'Other',
    ],
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['hour', 'month', 'year'], default: 'year' },
  },
  skills: [String],
  experience: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    default: 'mid',
  },
  deadline: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for text search
JobSchema.index({
  title: 'text',
  description: 'text',
  company: 'text',
  location: 'text',
});

module.exports = mongoose.model('Job', JobSchema);
