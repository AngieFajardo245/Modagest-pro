import { Navigate, Outlet } from "react-router-dom";
import ClienteNavbar from "../ClienteNavbar";

export default function ClienteLayout() {

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // Normalizar rol
  const rolNormalizado = rol?.toLowerCase().trim();

  // Protección SOLO si intenta entrar a rutas cliente
  if (!token || rolNormalizado !== "cliente") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={styles.container}>

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
    background: "#f5f7fb"
  },

  main: {
    padding: "20px"
  }
};