import styles from "./dashboardStyles";

export default function DashboardStats({ stats, formatoMoneda }) {
  return (
    <div style={styles.grid}>
      <Card
        title="Usuarios"
        value={stats?.totalUsuarios || 0}
        icon="👥"
        description="Usuarios registrados"
      />

      <Card
        title="Productos"
        value={stats?.totalProductos || 0}
        icon="🛍️"
        description="Productos activos"
      />

      <Card
        title="Ventas"
        value={stats?.totalVentas || 0}
        icon="📦"
        description="Ventas realizadas"
      />

      <Card
        title="Ingresos"
        value={formatoMoneda(stats?.ingresosTotales)}
        icon="💸"
        description="Total acumulado"
      />
    </div>
  );
}

function Card({ title, value, icon, description }) {
  return (
    <div style={styles.card}>
      <div style={styles.iconBox}>
        <span style={styles.icon}>{icon}</span>
      </div>

      <p style={styles.cardTitle}>{title}</p>

      <h2 style={styles.cardValue}>{value}</h2>

      <p style={styles.cardDescription}>{description}</p>
    </div>
  );
}
