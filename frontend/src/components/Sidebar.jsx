import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard",      icon: "⊞",  label: "Dashboard"   },
  { to: "/resume",         icon: "📄", label: "Resume AI"   },
  { to: "/skill-gap",      icon: "🧠", label: "Skill Gap"   },
  { to: "/career",         icon: "🎯", label: "Careers"     },
  { to: "/mock-interview", icon: "🎤", label: "Interview"   },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate  = useNavigate();

  const userName  = localStorage.getItem("userName")  || "User";
  const userEmail = localStorage.getItem("userEmail") || "";
  const initials  = userName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  function handleLogout() {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPassword");
    toast.success("Signed out successfully.");
    navigate("/");
  }

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">

      {/* ── LOGO ── */}
      <div className="sidebar-logo-wrap">
        <span className="sidebar-logo-icon">✦</span>
        <span className="sidebar-logo-text">AI Career Mentor</span>
      </div>

      {/* ── NAV LINKS ── */}
      <nav className="sidebar-nav" role="navigation">
        {NAV_ITEMS.map(({ to, icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`sidebar-link${active ? " sidebar-link-active" : ""}`}
            >
              <span className="sidebar-link-icon" aria-hidden="true">{icon}</span>
              <span className="sidebar-link-label">{label}</span>
              {active && <span className="sidebar-link-pip" aria-hidden="true" />}
            </Link>
          );
        })}
      </nav>

      {/* ── PROFILE (bottom) ── */}
      <div className="sidebar-profile">
        <div className="sidebar-profile-card">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-profile-info">
            <span className="sidebar-profile-name">{userName.split(" ")[0]}</span>
            <span className="sidebar-profile-email">{userEmail}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} aria-label="Sign out">
          <span>⏻</span>
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}
