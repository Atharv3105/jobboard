import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import './JobListingsPage.css';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];
const CATEGORIES = [
  'Technology', 'Marketing', 'Finance', 'Healthcare', 'Education',
  'Design', 'Sales', 'Engineering', 'Customer Service', 'HR', 'Legal', 'Operations', 'Other'
];
const EXPERIENCE = ['entry', 'mid', 'senior', 'executive'];

const JobListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (location) params.location = location;
      if (type) params.type = type;
      if (category) params.category = category;
      if (experience) params.experience = experience;

      const res = await jobsAPI.getAll(params);
      setJobs(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, location, type, category, experience, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setType('');
    setCategory('');
    setExperience('');
    setPage(1);
    setSearchParams({});
  };

  const hasFilters = search || location || type || category || experience;

  return (
    <div className="listings-page page-content">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>Browse <span className="text-gradient">Jobs</span></h1>
          <p className="page-subtitle">{total} opportunities available</p>

          {/* Search bar */}
          <form className="listings-search" onSubmit={handleSearch} id="listings-search-form">
            <div className="listings-search-input">
              <span>🔍</span>
              <input
                type="text"
                id="listings-query"
                placeholder="Search jobs, skills, companies..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="search-input"
              />
            </div>
            <div className="listings-search-input">
              <span>📍</span>
              <input
                type="text"
                id="listings-location"
                placeholder="Location..."
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container listings-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-header">
            <h3>Filters</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="clear-filters">Clear all</button>
            )}
          </div>

          {/* Job Type */}
          <div className="filter-group">
            <h4 className="filter-label">Job Type</h4>
            {JOB_TYPES.map((t) => (
              <label key={t} className="filter-option">
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={type === t}
                  onChange={() => { setType(t === type ? '' : t); setPage(1); }}
                />
                <span className="filter-radio" />
                <span>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</span>
              </label>
            ))}
          </div>

          <hr className="divider" />

          {/* Category */}
          <div className="filter-group">
            <h4 className="filter-label">Category</h4>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="form-control"
              id="filter-category"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <hr className="divider" />

          {/* Experience */}
          <div className="filter-group">
            <h4 className="filter-label">Experience</h4>
            {EXPERIENCE.map((e) => (
              <label key={e} className="filter-option">
                <input
                  type="radio"
                  name="experience"
                  value={e}
                  checked={experience === e}
                  onChange={() => { setExperience(e === experience ? '' : e); setPage(1); }}
                />
                <span className="filter-radio" />
                <span>{e.charAt(0).toUpperCase() + e.slice(1)} level</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="listings-main">
          {/* Active filters */}
          {hasFilters && (
            <div className="active-filters">
              {type && <span className="filter-chip">{type} <button onClick={() => setType('')}>×</button></span>}
              {category && <span className="filter-chip">{category} <button onClick={() => setCategory('')}>×</button></span>}
              {experience && <span className="filter-chip">{experience} <button onClick={() => setExperience('')}>×</button></span>}
            </div>
          )}

          {loading ? (
            <div className="grid-jobs">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card" style={{ padding: '1.5rem', height: '250px' }}>
                  <div className="skeleton" style={{ height: '100%' }} />
                </div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="grid-jobs">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    id="prev-page-btn"
                  >
                    ← Prev
                  </button>
                  <span className="pagination-info">Page {page} of {totalPages}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    id="next-page-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobListingsPage;
