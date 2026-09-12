import styles from "./dashboardStyles";
import SummaryRow from "./SummaryRow";

const NOMBRES_METODOS = {
  tarjeta: "Tarjeta",
  efectivo: "Efectivo",
  pse: "PSE",
  nequi: "Nequi",
  contra_entrega: "Contra Entrega",
};

const obtenerNombreMetodo = (metodo) => {
  const clave = String(metodo || "")
    .trim()
    .toLowerCase();

  return NOMBRES_METODOS[clave] || metodo || "Sin especificar";
};

export default function DashboardSummary({ stats, formatoMoneda }) {
  const metodosPago = stats?.metodosPago || {};

  return (
    <div style={styles.summaryCard}>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Estado General</h3>
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

        <SummaryRow label="Ventas realizadas" value={stats?.totalVentas || 0} />

        <SummaryRow
          label="Ingresos"
          value={formatoMoneda(stats?.ingresosTotales)}
        />
      </div>

      <div style={styles.paymentSection}>
        <h4 style={styles.paymentTitle}>💳 Métodos de pago</h4>

        {Object.keys(metodosPago).length === 0 ? (
          <p style={styles.activityTime}>No hay pagos registrados.</p>
        ) : (
          <div style={styles.paymentList}>
            {Object.entries(metodosPago).map(([metodo, cantidad]) => (
              <div key={metodo} style={styles.paymentRow}>
                <span style={styles.paymentLabel}>
                  {obtenerNombreMetodo(metodo)}
                </span>

                <span style={styles.paymentValue}>
                  {cantidad}
                  {cantidad === 1 ? " venta" : " ventas"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
