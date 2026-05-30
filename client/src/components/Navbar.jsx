import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, isEmployer, isCandidate, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">💼</span>
          <span className="logo-text">
            Job<span className="text-gradient">Board</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Browse Jobs
          </NavLink>
          {isAuthenticated && isEmployer && (
            <NavLink to="/employer/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
          )}
          {isAuthenticated && isCandidate && (
            <NavLink to="/candidate/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My Applications
            </NavLink>
          )}
        </div>

        {/* Auth Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user?.name?.split(' ')[0]}</span>
              <div className="user-dropdown">
                <Link to={isEmployer ? '/employer/dashboard' : '/candidate/dashboard'} className="dropdown-item">
                  🏠 Dashboard
                </Link>
                {isEmployer && (
                  <Link to="/employer/post-job" className="dropdown-item">
                    ➕ Post a Job
                  </Link>
                )}
                <Link to="/profile" className="dropdown-item">
                  👤 Profile
                </Link>
                <hr className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item dropdown-logout">
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}

          {/* Mobile Hamburger */}
          <button
            className={`hamburger ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            id="hamburger-btn"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/jobs" className="mobile-link" onClick={closeMenu}>
            Browse Jobs
          </NavLink>
          {isAuthenticated && isEmployer && (
            <>
              <NavLink to="/employer/dashboard" className="mobile-link" onClick={closeMenu}>
                Employer Dashboard
              </NavLink>
              <NavLink to="/employer/post-job" className="mobile-link" onClick={closeMenu}>
                Post a Job
              </NavLink>
            </>
          )}
          {isAuthenticated && isCandidate && (
            <NavLink to="/candidate/dashboard" className="mobile-link" onClick={closeMenu}>
              My Applications
            </NavLink>
          )}
          {isAuthenticated && (
            <>
              <NavLink to="/profile" className="mobile-link" onClick={closeMenu}>
                Profile
              </NavLink>
              <button onClick={handleLogout} className="mobile-link mobile-logout">
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <div className="mobile-auth">
              <Link to="/login" className="btn btn-secondary" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
