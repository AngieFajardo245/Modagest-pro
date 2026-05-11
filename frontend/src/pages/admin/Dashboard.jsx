import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/estadisticas");
        setStats(res.data);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
        setError("No se pudieron cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    obtenerStats();
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>📊 Panel Administrador</h2>
        <p style={styles.subtitle}>
          Resumen general del sistema ModaGest Pro
        </p>
      </div>

      {/* TARJETAS */}
      <div style={styles.grid}>

        <Card title="Usuarios" value={stats?.totalUsuarios} icon="👤" color="#0d6efd" />
        <Card title="Productos" value={stats?.totalProductos} icon="🛍️" color="#198754" />
        <Card title="Ventas" value={stats?.totalVentas} icon="📦" color="#fd7e14" />
        <Card title="Ingresos" value={`$${stats?.ingresosTotales}`} icon="💰" color="#6f42c1" />

      </div>

    </div>
  );
}

/* ================= COMPONENTE CARD ================= */

function Card({ title, value, icon, color }) {
  return (
    <div style={{ ...styles.card, borderTop: `5px solid ${color}` }}>

      <div style={styles.icon}>{icon}</div>

      <h4 style={styles.cardTitle}>{title}</h4>

      <p style={styles.value}>{value}</p>

    </div>
  );
}

/* ================= ESTILOS ================= */

const styles = {

  container: {
    padding: "30px",
    background: "#f4f6fb",
    minHeight: "100vh"
  },

  header: {
    marginBottom: "25px"
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "bold"
  },

  subtitle: {
    color: "#666",
    marginTop: "5px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "default"
  },

  cardTitle: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#555"
  },

  value: {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "8px",
    color: "#111"
  },

  icon: {
    fontSize: "30px"
  },

  center: {
    padding: "40px",
    textAlign: "center"
  }
};