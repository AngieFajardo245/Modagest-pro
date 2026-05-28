import { Navigate, Outlet } from "react-router-dom";
import ClienteNavbar from "../ClienteNavbar";

export default function ClienteLayout() {

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  const rolNormalizado = rol?.toLowerCase().trim();

  // Protección
  if (!token || rolNormalizado !== "cliente") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={styles.container}>

      {/* EFECTOS */}
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      {/* NAVBAR */}
      <ClienteNavbar />

      {/* CONTENIDO */}
      <main style={styles.main}>
        <Outlet />
      </main>

    </div>
  );
}

/* ================= ESTILOS ================= */

const styles = {

  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #050816, #0b1120, #140b2d)",
    position: "relative",
    overflowX: "hidden"
  },

  glow1: {
    position: "fixed",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background: "rgba(168,85,247,0.18)",
    filter: "blur(120px)",
    top: "-120px",
    left: "-120px",
    zIndex: 0
  },

  glow2: {
    position: "fixed",
    width: "380px",
    height: "380px",
    borderRadius: "50%",
    background: "rgba(59,130,246,0.12)",
    filter: "blur(140px)",
    bottom: "-140px",
    right: "-120px",
    zIndex: 0
  },

  main: {
    position: "relative",
    zIndex: 2,
    padding: "25px"
  }

};