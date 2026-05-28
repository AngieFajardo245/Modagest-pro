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

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setCompras(data);

    } catch (error) {

      console.error(error);

      setError("No se pudieron cargar tus compras");

    } finally {

      setLoading(false);

    }

  };

  /* ================= CALCULOS ================= */

  const totalCompras = compras.length;

  const dineroGastado = compras.reduce(
    (acc, c) => acc + (Number(c.total) || 0),
    0
  );

  const hoy = new Date().toDateString();

  const comprasHoy = compras.filter(
    c =>
      new Date(c.createdAt).toDateString() === hoy
  ).length;

  /* ================= FORMATO ================= */

  const formatearDinero = (valor) => {

    return new Intl.NumberFormat("es-CO", {

      style: "currency",

      currency: "COP"

    }).format(valor || 0);

  };

  /* ================= LOADING ================= */

  if (loading) {

    return (

      <div style={styles.center}>

        <div style={styles.loadingCard}>
          <h2>Cargando panel...</h2>
        </div>

      </div>

    );

  }

  /* ================= ERROR ================= */

  if (error) {

    return (

      <div style={styles.center}>

        <div style={styles.errorCard}>
          <h2>{error}</h2>
        </div>

      </div>

    );

  }

  /* ================= UI ================= */

  return (

    <div style={styles.container}>

      {/* HERO */}

      <div style={styles.hero}>

        <div>

          <p style={styles.badge}>
            ✨ Panel Cliente
          </p>

          <h1 style={styles.title}>
            Bienvenido, {nombre}
          </h1>

          <p style={styles.subtitle}>
            Gestiona tus compras y explora
            nuevos productos en ModaGest Pro
          </p>

        </div>

      </div>

      {/* ESTADÍSTICAS */}

      <div style={styles.grid}>

        <div style={styles.card}>

          <div style={styles.iconCircle}>
            🧾
          </div>

          <h3 style={styles.cardTitle}>
            Compras
          </h3>

          <p style={styles.number}>
            {totalCompras}
          </p>

          <span style={styles.cardText}>
            Compras realizadas
          </span>

        </div>

        <div style={styles.card}>

          <div style={styles.iconCircle}>
            💰
          </div>

          <h3 style={styles.cardTitle}>
            Total Gastado
          </h3>

          <p style={styles.number}>
            {formatearDinero(dineroGastado)}
          </p>

          <span style={styles.cardText}>
            Dinero invertido
          </span>

        </div>

        <div style={styles.card}>

          <div style={styles.iconCircle}>
            📅
          </div>

          <h3 style={styles.cardTitle}>
            Compras Hoy
          </h3>

          <p style={styles.number}>
            {comprasHoy}
          </p>

          <span style={styles.cardText}>
            Actividad reciente
          </span>

        </div>

      </div>

      {/* ACCIONES */}

      <div style={styles.actions}>

        <Link
          to="/cliente/productos"
          style={styles.link}
        >

          <div style={styles.actionCard}>

            <div style={styles.actionIcon}>
              🛍
            </div>

            <h2 style={styles.actionTitle}>
              Ver Productos
            </h2>

            <p style={styles.actionText}>
              Explora el catálogo completo
            </p>

          </div>

        </Link>

        <Link
          to="/cliente/compras"
          style={styles.link}
        >

          <div style={styles.actionCard}>

            <div style={styles.actionIcon}>
              📦
            </div>

            <h2 style={styles.actionTitle}>
              Mis Compras
            </h2>

            <p style={styles.actionText}>
              Revisa tu historial de pedidos
            </p>

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

    minHeight: "100vh",

    padding: "35px",

    background: "#050816",

    color: "white"

  },

  hero: {

    background:
      "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(76,29,149,0.18))",

    border: "1px solid rgba(139,92,246,0.25)",

    backdropFilter: "blur(14px)",

    borderRadius: "24px",

    padding: "40px",

    marginBottom: "35px",

    boxShadow:
      "0 0 30px rgba(139,92,246,0.12)"

  },

  badge: {

    color: "#a855f7",

    fontWeight: "600",

    marginBottom: "10px",

    letterSpacing: "1px"

  },

  title: {

    fontSize: "42px",

    fontWeight: "700",

    marginBottom: "15px"

  },

  subtitle: {

    color: "#cbd5e1",

    maxWidth: "600px",

    lineHeight: "1.7"

  },

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",

    gap: "25px",

    marginBottom: "35px"

  },

  card: {

    background: "rgba(255,255,255,0.05)",

    backdropFilter: "blur(10px)",

    border: "1px solid rgba(139,92,246,0.18)",

    borderRadius: "22px",

    padding: "30px",

    textAlign: "center",

    transition: "0.3s",

    cursor: "pointer",

    transform: "translateY(0px)",

    boxShadow:
      "0 0 20px rgba(139,92,246,0.08)"

  },

  iconCircle: {

    width: "70px",

    height: "70px",

    borderRadius: "50%",

    margin: "0 auto 20px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "30px",

    background:
      "linear-gradient(135deg,#7c3aed,#9333ea)",

    boxShadow:
      "0 0 20px rgba(139,92,246,0.35)"

  },

  cardTitle: {

    marginBottom: "15px",

    fontSize: "20px"

  },

  number: {

    fontSize: "30px",

    fontWeight: "bold",

    color: "#c084fc",

    marginBottom: "10px"

  },

  cardText: {

    color: "#94a3b8",

    fontSize: "14px"

  },

  actions: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",

    gap: "25px"

  },

  link: {

    textDecoration: "none"

  },

  actionCard: {

    background:
      "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(76,29,149,0.2))",

    border: "1px solid rgba(139,92,246,0.2)",

    backdropFilter: "blur(14px)",

    borderRadius: "24px",

    padding: "35px",

    color: "white",

    textAlign: "center",

    transition: "0.3s",

    boxShadow:
      "0 0 25px rgba(139,92,246,0.12)"

  },

  actionIcon: {

    fontSize: "45px",

    marginBottom: "18px"

  },

  actionTitle: {

    marginBottom: "12px",

    fontSize: "26px"

  },

  actionText: {

    color: "#d1d5db"

  },

  center: {

    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    background: "#050816"

  },

  loadingCard: {

    background: "rgba(255,255,255,0.05)",

    padding: "30px 50px",

    borderRadius: "20px",

    border: "1px solid rgba(139,92,246,0.2)",

    backdropFilter: "blur(10px)"

  },

  errorCard: {

    background: "rgba(220,38,38,0.12)",

    color: "#f87171",

    padding: "30px 50px",

    borderRadius: "20px",

    border: "1px solid rgba(248,113,113,0.3)",

    backdropFilter: "blur(10px)"

  }

};