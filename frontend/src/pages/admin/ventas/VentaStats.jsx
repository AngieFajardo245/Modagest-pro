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

        <p style={styles.statDescription}>Actualizado automáticamente</p>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>🛒</div>

        <h4 style={styles.statTitle}>Total Ventas</h4>

        <p style={styles.statValue}>{totalVentas}</p>

        <p style={styles.statDescription}>Número de transacciones completadas</p>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>📦</div>

        <h4 style={styles.statTitle}>Productos Vendidos</h4>

        <p style={styles.statValue}>{productosVendidos}</p>

        <p style={styles.statDescription}>Cantidad total de productos vendidos</p>
      </div>
    
      <div style={styles.statCard}>
        <div style={styles.statIcon}>📈</div>

        <h4 style={styles.statTitle}>Venta Promedio</h4>

        <p style={styles.statValue}>{formatoMoneda(ventaPromedio)}</p>

        <p style={styles.statDescription}>Promedio de cada transacción</p>
      </div>

    </div>
  );
}
