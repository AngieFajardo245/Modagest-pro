import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

  const token = localStorage.getItem("token");

  // SACAR ROL DESDE USUARIO (NO DESDE "rol")
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const userRole = usuario?.rol;

  /* ================= SIN TOKEN ================= */
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  /* ================= VALIDAR ROL ================= */
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;