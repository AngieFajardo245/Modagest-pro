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

  const estadoPago = obtenerEstado(ventaSeleccionada.Pago?.estado);

  const fechaVenta = ventaSeleccionada.createdAt
    ? new Date(ventaSeleccionada.createdAt).toLocaleString("es-CO")
    : "Sin fecha registrada";

  return (
    <div
      style={styles.modalOverlay}
      onClick={cerrarModal}
      role="presentation"
    >
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="venta-modal-title"
      >
        {/* ================= HEADER ================= */}

        <div style={styles.modalHeader}>
          <div>
            <h2 id="venta-modal-title" style={styles.modalTitle}>
              🧾 Venta #
              {String(ventaSeleccionada.id).padStart(5, "0")}
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

        {/* ================= CLIENTE ================= */}

        <div style={styles.modalCard}>
          <h3>👤 Cliente</h3>

          <p>
            <strong>Nombre:</strong>{" "}
            {ventaSeleccionada.Cliente?.nombre || "Cliente eliminado"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {ventaSeleccionada.Cliente?.email || "Sin correo"}
          </p>

          <p>
            <strong>Fecha:</strong> {fechaVenta}
          </p>

          <p>
            <strong>Total productos:</strong> {totalProductos}
          </p>
        </div>

        {/* ================= PRODUCTOS ================= */}

        <div style={styles.modalCard}>
          <h3>📦 Productos</h3>

          {detalles.length === 0 ? (
            <p style={styles.modalEmpty}>
              No hay productos registrados en esta venta.
            </p>
          ) : (
            detalles.map((detalle, index) => {
              const precio = Number(detalle.precio || 0);
              const subtotal = Number(detalle.subtotal || 0);
              const cantidad = Number(detalle.cantidad || 0);

              return (
                <div
                  key={detalle.id || `${detalle.Producto?.id || "producto"}-${index}`}
                  style={styles.modalProduct}
                >
                  <div style={styles.productHeader}>
                    <strong>
                      {detalle.Producto?.nombre || "Producto eliminado"}
                    </strong>

                    <span style={styles.productQuantity}>
                      x{cantidad}
                    </span>
                  </div>

                  <div style={styles.productInfo}>
                    <span>
                      Precio: {formatoMoneda(precio)}
                    </span>

                    <span>
                      Subtotal: {formatoMoneda(subtotal)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ================= PAGO ================= */}

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
              <strong>Referencia:</strong>{" "}
              {ventaSeleccionada.Pago.referencia}
            </p>
          )}
        </div>

        {/* ================= TOTAL ================= */}

        <div style={styles.modalTotal}>
          <span>Total de la Venta</span>

          <h2>{formatoMoneda(ventaSeleccionada.total)}</h2>
        </div>
      </div>
    </div>
  );
}
