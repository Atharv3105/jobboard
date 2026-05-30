import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { applicationsAPI } from '../services/api';
import './ApplyPage.css';

const ApplyPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setError('Only PDF and Word documents allowed');
      return;
    }

    setResume(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError('Please upload your resume');
      return;
    }
    if (coverLetter.trim().length < 50) {
      setError('Please write a cover letter of at least 50 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resume);

      await applicationsAPI.apply(formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="apply-page page-content">
        <div className="container apply-success">
          <div className="success-card card animate-fadeInUp">
            <div className="success-icon">🎉</div>
            <h1>Application Submitted!</h1>
            <p>
              Your application has been sent successfully. We've sent a confirmation email to you.
              The employer will review your application and reach out soon.
            </p>
            <div className="success-actions">
              <Link to="/candidate/dashboard" className="btn btn-primary btn-lg" id="go-to-dashboard-btn">
                View My Applications
              </Link>
              <Link to="/jobs" className="btn btn-secondary">
                Browse More Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-page page-content">
      <div className="page-header">
        <div className="container">
          <Link to={`/jobs/${jobId}`} className="back-link">← Back to Job</Link>
          <h1>Submit Your <span className="text-gradient">Application</span></h1>
          <p className="page-subtitle">Make a great first impression</p>
        </div>
      </div>

      <div className="container apply-layout">
        <div className="apply-form-container card animate-fadeInUp">
          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} id="application-form">
            {/* Resume Upload */}
            <div className="form-group">
              <label className="form-label">Resume / CV *</label>
              <div
                className={`file-upload-area ${resume ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current.click()}
                id="resume-upload-area"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="resume-file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {resume ? (
                  <div className="file-selected">
                    <span className="file-icon">📄</span>
                    <div>
                      <div className="file-name">{resume.name}</div>
                      <div className="file-size">{(resume.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <span className="file-check">✅</span>
                  </div>
                ) : (
                  <div className="file-upload-prompt">
                    <span className="upload-icon">📁</span>
                    <p className="upload-title">Click to upload your resume</p>
                    <p className="upload-hint">PDF or Word document • Max 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div className="form-group">
              <label className="form-label" htmlFor="cover-letter">
                Cover Letter *
                <span className="char-count">{coverLetter.length} / 2000</span>
              </label>
              <textarea
                id="cover-letter"
                className="form-control cover-letter-area"
                placeholder="Tell the employer why you're the perfect fit for this role. Highlight your relevant experience, skills, and enthusiasm..."
                value={coverLetter}
                onChange={(e) => {
                  if (e.target.value.length <= 2000) setCoverLetter(e.target.value);
                }}
                rows={8}
                required
              />
              <p className="form-error" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                Minimum 50 characters required
              </p>
            </div>

            <div className="apply-form-footer">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                id="submit-application-btn"
              >
                {loading ? (
                  <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Submitting...</>
                ) : (
                  '🚀 Submit Application'
                )}
              </button>
              <p className="apply-disclaimer">
                By submitting, you agree to share your resume and cover letter with the employer
              </p>
            </div>
          </form>
        </div>

        {/* Tips sidebar */}
        <aside className="apply-tips">
          <div className="tips-card card">
            <h3>✨ Application Tips</h3>
            <ul className="tips-list">
              <li>
                <span className="tip-icon">📝</span>
                <div>
                  <strong>Tailor your cover letter</strong>
                  <p>Mention specific skills from the job description</p>
                </div>
              </li>
              <li>
                <span className="tip-icon">📊</span>
                <div>
                  <strong>Quantify achievements</strong>
                  <p>Use numbers to show your impact (e.g., "improved sales by 30%")</p>
                </div>
              </li>
              <li>
                <span className="tip-icon">✅</span>
                <div>
                  <strong>Updated resume</strong>
                  <p>Ensure your resume is current and error-free</p>
                </div>
              </li>
              <li>
                <span className="tip-icon">🎯</span>
                <div>
                  <strong>Be specific</strong>
                  <p>Address why you want this role at this company</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ApplyPage;
