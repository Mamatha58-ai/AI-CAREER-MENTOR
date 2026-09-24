import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Public navigation">
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-icon">✦</span>
        AI Career Mentor
      </Link>
      <div className="navbar-links">
        <Link to="/login"    className="nav-ghost">Sign In</Link>
        <Link to="/register" className="nav-pill">Get Started</Link>
      </div>
    </nav>
  );
}
