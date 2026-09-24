import { Link } from "react-router-dom";

function FeaturedCard({ title, text, to }) {
  if (to) {
    return (
      <Link to={to} className="card" style={{ textDecoration: "none", color: "inherit" }}>
        <h3>{title}</h3>
        <p>{text}</p>
      </Link>
    );
  }

  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default FeaturedCard;