import { Navigate } from "react-router-dom";

/**
 * Wraps any route that requires authentication.
 * If no userEmail in localStorage → redirect to /login.
 */
function ProtectedRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("userEmail"));
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
