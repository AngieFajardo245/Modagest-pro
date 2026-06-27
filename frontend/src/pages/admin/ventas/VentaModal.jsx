import React from "react";

export default function VentaModal({
  ventaSeleccionada,
  cerrarModal,
  formatoMoneda,
  styles,
}) {
  if (!ventaSeleccionada) {
    return null;
  }

  const totalProductos =
    ventaSeleccionada.Detalles?.reduce(
      (acc, d) => acc + Number(d.cantidad || 0),
      0,
    ) || 0;

  return (
    <div style={styles.modalOverlay} onClick={cerrarModal}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2>🧾 Detalle Venta #{ventaSeleccionada.id}</h2>

          <button onClick={cerrarModal} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div style={styles.modalSection}>
          <h3>Cliente</h3>

          <p>
            <strong>Nombre:</strong>{" "}
            {ventaSeleccionada.Cliente?.nombre || "Cliente eliminado"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {ventaSeleccionada.Cliente?.email || "Sin correo"}
          </p>

          <p>
            <strong>Fecha:</strong>{" "}
            {ventaSeleccionada.createdAt
              ? new Date(ventaSeleccionada.createdAt).toLocaleString("es-CO")
              : "Sin fecha"}
          </p>

          <p>
            <strong>Productos:</strong> {totalProductos}
          </p>
        </div>

        <div style={styles.modalSection}>
          <h3>Productos</h3>

          {!ventaSeleccionada.Detalles ||
          ventaSeleccionada.Detalles.length === 0 ? (
            <p>No hay productos registrados</p>
          ) : (
            ventaSeleccionada.Detalles.map((detalle, index) => (
              <div key={detalle.id || index} style={styles.modalProduct}>
                <strong>
                  {detalle.Producto?.nombre || "Producto eliminado"}
                </strong>

                <p>Cantidad: {detalle.cantidad}</p>
              </div>
            ))
          )}
        </div>

        <div style={styles.modalSection}>
          <h3>Pago</h3>

          <p>Método: {ventaSeleccionada.Pago?.metodoPago || "Sin pago"}</p>

          <p>
            Estado:{" "}
            <span
              style={{
                color:
                  ventaSeleccionada.Pago?.estado === "aprobado"
                    ? "#22c55e"
                    : "#facc15",

                fontWeight: "bold",
              }}
            >
              {ventaSeleccionada.Pago?.estado || "Sin estado"}
            </span>
          </p>
        </div>

        <div style={styles.modalTotal}>
          Total: {formatoMoneda(ventaSeleccionada.total)}
        </div>
      </div>
    </div>
  );
}
