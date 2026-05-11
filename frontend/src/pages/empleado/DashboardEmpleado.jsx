import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function DashboardEmpleado() {

  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [stats, setStats] = useState({
    productos: 0,
    ventas: 0
  });

  const [loading, setLoading] = useState(true);

  /* ================= CARGAR DATOS ================= */

  useEffect(() => {

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      setNombre(usuario.nombre);
    }

    const obtenerDatos = async () => {
      try {

        const [productosRes, ventasRes] = await Promise.all([
          api.get("/productos"),
          api.get("/empleado/ventas")
        ]);

        setStats({
          productos: productosRes.data?.length || 0,
          ventas: ventasRes.data?.length || 0
        });

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();

  }, []);

  /* ================= UI ================= */

  if (loading) {
    return <p style={{ padding: "30px" }}>Cargando panel...</p>;
  }

  return (

    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2>👨‍💼 Panel del Empleado</h2>
        <p>Bienvenido, <strong>{nombre}</strong></p>
      </div>

      {/* CARDS */}
      <div style={styles.grid}>

        <div style={styles.card}>
          <h4>🛍 Productos disponibles</h4>
          <p style={styles.number}>{stats.productos}</p>
        </div>

        <div style={styles.card}>
          <h4>📦 Ventas realizadas</h4>
          <p style={styles.number}>{stats.ventas}</p>
        </div>

      </div>

      {/* ACCIONES */}
      <div style={styles.actions}>

        <div style={styles.actionCard} onClick={() => navigate("/empleado/productos")}>
          <h4>💰 Registrar Venta</h4>
          <p>Vender productos fácilmente</p>
        </div>

      </div>

    </div>

  );
}

export default DashboardEmpleado;

/* ================= ESTILOS ================= */

const styles = {

  container: {
    padding: "30px",
    background: "#f5f7fb",
    minHeight: "100vh"
  },

  header: {
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    textAlign: "center"
  },

  number: {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "10px"
  },

  actions: {
    display: "flex",
    gap: "20px"
  },

  actionCard: {
    background: "#198754",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    cursor: "pointer",
    flex: 1,
    textAlign: "center",
    transition: "0.2s"
  }

};