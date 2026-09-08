import React from "react";

export default function VentaModal({
  ventaSeleccionada,
  cerrarModal,
  formatoMoneda,
  styles,
}) {
  if (!ventaSeleccionada) return null;

  const detalles = Array.isArray(ventaSeleccionada.Detalles)
    ? ventaSeleccionada.Detalles
    : [];

  const totalProductos = detalles.reduce(
    (acc, detalle) => acc + Number(detalle.cantidad || 0),
    0,
  );

  const obtenerNombreCliente = () => {
    if (
      ventaSeleccionada.clienteId === null ||
      ventaSeleccionada.clienteId === undefined
    ) {
      return "Cliente General";
    }

    return ventaSeleccionada.Cliente?.nombre || "Cliente eliminado";
  };

  const obtenerEmailCliente = () => {
    if (
      ventaSeleccionada.clienteId === null ||
      ventaSeleccionada.clienteId === undefined
    ) {
      return "cliente@modagest.com";
    }

    return ventaSeleccionada.Cliente?.email || "Sin correo";
  };

  const obtenerEstado = (estado) => {
    switch ((estado || "").toLowerCase()) {
      case "aprobado":
        return {
          color: "#22c55e",
          icono: "🟢",
          texto: "Aprobado",
        };

      case "pendiente":
        return {
          color: "#facc15",
          icono: "🟡",
          texto: "Pendiente",
        };

      case "rechazado":
        return {
          color: "#ef4444",
          icono: "🔴",
          texto: "Rechazado",
        };

      default:
        return {
          color: "#94a3b8",
          icono: "⚪",
          texto: "Sin estado",
        };
    }
  };

  const obtenerFecha = (fecha) => {
    if (!fecha) return "Sin fecha registrada";

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return "Sin fecha registrada";
    }

    return fechaObj.toLocaleString("es-CO");
  };

  const formatearMoneda = (valor) => {
    if (typeof formatoMoneda === "function") {
      return formatoMoneda(valor);
    }

    return `$${Number(valor || 0).toLocaleString("es-CO")}`;
  };

  const obtenerSubtotal = (detalle) => {
    const subtotal = Number(detalle.subtotal);

    if (Number.isFinite(subtotal) && subtotal > 0) {
      return subtotal;
    }

    const precio = Number(detalle.precio || 0);
    const cantidad = Number(detalle.cantidad || 0);

    return precio * cantidad;
  };

  const estadoPago = obtenerEstado(ventaSeleccionada.Pago?.estado);
  const nombreCliente = obtenerNombreCliente();
  const emailCliente = obtenerEmailCliente();
  const fechaVenta = obtenerFecha(ventaSeleccionada.createdAt);

  return (
    <div style={styles.modalOverlay} onClick={cerrarModal} role="presentation">
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="venta-modal-title"
      >
        <div style={styles.modalHeader}>
          <div>
            <h2 id="venta-modal-title" style={styles.modalTitle}>
              🧾 Venta #{String(ventaSeleccionada.id).padStart(5, "0")}
            </h2>

            <p style={styles.modalSubtitle}>
              Detalle completo de la transacción
            </p>
          </div>

          <button
            type="button"
            onClick={cerrarModal}
            style={styles.closeBtn}
            aria-label="Cerrar detalle de venta"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        <div style={styles.modalCard}>
          <h3>👤 Cliente</h3>

          <p>
            <strong>Nombre:</strong> {nombreCliente}
          </p>

          <p>
            <strong>Email:</strong> {emailCliente}
          </p>

          <p>
            <strong>Fecha:</strong> {fechaVenta}
          </p>

          <p>
            <strong>Total productos:</strong> {totalProductos}
          </p>
        </div>

        <div style={styles.modalCard}>
          <h3>📦 Productos</h3>

          {detalles.length === 0 ? (
            <p style={styles.modalEmpty}>
              No hay productos registrados en esta venta.
            </p>
          ) : (
            detalles.map((detalle, index) => {
              const precio = Number(detalle.precio || 0);
              const cantidad = Number(detalle.cantidad || 0);
              const subtotal = obtenerSubtotal(detalle);

              const nombreProducto =
                detalle.Producto?.nombre || "Producto eliminado";

              return (
                <div
                  key={
                    detalle.id ||
                    `${ventaSeleccionada.id}-${detalle.Producto?.id || "producto"}-${index}`
                  }
                  style={styles.modalProduct}
                >
                  <div style={styles.productHeader}>
                    <strong>{nombreProducto}</strong>

                    <span style={styles.productQuantity}>x{cantidad}</span>
                  </div>

                  <div style={styles.productInfo}>
                    <span>Precio: {formatearMoneda(precio)}</span>

                    <span>Subtotal: {formatearMoneda(subtotal)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={styles.modalCard}>
          <h3>💳 Información del Pago</h3>

          <p>
            <strong>Método:</strong>{" "}
            {ventaSeleccionada.Pago?.metodoPago || "Sin registrar"}
          </p>

          <p>
            <strong>Estado:</strong>{" "}
            <span
              style={{
                color: estadoPago.color,
                fontWeight: "700",
              }}
            >
              {estadoPago.icono} {estadoPago.texto}
            </span>
          </p>

          {ventaSeleccionada.Pago?.referencia && (
            <p>
              <strong>Referencia:</strong> {ventaSeleccionada.Pago.referencia}
            </p>
          )}
        </div>

        <div style={styles.modalTotal}>
          <span>Total de la Venta</span>

          <h2>{formatearMoneda(ventaSeleccionada.total)}</h2>
        </div>
      </div>
    </div>
  );
}
