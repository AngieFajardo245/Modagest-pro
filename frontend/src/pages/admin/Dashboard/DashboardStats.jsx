import {
  FaBoxOpen,
  FaCalendarAlt,
  FaChartLine,
  FaCoins,
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import styles from "./dashboardStyles";

export default function DashboardStats({ stats, formatoMoneda }) {
  const datos = stats || {};

  const formatearMoneda = (valor) => {
    if (typeof formatoMoneda === "function") {
      return formatoMoneda(Number(valor || 0));
    }

    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  return (
    <>
      <div style={styles.grid}>
        <Card
          title="Usuarios"
          value={Number(datos.totalUsuarios || 0)}
          icon={<FaUsers />}
          description="Usuarios registrados"
        />

        <Card
          title="Productos"
          value={Number(datos.totalProductos || 0)}
          icon={<FaBoxOpen />}
          description="Productos activos"
        />

        <Card
          title="Ventas"
          value={Number(datos.totalVentas || 0)}
          icon={<FaShoppingCart />}
          description="Ventas realizadas"
        />

        <Card
          title="Ingresos"
          value={formatearMoneda(datos.ingresosTotales)}
          icon={<FaMoneyBillWave />}
          description="Total acumulado"
        />
      </div>

      <div style={styles.periodGrid}>
        <PeriodCard
          title="Ventas de hoy"
          value={Number(datos.ventasHoy || 0)}
          icon={<FaCalendarAlt />}
          description="Transacciones realizadas hoy"
        />

        <PeriodCard
          title="Ingresos de hoy"
          value={formatearMoneda(datos.ingresosHoy)}
          icon={<FaCoins />}
          description="Ingresos generados hoy"
        />

        <PeriodCard
          title="Ventas del mes"
          value={Number(datos.ventasMes || 0)}
          icon={<FaChartLine />}
          description="Transacciones realizadas este mes"
        />

        <PeriodCard
          title="Ingresos del mes"
          value={formatearMoneda(datos.ingresosMes)}
          icon={<FaMoneyBillWave />}
          description="Ingresos generados este mes"
        />
      </div>
    </>
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
