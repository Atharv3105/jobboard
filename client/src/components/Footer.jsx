import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">💼 Job<span className="text-gradient">Board</span></span>
          <p className="footer-tagline">
            Connecting talent with opportunity. Find your dream job or hire the best.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>For Job Seekers</h4>
            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/candidate/dashboard">My Applications</Link>
          </div>
          <div className="footer-col">
            <h4>For Employers</h4>
            <Link to="/register?role=employer">Post a Job</Link>
            <Link to="/employer/dashboard">Dashboard</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/">About</Link>
            <Link to="/">Contact</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 JobBoard. Built with ❤️ using React & Node.js</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
