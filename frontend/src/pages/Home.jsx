// Home route now redirects to the Landing page.
// All landing content lives in Landing.jsx.
import { Navigate } from "react-router-dom";
export default function Home() {
  return <Navigate to="/" replace />;
}
