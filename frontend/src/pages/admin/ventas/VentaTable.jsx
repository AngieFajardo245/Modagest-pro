import {
  FaBoxOpen,
  FaCalendarAlt,
  FaCog,
  FaCoins,
  FaCreditCard,
  FaEye,
  FaReceipt,
  FaUser,
} from "react-icons/fa";

const estiloIcono = {
  marginRight: "6px",
  verticalAlign: "middle",
};

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
          <th style={styles.th}>
            <FaReceipt style={estiloIcono} />
            Venta
          </th>

          <th style={styles.th}>
            <FaUser style={estiloIcono} />
            Cliente
          </th>

          <th style={styles.th}>
            <FaBoxOpen style={estiloIcono} />
            Productos
          </th>

          <th style={styles.th}>
            <FaCreditCard style={estiloIcono} />
            Estado
          </th>

          <th style={styles.th}>
            <FaCoins style={estiloIcono} />
            Total
          </th>

          <th style={styles.th}>
            <FaCalendarAlt style={estiloIcono} />
            Fecha
          </th>

          <th style={styles.th}>
            <FaCog style={estiloIcono} />
            Acción
          </th>
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
                            <FaBoxOpen style={estiloIcono} />
                            {nombreProducto}
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

                <div style={styles.metodoPago}>
                  <FaCreditCard style={estiloIcono} />
                  {metodoPago}
                </div>
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
                  onClick={(event) => {
                    event.stopPropagation();
                    abrirModal?.(venta);
                  }}
                  title={`Ver detalle de la venta #${venta.id}`}
                  aria-label={`Ver detalle de la venta #${venta.id}`}
                >
                  <FaEye style={estiloIcono} />
                  Ver detalle
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
