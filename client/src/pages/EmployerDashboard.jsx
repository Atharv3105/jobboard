import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import './DashboardPages.css';

const CATEGORIES = [
  'Technology', 'Marketing', 'Finance', 'Healthcare', 'Education',
  'Design', 'Sales', 'Engineering', 'Customer Service', 'HR', 'Legal', 'Operations', 'Other'
];

const EMPTY_JOB_FORM = {
  title: '', description: '', requirements: '', responsibilities: '',
  company: '', location: '', type: 'full-time', category: 'Technology',
  experience: 'mid', deadline: '',
  skills: '',
  salary: { min: '', max: '', currency: 'USD', period: 'year' },
};

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({ ...EMPTY_JOB_FORM, company: user?.company || '' });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getMyJobs();
      setMyJobs(res.data.data);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load your jobs' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('salary.')) {
      const field = name.split('.')[1];
      setJobForm((prev) => ({ ...prev, salary: { ...prev.salary, [field]: value } }));
    } else {
      setJobForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...jobForm,
        skills: jobForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        salary: {
          min: jobForm.salary.min ? Number(jobForm.salary.min) : undefined,
          max: jobForm.salary.max ? Number(jobForm.salary.max) : undefined,
          currency: jobForm.salary.currency,
          period: jobForm.salary.period,
        },
      };

      if (editingJob) {
        await jobsAPI.update(editingJob._id, payload);
        setMessage({ type: 'success', text: 'Job updated successfully!' });
      } else {
        await jobsAPI.create(payload);
        setMessage({ type: 'success', text: 'Job posted successfully!' });
      }

      setShowJobForm(false);
      setEditingJob(null);
      setJobForm({ ...EMPTY_JOB_FORM, company: user?.company || '' });
      fetchMyJobs();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save job' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setJobForm({
      ...job,
      skills: (job.skills || []).join(', '),
      salary: {
        min: job.salary?.min || '',
        max: job.salary?.max || '',
        currency: job.salary?.currency || 'USD',
        period: job.salary?.period || 'year',
      },
    });
    setShowJobForm(true);
    setActiveTab('post');
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    try {
      await jobsAPI.delete(jobId);
      setMessage({ type: 'success', text: 'Job deleted.' });
      fetchMyJobs();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete job.' });
    }
  };

  const viewApplicants = async (job) => {
    setSelectedJob(job);
    setActiveTab('applicants');
    try {
      const res = await applicationsAPI.getForJob(job._id);
      setApplications(res.data.data);
    } catch {
      setApplications([]);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await applicationsAPI.updateStatus(appId, { status });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status } : a))
      );
      setMessage({ type: 'success', text: 'Application status updated and candidate notified!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  const activeJobs = myJobs.filter((j) => j.isActive);
  const totalApplicants = 0; // Would be summed from actual data

  return (
    <div className="dashboard-page page-content">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Employer <span className="text-gradient">Dashboard</span></h1>
              <p className="page-subtitle">Welcome back, {user?.name} 👋</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingJob(null);
                setJobForm({ ...EMPTY_JOB_FORM, company: user?.company || '' });
                setShowJobForm(true);
                setActiveTab('post');
              }}
              id="post-job-btn"
            >
              + Post a Job
            </button>
          </div>

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-pill">
              <span>📋</span> {myJobs.length} Total Jobs
            </div>
            <div className="stat-pill">
              <span>✅</span> {activeJobs.length} Active
            </div>
            <div className="stat-pill">
              <span>👥</span> {user?.company || 'Your Company'}
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
            <button onClick={() => setMessage({ type: '', text: '' })} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
            My Jobs ({myJobs.length})
          </button>
          <button className={`tab ${activeTab === 'post' ? 'active' : ''}`} onClick={() => setActiveTab('post')}>
            {editingJob ? '✏️ Edit Job' : '+ Post Job'}
          </button>
          {selectedJob && (
            <button className={`tab ${activeTab === 'applicants' ? 'active' : ''}`} onClick={() => setActiveTab('applicants')}>
              Applicants — {selectedJob.title}
            </button>
          )}
        </div>

        {/* My Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : myJobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No jobs posted yet</h3>
                <p>Start attracting top talent by posting your first job</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('post')} id="post-first-job-btn">
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="employer-jobs-list">
                {myJobs.map((job) => (
                  <div key={job._id} className="employer-job-row card">
                    <div className="employer-job-info">
                      <h3><Link to={`/jobs/${job._id}`}>{job.title}</Link></h3>
                      <div className="job-meta-row">
                        <span>📍 {job.location}</span>
                        <span>💼 {job.type}</span>
                        <span>👁 {job.views} views</span>
                        <span className={job.isActive ? 'status-accepted' : 'status-rejected'}>
                          {job.isActive ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="employer-job-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => viewApplicants(job)}>
                        👥 View Applicants
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(job)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Post / Edit Job Tab */}
        {activeTab === 'post' && (
          <div className="job-form-container card">
            <h2>{editingJob ? 'Edit Job Posting' : 'Post a New Job'}</h2>

            <form onSubmit={handleFormSubmit} id="job-post-form">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="job-title">Job Title *</label>
                  <input id="job-title" name="title" required value={jobForm.title}
                    onChange={handleFormChange} className="form-control" placeholder="e.g. Senior React Developer" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="job-company">Company Name *</label>
                  <input id="job-company" name="company" required value={jobForm.company}
                    onChange={handleFormChange} className="form-control" placeholder="Your company" />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="job-location">Location *</label>
                  <input id="job-location" name="location" required value={jobForm.location}
                    onChange={handleFormChange} className="form-control" placeholder="e.g. New York, NY or Remote" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="job-type">Job Type *</label>
                  <select id="job-type" name="type" value={jobForm.type}
                    onChange={handleFormChange} className="form-control">
                    {['full-time', 'part-time', 'contract', 'internship', 'remote'].map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="job-category">Category *</label>
                  <select id="job-category" name="category" value={jobForm.category}
                    onChange={handleFormChange} className="form-control">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="job-experience">Experience Level</label>
                  <select id="job-experience" name="experience" value={jobForm.experience}
                    onChange={handleFormChange} className="form-control">
                    {['entry', 'mid', 'senior', 'executive'].map((e) => (
                      <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)} Level</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Salary */}
              <div className="salary-group">
                <label className="form-label">Salary Range in INR (Optional — e.g. 1200000 for ₹12L)</label>
                <div className="salary-row">
                  <input name="salary.min" type="number" value={jobForm.salary.min}
                    onChange={handleFormChange} className="form-control" placeholder="Min (₹)" id="salary-min" />
                  <span className="salary-dash">—</span>
                  <input name="salary.max" type="number" value={jobForm.salary.max}
                    onChange={handleFormChange} className="form-control" placeholder="Max (₹)" id="salary-max" />
                  <select name="salary.period" value={jobForm.salary.period}
                    onChange={handleFormChange} className="form-control salary-period" id="salary-period">
                    <option value="hour">/ hour</option>
                    <option value="month">/ month</option>
                    <option value="year">/ year</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="job-skills">Required Skills (comma-separated)</label>
                <input id="job-skills" name="skills" value={jobForm.skills}
                  onChange={handleFormChange} className="form-control"
                  placeholder="e.g. React, Node.js, MongoDB, TypeScript" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="job-deadline">Application Deadline</label>
                <input id="job-deadline" name="deadline" type="date" value={jobForm.deadline}
                  onChange={handleFormChange} className="form-control"
                  min={new Date().toISOString().split('T')[0]} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="job-description">Job Description *</label>
                <textarea id="job-description" name="description" required value={jobForm.description}
                  onChange={handleFormChange} className="form-control" rows={6}
                  placeholder="Describe the role, team, and what you're looking for..." />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="job-requirements">Requirements</label>
                <textarea id="job-requirements" name="requirements" value={jobForm.requirements}
                  onChange={handleFormChange} className="form-control" rows={4}
                  placeholder="List the qualifications and experience required..." />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="job-responsibilities">Responsibilities</label>
                <textarea id="job-responsibilities" name="responsibilities" value={jobForm.responsibilities}
                  onChange={handleFormChange} className="form-control" rows={4}
                  placeholder="Describe the key responsibilities of this role..." />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={formLoading} id="save-job-btn">
                  {formLoading ? (
                    <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
                  ) : (
                    editingJob ? '💾 Update Job' : '🚀 Post Job'
                  )}
                </button>
                <button type="button" className="btn btn-secondary"
                  onClick={() => { setActiveTab('jobs'); setEditingJob(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && selectedJob && (
          <div>
            <div className="applicants-header">
              <h2>Applicants for "{selectedJob.title}"</h2>
              <span className="badge badge-blue">{applications.length} total</span>
            </div>

            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No applicants yet</h3>
                <p>Share your job posting to attract candidates</p>
              </div>
            ) : (
              <div className="applicants-list">
                {applications.map((app) => (
                  <div key={app._id} className="applicant-card card">
                    <div className="applicant-avatar">
                      {app.applicant?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="applicant-info">
                      <h4>{app.applicant?.name}</h4>
                      <p className="applicant-email">{app.applicant?.email}</p>
                      {app.applicant?.skills?.length > 0 && (
                        <div className="applicant-skills">
                          {app.applicant.skills.slice(0, 4).map((s) => (
                            <span key={s} className="skill-tag">{s}</span>
                          ))}
                        </div>
                      )}
                      <div className="cover-letter-preview">
                        <strong>Cover Letter:</strong>
                        <p>{app.coverLetter?.substring(0, 150)}...</p>
                      </div>
                    </div>
                    <div className="applicant-actions">
                      <span className={`badge ${
                        app.status === 'accepted' ? 'badge-emerald' :
                        app.status === 'shortlisted' ? 'badge-blue' :
                        app.status === 'rejected' ? 'badge-red' : 'badge-gray'
                      }`}>
                        {app.status}
                      </span>

                      <a href={`http://localhost:5000/${app.resumePath?.replace(/\\/g, '/')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm">
                        📄 View Resume
                      </a>

                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        className="form-control status-select"
                      >
                        {['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'].map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
