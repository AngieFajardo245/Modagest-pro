import React from "react";

export default function VentaStats({
  ingresosTotales = 0,
  totalVentas = 0,
  productosVendidos = 0,
  ventaPromedio = 0,
  formatoMoneda,
  styles,
}) {
  const formatearMoneda = (valor) => {
    if (typeof formatoMoneda === "function") {
      return formatoMoneda(valor);
    }

    return `$${Number(valor || 0).toLocaleString("es-CO")}`;
  };

  return (
    <div style={styles.statsGrid}>
      <div style={styles.statCard}>
        <div style={styles.statIcon}>💰</div>

        <h4 style={styles.statTitle}>Ingresos Totales</h4>

        <p style={styles.statValue}>{formatearMoneda(ingresosTotales)}</p>

        <p style={styles.statDescription}>Actualizado automáticamente</p>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>🛒</div>

        <h4 style={styles.statTitle}>Total Ventas</h4>

        <p style={styles.statValue}>{Number(totalVentas)}</p>

        <p style={styles.statDescription}>
          Número de transacciones completadas
        </p>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>📦</div>

        <h4 style={styles.statTitle}>Productos Vendidos</h4>

        <p style={styles.statValue}>{Number(productosVendidos)}</p>

        <p style={styles.statDescription}>
          Cantidad total de productos vendidos
        </p>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>📈</div>

        <h4 style={styles.statTitle}>Venta Promedio</h4>

        <p style={styles.statValue}>{formatearMoneda(ventaPromedio)}</p>

        <p style={styles.statDescription}>Promedio de cada transacción</p>
      </div>
    </div>
  );
}
