import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const obtenerStats = async () => {
      try {
        const res = await api.get("/admin/estadisticas");
        setStats(res.data);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };

    obtenerStats();
  }, []);

  if (!stats) return <div style={{ padding: "20px" }}>Cargando...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Panel Administrador</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginTop: "20px" }}>
        
        <div style={cardStyle}>
          <h3>Usuarios</h3>
          <p>{stats.totalUsuarios}</p>
        </div>

        <div style={cardStyle}>
          <h3>Productos</h3>
          <p>{stats.totalProductos}</p>
        </div>

        <div style={cardStyle}>
          <h3>Ventas</h3>
          <p>{stats.totalVentas}</p>
        </div>

        <div style={cardStyle}>
          <h3>Ingresos Totales</h3>
          <p>${stats.ingresosTotales}</p>
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  textAlign: "center"
};