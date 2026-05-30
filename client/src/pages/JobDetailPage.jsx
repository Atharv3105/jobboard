import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './JobDetailPage.css';

const JOB_TYPE_COLORS = {
  'full-time': 'badge-emerald',
  'part-time': 'badge-blue',
  'contract': 'badge-purple',
  'internship': 'badge-orange',
  'remote': 'badge-emerald',
};

const formatSalary = (salary) => {
  if (!salary?.min && !salary?.max) return null;
  const fmt = (n) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1).replace(/\.0$/, '')} Cr`;
    if (n >= 100000)   return `₹${(n / 100000).toFixed(1).replace(/\.0$/, '')}L`;
    if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n}`;
  };
  const period = salary.period === 'year' ? '/yr' : salary.period === 'month' ? '/mo' : '/hr';
  if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)} ${period}`;
  if (salary.min) return `From ${fmt(salary.min)} ${period}`;
  return `Up to ${fmt(salary.max)} ${period}`;
};

const JobDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, isCandidate, isEmployer } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobsAPI.getById(id);
        setJob(res.data.data);
      } catch {
        setError('Job not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/apply/${id}`);
  };

  if (loading) {
    return (
      <div className="page-content loading-center">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="page-content">
        <div className="container" style={{ paddingTop: '4rem' }}>
          <div className="empty-state">
            <div className="empty-state-icon">😕</div>
            <h3>{error || 'Job not found'}</h3>
            <Link to="/jobs" className="btn btn-primary">Browse All Jobs</Link>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  const salaryText = formatSalary(job.salary);

  return (
    <div className="job-detail-page page-content">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <Link to="/jobs" className="back-link">← Back to Jobs</Link>

          <div className="job-detail-header">
            <div className="job-detail-company-icon">
              {job.category === 'Technology' ? '💻' : '🏢'}
            </div>
            <div>
              <h1 className="job-detail-title">{job.title}</h1>
              <p className="job-detail-company">
                {job.company || job.postedBy?.company}
              </p>
              <div className="job-detail-badges">
                <span className={`badge ${JOB_TYPE_COLORS[job.type] || 'badge-gray'}`}>
                  {job.type}
                </span>
                <span className="badge badge-blue">{job.category}</span>
                {!job.isActive && <span className="badge badge-red">Closed</span>}
                {isExpired && <span className="badge badge-red">Deadline Passed</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container job-detail-layout">
        {/* Main Content */}
        <main className="job-detail-main">
          {/* Quick info */}
          <div className="job-info-grid card">
            <div className="job-info-item">
              <span className="info-icon">📍</span>
              <div>
                <div className="info-label">Location</div>
                <div className="info-value">{job.location}</div>
              </div>
            </div>
            <div className="job-info-item">
              <span className="info-icon">💼</span>
              <div>
                <div className="info-label">Experience</div>
                <div className="info-value">{job.experience} level</div>
              </div>
            </div>
            {salaryText && (
              <div className="job-info-item">
                <span className="info-icon">💰</span>
                <div>
                  <div className="info-label">Salary</div>
                  <div className="info-value salary">{salaryText}</div>
                </div>
              </div>
            )}
            {job.deadline && (
              <div className="job-info-item">
                <span className="info-icon">📅</span>
                <div>
                  <div className="info-label">Apply By</div>
                  <div className={`info-value ${isExpired ? 'expired' : ''}`}>
                    {new Date(job.deadline).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="card job-section">
            <h2>Job Description</h2>
            <div className="job-description-text">
              {job.description.split('\n').map((para, i) => (
                para.trim() ? <p key={i}>{para}</p> : <br key={i} />
              ))}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="card job-section">
              <h2>Requirements</h2>
              <div className="job-description-text">
                {job.requirements.split('\n').map((para, i) => (
                  para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="card job-section">
              <h2>Responsibilities</h2>
              <div className="job-description-text">
                {job.responsibilities.split('\n').map((para, i) => (
                  para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="card job-section">
              <h2>Required Skills</h2>
              <div className="skills-list">
                {job.skills.map((skill) => (
                  <span key={skill} className="skill-tag-lg">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="job-detail-sidebar">
          {/* Apply card */}
          <div className="apply-card card">
            {job.isActive && !isExpired ? (
              <>
                <h3>Ready to Apply?</h3>
                <p>Join {job.views} others who viewed this position</p>
                {isCandidate && (
                  <button className="btn btn-primary btn-lg apply-btn" onClick={handleApply} id="apply-now-btn">
                    Apply Now →
                  </button>
                )}
                {isEmployer && (
                  <div className="alert alert-info">You are logged in as an employer</div>
                )}
                {!isAuthenticated && (
                  <>
                    <button className="btn btn-primary btn-lg apply-btn" onClick={handleApply} id="apply-login-btn">
                      Login to Apply
                    </button>
                    <p className="apply-note">
                      Don't have an account? <Link to="/register">Register free</Link>
                    </p>
                  </>
                )}
              </>
            ) : (
              <div className="closed-job">
                <span className="closed-icon">🔒</span>
                <h3>Position Closed</h3>
                <p>This job is no longer accepting applications</p>
                <Link to="/jobs" className="btn btn-secondary">Browse Open Jobs</Link>
              </div>
            )}
          </div>

          {/* Company card */}
          <div className="company-card card">
            <h3>About the Company</h3>
            <div className="company-detail">
              <strong>{job.company || job.postedBy?.company}</strong>
            </div>
            {job.postedBy?.companyDescription && (
              <p className="company-bio">{job.postedBy.companyDescription}</p>
            )}
            {job.postedBy?.companyWebsite && (
              <a
                href={job.postedBy.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                🌐 Visit Website
              </a>
            )}
          </div>

          {/* Share */}
          <div className="share-card card">
            <h4>Share this job</h4>
            <div className="share-btns">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                id="copy-link-btn"
              >
                🔗 Copy Link
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetailPage;
