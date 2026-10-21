import { FaCoins } from "react-icons/fa";
import styles from "./dashboardStyles";

export default function DashboardHero({ ingresos, formatoMoneda }) {
  return (
    <div style={styles.heroCard}>
      <div style={styles.heroContent}>
        <p style={styles.heroLabel}>Ingresos totales</p>

        <h2 style={styles.heroValue}>{formatoMoneda(ingresos)}</h2>

        <p style={styles.heroDescription}>
          Resumen general de ingresos registrados en el sistema.
        </p>
      </div>

      <div style={styles.heroIcon} aria-hidden="true">
        <FaCoins />
      </div>
    </div>
  );
}
