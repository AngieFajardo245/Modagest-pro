import { Navigate, Outlet } from "react-router-dom";
import EmpleadoNavbar from "../EmpleadoNavbar";

export default function EmpleadoLayout() {

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  const rolNormalizado =
    rol?.toLowerCase().trim();

  if (
    !token ||
    rolNormalizado !== "empleado"
  ) {
    return <Navigate to="/login" replace />;
  }

  return (

    <div style={styles.container}>

      {/* EFECTOS FONDO */}

      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      {/* NAVBAR */}

      <EmpleadoNavbar />

      {/* CONTENIDO */}

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

  container: {

    minHeight: "100vh",

    background:
      "linear-gradient(135deg, #0f172a, #111827, #1e1b4b)",

    position: "relative",

    overflowX: "hidden"

  },

  /* ================= EFECTOS ================= */

  glow1: {

    position: "fixed",

    width: "320px",

    height: "320px",

    borderRadius: "50%",

    background:
      "rgba(124,58,237,0.18)",

    filter: "blur(120px)",

    top: "-100px",

    left: "-100px",

    zIndex: 0

  },

  glow2: {

    position: "fixed",

    width: "380px",

    height: "380px",

    borderRadius: "50%",

    background:
      "rgba(59,130,246,0.15)",

    filter: "blur(140px)",

    bottom: "-140px",

    right: "-120px",

    zIndex: 0

  },

  /* ================= MAIN ================= */

  main: {

    position: "relative",

    zIndex: 2,

    padding: "30px"

  },

  content: {

    maxWidth: "1400px",

    margin: "0 auto",

    background:
      "rgba(255,255,255,0.04)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "28px",

    padding: "35px",

    backdropFilter: "blur(16px)",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.35)",

    minHeight: "78vh"

  }

};