import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* ===================================================== */
  /* ================= FORMATO MONEDA ==================== */
  /* ===================================================== */

  const formatoMoneda = (valor) => {

    return Number(valor || 0).toLocaleString(
      "es-CO",
      {
        style: "currency",
        currency: "COP"
      }
    );

  };

  /* ===================================================== */
  /* ================= OBTENER DATOS ====================== */
  /* ===================================================== */

  useEffect(() => {

    const obtenerStats = async () => {

      try {

        setLoading(true);

        const res = await api.get(
          "/admin/estadisticas"
        );

        setStats(res.data);

      } catch (error) {

        console.error(error);

        setError(
          error.response?.data?.message ||
          "No se pudieron cargar las estadísticas"
        );

      } finally {

        setLoading(false);

      }

    };

    obtenerStats();

  }, []);

  /* ===================================================== */
  /* ======================= LOADING ====================== */
  /* ===================================================== */

  if (loading) {

    return (

      <div style={styles.loadingContainer}>

        <div style={styles.loader}></div>

        <p style={styles.loadingText}>
          Cargando dashboard...
        </p>

      </div>

    );

  }

  /* ===================================================== */
  /* ======================== ERROR ======================= */
  /* ===================================================== */

  if (error) {

    return (

      <div style={styles.loadingContainer}>

        <p style={styles.error}>
          {error}
        </p>

      </div>

    );

  }

  /* ===================================================== */
  /* ========================== UI ======================== */
  /* ===================================================== */

  return (

    <div style={styles.container}>

      {/* ================= HEADER ================= */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            Dashboard Administrativo
          </h1>

          <p style={styles.subtitle}>
            Bienvenido nuevamente a ModaGest Pro
          </p>

        </div>

        <div style={styles.dateBox}>

          {new Date().toLocaleDateString(
            "es-CO",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            }
          )}

        </div>

      </div>

      {/* ================= HERO ================= */}

      <div style={styles.heroCard}>

        <div>

          <p style={styles.heroLabel}>
            Ingresos Totales
          </p>

          <h2 style={styles.heroValue}>

            {formatoMoneda(
              stats?.ingresosTotales
            )}

          </h2>

          <p style={styles.heroDescription}>
            Resumen general de ingresos registrados
            dentro del sistema.
          </p>

        </div>

        <div style={styles.heroIcon}>
          💰
        </div>

      </div>

      {/* ================= GRID ================= */}

      <div style={styles.grid}>

        <Card
          title="Usuarios"
          value={stats?.totalUsuarios || 0}
          icon="👥"
          color="#3B82F6"
          description="Usuarios registrados"
        />

        <Card
          title="Productos"
          value={stats?.totalProductos || 0}
          icon="🛍️"
          color="#8B5CF6"
          description="Productos activos"
        />

        <Card
          title="Ventas"
          value={stats?.totalVentas || 0}
          icon="📦"
          color="#10B981"
          description="Ventas realizadas"
        />

        <Card
          title="Ingresos"
          value={formatoMoneda(
            stats?.ingresosTotales
          )}
          icon="💸"
          color="#F59E0B"
          description="Total acumulado"
        />

      </div>

      {/* ================= ACTIVIDAD ================= */}

      <div style={styles.bottomGrid}>

        {/* ================= ACTIVIDAD ================= */}

        <div style={styles.activityCard}>

          <div style={styles.sectionHeader}>

            <h3 style={styles.sectionTitle}>
              Actividad Reciente
            </h3>

            <span style={styles.sectionBadge}>
              En vivo
            </span>

          </div>

          <div style={styles.activityList}>

            <ActivityItem
              icon="🛒"
              text="Nueva venta registrada"
              time="Hace unos minutos"
            />

            <ActivityItem
              icon="👤"
              text="Nuevo usuario registrado"
              time="Hoy"
            />

            <ActivityItem
              icon="📦"
              text="Inventario actualizado"
              time="Hoy"
            />

            <ActivityItem
              icon="💳"
              text="Pago aprobado"
              time="Hace 1 hora"
            />

          </div>

        </div>

        {/* ================= RESUMEN ================= */}

        <div style={styles.summaryCard}>

          <div style={styles.sectionHeader}>

            <h3 style={styles.sectionTitle}>
              Estado General
            </h3>

          </div>

          <div style={styles.summaryList}>

            <SummaryRow
              label="Usuarios activos"
              value={stats?.totalUsuarios || 0}
            />

            <SummaryRow
              label="Productos disponibles"
              value={stats?.totalProductos || 0}
            />

            <SummaryRow
              label="Ventas realizadas"
              value={stats?.totalVentas || 0}
            />

            <SummaryRow
              label="Ingresos"
              value={formatoMoneda(
                stats?.ingresosTotales
              )}
            />

          </div>

        </div>

      </div>

    </div>

  );

}

/* ===================================================== */
/* ======================= CARD ========================= */
/* ===================================================== */

function Card({
  title,
  value,
  icon,
  color,
  description
}) {

  return (

    <div
      style={{
        ...styles.card,
        border:
          `1px solid ${color}30`
      }}
    >

      <div
        style={{
          ...styles.iconBox,
          background:
            `${color}20`
        }}
      >

        <span style={styles.icon}>
          {icon}
        </span>

      </div>

      <p style={styles.cardTitle}>
        {title}
      </p>

      <h2 style={styles.cardValue}>
        {value}
      </h2>

      <p style={styles.cardDescription}>
        {description}
      </p>

    </div>

  );

}

