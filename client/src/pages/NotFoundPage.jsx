import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="page-content" style={{
    minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center'
  }}>
    <div className="empty-state" style={{ maxWidth: 500 }}>
      <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</div>
      <div className="empty-state-icon">🔍</div>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: '1rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/jobs" className="btn btn-secondary">Browse Jobs</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
