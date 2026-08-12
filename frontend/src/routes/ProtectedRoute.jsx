import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const usuarioStorage = localStorage.getItem("usuario");

  const limpiarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
  };

  let usuario = null;

  try {
    usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
  } catch {
    limpiarSesion();
    return <Navigate to="/login" replace />;
  }

  const tokenValido =
    typeof token === "string" &&
    token.trim() !== "" &&
    token !== "undefined" &&
    token !== "null";

  const usuarioValido =
    usuario && typeof usuario === "object" && usuario.id && usuario.rol;

  if (!tokenValido || !usuarioValido) {
    if (!tokenValido && location.pathname !== "/login") {
      localStorage.setItem(
        "redirectAfterLogin",
        `${location.pathname}${location.search}${location.hash}`,
      );
    }

    limpiarSesion();

    return <Navigate to="/login" replace />;
  }

  const userRole = String(usuario.rol).toLowerCase().trim();
  const requiredRole = String(role || "")
    .toLowerCase()
    .trim();

  if (requiredRole && userRole !== requiredRole) {
    if (userRole === "cliente") {
      return <Navigate to="/cliente" replace />;
    }

    if (userRole === "administrador") {
      return <Navigate to="/admin" replace />;
    }

    if (userRole === "empleado") {
      return <Navigate to="/empleado" replace />;
    }

    limpiarSesion();

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
