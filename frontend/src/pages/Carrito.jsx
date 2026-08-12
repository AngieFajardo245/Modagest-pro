import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Carrito() {
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  const formatoMoneda = (valor) =>
    Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const guardarCarrito = (nuevoCarrito) => {
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

    setCarrito(nuevoCarrito);

    window.dispatchEvent(new Event("carritoActualizado"));
  };

  const cargarCarrito = async () => {
    try {
      setCargando(true);
      setError("");

      const carritoGuardado = JSON.parse(
        localStorage.getItem("carrito") || "[]",
      );

      if (!Array.isArray(carritoGuardado) || carritoGuardado.length === 0) {
        setCarrito([]);
        return;
      }

      const response = await api.get("/productos");

      const productos = Array.isArray(response.data) ? response.data : [];

      const carritoActualizado = carritoGuardado
        .map((producto) => {
          const productoActual = productos.find(
            (item) => item.id === producto.id,
          );

          if (!productoActual) {
            return null;
          }

          const stock = Number(productoActual.stock || 0);

          const precio = Number(productoActual.precio || 0);

          if (stock <= 0) {
            return {
              ...producto,
              nombre: productoActual.nombre,
              descripcion: productoActual.descripcion || "",
              imagen: productoActual.imagen || "",
              precio,
              stock: 0,
              cantidad: 0,
            };
          }

          const cantidadGuardada = Number(producto.cantidad);

          const cantidad = Math.min(
            Math.max(
              Number.isInteger(cantidadGuardada) && cantidadGuardada > 0
                ? cantidadGuardada
                : 1,
              1,
            ),
            stock,
          );

          return {
            ...producto,
            nombre: productoActual.nombre,
            descripcion: productoActual.descripcion || "",
            imagen: productoActual.imagen || "",
            precio,
            stock,
            cantidad,
          };
        })
        .filter(Boolean);

      localStorage.setItem("carrito", JSON.stringify(carritoActualizado));

      setCarrito(carritoActualizado);
    } catch (error) {
      console.error("Error cargando carrito:", error);

      setCarrito([]);
      setError("No fue posible cargar el carrito. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCarrito();

    const actualizarCarrito = () => {
      const carritoGuardado = JSON.parse(
        localStorage.getItem("carrito") || "[]",
      );

      setCarrito(Array.isArray(carritoGuardado) ? carritoGuardado : []);
    };

    window.addEventListener("carritoActualizado", actualizarCarrito);

    window.addEventListener("storage", actualizarCarrito);

    return () => {
      window.removeEventListener("carritoActualizado", actualizarCarrito);

      window.removeEventListener("storage", actualizarCarrito);
    };
  }, []);

  const eliminar = (id) => {
    const nuevoCarrito = carrito.filter((producto) => producto.id !== id);

    guardarCarrito(nuevoCarrito);
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    const cantidad = Number(nuevaCantidad);

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return;
    }

    const producto = carrito.find((item) => item.id === id);

    if (!producto) {
      return;
    }

    const stock = Number(producto.stock || 0);

    if (stock <= 0) {
      return;
    }

    if (cantidad > stock) {
      alert(`Solo hay ${stock} unidades disponibles.`);
      return;
    }

    const nuevoCarrito = carrito.map((item) =>
      item.id === id
        ? {
            ...item,
            cantidad,
          }
        : item,
    );

    guardarCarrito(nuevoCarrito);
  };

  const total = carrito.reduce((acumulado, producto) => {
    const precio = Number(producto.precio || 0);

    const cantidad = Number(producto.cantidad || 0);

    return acumulado + precio * cantidad;
  }, 0);

  const productosAgotados = carrito.filter(
    (producto) => Number(producto.stock || 0) <= 0,
  );

  const hayProblemasStock = carrito.some((producto) => {
    const stock = Number(producto.stock || 0);

    const cantidad = Number(producto.cantidad || 0);

    return stock <= 0 || cantidad > stock;
  });

  const abrirPago = () => {
    if (!token) {
      alert("Debes iniciar sesión para realizar una compra.");

      localStorage.setItem("redirectAfterLogin", "/cliente/carrito");

      navigate("/login");
      return;
    }

    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    if (hayProblemasStock) {
      alert(
        "Hay productos sin stock suficiente. Revisa tu carrito antes de continuar.",
      );
      return;
    }

    setMetodoPago("");
    setMostrarPago(true);
  };

  const cerrarPago = () => {
    if (procesando) {
      return;
    }

    setMostrarPago(false);
    setMetodoPago("");
  };

  const confirmarPago = async () => {
    if (!metodoPago) {
      alert("Selecciona un método de pago.");
      return;
    }

    if (procesando) {
      return;
    }

    if (!token) {
      cerrarPago();

      localStorage.setItem("redirectAfterLogin", "/cliente/carrito");

      navigate("/login");
      return;
    }

    try {
      setProcesando(true);

      await api.post(
        "/cliente/comprar",
        {
          productos: carrito.map((producto) => ({
            productoId: producto.id,
            cantidad: Number(producto.cantidad),
          })),
          metodoPago,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.removeItem("carrito");
      setCarrito([]);
      setMostrarPago(false);
      setMetodoPago("");

      window.dispatchEvent(new Event("carritoActualizado"));

      alert(`Compra realizada correctamente con ${metodoPago} ✅`);

      navigate("/cliente/compras");
    } catch (error) {
      console.error("Error procesando compra:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("usuario");

        setMostrarPago(false);

        localStorage.setItem("redirectAfterLogin", "/cliente/carrito");

        alert("Tu sesión ha expirado. Inicia sesión nuevamente.");

        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "No fue posible procesar la compra. Intenta nuevamente.",
      );
    } finally {
      setProcesando(false);
    }
  };

  const irATienda = () => {
    if (!token) {
      navigate("/");
      return;
    }

    switch (rol?.toLowerCase().trim()) {
      case "cliente":
        navigate("/cliente/productos");
        break;

      case "administrador":
        navigate("/admin/productos");
        break;

      case "empleado":
        navigate("/empleado/productos");
        break;

      default:
        navigate("/");
        break;
    }
  };

  const obtenerImagen = (imagen) => {
    const imagenDefault =
      "https://placehold.co/180x180/111827/e5e7eb?text=ModaGest";

    if (!imagen) {
      return imagenDefault;
    }

    if (typeof imagen === "string" && imagen.startsWith("http")) {
      return imagen;
    }

    return `http://localhost:5000/uploads/${imagen}`;
  };

  if (cargando) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loader}></div>

          <h2 style={styles.loadingTitle}>Cargando tu carrito</h2>

          <p style={styles.loadingText}>Estamos verificando tus productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>!</div>

          <h2 style={styles.errorTitle}>No pudimos cargar tu carrito</h2>

          <p style={styles.errorText}>{error}</p>

          <button type="button" style={styles.shopBtn} onClick={cargarCarrito}>
            Intentar nuevamente
          </button>

          <button
            type="button"
            style={styles.secondaryErrorBtn}
            onClick={irATienda}
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow}></div>

      <main style={styles.container}>
        <div style={styles.header}>
          <div>
            <span style={styles.badge}>🛒 Tu selección</span>

            <h1 style={styles.title}>Carrito de compras</h1>

            <p style={styles.subtitle}>
              Revisa tus productos antes de completar tu compra.
            </p>
          </div>

          {carrito.length > 0 && (
            <div style={styles.itemsBadge}>
              {carrito.length} {carrito.length === 1 ? "producto" : "productos"}
            </div>
          )}
        </div>

        {carrito.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>🛒</div>

            <h2 style={styles.emptyTitle}>Tu carrito está vacío</h2>

            <p style={styles.emptyText}>
              Explora nuestro catálogo y encuentra productos que te gusten.
            </p>

            <button type="button" style={styles.shopBtn} onClick={irATienda}>
              🛍️ Explorar productos
            </button>
          </div>
        ) : (
          <div style={styles.layout}>
            <section style={styles.productsSection}>
              {productosAgotados.length > 0 && (
                <div style={styles.warning}>
                  <span style={styles.warningIcon}>⚠️</span>

                  <div>
                    <strong>Revisa tu carrito</strong>

                    <p>Algunos productos ya no tienen disponibilidad.</p>
                  </div>
                </div>
              )}

              {carrito.map((producto) => {
                const stock = Number(producto.stock || 0);

                const cantidad = Number(producto.cantidad || 0);

                const precio = Number(producto.precio || 0);

                const subtotal = precio * cantidad;

                const agotado = stock <= 0;

                return (
                  <article key={producto.id} style={styles.productCard}>
                    <div style={styles.imageWrapper}>
                      <img
                        src={obtenerImagen(producto.imagen)}
                        alt={producto.nombre || "Producto"}
                        style={styles.productImage}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/180x180/111827/e5e7eb?text=ModaGest";
                        }}
                      />

                      <span
                        style={{
                          ...styles.stockBadge,
                          background: agotado
                            ? "rgba(239,68,68,0.15)"
                            : "rgba(34,197,94,0.15)",
                          color: agotado ? "#f87171" : "#4ade80",
                        }}
                      >
                        {agotado ? "Agotado" : "Disponible"}
                      </span>
                    </div>

                    <div style={styles.productInfo}>
                      <div style={styles.productTop}>
                        <div>
                          <h2 style={styles.productName}>{producto.nombre}</h2>

                          <p style={styles.description}>
                            {producto.descripcion || "Producto de ModaGest Pro"}
                          </p>
                        </div>

                        <button
                          type="button"
                          style={styles.deleteBtn}
                          onClick={() => eliminar(producto.id)}
                          aria-label={`Eliminar ${producto.nombre}`}
                          disabled={procesando}
                        >
                          🗑️
                        </button>
                      </div>

                      <div style={styles.productBottom}>
                        <div>
                          <span style={styles.priceLabel}>Precio unitario</span>

                          <p style={styles.price}>{formatoMoneda(precio)}</p>
                        </div>

                        <div style={styles.quantityBlock}>
                          <span style={styles.priceLabel}>Cantidad</span>

                          <div style={styles.controls}>
                            <button
                              type="button"
                              style={{
                                ...styles.btnQty,
                                opacity:
                                  cantidad <= 1 || agotado || procesando
                                    ? 0.45
                                    : 1,
                              }}
                              onClick={() =>
                                cambiarCantidad(producto.id, cantidad - 1)
                              }
                              disabled={cantidad <= 1 || agotado || procesando}
                            >
                              −
                            </button>

                            <span style={styles.qty}>{cantidad}</span>

                            <button
                              type="button"
                              style={{
                                ...styles.btnQty,
                                opacity:
                                  agotado || cantidad >= stock || procesando
                                    ? 0.45
                                    : 1,
                              }}
                              onClick={() =>
                                cambiarCantidad(producto.id, cantidad + 1)
                              }
                              disabled={
                                agotado || cantidad >= stock || procesando
                              }
                            >
                              +
                            </button>
                          </div>

                          <span style={styles.stockText}>
                            {agotado ? "Sin unidades" : `${stock} disponibles`}
                          </span>
                        </div>

                        <div style={styles.subtotalBlock}>
                          <span style={styles.priceLabel}>Subtotal</span>

                          <p style={styles.subtotal}>
                            {formatoMoneda(subtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <span style={styles.summaryBadge}>Resumen</span>

                <span style={styles.secureText}>🔒 Compra segura</span>
              </div>

              <h2 style={styles.summaryTitle}>Resumen de compra</h2>

              <div style={styles.summaryRows}>
                <div style={styles.summaryRow}>
                  <span>Productos</span>
                  <strong>{carrito.length}</strong>
                </div>

                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <strong>{formatoMoneda(total)}</strong>
                </div>

                <div style={styles.summaryRow}>
                  <span>Envío</span>
                  <strong style={styles.freeText}>Gratis</strong>
                </div>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.totalRow}>
                <span>Total</span>

                <strong>{formatoMoneda(total)}</strong>
              </div>

              <button
                type="button"
                style={{
                  ...styles.buyBtn,
                  opacity: procesando || hayProblemasStock ? 0.55 : 1,
                  cursor:
                    procesando || hayProblemasStock ? "not-allowed" : "pointer",
                }}
                onClick={abrirPago}
                disabled={procesando || hayProblemasStock}
              >
                💳 Finalizar compra
              </button>

              <button
                type="button"
                style={styles.continueBtn}
                onClick={irATienda}
                disabled={procesando}
              >
                ← Seguir comprando
              </button>

              <p style={styles.securityText}>
                🔐 Tus datos están protegidos durante el proceso de compra.
              </p>
            </aside>
          </div>
        )}
      </main>

      {mostrarPago && (
        <div style={styles.overlay}>
          <div
            style={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-pago"
          >
            <div style={styles.modalHeader}>
              <div>
                <span style={styles.modalBadge}>Pago seguro</span>

                <h2 id="titulo-pago" style={styles.modalTitle}>
                  Elige tu método de pago
                </h2>
              </div>

              <button
                type="button"
                style={styles.closeBtn}
                onClick={cerrarPago}
                disabled={procesando}
                aria-label="Cerrar ventana de pago"
              >
                ✕
              </button>
            </div>

            <div style={styles.modalTotalBox}>
              <span>Total a pagar</span>

              <strong>{formatoMoneda(total)}</strong>
            </div>

            <div style={styles.paymentMethods}>
              {[
                {
                  value: "Tarjeta",
                  icon: "💳",
                  title: "Tarjeta",
                  text: "Débito o crédito",
                },
                {
                  value: "PSE",
                  icon: "🏦",
                  title: "PSE",
                  text: "Pago desde tu banco",
                },
                {
                  value: "Nequi",
                  icon: "📱",
                  title: "Nequi",
                  text: "Pago con tu celular",
                },
                {
                  value: "Contra Entrega",
                  icon: "📦",
                  title: "Contra Entrega",
                  text: "Paga al recibir",
                },
              ].map((metodo) => (
                <label
                  key={metodo.value}
                  style={{
                    ...styles.paymentOption,
                    ...(metodoPago === metodo.value
                      ? styles.paymentOptionActive
                      : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value={metodo.value}
                    checked={metodoPago === metodo.value}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    style={styles.radio}
                    disabled={procesando}
                  />

                  <span style={styles.paymentIcon}>{metodo.icon}</span>

                  <span style={styles.paymentInfo}>
                    <strong>{metodo.title}</strong>

                    <small>{metodo.text}</small>
                  </span>

                  <span style={styles.paymentCheck}>
                    {metodoPago === metodo.value ? "✓" : ""}
                  </span>
                </label>
              ))}
            </div>

            <div style={styles.simulationNote}>
              <span>ℹ️</span>

              <p>
                Esta es una simulación de pago. No se realizará ningún cobro
                real.
              </p>
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={cerrarPago}
                disabled={procesando}
              >
                Cancelar
              </button>

              <button
                type="button"
                style={{
                  ...styles.confirmBtn,
                  opacity: procesando ? 0.65 : 1,
                  cursor: procesando ? "not-allowed" : "pointer",
                }}
                onClick={confirmarPago}
                disabled={procesando}
              >
                {procesando ? "Procesando..." : "Confirmar pago"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #050816 0%, #0f172a 48%, #17102f 100%)",
    color: "#fff",
    padding: "40px 24px 70px",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  },

  backgroundGlow: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(124,58,237,0.12)",
    filter: "blur(100px)",
    top: "-160px",
    right: "-120px",
    pointerEvents: "none",
  },

  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },

  badge: {
    display: "inline-block",
    color: "#c084fc",
    background: "rgba(124,58,237,0.12)",
    border: "1px solid rgba(168,85,247,0.22)",
    borderRadius: "999px",
    padding: "7px 13px",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "12px",
  },

  title: {
    fontSize: "42px",
    lineHeight: "1.1",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "-1px",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "16px",
    marginTop: "12px",
    marginBottom: 0,
  },

  itemsBadge: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "10px 16px",
    borderRadius: "999px",
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 350px",
    gap: "28px",
    alignItems: "start",
  },

  productsSection: {
    minWidth: 0,
  },

  warning: {
    display: "flex",
    gap: "13px",
    alignItems: "center",
    background: "rgba(245,158,11,0.09)",
    border: "1px solid rgba(245,158,11,0.2)",
    color: "#fcd34d",
    padding: "15px 18px",
    borderRadius: "17px",
    marginBottom: "18px",
  },

  warningIcon: {
    fontSize: "20px",
  },

  productCard: {
    display: "flex",
    gap: "22px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "20px",
    marginBottom: "18px",
    backdropFilter: "blur(16px)",
    boxShadow: "0 14px 35px rgba(0,0,0,0.18)",
    boxSizing: "border-box",
  },

  imageWrapper: {
    width: "170px",
    height: "170px",
    flexShrink: 0,
    borderRadius: "19px",
    overflow: "hidden",
    position: "relative",
    background: "rgba(255,255,255,0.05)",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "8px",
    boxSizing: "border-box",
  },

  stockBadge: {
    position: "absolute",
    left: "10px",
    bottom: "10px",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    backdropFilter: "blur(8px)",
  },

  productInfo: {
    flex: 1,
    minWidth: 0,
  },

  productTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
  },

  productName: {
    fontSize: "21px",
    fontWeight: "750",
    margin: "2px 0 7px",
  },

  description: {
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: 0,
    maxWidth: "620px",
  },

  deleteBtn: {
    width: "38px",
    height: "38px",
    flexShrink: 0,
    border: "1px solid rgba(239,68,68,0.18)",
    borderRadius: "12px",
    background: "rgba(239,68,68,0.08)",
    color: "#f87171",
    cursor: "pointer",
    fontSize: "15px",
  },

  productBottom: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "end",
    gap: "20px",
    marginTop: "25px",
  },

  priceLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    marginBottom: "6px",
    fontWeight: "700",
  },

  price: {
    color: "#c084fc",
    fontSize: "19px",
    fontWeight: "800",
    margin: 0,
  },

  quantityBlock: {
    textAlign: "center",
  },

  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  btnQty: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    border: "1px solid rgba(168,85,247,0.2)",
    background: "rgba(124,58,237,0.18)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "19px",
    fontWeight: "800",
  },

  qty: {
    minWidth: "28px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "800",
  },

  stockText: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    marginTop: "6px",
  },

  subtotalBlock: {
    textAlign: "right",
  },

  subtotal: {
    color: "#4ade80",
    fontSize: "19px",
    fontWeight: "800",
    margin: 0,
  },

  summaryCard: {
    background:
      "linear-gradient(145deg, rgba(124,58,237,0.14), rgba(255,255,255,0.045))",
    border: "1px solid rgba(168,85,247,0.2)",
    borderRadius: "26px",
    padding: "25px",
    backdropFilter: "blur(18px)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
    position: "sticky",
    top: "25px",
  },

  summaryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },

  summaryBadge: {
    color: "#c084fc",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  secureText: {
    color: "#64748b",
    fontSize: "11px",
  },

  summaryTitle: {
    fontSize: "22px",
    margin: "0 0 22px",
    fontWeight: "800",
  },

  summaryRows: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: "14px",
  },

  freeText: {
    color: "#4ade80",
  },

  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    margin: "22px 0",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
    fontSize: "17px",
    color: "#e2e8f0",
  },

  buyBtn: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    fontWeight: "800",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(124,58,237,0.25)",
  },

  continueBtn: {
    width: "100%",
    marginTop: "12px",
    padding: "13px",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.035)",
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },

  securityText: {
    color: "#64748b",
    fontSize: "11px",
    lineHeight: "1.5",
    textAlign: "center",
    margin: "17px 0 0",
  },

  emptyCard: {
    maxWidth: "650px",
    margin: "50px auto",
    textAlign: "center",
    padding: "70px 30px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    backdropFilter: "blur(16px)",
    boxSizing: "border-box",
  },

  emptyIcon: {
    width: "82px",
    height: "82px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "rgba(124,58,237,0.14)",
    fontSize: "37px",
  },

  emptyTitle: {
    fontSize: "28px",
    margin: "0 0 10px",
  },

  emptyText: {
    color: "#94a3b8",
    lineHeight: "1.6",
    maxWidth: "450px",
    margin: "0 auto 28px",
  },

  shopBtn: {
    border: "none",
    padding: "14px 22px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    fontSize: "14px",
  },

  secondaryErrorBtn: {
    display: "block",
    width: "100%",
    marginTop: "12px",
    padding: "13px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    fontWeight: "700",
    cursor: "pointer",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050816",
    color: "#fff",
    padding: "20px",
    boxSizing: "border-box",
  },

  loadingCard: {
    textAlign: "center",
    padding: "35px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
  },

  loader: {
    width: "46px",
    height: "46px",
    border: "4px solid rgba(255,255,255,0.12)",
    borderTop: "4px solid #a855f7",
    borderRadius: "50%",
    margin: "0 auto 20px",
  },

  loadingTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
  },

  loadingText: {
    color: "#94a3b8",
    margin: 0,
  },

  errorCard: {
    textAlign: "center",
    maxWidth: "450px",
    padding: "40px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(239,68,68,0.18)",
    borderRadius: "24px",
    boxSizing: "border-box",
  },

  errorIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    background: "rgba(239,68,68,0.12)",
    color: "#f87171",
    fontSize: "24px",
    fontWeight: "800",
  },

  errorTitle: {
    fontSize: "21px",
    marginBottom: "10px",
  },

  errorText: {
    color: "#94a3b8",
    lineHeight: "1.5",
    marginBottom: "25px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.78)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 999,
    boxSizing: "border-box",
  },

  modal: {
    width: "100%",
    maxWidth: "520px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#0b1120",
    border: "1px solid rgba(168,85,247,0.22)",
    borderRadius: "26px",
    padding: "27px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.55)",
    boxSizing: "border-box",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "22px",
  },

  modalBadge: {
    color: "#a855f7",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  modalTitle: {
    fontSize: "25px",
    fontWeight: "800",
    margin: "7px 0 0",
  },

  closeBtn: {
    width: "38px",
    height: "38px",
    flexShrink: 0,
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.04)",
    color: "#94a3b8",
    cursor: "pointer",
  },

  modalTotalBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    background: "rgba(124,58,237,0.1)",
    border: "1px solid rgba(168,85,247,0.16)",
    padding: "17px",
    borderRadius: "16px",
    marginBottom: "20px",
    color: "#94a3b8",
  },

  paymentMethods: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  paymentOption: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "14px",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.025)",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  paymentOptionActive: {
    border: "1px solid rgba(168,85,247,0.55)",
    background: "rgba(124,58,237,0.12)",
  },

  radio: {
    accentColor: "#8b5cf6",
  },

  paymentIcon: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "11px",
    background: "rgba(255,255,255,0.06)",
    fontSize: "19px",
  },

  paymentInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    flex: 1,
  },

  paymentCheck: {
    color: "#c084fc",
    fontWeight: "800",
  },

  simulationNote: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    background: "rgba(59,130,246,0.08)",
    border: "1px solid rgba(59,130,246,0.14)",
    borderRadius: "14px",
    padding: "13px",
    marginTop: "18px",
    color: "#93c5fd",
  },

  modalActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: "12px",
    marginTop: "22px",
  },

  cancelBtn: {
    padding: "14px",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    cursor: "pointer",
    fontWeight: "700",
  },

  confirmBtn: {
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "800",
  },
};
