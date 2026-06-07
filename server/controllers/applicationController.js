const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('../config/email');
const path = require('path');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate)
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check job exists
    const job = await Job.findById(jobId).populate('postedBy', 'email name');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (!job.isActive) {
      return res
        .status(400)
        .json({ success: false, message: 'This job is no longer accepting applications' });
    }

    // Check for deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed',
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'Please upload a resume' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resumePath: `uploads/resumes/${req.file.filename}`,
      resumeOriginalName: req.file.originalname,
    });

    // Email to candidate
    await sendEmail({
      to: req.user.email,
      subject: `✅ Application Submitted — ${job.title}`,
      text: `Hi ${req.user.name},\n\nYour application for "${job.title}" at ${job.company} has been submitted successfully!\n\nWe'll notify you when the employer reviews your application.\n\nGood luck!\n\nJobBoard Team`,
    });

    // Email to employer
    if (job.postedBy?.email) {
      await sendEmail({
        to: job.postedBy.email,
        subject: `📩 New Application for "${job.title}"`,
        text: `Hi ${job.postedBy.name},\n\nYou have a new application for your job posting "${job.title}".\n\nApplicant: ${req.user.name} (${req.user.email})\n\nLogin to your dashboard to review the application.\n\nJobBoard Team`,
      });
    }

    await application.populate('job', 'title company location');
    await application.populate('applicant', 'name email');

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }
    next(error);
  }
};

// @desc    Get candidate's applications
// @route   GET /api/applications/mine
// @access  Private (Candidate)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location type salary isActive')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a job (employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications',
      });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email skills bio location phone experience')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (employer)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, employerNotes } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job', 'title company postedBy')
      .populate('applicant', 'name email');

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: 'Application not found' });
    }

    if (
      application.job.postedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    application.status = status || application.status;
    application.employerNotes = employerNotes || application.employerNotes;
    await application.save();

    // Notify candidate of status change
    const statusMessages = {
      reviewed: 'Your application is being reviewed',
      shortlisted: '🎉 Great news! You have been shortlisted',
      rejected: 'Unfortunately, your application was not selected this time',
      accepted: '🎊 Congratulations! Your application has been accepted!',
    };

    if (statusMessages[status]) {
      await sendEmail({
        to: application.applicant.email,
        subject: `Application Update — ${application.job.title}`,
        text: `Hi ${application.applicant.name},\n\n${statusMessages[status]} for the position of "${application.job.title}" at ${application.job.company}.\n\n${employerNotes ? `Note from employer: ${employerNotes}\n\n` : ''}Best of luck!\n\nJobBoard Team`,
      });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
