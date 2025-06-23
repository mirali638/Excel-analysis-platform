import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check if token has expired
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }
    if (decoded.status !== "active") {
      return <Navigate to="/unauthorized" />;
    }

    // Role-based access control
    if (role && decoded.role !== role) {
      return <Navigate to="/unauthorized" />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
