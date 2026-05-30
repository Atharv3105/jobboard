import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState(searchParams.get('role') || 'candidate');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (role === 'employer' && !formData.company) {
      setError('Company name is required for employers');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        company: formData.company,
      });
      navigate(role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-content">
      <div className="auth-bg-orb" />

      <div className="auth-container">
        <div className="auth-card card animate-fadeInUp">
          {/* Logo */}
          <Link to="/" className="auth-logo">
            💼 Job<span className="text-gradient">Board</span>
          </Link>

          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join thousands of professionals today</p>

          {/* Role Toggle */}
          <div className="role-toggle" id="role-toggle">
            <button
              type="button"
              className={`role-btn ${role === 'candidate' ? 'active' : ''}`}
              onClick={() => setRole('candidate')}
              id="role-candidate-btn"
            >
              👤 Job Seeker
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'employer' ? 'active' : ''}`}
              onClick={() => setRole('employer')}
              id="role-employer-btn"
            >
              🏢 Employer
            </button>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" id="register-form">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {role === 'employer' && (
              <div className="form-group">
                <label className="form-label" htmlFor="reg-company">Company Name</label>
                <input
                  id="reg-company"
                  name="company"
                  type="text"
                  required
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                required
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm-password">Confirm Password</label>
              <input
                id="reg-confirm-password"
                name="confirmPassword"
                type="password"
                required
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
              id="register-submit-btn"
            >
              {loading ? (
                <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating account...</>
              ) : (
                `Create ${role === 'employer' ? 'Employer' : 'Candidate'} Account →`
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
