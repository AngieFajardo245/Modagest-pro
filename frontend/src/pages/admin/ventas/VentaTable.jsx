import React from "react";

export default function VentaTable({
  ventasFiltradas = [],
  formatoMoneda,
  styles,
  abrirModal,
  obtenerNombreCliente,
  obtenerEmailCliente,
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

  const obtenerFecha = (fecha) => {
    if (!fecha) {
      return {
        fecha: "Sin fecha",
        hora: "",
      };
    }

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return {
        fecha: "Sin fecha",
        hora: "",
      };
    }

    return {
      fecha: fechaObj.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      hora: fechaObj.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const obtenerTotal = (total) => {
    if (typeof formatoMoneda === "function") {
      return formatoMoneda(total);
    }

    return `$${Number(total || 0).toLocaleString("es-CO")}`;
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
        {ventasFiltradas.map((venta) => {
          const nombreCliente = obtenerNombreCliente
            ? obtenerNombreCliente(venta)
            : venta.Cliente?.nombre || "Cliente General";

          const emailCliente = obtenerEmailCliente
            ? obtenerEmailCliente(venta)
            : venta.Cliente?.email || "Sin correo";

          const detalles = Array.isArray(venta.Detalles) ? venta.Detalles : [];

          const estado = venta.Pago?.estado || "Sin estado";
          const metodoPago = venta.Pago?.metodoPago || "Sin pago";
          const fecha = obtenerFecha(venta.createdAt);

          return (
            <tr
              key={venta.id}
              style={styles.tr}
              onClick={() => abrirModal?.(venta)}
            >
              <td style={styles.td}>#{String(venta.id).padStart(5, "0")}</td>

              <td style={styles.td}>
                <div style={styles.userInfo}>
                  <div style={styles.avatar}>
                    {nombreCliente.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{nombreCliente}</strong>

                    <p style={styles.email}>{emailCliente}</p>
                  </div>
                </div>
              </td>

              <td style={styles.td}>
                <div style={styles.productsBox}>
                  {detalles.length > 0 ? (
                    detalles.map((detalle, index) => {
                      const nombreProducto =
                        detalle.Producto?.nombre || "Producto eliminado";

                      const cantidad = Number(detalle.cantidad || 0);

                      return (
                        <div
                          key={
                            detalle.id ||
                            `${venta.id}-${detalle.Producto?.id || "producto"}-${index}`
                          }
                          style={styles.productItem}
                        >
                          <span style={styles.productName}>
                            📦 {nombreProducto}
                          </span>

                          <span style={styles.productQty}>× {cantidad}</span>
                        </div>
                      );
                    })
                  ) : (
                    <span style={styles.email}>Sin productos</span>
                  )}
                </div>
              </td>

              <td style={styles.td}>
                <span
                  style={{
                    ...styles.estadoBadge,
                    ...obtenerEstadoColor(estado),
                  }}
                >
                  {estado}
                </span>

                <div style={styles.metodoPago}>💳 {metodoPago}</div>
              </td>

              <td style={styles.total}>{obtenerTotal(venta.total)}</td>

              <td style={styles.td}>
                <div style={styles.fecha}>{fecha.fecha}</div>

                {fecha.hora && <div style={styles.hora}>{fecha.hora}</div>}
              </td>

              <td style={styles.td}>
                <button
                  type="button"
                  style={styles.viewBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    abrirModal?.(venta);
                  }}
                  title={`Ver detalle de la venta #${venta.id}`}
                  aria-label={`Ver detalle de la venta #${venta.id}`}
                >
                  👁️ Ver detalle
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
