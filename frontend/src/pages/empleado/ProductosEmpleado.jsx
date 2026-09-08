import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
  FaCashRegister,
  FaBoxes,
  FaPlus,
  FaMinus,
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";

function ProductosEmpleado() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [vendiendo, setVendiendo] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const obtenerProductos = async (mostrarActualizando = false) => {
    try {
      if (mostrarActualizando) {
        setActualizando(true);
      } else {
        setLoading(true);
      }

      const res = await api.get("/productos");
      const data = Array.isArray(res.data) ? res.data : [];

      setProductos(data);

      setCantidades((prev) => {
        const nuevasCantidades = {};

        data.forEach((producto) => {
          const stock = Number(producto?.stock) || 0;
          const cantidadAnterior = Number(prev[producto.id]) || 1;

          nuevasCantidades[producto.id] =
            stock > 0 ? Math.min(Math.max(cantidadAnterior, 1), stock) : 1;
        });

        return nuevasCantidades;
      });
    } catch (error) {
      console.error("Error al obtener productos:", error);

      alert(
        error?.response?.data?.message ||
          error?.response?.data?.mensaje ||
          "No se pudieron cargar los productos.",
      );
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const aumentar = (id, stock) => {
    setCantidades((prev) => {
      const actual = Number(prev[id]) || 1;

      if (actual >= stock) {
        return prev;
      }

      return {
        ...prev,
        [id]: actual + 1,
      };
    });
  };

  const disminuir = (id) => {
    setCantidades((prev) => {
      const actual = Number(prev[id]) || 1;

      if (actual <= 1) {
        return prev;
      }

      return {
        ...prev,
        [id]: actual - 1,
      };
    });
  };

  const formatear = (valor) => {
    return new Intl.NumberFormat("es-CO").format(Number(valor) || 0);
  };

  const venderProducto = async (producto) => {
    const cantidad = Number(cantidades[producto.id]) || 1;
    const stock = Number(producto?.stock) || 0;
    const precio = Number(producto?.precio) || 0;

    if (stock <= 0) {
      alert("Este producto no tiene stock disponible.");
      return;
    }

    if (cantidad < 1 || cantidad > stock) {
      alert("La cantidad seleccionada no es válida.");
      return;
    }

    const total = precio * cantidad;

    const confirmar = window.confirm(
      `¿Deseas registrar esta venta?\n\n` +
        `Producto: ${producto.nombre}\n` +
        `Cantidad: ${cantidad}\n` +
        `Total: $${formatear(total)}`,
    );

    if (!confirmar) {
      return;
    }

    try {
      setVendiendo(producto.id);

      await api.post("/empleado/vender", {
        productoId: producto.id,
        cantidad,
      });

      alert("Venta registrada correctamente.");

      await obtenerProductos();
    } catch (error) {
      console.error("Error registrando venta:", error);

      alert(
        error?.response?.data?.message ||
          error?.response?.data?.mensaje ||
          "No se pudo registrar la venta.",
      );
    } finally {
      setVendiendo(null);
    }
  };

  const obtenerEstadoStock = (stock) => {
    if (stock <= 0) {
      return {
        texto: "Sin stock",
        tipo: "empty",
      };
    }

    if (stock <= 5) {
      return {
        texto: "Stock bajo",
        tipo: "low",
      };
    }

    return {
      texto: "Disponible",
      tipo: "available",
    };
  };

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const nombre = String(producto?.nombre || "").toLowerCase();
      const descripcion = String(producto?.descripcion || "").toLowerCase();

      const coincideBusqueda =
        nombre.includes(texto) || descripcion.includes(texto);

      const coincideStock = soloDisponibles
        ? Number(producto?.stock || 0) > 0
        : true;

      return coincideBusqueda && coincideStock;
    });
  }, [productos, busqueda, soloDisponibles]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>
            <FaCashRegister />
            ÁREA COMERCIAL
          </div>

          <h1 style={styles.title}>Registrar venta</h1>

          <p style={styles.subtitle}>
            Selecciona un producto, indica la cantidad y registra la venta del
            cliente.
          </p>
        </div>

        <div style={styles.headerBadge}>
          <FaBoxOpen style={styles.headerBadgeIcon} />

          <div>
            <strong style={styles.headerBadgeStrong}>Productos</strong>

            <span style={styles.headerBadgeSpan}>
              {productos.length} registrados
            </span>
          </div>
        </div>
      </div>

      <div style={styles.filters}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />

          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(e) => setSoloDisponibles(e.target.checked)}
          />

          <span>Solo disponibles</span>
        </label>

        <button
          type="button"
          style={{
            ...styles.refreshButton,
            opacity: actualizando ? 0.7 : 1,
          }}
          onClick={() => obtenerProductos(true)}
          disabled={actualizando}
        >
          <FaSyncAlt style={actualizando ? styles.spinningIcon : undefined} />
          {actualizando ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      <div style={styles.resultsInfo}>
        Mostrando{" "}
        <strong style={styles.resultsStrong}>
          {productosFiltrados.length}
        </strong>{" "}
        {productosFiltrados.length === 1 ? "producto" : "productos"}
      </div>

      {productosFiltrados.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            <FaBoxes />
          </div>

          <h3 style={styles.emptyTitle}>No hay productos</h3>

          <p style={styles.emptyText}>
            {productos.length === 0
              ? "No hay productos registrados actualmente."
              : "No encontramos productos que coincidan con la búsqueda actual."}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {productosFiltrados.map((producto) => {
            const cantidad = Number(cantidades[producto.id]) || 1;
            const precio = Number(producto?.precio) || 0;
            const stock = Number(producto?.stock) || 0;
            const total = precio * cantidad;

            const estadoStock = obtenerEstadoStock(stock);
            const estaVendiendo = vendiendo === producto.id;

            const imagen = producto?.imagen
              ? producto.imagen.startsWith("http")
                ? producto.imagen
                : `http://localhost:5000/uploads/${producto.imagen}`
              : null;

            return (
              <div key={producto.id} style={styles.card}>
                <div style={styles.imageBox}>
                  {imagen ? (
                    <img
                      src={imagen}
                      alt={producto.nombre}
                      style={styles.image}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";

                        const fallback =
                          e.currentTarget.parentElement?.querySelector(
                            ".image-fallback",
                          );

                        if (fallback) {
                          fallback.style.display = "block";
                        }
                      }}
                    />
                  ) : null}

                  <FaBoxOpen
                    className="image-fallback"
                    style={{
                      ...styles.imageFallback,
                      display: imagen ? "none" : "block",
                    }}
                  />

                  <div
                    style={{
                      ...styles.stockBadge,
                      ...(estadoStock.tipo === "available"
                        ? styles.stockAvailable
                        : estadoStock.tipo === "low"
                          ? styles.stockLow
                          : styles.stockEmpty),
                    }}
                  >
                    {estadoStock.tipo === "available" ? (
                      <FaCheckCircle />
                    ) : (
                      <FaExclamationTriangle />
                    )}

                    {estadoStock.texto}
                  </div>
                </div>

                <div style={styles.body}>
                  <h3 style={styles.productName}>{producto.nombre}</h3>

                  <p style={styles.description}>
                    {producto.descripcion || "Producto disponible para venta."}
                  </p>

                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Precio unitario</span>

                      <strong style={styles.price}>${formatear(precio)}</strong>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Existencias</span>

                      <strong style={styles.stockNumber}>{stock}</strong>
                    </div>
                  </div>

                  <div style={styles.quantitySection}>
                    <div>
                      <span style={styles.quantityLabel}>Cantidad</span>

                      <small style={styles.quantityHelp}>Máximo: {stock}</small>
                    </div>

                    <div style={styles.counter}>
                      <button
                        type="button"
                        disabled={cantidad <= 1 || stock <= 0}
                        style={{
                          ...styles.counterBtn,
                          ...(cantidad <= 1 || stock <= 0
                            ? styles.counterBtnDisabled
                            : {}),
                        }}
                        onClick={() => disminuir(producto.id)}
                      >
                        <FaMinus />
                      </button>

                      <span style={styles.counterValue}>{cantidad}</span>

                      <button
                        type="button"
                        disabled={stock <= 0 || cantidad >= stock}
                        style={{
                          ...styles.counterBtn,
                          ...(stock <= 0 || cantidad >= stock
                            ? styles.counterBtnDisabled
                            : {}),
                        }}
                        onClick={() => aumentar(producto.id, stock)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div style={styles.totalBox}>
                    <div>
                      <span style={styles.totalLabel}>Total de la venta</span>

                      <small style={styles.totalHelp}>
                        {cantidad} {cantidad === 1 ? "unidad" : "unidades"}
                      </small>
                    </div>

                    <strong style={styles.total}>${formatear(total)}</strong>
                  </div>

                  <button
                    type="button"
                    disabled={stock <= 0 || estaVendiendo}
                    style={
                      stock <= 0 || estaVendiendo
                        ? styles.disabledBtn
                        : styles.sellBtn
                    }
                    onClick={() => venderProducto(producto)}
                  >
                    <FaCashRegister />

                    <span>
                      {estaVendiendo
                        ? "Registrando..."
                        : stock <= 0
                          ? "Producto agotado"
                          : "Registrar venta"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductosEmpleado;

const styles = {
  container: {
    minHeight: "100vh",
    padding: "20px",
    color: "#ffffff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "25px",
    marginBottom: "30px",
  },

  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#a78bfa",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "10px",
  },

  title: {
    margin: 0,
    fontSize: "clamp(30px, 4vw, 42px)",
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: "-1px",
  },

  subtitle: {
    margin: "10px 0 0",
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: "1.6",
    maxWidth: "650px",
  },

  headerBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 20px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  headerBadgeIcon: {
    color: "#a78bfa",
    fontSize: "24px",
  },

  headerBadgeStrong: {
    display: "block",
    color: "#ffffff",
    fontSize: "14px",
  },

  headerBadgeSpan: {
    display: "block",
    marginTop: "3px",
    color: "#64748b",
    fontSize: "12px",
  },

  filters: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "15px",
    padding: "18px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.07)",
  },

  searchBox: {
    position: "relative",
    flex: 1,
    minWidth: "240px",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
    fontSize: "13px",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px 12px 42px",
    borderRadius: "13px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.045)",
    color: "#ffffff",
    outline: "none",
    fontSize: "13px",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#cbd5e1",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: "13px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(124,58,237,0.12)",
    color: "#c4b5fd",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
  },

  spinningIcon: {
    animation: "spin 1s linear infinite",
  },

  resultsInfo: {
    marginBottom: "20px",
    color: "#64748b",
    fontSize: "13px",
  },

  resultsStrong: {
    color: "#c4b5fd",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "26px",
    overflow: "hidden",
    backdropFilter: "blur(16px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.22)",
  },

  imageBox: {
    position: "relative",
    height: "245px",
    background: "rgba(255,255,255,0.025)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  imageFallback: {
    color: "#a78bfa",
    fontSize: "48px",
    opacity: 0.7,
  },

  stockBadge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
  },

  stockAvailable: {
    background: "rgba(16,185,129,0.14)",
    border: "1px solid rgba(16,185,129,0.25)",
    color: "#6ee7b7",
  },

  stockLow: {
    background: "rgba(245,158,11,0.14)",
    border: "1px solid rgba(245,158,11,0.25)",
    color: "#fbbf24",
  },

  stockEmpty: {
    background: "rgba(239,68,68,0.14)",
    border: "1px solid rgba(239,68,68,0.25)",
    color: "#f87171",
  },

  body: {
    padding: "23px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },

  productName: {
    margin: 0,
    color: "#ffffff",
    fontSize: "21px",
    fontWeight: "800",
  },

  description: {
    margin: "8px 0 18px",
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.5",
    minHeight: "40px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "20px",
  },

  infoItem: {
    padding: "13px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.055)",
  },

  infoLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    marginBottom: "5px",
  },

  price: {
    color: "#38bdf8",
    fontSize: "18px",
  },

  stockNumber: {
    color: "#cbd5e1",
    fontSize: "18px",
  },

  quantitySection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    padding: "15px 0",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },

  quantityLabel: {
    display: "block",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
  },

  quantityHelp: {
    display: "block",
    marginTop: "4px",
    color: "#64748b",
    fontSize: "10px",
  },

  counter: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  counterBtn: {
    width: "38px",
    height: "38px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  counterBtnDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },

  counterValue: {
    minWidth: "28px",
    textAlign: "center",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "800",
  },

  totalBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginTop: "18px",
    marginBottom: "18px",
    padding: "17px",
    borderRadius: "17px",
    background: "rgba(16,185,129,0.07)",
    border: "1px solid rgba(16,185,129,0.12)",
  },

  totalLabel: {
    display: "block",
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: "700",
  },

  totalHelp: {
    display: "block",
    marginTop: "3px",
    color: "#64748b",
    fontSize: "10px",
  },

  total: {
    color: "#34d399",
    fontSize: "25px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  sellBtn: {
    width: "100%",
    minHeight: "48px",
    border: "none",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },

  disabledBtn: {
    width: "100%",
    minHeight: "48px",
    border: "none",
    borderRadius: "15px",
    background: "#334155",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "not-allowed",
  },

  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 30px",
    borderRadius: "26px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    textAlign: "center",
  },

  emptyIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(124,58,237,0.12)",
    color: "#a78bfa",
    fontSize: "32px",
  },

  emptyTitle: {
    margin: "20px 0 8px",
    color: "#ffffff",
    fontSize: "20px",
  },

  emptyText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    maxWidth: "450px",
    lineHeight: "1.6",
  },

  loadingContainer: {
    minHeight: "75vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px",
  },

  loader: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "4px solid rgba(255,255,255,0.1)",
    borderTop: "4px solid #8b5cf6",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "15px",
  },
};
