import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("rol");

  // Si no hay token -> login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere rol específico
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;