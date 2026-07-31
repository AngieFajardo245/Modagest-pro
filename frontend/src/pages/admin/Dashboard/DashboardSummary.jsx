import styles from "./dashboardStyles";
import SummaryRow from "./SummaryRow";

export default function DashboardSummary({
  stats,
  formatoMoneda
}) {

  return (

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
          value={
            formatoMoneda(
              stats?.ingresosTotales
            )
          }
        />


      </div>


    </div>

  );

}