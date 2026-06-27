import React from "react";

export default function VentaStats({
  ingresosTotales,
  totalVentas,
  productosVendidos,
  ventaPromedio,
  formatoMoneda,
  styles,
}) {
  return (
    <div style={styles.statsGrid}>
      <div style={styles.statCard}>
        <div style={styles.statIcon}>💰</div>

        <h4 style={styles.statTitle}>Ingresos Totales</h4>

        <p style={styles.statValue}>{formatoMoneda(ingresosTotales)}</p>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>🛒</div>

        <h4 style={styles.statTitle}>Total Ventas</h4>

        <p style={styles.statValue}>{totalVentas}</p>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>📦</div>

        <h4 style={styles.statTitle}>Productos Vendidos</h4>

        <p style={styles.statValue}>{productosVendidos}</p>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>📈</div>

        <h4 style={styles.statTitle}>Venta Promedio</h4>

        <p style={styles.statValue}>{formatoMoneda(ventaPromedio)}</p>
      </div>
    </div>
  );
}
