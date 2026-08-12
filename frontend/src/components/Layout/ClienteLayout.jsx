import { Navigate, Outlet } from "react-router-dom";
import ClienteNavbar from "../ClienteNavbar";

export default function ClienteLayout() {
  const token = localStorage.getItem("token");
  const usuarioStorage = localStorage.getItem("usuario");

  let usuario = null;

  try {
    usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");

    return <Navigate to="/login" replace />;
  }

  const tokenValido =
    typeof token === "string" &&
    token.trim() !== "" &&
    token !== "undefined" &&
    token !== "null";

  const rol = String(usuario?.rol || "")
    .toLowerCase()
    .trim();

  if (!tokenValido || !usuario || rol !== "cliente") {
    if (!tokenValido) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
    }

    return <Navigate to="/login" replace />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      <div style={styles.content}>
        <ClienteNavbar />

        <main style={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #050816 0%, #0b1120 50%, #140b2d 100%)",
    position: "relative",
    overflowX: "hidden",
  },

  content: {
    position: "relative",
    zIndex: 2,
    minHeight: "100vh",
  },

  glow1: {
    position: "fixed",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background: "rgba(168, 85, 247, 0.16)",
    filter: "blur(120px)",
    top: "-120px",
    left: "-120px",
    pointerEvents: "none",
    zIndex: 0,
  },

  glow2: {
    position: "fixed",
    width: "380px",
    height: "380px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.10)",
    filter: "blur(140px)",
    bottom: "-140px",
    right: "-120px",
    pointerEvents: "none",
    zIndex: 0,
  },

  main: {
    width: "100%",
    boxSizing: "border-box",
    padding: "25px",
  },
};
