import { useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaBoxes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import api from "../../services/api";
import { obtenerUrlImagen } from "../../utils/media";

function ProductosEmpleado() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [error, setError] = useState("");

  const obtenerProductos = async (mostrarActualizando = false) => {
    try {
      setError("");

      if (mostrarActualizando) {
        setActualizando(true);
      } else {
        setLoading(true);
      }

      const respuesta = await api.get("/productos");
      setProductos(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("No fue posible cargar los productos.");
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const formatearMoneda = (valor) =>
    Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const obtenerEstadoStock = (stock) => {
    if (stock <= 0) {
      return {
        texto: "Agotado",
        estilo: styles.stockEmpty,
        icono: <FaExclamationTriangle />,
      };
    }

    if (stock <= 5) {
      return {
        texto: "Stock bajo",
        estilo: styles.stockLow,
        icono: <FaExclamationTriangle />,
      };
    }

    return {
      texto: "Disponible",
      estilo: styles.stockAvailable,
      icono: <FaCheckCircle />,
    };
  };

  const obtenerImagen = (imagen) => {
    return obtenerUrlImagen(imagen, "");
  };

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const nombre = String(producto?.nombre || "").toLowerCase();
      const descripcion = String(producto?.descripcion || "").toLowerCase();
      const stock = Number(producto?.stock || 0);

      const coincideBusqueda =
        nombre.includes(texto) || descripcion.includes(texto);

      const coincideDisponibilidad = soloDisponibles ? stock > 0 : true;

      return coincideBusqueda && coincideDisponibilidad;
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
    <main style={styles.container}>
      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>
            <FaBoxes />
            CATÁLOGO
          </div>

          <h1 style={styles.title}>Productos</h1>

          <p style={styles.subtitle}>
            Consulta los productos disponibles, sus precios y existencias.
          </p>
        </div>

        <div style={styles.headerBadge}>
          <FaBoxOpen style={styles.headerBadgeIcon} />

          <div>
            <strong style={styles.headerBadgeStrong}>
              {productos.length} productos
            </strong>
            <span style={styles.headerBadgeSpan}>Registrados actualmente</span>
          </div>
        </div>
      </header>

      <section style={styles.filters}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />

          <input
            type="search"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            style={styles.searchInput}
          />
        </div>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(event) => setSoloDisponibles(event.target.checked)}
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
          <FaSyncAlt />
          {actualizando ? "Actualizando..." : "Actualizar"}
        </button>
      </section>

      {error && (
        <section style={styles.errorBox}>
          <FaExclamationTriangle />
          <span>{error}</span>
          <button type="button" onClick={() => obtenerProductos()}>
            Reintentar
          </button>
        </section>
      )}

      {!error && (
        <>
          <p style={styles.resultsInfo}>
            Mostrando{" "}
            <strong style={styles.resultsStrong}>
              {productosFiltrados.length}
            </strong>{" "}
            {productosFiltrados.length === 1 ? "producto" : "productos"}
          </p>

          {productosFiltrados.length === 0 ? (
            <section style={styles.empty}>
              <div style={styles.emptyIcon}>
                <FaBoxes />
              </div>

              <h2 style={styles.emptyTitle}>No hay productos</h2>

              <p style={styles.emptyText}>
                {productos.length === 0
                  ? "No hay productos registrados actualmente."
                  : "No encontramos productos que coincidan con la búsqueda."}
              </p>
            </section>
          ) : (
            <section style={styles.grid}>
              {productosFiltrados.map((producto) => {
                const stock = Number(producto?.stock || 0);
                const estadoStock = obtenerEstadoStock(stock);
                const imagen = obtenerImagen(producto?.imagen);

                return (
                  <article key={producto.id} style={styles.card}>
                    <div style={styles.imageBox}>
                      {imagen ? (
                        <img
                          src={imagen}
                          alt={producto.nombre}
                          style={styles.image}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            const fallback =
                              event.currentTarget.parentElement?.querySelector(
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
                          ...estadoStock.estilo,
                        }}
                      >
                        {estadoStock.icono}
                        {estadoStock.texto}
                      </div>
                    </div>

                    <div style={styles.body}>
                      <h2 style={styles.productName}>{producto.nombre}</h2>

                      <p style={styles.description}>
                        {producto.descripcion || "Sin descripción registrada."}
                      </p>

                      <div style={styles.infoGrid}>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>Precio</span>
                          <strong style={styles.price}>
                            {formatearMoneda(producto.precio)}
                          </strong>
                        </div>

                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>Existencias</span>
                          <strong
                            style={{
                              ...styles.stockNumber,
                              color:
                                stock <= 0
                                  ? "#f87171"
                                  : stock <= 5
                                    ? "#fbbf24"
                                    : "#6ee7b7",
                            }}
                          >
                            {stock}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default ProductosEmpleado;

const styles = {
  container: {
    minHeight: "100vh",
    padding: "clamp(20px, 4vw, 42px)",
    color: "#ffffff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
    marginBottom: "30px",
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
    color: "#a78bfa",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },
  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(30px, 4vw, 42px)",
    fontWeight: "800",
  },
  subtitle: {
    maxWidth: "650px",
    margin: "10px 0 0",
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: "1.6",
  },
  headerBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 20px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.045)",
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
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "15px",
    padding: "18px",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.035)",
  },
  searchBox: {
    position: "relative",
    flex: 1,
    minWidth: "240px",
  },
  searchIcon: {
    position: "absolute",
    top: "50%",
    left: "14px",
    transform: "translateY(-50%)",
    color: "#64748b",
    fontSize: "13px",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px 12px 42px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "13px",
    outline: "none",
    background: "rgba(255,255,255,0.045)",
    color: "#ffffff",
    fontSize: "13px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#cbd5e1",
    fontSize: "13px",
    cursor: "pointer",
  },
  refreshButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 16px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "13px",
    background: "rgba(124,58,237,0.12)",
    color: "#c4b5fd",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
  },
  resultsInfo: {
    margin: "0 0 20px",
    color: "#64748b",
    fontSize: "13px",
  },
  resultsStrong: {
    color: "#c4b5fd",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },
  card: {
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.045)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.22)",
  },
  imageBox: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "230px",
    padding: "18px",
    background: "rgba(255,255,255,0.025)",
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
    border: "1px solid rgba(16,185,129,0.25)",
    background: "rgba(16,185,129,0.14)",
    color: "#6ee7b7",
  },
  stockLow: {
    border: "1px solid rgba(245,158,11,0.25)",
    background: "rgba(245,158,11,0.14)",
    color: "#fbbf24",
  },
  stockEmpty: {
    border: "1px solid rgba(239,68,68,0.25)",
    background: "rgba(239,68,68,0.14)",
    color: "#f87171",
  },
  body: {
    padding: "22px",
  },
  productName: {
    margin: 0,
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "800",
  },
  description: {
    minHeight: "40px",
    margin: "8px 0 18px",
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.5",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  infoItem: {
    padding: "13px",
    border: "1px solid rgba(255,255,255,0.055)",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.035)",
  },
  infoLabel: {
    display: "block",
    marginBottom: "5px",
    color: "#64748b",
    fontSize: "11px",
  },
  price: {
    color: "#38bdf8",
    fontSize: "17px",
  },
  stockNumber: {
    fontSize: "18px",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "12px",
    padding: "24px",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "18px",
    background: "rgba(239,68,68,0.08)",
    color: "#fca5a5",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 30px",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "26px",
    background: "rgba(255,255,255,0.04)",
    textAlign: "center",
  },
  emptyIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "80px",
    height: "80px",
    borderRadius: "24px",
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
    maxWidth: "450px",
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  loadingContainer: {
    display: "flex",
    minHeight: "75vh",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px",
  },
  loader: {
    width: "52px",
    height: "52px",
    border: "4px solid rgba(255,255,255,0.1)",
    borderTopColor: "#8b5cf6",
    borderRadius: "50%",
  },
  loadingText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "15px",
  },
};
