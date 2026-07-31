import styles from "./dashboardStyles";

export default function DashboardHero({ ingresos, formatoMoneda }) {
  return (
    <div style={styles.heroCard}>
      <div>
        <p style={styles.heroLabel}>Ingresos Totales</p>

        <h2 style={styles.heroValue}>{formatoMoneda(ingresos)}</h2>

        <p style={styles.heroDescription}>
          Resumen general de ingresos registrados dentro del sistema.
        </p>
      </div>

      <div style={styles.heroIcon}>💰</div>
    </div>
  );
}
