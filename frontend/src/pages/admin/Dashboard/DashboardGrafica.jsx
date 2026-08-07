import styles from "./dashboardStyles";

export default function DashboardGrafica({ ventas, formatoMoneda }) {
  const datos = ventas || [];

  if (datos.length === 0) {
    return (
      <div style={styles.chartCard}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Ventas</h3>
        </div>

        <p style={styles.chartEmpty}>No hay ventas registradas para mostrar.</p>
      </div>
    );
  }

  const ventasMaximas = Math.max(
    ...datos.map((venta) => Number(venta.total || 0)),
  );

  return (
    <div style={styles.chartCard}>
      <div style={styles.sectionHeader}>
        <div>
          <h3 style={styles.sectionTitle}>Ventas</h3>

          <p style={styles.chartSubtitle}>
            Comportamiento de las ventas registradas
          </p>
        </div>

        <span style={styles.sectionBadge}>
          {datos.length} {datos.length === 1 ? "venta" : "ventas"}
        </span>
      </div>

      <div style={styles.chartList}>
        {datos.map((venta) => {
          const total = Number(venta.total || 0);

          const porcentaje =
            ventasMaximas > 0 ? (total / ventasMaximas) * 100 : 0;

          const fecha = new Date(venta.createdAt).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          return (
            <div key={venta.id} style={styles.chartItem}>
              <div style={styles.chartInfo}>
                <span style={styles.chartDate}>{fecha}</span>

                <strong style={styles.chartValue}>
                  {formatoMoneda
                    ? formatoMoneda(total)
                    : total.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      })}
                </strong>
              </div>

              <div style={styles.chartBarBackground}>
                <div
                  style={{
                    ...styles.chartBar,
                    width: `${porcentaje}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
