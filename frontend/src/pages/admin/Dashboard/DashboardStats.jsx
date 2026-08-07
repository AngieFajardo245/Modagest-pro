import styles from "./dashboardStyles";

export default function DashboardStats({ stats, formatoMoneda }) {
  return (
    <>
      {/* ================= ESTADISTICAS GENERALES ================= */}

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

      {/* ================= ESTADISTICAS DE HOY ================= */}

      <div style={styles.periodGrid}>
        <PeriodCard
          title="Ventas de hoy"
          value={stats?.ventasHoy || 0}
          icon="🛒"
          description="Transacciones realizadas hoy"
        />

        <PeriodCard
          title="Ingresos de hoy"
          value={formatoMoneda(stats?.ingresosHoy)}
          icon="💰"
          description="Ingresos generados hoy"
        />

        {/* ================= ESTADISTICAS DEL MES ================= */}

        <PeriodCard
          title="Ventas del mes"
          value={stats?.ventasMes || 0}
          icon="📈"
          description="Transacciones realizadas este mes"
        />

        <PeriodCard
          title="Ingresos del mes"
          value={formatoMoneda(stats?.ingresosMes)}
          icon="💵"
          description="Ingresos generados este mes"
        />
      </div>
    </>
  );
}

/* ================= TARJETA GENERAL ================= */

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

/* ================= TARJETA POR PERIODO ================= */

function PeriodCard({ title, value, icon, description }) {
  return (
    <div style={styles.periodCard}>
      <div style={styles.periodIconBox}>
        <span style={styles.periodIcon}>{icon}</span>
      </div>

      <div>
        <p style={styles.periodTitle}>{title}</p>

        <h3 style={styles.periodValue}>{value}</h3>

        <p style={styles.periodDescription}>{description}</p>
      </div>
    </div>
  );
}
