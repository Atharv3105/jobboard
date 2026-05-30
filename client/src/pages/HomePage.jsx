import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import './HomePage.css';

const STATS = [
  { value: '10,000+', label: 'Jobs Posted', icon: '💼' },
  { value: '5,000+', label: 'Companies', icon: '🏢' },
  { value: '50,000+', label: 'Job Seekers', icon: '👥' },
  { value: '8,000+', label: 'Hired', icon: '🎉' },
];

const CATEGORIES = [
  { name: 'Technology', icon: '💻', color: '#3b82f6' },
  { name: 'Marketing', icon: '📣', color: '#8b5cf6' },
  { name: 'Finance', icon: '💰', color: '#10b981' },
  { name: 'Healthcare', icon: '🏥', color: '#ef4444' },
  { name: 'Design', icon: '🎨', color: '#f59e0b' },
  { name: 'Engineering', icon: '⚙️', color: '#06b6d4' },
  { name: 'Education', icon: '🎓', color: '#ec4899' },
  { name: 'Sales', icon: '📈', color: '#84cc16' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await jobsAPI.getAll({ limit: 6 });
        setFeaturedJobs(res.data.data);
      } catch {
        // Silently fail on demo
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* === HERO === */}
      <section className="hero">
        <div className="hero-bg-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="container hero-content">
          <div className="hero-badge animate-fadeInUp">
            🚀 Over 10,000 jobs available now
          </div>

          <h1 className="hero-title animate-fadeInUp delay-1">
            Find Your <span className="text-gradient">Dream Job</span>
            <br />Today
          </h1>

          <p className="hero-subtitle animate-fadeInUp delay-2">
            Connect with top employers. Browse thousands of opportunities
            <br className="hide-mobile" /> across every industry and location.
          </p>

          {/* Search Bar */}
          <form className="hero-search animate-fadeInUp delay-3" onSubmit={handleSearch} id="hero-search-form">
            <div className="search-input-group">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                id="search-query"
                placeholder="Job title, skills, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="search-divider" />
            <div className="search-input-group">
              <span className="search-icon">📍</span>
              <input
                type="text"
                id="search-location"
                placeholder="Location or remote"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary search-btn">
              Search Jobs
            </button>
          </form>

          <p className="hero-suggestions animate-fadeInUp delay-4">
            Popular: &nbsp;
            {['React Developer', 'UI Designer', 'Data Scientist', 'Remote'].map((term) => (
              <button
                key={term}
                className="suggestion-chip"
                onClick={() => {
                  setSearchQuery(term);
                  navigate(`/jobs?search=${encodeURIComponent(term)}`);
                }}
              >
                {term}
              </button>
            ))}
          </p>
        </div>
      </section>

      {/* === STATS === */}
      <section className="stats-section">
        <div className="container stats-grid">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`stat-card card animate-fadeInUp delay-${i + 1}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* === CATEGORIES === */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Browse by <span className="text-gradient">Category</span></h2>
            <p>Find the perfect job in your field of expertise</p>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/jobs?category=${cat.name}`}
                className="category-card card"
                style={{ '--cat-color': cat.color }}
              >
                <div className="category-icon">{cat.icon}</div>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === FEATURED JOBS === */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured <span className="text-gradient">Opportunities</span></h2>
            <p>Hand-picked jobs from top companies</p>
          </div>

          {loadingJobs ? (
            <div className="grid-jobs">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="job-card-skeleton card">
                  <div className="skeleton" style={{ height: 48, width: 48, borderRadius: 10 }} />
                  <div className="skeleton" style={{ height: 20, width: '70%', marginTop: 12 }} />
                  <div className="skeleton" style={{ height: 14, width: '50%', marginTop: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '80%', marginTop: 16 }} />
                </div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid-jobs">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">💼</div>
              <h3>No jobs yet</h3>
              <p>Be the first employer to post a job opening!</p>
              <Link to="/register?role=employer" className="btn btn-primary">
                Post a Job
              </Link>
            </div>
          )}

          {featuredJobs.length > 0 && (
            <div className="section-cta">
              <Link to="/jobs" className="btn btn-secondary btn-lg">
                View All Jobs →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* === CTA BANNER === */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-card card">
            <div className="cta-orb" />
            <div className="cta-content">
              <h2>Ready to find your next hire?</h2>
              <p>Join thousands of employers who trust JobBoard to find top talent</p>
              <div className="cta-actions">
                <Link to="/register?role=employer" className="btn btn-primary btn-lg">
                  Post a Job Free
                </Link>
                <Link to="/jobs" className="btn btn-secondary btn-lg">
                  Browse as Candidate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
