import React from "react";

export default function VentaTable({
  ventasFiltradas,
  formatoMoneda,
  styles,
  abrirModal,
}) {
  const obtenerEstadoColor = (estado) => {
    switch ((estado || "").toLowerCase()) {
      case "aprobado":
        return styles.estadoAprobado;

      case "pendiente":
        return styles.estadoPendiente;

      case "rechazado":
        return styles.estadoRechazado;

      default:
        return styles.estadoDefault;
    }
  };

  return (
    <table style={styles.table}>
      <thead>
        <tr style={styles.thead}>
          <th style={styles.th}>🧾 Venta</th>
          <th style={styles.th}>👤 Cliente</th>
          <th style={styles.th}>📦 Productos</th>
          <th style={styles.th}>💳 Estado</th>
          <th style={styles.th}>💰 Total</th>
          <th style={styles.th}>📅 Fecha</th>
          <th style={styles.th}>⚙️ Acción</th>
        </tr>
      </thead>

      <tbody>
        {ventasFiltradas.map((venta) => (
          <tr
            key={venta.id}
            style={styles.tr}
            onClick={() => abrirModal(venta)}
          >
            <td style={styles.td}>#{String(venta.id).padStart(5, "0")}</td>

            <td style={styles.td}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  {venta.Cliente?.nombre?.charAt(0)?.toUpperCase() || "C"}
                </div>

                <div>
                  <strong>{venta.Cliente?.nombre || "Cliente General"}</strong>

                  <p style={styles.email}>
                    {venta.Cliente?.email || "Sin correo"}
                  </p>
                </div>
              </div>
            </td>

            <td style={styles.td}>
              <div style={styles.productsBox}>
                {venta.Detalles?.length > 0 ? (
                  venta.Detalles.map((detalle, index) => (
                    <div key={detalle.id || index} style={styles.productItem}>
                      <span style={styles.productName}>
                        📦 {detalle.Producto?.nombre || "Producto eliminado"}
                      </span>

                      <span style={styles.productQty}>
                        × {detalle.cantidad}
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={styles.email}>Sin productos</span>
                )}
              </div>
            </td>

            <td style={styles.td}>
              <span
                style={{
                  ...styles.estadoBadge,
                  ...obtenerEstadoColor(venta.Pago?.estado),
                }}
              >
                {venta.Pago?.estado || "Sin estado"}
              </span>

              <div style={styles.metodoPago}>
                💳 {venta.Pago?.metodoPago || "Sin pago"}
              </div>
            </td>

            <td style={styles.total}>{formatoMoneda(venta.total)}</td>

            <td style={styles.td}>
              <div style={styles.fecha}>
                {venta.createdAt
                  ? new Date(venta.createdAt).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Sin fecha"}
              </div>

              {venta.createdAt && (
                <div style={styles.hora}>
                  {new Date(venta.createdAt).toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </td>

            <td style={styles.td}>
              <button
                type="button"
                style={styles.viewBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  abrirModal(venta);
                }}
                title={`Ver detalle de la venta #${venta.id}`}
              >
                👁️ Ver detalle
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
