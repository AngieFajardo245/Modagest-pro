import React from "react";

export default function VentaTable({
  ventasFiltradas,
  formatoMoneda,
  styles,
  abrirModal,
}) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Venta</th>

          <th style={styles.th}>Cliente</th>

          <th style={styles.th}>Productos</th>

          <th style={styles.th}>Pago</th>

          <th style={styles.th}>Total</th>

          <th style={styles.th}>Fecha</th>
        </tr>
      </thead>

      <tbody>
        {ventasFiltradas.map((venta) => (
          <tr
            key={venta.id}
            style={{
              ...styles.tr,
              cursor: "pointer",
            }}
            onClick={() => abrirModal(venta)}
          >
            <td style={styles.td}>
              <div style={styles.saleId}>#{venta.id}</div>
            </td>

            <td style={styles.td}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  {venta.Cliente?.nombre?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <strong>
                    {venta.Cliente?.nombre || "Cliente eliminado"}
                  </strong>

                  <p style={styles.email}>
                    {venta.Cliente?.email || "Sin correo"}
                  </p>
                </div>
              </div>
            </td>

            <td style={styles.td}>
              <div style={styles.productsBox}>
                {venta.Detalles?.map((detalle, index) => (
                  <div key={index} style={styles.productItem}>
                    <strong>
                      {detalle.Producto?.nombre || "Producto eliminado"}
                    </strong>
                    <br />
                    Cantidad: {detalle.cantidad}
                  </div>
                ))}
              </div>
            </td>

            <td style={styles.td}>
              <span style={styles.badge}>
                {venta.Pago?.metodoPago || "Sin pago"}
              </span>

              <p>{venta.Pago?.estado || "Sin estado"}</p>
            </td>

            <td style={styles.total}>{formatoMoneda(venta.total)}</td>

            <td style={styles.td}>
              {new Date(venta.createdAt).toLocaleString("es-CO")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
