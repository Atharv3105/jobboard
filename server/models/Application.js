const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  coverLetter: {
    type: String,
    required: [true, 'Please provide a cover letter'],
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
  },
  resumePath: {
    type: String,
    required: [true, 'Please upload a resume'],
  },
  resumeOriginalName: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
    default: 'pending',
  },
  employerNotes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate applications
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
