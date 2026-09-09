import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function ComprasCliente() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const obtenerCompras = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/cliente/compras");
      const data = Array.isArray(res.data) ? res.data : [];

      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setCompras(data);
    } catch (err) {
      console.error("Error obteniendo compras:", err);
      setCompras([]);
      setError("No fue posible cargar tu historial de compras.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCompras();
  }, []);

  const formatearMoneda = (valor) =>
    Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";

    const fechaFormateada = new Date(fecha);

    if (Number.isNaN(fechaFormateada.getTime())) {
      return "Fecha no disponible";
    }

    return fechaFormateada.toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const obtenerImagen = (imagen) => {
    const imagenFallback =
      "https://placehold.co/300x220/161a2f/ffffff?text=ModaGest+Pro";

    if (!imagen || typeof imagen !== "string") {
      return imagenFallback;
    }

    if (imagen.startsWith("http://") || imagen.startsWith("https://")) {
      return imagen;
    }

    const nombreImagen = imagen.replace(/^\/+/, "");

    return `http://localhost:5000/uploads/${nombreImagen}`;
  };

  const manejarErrorImagen = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src =
      "https://placehold.co/300x220/161a2f/ffffff?text=ModaGest+Pro";
  };

  const totalCompras = compras.length;

  const totalGastado = useMemo(
    () =>
      compras.reduce((total, compra) => total + Number(compra.total || 0), 0),
    [compras],
  );

  const ultimaCompra = compras[0];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Cargando tu historial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>

          <h2 style={styles.errorTitle}>No pudimos cargar tus compras</h2>

          <p style={styles.errorText}>{error}</p>

          <button
            type="button"
            style={styles.retryButton}
            onClick={obtenerCompras}
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div>
          <p style={styles.badgeTop}>✨ Historial de compras</p>

          <h1 style={styles.title}>Mis Compras</h1>

          <p style={styles.subtitle}>
            Consulta tus pedidos, productos adquiridos y métodos de pago en un
            solo lugar.
          </p>
        </div>

        <div style={styles.heroIcon}>🧾</div>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.iconCircle}>📦</div>

          <div>
            <p style={styles.summaryLabel}>Compras realizadas</p>

            <h3 style={styles.summaryValue}>{totalCompras}</h3>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.iconCircle}>💰</div>

          <div>
            <p style={styles.summaryLabel}>Total gastado</p>

            <h3 style={styles.summaryValue}>{formatearMoneda(totalGastado)}</h3>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.iconCircle}>🕒</div>

          <div>
            <p style={styles.summaryLabel}>Última compra</p>

            <h3 style={styles.summaryDate}>
              {ultimaCompra
                ? formatearFecha(ultimaCompra.createdAt)
                : "Sin compras"}
            </h3>
          </div>
        </div>
      </div>

      {compras.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🛍️</div>

          <h2 style={styles.emptyTitle}>Todavía no tienes compras</h2>

          <p style={styles.emptyText}>
            Cuando realices tu primera compra, aparecerá aquí toda la
            información de tu pedido.
          </p>
        </div>
      ) : (
        <div style={styles.orders}>
          {compras.map((compra, index) => (
            <div key={compra.id} style={styles.orderCard}>
              {index === 0 && (
                <div style={styles.latestBadge}>⭐ Compra más reciente</div>
              )}

              <div style={styles.orderHeader}>
                <div>
                  <p style={styles.orderLabel}>Pedido #{compra.id}</p>

                  <p style={styles.date}>{formatearFecha(compra.createdAt)}</p>
                </div>

                <div style={styles.orderStatus}>
                  <span style={styles.statusDot}></span>
                  Compra realizada
                </div>
              </div>

              <div style={styles.orderSummary}>
                <div>
                  <p style={styles.orderTotalLabel}>Total del pedido</p>

                  <h2 style={styles.orderTotal}>
                    {formatearMoneda(compra.total)}
                  </h2>
                </div>

                {compra.Pago && (
                  <div style={styles.paymentInfo}>
                    <span style={styles.paymentIcon}>💳</span>

                    <div>
                      <p style={styles.paymentLabel}>Método de pago</p>

                      <strong style={styles.paymentValue}>
                        {compra.Pago.metodoPago || "No especificado"}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {compra.direccionEntrega && (
                <div style={styles.deliveryInfo}>
                  <div style={styles.deliveryIcon}>📍</div>

                  <div>
                    <p style={styles.deliveryLabel}>Dirección de entrega</p>

                    <strong style={styles.deliveryAddress}>
                      {compra.direccionEntrega}
                    </strong>

                    <p style={styles.deliveryDetails}>
                      {compra.ciudadEntrega}
                      {compra.telefonoEntrega
                        ? ` · Teléfono: ${compra.telefonoEntrega}`
                        : ""}
                    </p>
                  </div>
                </div>
              )}

              <div style={styles.productsHeader}>
                <h3 style={styles.productsTitle}>Productos del pedido</h3>

                <span style={styles.productCount}>
                  {compra.Detalles?.length || 0}{" "}
                  {(compra.Detalles?.length || 0) === 1
                    ? "producto"
                    : "productos"}
                </span>
              </div>

              <div style={styles.detailsContainer}>
                {compra.Detalles?.length > 0 ? (
                  compra.Detalles.map((detalle) => {
                    const producto = detalle.Producto;
                    const imagen = obtenerImagen(producto?.imagen);

                    return (
                      <div key={detalle.id} style={styles.detailCard}>
                        <div style={styles.imageBox}>
                          <img
                            src={imagen}
                            alt={producto?.nombre || "Producto"}
                            style={styles.image}
                            onError={manejarErrorImagen}
                          />
                        </div>

                        <div style={styles.productInfo}>
                          <h3 style={styles.productName}>
                            {producto?.nombre || "Producto"}
                          </h3>

                          <div style={styles.productDetails}>
                            <div>
                              <span style={styles.detailLabel}>Cantidad</span>

                              <strong style={styles.detailValue}>
                                {detalle.cantidad}
                              </strong>
                            </div>

                            <div>
                              <span style={styles.detailLabel}>
                                Precio unitario
                              </span>

                              <strong style={styles.detailValue}>
                                {formatearMoneda(detalle.precio)}
                              </strong>
                            </div>

                            <div>
                              <span style={styles.detailLabel}>Subtotal</span>

                              <strong style={styles.subtotalValue}>
                                {formatearMoneda(detalle.subtotal)}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={styles.noDetails}>
                    <span>📦</span>

                    <p>No hay detalles disponibles para este pedido.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComprasCliente;

const styles = {
  container: {
    minHeight: "100vh",
    padding: "35px",
    background: "#050816",
    color: "#fff",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(76,29,149,0.18))",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: "26px",
    padding: "38px 40px",
    marginBottom: "30px",
    backdropFilter: "blur(14px)",
    boxShadow: "0 0 30px rgba(139,92,246,0.12)",
  },

  badgeTop: {
    color: "#c084fc",
    fontWeight: "600",
    margin: "0 0 10px",
    letterSpacing: "1px",
  },

  title: {
    fontSize: "42px",
    margin: "0 0 12px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: "1.6",
    maxWidth: "680px",
    margin: 0,
  },

  heroIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px",
    flexShrink: 0,
    background: "linear-gradient(135deg,#7c3aed,#9333ea)",
    boxShadow: "0 0 25px rgba(139,92,246,0.35)",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "35px",
  },

  summaryCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(139,92,246,0.15)",
    borderRadius: "22px",
    padding: "23px",
    display: "flex",
    alignItems: "center",
    gap: "17px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 20px rgba(139,92,246,0.07)",
  },

  iconCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    flexShrink: 0,
    background: "linear-gradient(135deg,#7c3aed,#9333ea)",
    boxShadow: "0 0 18px rgba(139,92,246,0.3)",
  },

  summaryLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  summaryValue: {
    margin: "7px 0 0",
    fontSize: "25px",
    color: "#fff",
  },

  summaryDate: {
    margin: "7px 0 0",
    fontSize: "14px",
    color: "#e2e8f0",
  },

  orders: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },

  orderCard: {
    position: "relative",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(139,92,246,0.16)",
    borderRadius: "24px",
    padding: "25px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 25px rgba(139,92,246,0.07)",
    overflow: "hidden",
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },

  orderLabel: {
    margin: 0,
    color: "#fff",
    fontSize: "18px",
    fontWeight: "700",
  },

  date: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
  },

  orderStatus: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 13px",
    borderRadius: "30px",
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.2)",
    color: "#86efac",
    fontSize: "13px",
    fontWeight: "600",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 8px rgba(34,197,94,0.7)",
  },

  orderSummary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    padding: "22px 0",
  },

  orderTotalLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  orderTotal: {
    margin: "6px 0 0",
    color: "#c084fc",
    fontSize: "30px",
    fontWeight: "800",
  },

  paymentInfo: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "12px 16px",
    borderRadius: "15px",
    background: "rgba(59,130,246,0.08)",
    border: "1px solid rgba(59,130,246,0.16)",
  },

  paymentIcon: {
    fontSize: "23px",
  },

  paymentLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px",
  },

  paymentValue: {
    display: "block",
    marginTop: "3px",
    color: "#dbeafe",
    fontSize: "14px",
  },

  deliveryInfo: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    marginBottom: "22px",
    padding: "16px",
    borderRadius: "16px",
    background: "rgba(124,58,237,0.179)",
    border: "1px solid rgba(167,139,250,0.2)",
  },

  deliveryIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    fontSize: "19px",
  },

  deliveryLabel: {
    margin: "0 0 5px",
    color: "#a78bfa",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },

  deliveryAddress: {
    display: "block",
    color: "#f8fafc",
    fontSize: "15px",
    lineHeight: 1.4,
  },

  deliveryDetails: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
  },

  productsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "17px",
  },

  productsTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#f8fafc",
  },

  productCount: {
    color: "#a78bfa",
    fontSize: "13px",
    fontWeight: "600",
  },

  detailsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },

  detailCard: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "18px",
    padding: "14px",
  },

  imageBox: {
    width: "105px",
    height: "105px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    overflow: "hidden",
    background: "linear-gradient(135deg,#1e1b4b,#1e293b)",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  productInfo: {
    flex: 1,
    minWidth: 0,
  },

  productName: {
    margin: "0 0 10px",
    fontSize: "17px",
    color: "#fff",
    fontWeight: "700",
  },

  productDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  detailLabel: {
    color: "#64748b",
    fontSize: "12px",
    marginRight: "6px",
  },

  detailValue: {
    color: "#cbd5e1",
    fontSize: "13px",
  },

  subtotalValue: {
    color: "#34d399",
    fontSize: "13px",
  },

  latestBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: "7px 14px",
    borderBottomRightRadius: "13px",
    background: "linear-gradient(135deg,#7c3aed,#9333ea)",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    padding: "70px 30px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(139,92,246,0.16)",
    borderRadius: "24px",
    backdropFilter: "blur(10px)",
  },

  emptyIcon: {
    fontSize: "65px",
    marginBottom: "18px",
  },

  emptyTitle: {
    margin: "0 0 10px",
    fontSize: "25px",
  },

  emptyText: {
    margin: 0,
    color: "#94a3b8",
    lineHeight: "1.6",
  },

  errorCard: {
    maxWidth: "550px",
    margin: "80px auto",
    padding: "45px 35px",
    textAlign: "center",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "24px",
  },

  errorIcon: {
    fontSize: "55px",
    marginBottom: "15px",
  },

  errorTitle: {
    margin: "0 0 10px",
    color: "#fca5a5",
  },

  errorText: {
    color: "#cbd5e1",
    marginBottom: "25px",
  },

  retryButton: {
    border: "none",
    borderRadius: "14px",
    padding: "13px 22px",
    background: "linear-gradient(135deg,#7c3aed,#9333ea)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  loadingContainer: {
    minHeight: "100vh",
    background: "#050816",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },

  loader: {
    width: "55px",
    height: "55px",
    border: "5px solid rgba(255,255,255,0.12)",
    borderTop: "5px solid #9333ea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    color: "#cbd5e1",
    fontSize: "17px",
  },

  noDetails: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    padding: "25px",
    color: "#94a3b8",
  },
};
