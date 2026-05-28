import { Navigate, Outlet } from "react-router-dom";
import AdminNavbar from "../AdminNavbar";

export default function AdminLayout() {

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  /* ================= VALIDACIÓN ================= */

  if (!token || rol !== "administrador") {
    return <Navigate to="/login" replace />;
  }

  return (

    <div style={styles.page}>

      {/* ================= EFECTOS FONDO ================= */}

      <div style={styles.glowTop}></div>
      <div style={styles.glowBottom}></div>

      {/* ================= NAVBAR ================= */}

      <AdminNavbar />

      {/* ================= CONTENIDO ================= */}

      <main style={styles.main}>

        <div style={styles.content}>

          <Outlet />

        </div>

      </main>

    </div>

  );

}

/* ================= ESTILOS ================= */

const styles = {

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(135deg, #0f172a, #111827, #1e1b4b)",

    position: "relative",

    overflowX: "hidden"

  },

  /* ================= EFECTOS ================= */

  glowTop: {

    position: "fixed",

    top: "-120px",

    left: "-120px",

    width: "380px",

    height: "380px",

    borderRadius: "50%",

    background:
      "rgba(124,58,237,0.22)",

    filter: "blur(120px)",

    zIndex: 0

  },

  glowBottom: {

    position: "fixed",

    bottom: "-140px",

    right: "-120px",

    width: "420px",

    height: "420px",

    borderRadius: "50%",

    background:
      "rgba(59,130,246,0.18)",

    filter: "blur(140px)",

    zIndex: 0

  },

  /* ================= MAIN ================= */

  main: {

    position: "relative",

    zIndex: 2,

    padding: "30px"

  },

  content: {

    width: "100%",

    minHeight: "calc(100vh - 120px)",

    background:
      "rgba(255,255,255,0.04)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "28px",

    padding: "35px",

    backdropFilter: "blur(16px)",

    WebkitBackdropFilter: "blur(16px)",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.35)"

  }

};