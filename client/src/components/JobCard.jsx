import { Link } from 'react-router-dom';
import './JobCard.css';

const JOB_TYPE_COLORS = {
  'full-time': 'badge-emerald',
  'part-time': 'badge-blue',
  'contract': 'badge-purple',
  'internship': 'badge-orange',
  'remote': 'badge-emerald',
};

const CATEGORY_ICONS = {
  Technology: '💻',
  Marketing: '📣',
  Finance: '💰',
  Healthcare: '🏥',
  Education: '🎓',
  Design: '🎨',
  Sales: '📈',
  Engineering: '⚙️',
  'Customer Service': '🎧',
  HR: '👥',
  Legal: '⚖️',
  Operations: '🔧',
  Other: '💼',
};

const formatSalary = (salary) => {
  if (!salary?.min && !salary?.max) return 'Salary not specified';

  // Format a number as INR: Lakhs (≥1L) or Thousands (≥1K)
  const fmt = (n) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1).replace(/\.0$/, '')} Cr`;
    if (n >= 100000)   return `₹${(n / 100000).toFixed(1).replace(/\.0$/, '')}L`;
    if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n}`;
  };

  const period = salary.period === 'year' ? '/yr' : salary.period === 'month' ? '/mo' : '/hr';

  if (salary.min && salary.max) {
    return `${fmt(salary.min)} – ${fmt(salary.max)} ${period}`;
  }
  if (salary.min) return `From ${fmt(salary.min)} ${period}`;
  return `Up to ${fmt(salary.max)} ${period}`;
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const JobCard = ({ job, showActions, onDelete, onEdit }) => {
  const icon = CATEGORY_ICONS[job.category] || '💼';
  const typeColor = JOB_TYPE_COLORS[job.type] || 'badge-gray';

  return (
    <div className="job-card card animate-fadeInUp">
      {/* Header */}
      <div className="job-card-header">
        <div className="job-icon">{icon}</div>
        <div className="job-meta-top">
          <span className={`badge ${typeColor}`}>{job.type}</span>
          <span className="job-time">{timeAgo(job.createdAt)}</span>
        </div>
      </div>

      {/* Title & Company */}
      <div className="job-card-body">
        <h3 className="job-title">
          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
        </h3>
        <p className="job-company">
          🏢 {job.company || job.postedBy?.company || 'Company'}
        </p>

        {/* Details */}
        <div className="job-details">
          <span className="job-detail">
            📍 {job.location}
          </span>
          <span className="job-detail">
            💼 {job.experience} level
          </span>
          {(job.salary?.min || job.salary?.max) && (
            <span className="job-detail salary">
              💰 {formatSalary(job.salary)}
            </span>
          )}
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="job-skills">
            {job.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
            {job.skills.length > 4 && (
              <span className="skill-tag skill-tag-more">+{job.skills.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="job-card-footer">
        {!showActions ? (
          <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
            View Details →
          </Link>
        ) : (
          <div className="job-card-actions">
            <button onClick={() => onEdit(job)} className="btn btn-secondary btn-sm">
              ✏️ Edit
            </button>
            <button onClick={() => onDelete(job._id)} className="btn btn-danger btn-sm">
              🗑 Delete
            </button>
          </div>
        )}
        <div className="job-views">👁 {job.views || 0} views</div>
      </div>

      {/* Inactive overlay */}
      {!job.isActive && (
        <div className="job-card-inactive">
          <span>Closed</span>
        </div>
      )}
    </div>
  );
};

export default JobCard;
