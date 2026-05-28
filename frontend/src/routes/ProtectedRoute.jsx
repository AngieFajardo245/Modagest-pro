import {
  Navigate,
  useLocation
} from "react-router-dom";

function ProtectedRoute({
  children,
  role
}) {

  const location = useLocation();

  /* ================= TOKEN ================= */

  const token =
    localStorage.getItem("token");

  /* ================= USUARIO ================= */

  const usuarioStorage =
    localStorage.getItem("usuario");

  let usuario = null;

  try {

    usuario = usuarioStorage
      ? JSON.parse(usuarioStorage)
      : null;

  } catch (error) {

    console.error(
      "❌ Error parseando usuario:",
      error
    );

    localStorage.clear();

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  /* ================= VALIDAR TOKEN ================= */

  if (
    !token ||
    token === "undefined" ||
    token === "null" ||
    token.trim() === ""
  ) {

    localStorage.setItem(
      "redirectAfterLogin",
      location.pathname
    );

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  /* ================= SIN USUARIO ================= */

  if (!usuario) {

    localStorage.clear();

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  /* ================= ROLES ================= */

  const userRole =
    usuario?.rol
      ?.toLowerCase()
      ?.trim();

  const requiredRole =
    role
      ?.toLowerCase()
      ?.trim();

  /* ================= VALIDAR ROL ================= */

  if (
    requiredRole &&
    userRole !== requiredRole
  ) {

    console.warn(
      "⛔ Acceso denegado"
    );

    /* ================= REDIRECCIONES ================= */

    if (userRole === "cliente") {

      return (
        <Navigate
          to="/cliente"
          replace
        />
      );

    }

    if (userRole === "administrador") {

      return (
        <Navigate
          to="/admin"
          replace
        />
      );

    }

    if (userRole === "empleado") {

      return (
        <Navigate
          to="/empleado"
          replace
        />
      );

    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  /* ================= OK ================= */

  return children;

}

export default ProtectedRoute;