/* ===================================================== */
/* =================== ACTIVITY ITEM ==================== */
/* ===================================================== */

function ActivityItem({
  icon,
  text,
  time
}) {

  return (

    <div style={styles.activityItem}>

      <div style={styles.activityIcon}>
        {icon}
      </div>

      <div>

        <p style={styles.activityText}>
          {text}
        </p>

        <span style={styles.activityTime}>
          {time}
        </span>

      </div>

    </div>

  );

}

/* ===================================================== */
/* ==================== SUMMARY ROW ===================== */
/* ===================================================== */

function SummaryRow({
  label,
  value
}) {

  return (

    <div style={styles.summaryRow}>

      <span style={styles.summaryLabel}>
        {label}
      </span>

      <span style={styles.summaryValue}>
        {value}
      </span>

    </div>

  );

}

/* ===================================================== */
/* ======================= ESTILOS ====================== */
/* ===================================================== */

const styles = {

  container: {

    padding: "10px",

    minHeight: "100vh",

    color: "#fff"

  },

  /* ================= HEADER ================= */

  header: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "20px",

    marginBottom: "30px"

  },

  title: {

    margin: 0,

    fontSize: "40px",

    fontWeight: "800",

    color: "#fff"

  },

  subtitle: {

    marginTop: "8px",

    color: "#94a3b8",

    fontSize: "15px"

  },

  dateBox: {

    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    padding: "14px 20px",

    borderRadius: "18px",

    backdropFilter: "blur(12px)",

    color: "#d1d5db"

  },

  /* ================= HERO ================= */

  heroCard: {

    background:
      "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(37,99,235,0.95))",

    borderRadius: "30px",

    padding: "40px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "35px",

    boxShadow:
      "0 20px 45px rgba(0,0,0,0.35)",

    flexWrap: "wrap",

    gap: "20px"

  },

  heroLabel: {

    margin: 0,

    color: "#e5e7eb",

    fontSize: "18px"

  },

  heroValue: {

    marginTop: "10px",

    fontSize: "42px",

    fontWeight: "800"

  },

  heroDescription: {

    marginTop: "10px",

    color: "#e5e7eb",

    maxWidth: "500px",

    lineHeight: "1.6"

  },

  heroIcon: {

    fontSize: "80px"

  },

  /* ================= GRID ================= */

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",

    gap: "25px",

    marginBottom: "35px"

  },

  card: {

    background:
      "rgba(255,255,255,0.05)",

    backdropFilter: "blur(14px)",

    WebkitBackdropFilter:
      "blur(14px)",

    borderRadius: "24px",

    padding: "28px",

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.25)",

    transition: "0.3s"

  },

  iconBox: {

    width: "65px",

    height: "65px",

    borderRadius: "18px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    marginBottom: "20px"

  },

  icon: {

    fontSize: "30px"

  },

  cardTitle: {

    color: "#94a3b8",

    fontSize: "15px",

    marginBottom: "10px"

  },

  cardValue: {

    fontSize: "34px",

    margin: 0,

    fontWeight: "800",

    color: "#fff"

  },

  cardDescription: {

    marginTop: "10px",

    color: "#94a3b8",

    fontSize: "14px"

  },

  /* ================= BOTTOM ================= */

  bottomGrid: {

    display: "grid",

    gridTemplateColumns:
      "1.4fr 1fr",

    gap: "25px"

  },

  activityCard: {

    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "24px",

    padding: "28px",

    backdropFilter: "blur(14px)"

  },

  summaryCard: {

    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "24px",

    padding: "28px",

    backdropFilter: "blur(14px)"

  },

  sectionHeader: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "25px"

  },

  sectionTitle: {

    margin: 0,

    fontSize: "22px",

    fontWeight: "700"

  },

  sectionBadge: {

    background:
      "rgba(16,185,129,0.18)",

    color: "#10b981",

    padding: "8px 14px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "700"

  },

  /* ================= ACTIVITY ================= */

  activityList: {

    display: "flex",

    flexDirection: "column",

    gap: "18px"

  },

  activityItem: {

    display: "flex",

    alignItems: "center",

    gap: "16px",

    padding: "14px",

    borderRadius: "18px",

    background:
      "rgba(255,255,255,0.04)"

  },

  activityIcon: {

    width: "50px",

    height: "50px",

    borderRadius: "14px",

    background:
      "rgba(124,58,237,0.18)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "22px"

  },

  activityText: {

    margin: 0,

    color: "#fff",

    fontWeight: "600"

  },

  activityTime: {

    color: "#94a3b8",

    fontSize: "13px"

  },

  /* ================= SUMMARY ================= */

  summaryList: {

    display: "flex",

    flexDirection: "column",

    gap: "16px"

  },

  summaryRow: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    paddingBottom: "12px",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)"

  },

  summaryLabel: {

    color: "#94a3b8"

  },

  summaryValue: {

    fontWeight: "700",

    color: "#fff"

  },

  /* ================= LOADING ================= */

  loadingContainer: {

    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    flexDirection: "column",

    color: "#fff"

  },

  loadingText: {

    marginTop: "18px",

    color: "#d1d5db"

  },

  loader: {

    width: "60px",

    height: "60px",

    border:
      "6px solid rgba(255,255,255,0.1)",

    borderTop:
      "6px solid #8b5cf6",

    borderRadius: "50%"

  },

  error: {

    color: "#ef4444",

    fontWeight: "700",

    fontSize: "18px"

  }

};