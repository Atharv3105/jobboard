import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './DashboardPages.css';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'badge-gray', icon: '⏳' },
  reviewed: { label: 'Reviewed', color: 'badge-blue', icon: '👀' },
  shortlisted: { label: 'Shortlisted', color: 'badge-purple', icon: '⭐' },
  rejected: { label: 'Not Selected', color: 'badge-red', icon: '❌' },
  accepted: { label: 'Accepted!', color: 'badge-emerald', icon: '🎉' },
};

const CandidateDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    skills: (user?.skills || []).join(', '),
    experience: user?.experience || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await applicationsAPI.getMine();
        setApplications(res.data.data);
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await usersAPI.updateProfile({
        ...profileForm,
        skills: profileForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      updateUser(res.data.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setProfileLoading(false);
    }
  };

  const pending = applications.filter((a) => a.status === 'pending').length;
  const accepted = applications.filter((a) => a.status === 'accepted').length;
  const shortlisted = applications.filter((a) => a.status === 'shortlisted').length;

  return (
    <div className="dashboard-page page-content">
      <div className="page-header">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>My <span className="text-gradient">Dashboard</span></h1>
              <p className="page-subtitle">Hello, {user?.name} 👋</p>
            </div>
            <Link to="/jobs" className="btn btn-primary">
              🔍 Find Jobs
            </Link>
          </div>

          <div className="dashboard-stats">
            <div className="stat-pill">
              <span>📋</span> {applications.length} Applied
            </div>
            <div className="stat-pill">
              <span>⭐</span> {shortlisted} Shortlisted
            </div>
            <div className="stat-pill">
              <span>🎉</span> {accepted} Accepted
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

        <div className="tabs">
          <button className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}>
            📋 My Applications ({applications.length})
          </button>
          <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}>
            👤 My Profile
          </button>
        </div>

        {/* Applications */}
        {activeTab === 'applications' && (
          <div>
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No applications yet</h3>
                <p>Start browsing jobs and submit your first application</p>
                <Link to="/jobs" className="btn btn-primary" id="browse-jobs-btn">Browse Jobs</Link>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map((app) => {
                  const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                  return (
                    <div key={app._id} className="application-row card">
                      <div className="application-job-info">
                        <h3>
                          <Link to={`/jobs/${app.job?._id}`}>
                            {app.job?.title || 'Job Removed'}
                          </Link>
                        </h3>
                        <div className="job-meta-row">
                          <span>🏢 {app.job?.company}</span>
                          <span>📍 {app.job?.location}</span>
                          <span>💼 {app.job?.type}</span>
                          <span>📅 Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="application-status">
                        <span className={`badge ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                        {app.job?.isActive === false && (
                          <span className="badge badge-gray">Job Closed</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="profile-form-container card">
            <h2>Edit Profile</h2>

            <div className="profile-avatar-section">
              <div className="profile-avatar-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
                <span className="badge badge-blue">{user?.role}</span>
              </div>
            </div>

            <hr className="divider" />

            <form onSubmit={handleProfileSubmit} id="profile-form">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-name">Full Name</label>
                  <input id="profile-name" name="name" value={profileForm.name}
                    onChange={handleProfileChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-location">Location</label>
                  <input id="profile-location" name="location" value={profileForm.location}
                    onChange={handleProfileChange} className="form-control" placeholder="City, Country" />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-phone">Phone</label>
                  <input id="profile-phone" name="phone" value={profileForm.phone}
                    onChange={handleProfileChange} className="form-control" placeholder="+1 234 567 890" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-experience">Experience Level</label>
                  <select id="profile-experience" name="experience" value={profileForm.experience}
                    onChange={handleProfileChange} className="form-control">
                    <option value="">Select level</option>
                    {['entry', 'mid', 'senior', 'executive'].map((e) => (
                      <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)} Level</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-skills">Skills (comma-separated)</label>
                <input id="profile-skills" name="skills" value={profileForm.skills}
                  onChange={handleProfileChange} className="form-control"
                  placeholder="e.g. JavaScript, React, Node.js, Python" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-bio">Bio</label>
                <textarea id="profile-bio" name="bio" value={profileForm.bio}
                  onChange={handleProfileChange} className="form-control" rows={4}
                  placeholder="Tell employers about yourself, your experience, and what you're looking for..." />
              </div>

              <button type="submit" className="btn btn-primary" disabled={profileLoading} id="save-profile-btn">
                {profileLoading ? (
                  <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
                ) : (
                  '💾 Save Profile'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
