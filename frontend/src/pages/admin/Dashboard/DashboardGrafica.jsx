import styles from "./dashboardStyles";

export default function DashboardGrafica({ ventas, formatoMoneda }) {
  const datos = Array.isArray(ventas) ? ventas : [];

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

  const ventasValidas = datos.filter((venta) => {
    const total = Number(venta?.total);

    return Number.isFinite(total) && total >= 0;
  });

  if (ventasValidas.length === 0) {
    return (
      <div style={styles.chartCard}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Ventas</h3>
        </div>

        <p style={styles.chartEmpty}>
          No hay datos válidos de ventas para mostrar.
        </p>
      </div>
    );
  }

  const ventasMaximas = Math.max(
    ...ventasValidas.map((venta) => Number(venta.total)),
  );

  const formatearMoneda = (valor) => {
    if (typeof formatoMoneda === "function") {
      return formatoMoneda(valor);
    }

    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  const formatearFecha = (valor) => {
    if (!valor) {
      return "Fecha no disponible";
    }

    const fecha = new Date(valor);

    if (Number.isNaN(fecha.getTime())) {
      return "Fecha no disponible";
    }

    return fecha.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
          {ventasValidas.length}{" "}
          {ventasValidas.length === 1 ? "venta" : "ventas"}
        </span>
      </div>

      <div style={styles.chartList}>
        {ventasValidas.map((venta) => {
          const total = Number(venta.total);

          const porcentaje =
            ventasMaximas > 0 ? (total / ventasMaximas) * 100 : 0;

          return (
            <div key={venta.id} style={styles.chartItem}>
              <div style={styles.chartInfo}>
                <span style={styles.chartDate}>
                  {formatearFecha(venta.createdAt)}
                </span>

                <strong style={styles.chartValue}>
                  {formatearMoneda(total)}
                </strong>
              </div>

              <div
                style={styles.chartBarBackground}
                role="progressbar"
                aria-valuenow={Math.round(porcentaje)}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Venta de ${formatearMoneda(total)}`}
              >
                <div
                  style={{
                    ...styles.chartBar,
                    width: `${Math.min(Math.max(porcentaje, 0), 100)}%`,
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
