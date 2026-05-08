import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

function DashboardCliente() {

  const [nombre, setNombre] = useState("");
  const [compras, setCompras] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= CARGAR DATOS ================= */

  useEffect(() => {

    const usuario = localStorage.getItem("usuario");

    if (usuario) {
      try {
        const data = JSON.parse(usuario);
        setNombre(data.nombre || "Cliente");
      } catch {
        setNombre("Cliente");
      }
    }

    obtenerCompras();

  }, []);

  const obtenerCompras = async () => {
    try {

      setLoading(true);

      const res = await api.get("/cliente/compras");

      const data = Array.isArray(res.data) ? res.data : [];
      setCompras(data);

    } catch (error) {

      console.error("Error cargando compras:", error);
      setError("No se pudieron cargar tus compras");

    } finally {

      setLoading(false);

    }
  };

  /* ================= CALCULOS ================= */

  const totalCompras = compras.length;

  const dineroGastado = compras.reduce(
    (acc, c) => acc + (c.total || 0),
    0
  );

  const hoy = new Date().toDateString();

  const comprasHoy = compras.filter(c =>
    new Date(c.createdAt).toDateString() === hoy
  ).length;

  /* ================= FORMATO ================= */

  const formatearDinero = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP"
    }).format(valor || 0);
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div style={styles.center}>
        <p>Cargando panel...</p>
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
        <h2>👤 Panel del Cliente</h2>
        <p style={styles.subtext}>
          Bienvenido <strong>{nombre}</strong> a ModaGest Pro
        </p>
      </div>

      {/* ESTADÍSTICAS */}
      <div style={styles.grid}>

        <div style={styles.card}>
          <h5>🧾 Compras</h5>
          <p style={styles.number}>{totalCompras}</p>
        </div>

        <div style={styles.card}>
          <h5>💰 Total Gastado</h5>
          <p style={styles.number}>
            {formatearDinero(dineroGastado)}
          </p>
        </div>

        <div style={styles.card}>
          <h5>📅 Hoy</h5>
          <p style={styles.number}>{comprasHoy}</p>
        </div>

      </div>

      {/* ACCIONES */}
      <div style={styles.actions}>

        <Link to="/cliente/productos" style={styles.link}>
          <div style={{ ...styles.actionCard, background: "#0d6efd" }}>
            <h4>🛍 Ver Productos</h4>
            <p>Explorar catálogo completo</p>
          </div>
        </Link>

        <Link to="/cliente/compras" style={styles.link}>
          <div style={{ ...styles.actionCard, background: "#198754" }}>
            <h4>📦 Mis Compras</h4>
            <p>Revisar historial</p>
          </div>
        </Link>

      </div>

    </div>

  );
}

export default DashboardCliente;

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

  subtext: {
    color: "#666"
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
    textAlign: "center",
    transition: "0.3s"
  },

  number: {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "10px"
  },

  actions: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  },

  link: {
    textDecoration: "none",
    flex: 1
  },

  actionCard: {
    color: "white",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s"
  },

  center: {
    padding: "40px",
    textAlign: "center"
  }

};