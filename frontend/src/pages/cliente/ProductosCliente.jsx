import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ProductosCliente() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [soloStock, setSoloStock] = useState(false);
  const [orden, setOrden] = useState("");

  const [mostrarOrden, setMostrarOrden] = useState(false);
  const [mensajeCarrito, setMensajeCarrito] = useState("");

  const obtenerUsuario = () => {
    try {
      return JSON.parse(localStorage.getItem("usuario")) || null;
    } catch {
      return null;
    }
  };

  const obtenerClaveCarrito = () => {
    const token = localStorage.getItem("token");
    const usuario = obtenerUsuario();

    if (!token) {
      return "carrito_invitado";
    }

    const usuarioId =
      usuario?.id ||
      usuario?.usuarioId ||
      usuario?.idUsuario ||
      usuario?.id_usuario;

    if (usuarioId) {
      return `carrito_cliente_${usuarioId}`;
    }

    return `carrito_cliente_token_${token}`;
  };

  const obtenerCarrito = () => {
    try {
      const clave = obtenerClaveCarrito();
      const carritoGuardado = localStorage.getItem(clave);

      if (!carritoGuardado) {
        return [];
      }

      const carrito = JSON.parse(carritoGuardado);

      return Array.isArray(carrito) ? carrito : [];
    } catch (err) {
      console.error("Error leyendo el carrito:", err);
      return [];
    }
  };

  const guardarCarrito = (carrito) => {
    const clave = obtenerClaveCarrito();
    const carritoJSON = JSON.stringify(carrito);

    localStorage.setItem(clave, carritoJSON);

    window.dispatchEvent(
      new CustomEvent("carritoActualizado", {
        detail: {
          carrito,
          clave,
        },
      }),
    );

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: clave,
        newValue: carritoJSON,
        storageArea: localStorage,
      }),
    );
  };

  const migrarCarritoInvitado = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const usuario = obtenerUsuario();

    const usuarioId =
      usuario?.id ||
      usuario?.usuarioId ||
      usuario?.idUsuario ||
      usuario?.id_usuario;

    if (!usuarioId) {
      return;
    }

    const claveCliente = `carrito_cliente_${usuarioId}`;

    try {
      const carritoInvitadoJSON = localStorage.getItem("carrito_invitado");

      if (!carritoInvitadoJSON) {
        return;
      }

      const carritoInvitado = JSON.parse(carritoInvitadoJSON);

      if (!Array.isArray(carritoInvitado) || carritoInvitado.length === 0) {
        localStorage.removeItem("carrito_invitado");
        return;
      }

      const carritoClienteJSON = localStorage.getItem(claveCliente);

      const carritoCliente = carritoClienteJSON
        ? JSON.parse(carritoClienteJSON)
        : [];

      const carritoFinal = Array.isArray(carritoCliente)
        ? [...carritoCliente]
        : [];

      carritoInvitado.forEach((productoInvitado) => {
        const existente = carritoFinal.find(
          (producto) => Number(producto.id) === Number(productoInvitado.id),
        );

        if (existente) {
          existente.cantidad =
            Number(existente.cantidad || 0) +
            Number(productoInvitado.cantidad || 0);
        } else {
          carritoFinal.push(productoInvitado);
        }
      });

      localStorage.setItem(claveCliente, JSON.stringify(carritoFinal));
      localStorage.removeItem("carrito_invitado");

      window.dispatchEvent(
        new CustomEvent("carritoActualizado", {
          detail: {
            carrito: carritoFinal,
            clave: claveCliente,
          },
        }),
      );
    } catch (err) {
      console.error("Error migrando el carrito:", err);
    }
  };

  const limpiarCarritoAntiguo = () => {
    localStorage.removeItem("carrito");
  };

  const formatearMoneda = (valor) =>
    Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const obtenerProductos = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/productos");
      const data = Array.isArray(res.data) ? res.data : [];

      setProductos(data);

      const cantidadesIniciales = {};

      data.forEach((producto) => {
        const stock = Number(producto.stock || 0);
        cantidadesIniciales[producto.id] = stock > 0 ? 1 : 0;
      });

      setCantidades(cantidadesIniciales);
    } catch (err) {
      console.error("Error obteniendo productos:", err);

      setProductos([]);

      setError(
        err.response?.data?.message || "No se pudieron cargar los productos.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    limpiarCarritoAntiguo();
    migrarCarritoInvitado();
    obtenerProductos();
  }, []);

  useEffect(() => {
    if (!mensajeCarrito) {
      return;
    }

    const timer = setTimeout(() => {
      setMensajeCarrito("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [mensajeCarrito]);

  useEffect(() => {
    const cerrarOrden = (event) => {
      if (!event.target.closest("[data-orden]")) {
        setMostrarOrden(false);
      }
    };

    document.addEventListener("click", cerrarOrden);

    return () => {
      document.removeEventListener("click", cerrarOrden);
    };
  }, []);

  const filtrados = useMemo(() => {
    let data = [...productos];

    const texto = busqueda.trim().toLowerCase();

    if (texto) {
      data = data.filter((producto) => {
        const nombre = producto.nombre?.toLowerCase() || "";
        const descripcion = producto.descripcion?.toLowerCase() || "";

        const categoria =
          producto.Categoria?.nombre?.toLowerCase() ||
          producto.categoria?.nombre?.toLowerCase() ||
          producto.categoriaNombre?.toLowerCase() ||
          "";

        return (
          nombre.includes(texto) ||
          descripcion.includes(texto) ||
          categoria.includes(texto)
        );
      });
    }

    if (precioMax !== "") {
      data = data.filter(
        (producto) => Number(producto.precio || 0) <= Number(precioMax),
      );
    }

    if (soloStock) {
      data = data.filter((producto) => Number(producto.stock || 0) > 0);
    }

    if (orden === "precio-asc") {
      data.sort((a, b) => Number(a.precio || 0) - Number(b.precio || 0));
    }

    if (orden === "precio-desc") {
      data.sort((a, b) => Number(b.precio || 0) - Number(a.precio || 0));
    }

    return data;
  }, [productos, busqueda, precioMax, soloStock, orden]);

  const aumentar = (id, stock) => {
    const stockDisponible = Number(stock || 0);
    const cantidadActual = Number(cantidades[id] || 0);

    if (cantidadActual >= stockDisponible) {
      return;
    }

    setCantidades((prev) => ({
      ...prev,
      [id]: cantidadActual + 1,
    }));
  };

  const disminuir = (id) => {
    const cantidadActual = Number(cantidades[id] || 1);

    if (cantidadActual <= 1) {
      return;
    }

    setCantidades((prev) => ({
      ...prev,
      [id]: cantidadActual - 1,
    }));
  };

  const agregarAlCarrito = (producto) => {
    const productoId = Number(producto.id);
    const stock = Number(producto.stock || 0);

    if (!productoId) {
      setMensajeCarrito("No se pudo identificar el producto.");
      return;
    }

    if (stock <= 0) {
      setMensajeCarrito("Este producto está agotado.");
      return;
    }

    const cantidadAgregar = Number(cantidades[producto.id] || 1);

    if (cantidadAgregar < 1) {
      setMensajeCarrito("La cantidad seleccionada no es válida.");
      return;
    }

    if (cantidadAgregar > stock) {
      setMensajeCarrito(
        `Solo hay ${stock} ${stock === 1 ? "unidad" : "unidades"} disponibles.`,
      );
      return;
    }

    const carritoActual = obtenerCarrito();

    const productoExistente = carritoActual.find(
      (item) => Number(item.id) === productoId,
    );

    if (productoExistente) {
      const cantidadActual = Number(productoExistente.cantidad || 0);

      const nuevaCantidad = cantidadActual + cantidadAgregar;

      if (nuevaCantidad > stock) {
        setMensajeCarrito(
          `Solo puedes tener hasta ${stock} ${
            stock === 1 ? "unidad" : "unidades"
          } de este producto.`,
        );
        return;
      }

      productoExistente.cantidad = nuevaCantidad;
      productoExistente.stock = stock;
      productoExistente.precio = Number(producto.precio || 0);
      productoExistente.nombre = producto.nombre || "Producto";
      productoExistente.imagen = producto.imagen || "";
      productoExistente.descripcion = producto.descripcion || "";
      productoExistente.categoria =
        producto.categoria ||
        producto.Categoria ||
        producto.categoriaNombre ||
        "";
    } else {
      carritoActual.push({
        id: productoId,
        nombre: producto.nombre || "Producto",
        descripcion: producto.descripcion || "",
        precio: Number(producto.precio || 0),
        stock,
        imagen: producto.imagen || "",
        cantidad: cantidadAgregar,
        categoria:
          producto.categoria ||
          producto.Categoria ||
          producto.categoriaNombre ||
          "",
      });
    }

    guardarCarrito(carritoActual);

    setMensajeCarrito(
      `${producto.nombre || "Producto"} fue agregado al carrito.`,
    );

    setCantidades((prev) => ({
      ...prev,
      [producto.id]: 1,
    }));
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setPrecioMax("");
    setSoloStock(false);
    setOrden("");
  };

  const seleccionarOrden = (valor) => {
    setOrden(valor);
    setMostrarOrden(false);
  };

  const hayFiltros =
    busqueda.trim() !== "" || precioMax !== "" || soloStock || orden !== "";

  const obtenerCategoria = (producto) =>
    producto.Categoria?.nombre ||
    producto.categoria?.nombre ||
    producto.categoriaNombre ||
    "Moda";

  const obtenerImagen = (producto) => {
    const imagenFallback =
      "https://placehold.co/600x500/161a2f/ffffff?text=ModaGest+Pro";

    if (!producto?.imagen) {
      return imagenFallback;
    }

    if (
      typeof producto.imagen === "string" &&
      producto.imagen.startsWith("http")
    ) {
      return producto.imagen;
    }

    const nombreImagen = String(producto.imagen).replace(/^\/+/, "");

    return `http://localhost:5000/uploads/${nombreImagen}`;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>

        <p style={styles.loadingText}>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>!</div>

          <h2 style={styles.errorTitle}>No pudimos cargar la tienda</h2>

          <p style={styles.errorText}>{error}</p>

          <button
            type="button"
            style={styles.retryButton}
            onClick={obtenerProductos}
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {mensajeCarrito && (
        <div style={styles.toast}>
          <span style={styles.toastIcon}>✓</span>

          <span>{mensajeCarrito}</span>
        </div>
      )}

      <div style={styles.header}>
        <div style={styles.headerContent} className="cliente-header-content">
          <div>
            <p style={styles.brand}>MODAGEST PRO</p>

            <h1 style={styles.title}>Tienda</h1>

            <p style={styles.subtitle}>
              Explora nuestro catálogo y encuentra los productos que buscas.
            </p>
          </div>

          <button
            type="button"
            style={styles.cartButton}
            className="cliente-cart-button"
            onClick={() => navigate("/cliente/carrito")}
          >
            🛒
            <span>Ver carrito</span>
          </button>
        </div>
      </div>

      <div style={styles.filtersCard}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Buscar por nombre, categoría o descripción..."
            style={styles.searchInput}
            className="cliente-search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div style={styles.filterRow} className="cliente-filter-row">
          <div style={styles.priceWrapper}>
            <span style={styles.currencyIcon}>$</span>

            <input
              type="number"
              placeholder="Precio máximo"
              style={styles.priceInput}
              className="cliente-price-input"
              value={precioMax}
              min="0"
              onChange={(e) => setPrecioMax(e.target.value)}
            />
          </div>

          <div style={styles.orderWrapper} data-orden>
            <button
              type="button"
              style={styles.selectButton}
              onClick={(e) => {
                e.stopPropagation();
                setMostrarOrden((prev) => !prev);
              }}
            >
              <span>
                {orden === "precio-asc"
                  ? "Menor precio"
                  : orden === "precio-desc"
                    ? "Mayor precio"
                    : "Ordenar por"}
              </span>

              <span
                style={{
                  ...styles.selectArrow,
                  transform: mostrarOrden ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </button>

            {mostrarOrden && (
              <div style={styles.selectMenu}>
                <button
                  type="button"
                  style={{
                    ...styles.selectOption,
                    ...(orden === "" ? styles.selectOptionActive : {}),
                  }}
                  className="cliente-select-option"
                  onClick={() => seleccionarOrden("")}
                >
                  <span>Ordenar por</span>

                  {orden === "" && <span>✓</span>}
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.selectOption,
                    ...(orden === "precio-asc"
                      ? styles.selectOptionActive
                      : {}),
                  }}
                  className="cliente-select-option"
                  onClick={() => seleccionarOrden("precio-asc")}
                >
                  <span>Menor precio</span>

                  {orden === "precio-asc" && <span>✓</span>}
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.selectOption,
                    ...(orden === "precio-desc"
                      ? styles.selectOptionActive
                      : {}),
                  }}
                  className="cliente-select-option"
                  onClick={() => seleccionarOrden("precio-desc")}
                >
                  <span>Mayor precio</span>

                  {orden === "precio-desc" && <span>✓</span>}
                </button>
              </div>
            )}
          </div>

          <label style={styles.stockLabel} className="cliente-stock-label">
            <input
              type="checkbox"
              checked={soloStock}
              onChange={(e) => setSoloStock(e.target.checked)}
            />

            <span>Solo disponibles</span>
          </label>

          {hayFiltros && (
            <button
              type="button"
              style={styles.clearButton}
              className="cliente-clear-button"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div style={styles.catalogHeader}>
        <div>
          <h2 style={styles.catalogTitle}>Catálogo de productos</h2>

          <p style={styles.catalogCount}>
            {filtrados.length}{" "}
            {filtrados.length === 1
              ? "producto encontrado"
              : "productos encontrados"}
          </p>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>⌕</div>

          <h3 style={styles.emptyTitle}>No encontramos productos</h3>

          <p style={styles.emptyText}>
            Prueba cambiando los filtros o utilizando otra búsqueda.
          </p>

          {hayFiltros && (
            <button
              type="button"
              style={styles.emptyButton}
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {filtrados.map((producto) => {
            const stock = Number(producto.stock || 0);

            const cantidad = Number(
              cantidades[producto.id] || (stock > 0 ? 1 : 0),
            );

            const total = Number(producto.precio || 0) * cantidad;

            const agotado = stock <= 0;

            return (
              <div
                key={producto.id}
                style={styles.card}
                className="cliente-product-card"
              >
                <div
                  style={{
                    ...styles.stockBadge,
                    ...(agotado
                      ? styles.stockBadgeOut
                      : styles.stockBadgeAvailable),
                  }}
                >
                  <span>{agotado ? "Agotado" : "Disponible"}</span>
                </div>

                <div style={styles.imageBox} className="cliente-image-box">
                  <img
                    src={obtenerImagen(producto)}
                    alt={producto.nombre || "Producto"}
                    style={styles.image}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://placehold.co/600x500/161a2f/ffffff?text=ModaGest+Pro";
                    }}
                  />
                </div>

                <div style={styles.body}>
                  <span style={styles.category}>
                    {obtenerCategoria(producto)}
                  </span>

                  <h3 style={styles.productName}>
                    {producto.nombre || "Producto sin nombre"}
                  </h3>

                  <p style={styles.description}>
                    {producto.descripcion || "Sin descripción disponible"}
                  </p>

                  <div style={styles.priceRow}>
                    <h2 style={styles.price}>
                      {formatearMoneda(producto.precio)}
                    </h2>
                  </div>

                  <p
                    style={{
                      ...styles.stock,
                      color: agotado ? "#f87171" : "#94a3b8",
                    }}
                  >
                    {agotado
                      ? "Producto agotado"
                      : `${stock} ${
                          stock === 1 ? "unidad" : "unidades"
                        } disponibles`}
                  </p>

                  <div style={styles.counter}>
                    <button
                      type="button"
                      style={{
                        ...styles.counterBtn,
                        ...(cantidad <= 1 || agotado
                          ? styles.counterBtnDisabled
                          : {}),
                      }}
                      disabled={cantidad <= 1 || agotado}
                      onClick={() => disminuir(producto.id)}
                    >
                      −
                    </button>

                    <span style={styles.counterValue}>
                      {agotado ? 0 : cantidad}
                    </span>

                    <button
                      type="button"
                      style={{
                        ...styles.counterBtn,
                        ...(agotado || cantidad >= stock
                          ? styles.counterBtnDisabled
                          : {}),
                      }}
                      disabled={agotado || cantidad >= stock}
                      onClick={() => aumentar(producto.id, stock)}
                    >
                      +
                    </button>
                  </div>

                  <div style={styles.totalBox}>
                    <span style={styles.totalLabel}>Total</span>

                    <strong
                      style={{
                        ...styles.total,
                        color: agotado ? "#64748b" : "#c084fc",
                      }}
                    >
                      {formatearMoneda(total)}
                    </strong>
                  </div>

                  <button
                    type="button"
                    style={{
                      ...styles.button,
                      ...(agotado ? styles.buttonDisabled : {}),
                    }}
                    disabled={agotado}
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    {agotado ? "Producto agotado" : "🛒 Agregar al carrito"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          .cliente-product-card {
            transition:
              transform 0.2s ease,
              border-color 0.2s ease,
              box-shadow 0.2s ease;
          }

          .cliente-product-card:hover {
            transform: translateY(-4px);
            border-color: rgba(168, 85, 247, 0.3);
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
          }

          .cliente-search-input:focus,
          .cliente-price-input:focus {
            border-color: rgba(168, 85, 247, 0.5) !important;
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08);
          }

          .cliente-select-option:hover {
            background: rgba(124, 58, 237, 0.16) !important;
            color: #fff !important;
          }

          @media (max-width: 900px) {
            .cliente-header-content {
              align-items: flex-start !important;
              flex-direction: column !important;
            }

            .cliente-cart-button {
              width: 100%;
            }

            .cliente-filter-row {
              align-items: stretch !important;
            }
          }

          @media (max-width: 700px) {
            .cliente-page {
              padding: 25px 15px 45px !important;
            }

            .cliente-title {
              font-size: 34px !important;
            }

            .cliente-filter-row > * {
              width: 100% !important;
            }

            .cliente-stock-label {
              padding: 5px 0 !important;
            }

            .cliente-clear-button {
              width: 100%;
            }

            .cliente-toast {
              left: 15px !important;
              right: 15px !important;
              max-width: none !important;
            }
          }

          @media (max-width: 520px) {
            .cliente-page {
              padding: 22px 12px 40px !important;
            }

            .cliente-image-box {
              height: 165px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default ProductosCliente;

const styles = {
  container: {
    minHeight: "100vh",
    padding: "38px 35px 60px",
    background:
      "radial-gradient(circle at top right, rgba(91,33,182,0.16), transparent 30%), linear-gradient(135deg, #070b18, #0d1326 55%, #10152b)",
    color: "white",
  },

  header: {
    maxWidth: "1150px",
    margin: "0 auto 25px",
  },

  headerContent: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "25px",
  },

  brand: {
    margin: "0 0 7px",
    color: "#a855f7",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
  },

  title: {
    margin: 0,
    fontSize: "42px",
    lineHeight: "1",
    fontWeight: "800",
    letterSpacing: "-1px",
  },

  subtitle: {
    margin: "13px 0 0",
    color: "#94a3b8",
    fontSize: "15px",
  },

  cartButton: {
    minHeight: "44px",
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    borderRadius: "11px",
    border: "1px solid rgba(168,85,247,0.45)",
    background: "rgba(124,58,237,0.14)",
    color: "white",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    transition: "0.2s ease",
  },

  filtersCard: {
    maxWidth: "1150px",
    margin: "0 auto 27px",
    padding: "13px",
    borderRadius: "16px",
    border: "1px solid rgba(148,163,184,0.12)",
    background: "rgba(15,23,42,0.76)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.18)",
  },

  searchWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: "10px",
  },

  searchIcon: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#a855f7",
    fontSize: "21px",
    zIndex: 2,
  },

  searchInput: {
    width: "100%",
    height: "42px",
    boxSizing: "border-box",
    padding: "0 14px 0 39px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.72)",
    color: "white",
    outline: "none",
    fontSize: "13px",
  },

  filterRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
  },

  priceWrapper: {
    position: "relative",
    width: "128px",
  },

  currencyIcon: {
    position: "absolute",
    left: "11px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#a855f7",
    fontSize: "14px",
    zIndex: 2,
  },

  priceInput: {
    width: "100%",
    height: "38px",
    boxSizing: "border-box",
    padding: "0 10px 0 28px",
    borderRadius: "9px",
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.72)",
    color: "white",
    outline: "none",
    fontSize: "12px",
  },

  orderWrapper: {
    position: "relative",
    width: "126px",
    zIndex: 30,
  },

  selectButton: {
    width: "100%",
    height: "38px",
    boxSizing: "border-box",
    padding: "0 10px 0 13px",
    borderRadius: "9px",
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.72)",
    color: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  selectArrow: {
    color: "#a855f7",
    fontSize: "9px",
    transition: "0.2s ease",
  },

  selectMenu: {
    position: "absolute",
    top: "43px",
    left: 0,
    width: "100%",
    boxSizing: "border-box",
    padding: "5px",
    borderRadius: "10px",
    border: "1px solid rgba(139,92,246,0.3)",
    background: "#111827",
    boxShadow: "0 15px 30px rgba(0,0,0,0.4)",
    zIndex: 100,
  },

  selectOption: {
    width: "100%",
    minHeight: "36px",
    padding: "7px 9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "none",
    borderRadius: "7px",
    background: "transparent",
    color: "#cbd5e1",
    textAlign: "left",
    fontSize: "12px",
    cursor: "pointer",
  },

  selectOptionActive: {
    background: "rgba(124,58,237,0.22)",
    color: "white",
  },

  stockLabel: {
    minHeight: "38px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "0 8px",
    color: "#cbd5e1",
    fontSize: "12px",
    cursor: "pointer",
  },

  clearButton: {
    minHeight: "34px",
    padding: "0 10px",
    borderRadius: "8px",
    border: "1px solid rgba(168,85,247,0.28)",
    background: "rgba(124,58,237,0.1)",
    color: "#c084fc",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
  },

  catalogHeader: {
    maxWidth: "1150px",
    margin: "0 auto 16px",
  },

  catalogTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "800",
  },

  catalogCount: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "11px",
  },

  grid: {
    maxWidth: "1150px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
    alignItems: "stretch",
  },

  card: {
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    borderRadius: "17px",
    border: "1px solid rgba(148,163,184,0.11)",
    background: "rgba(17,24,39,0.9)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
  },

  stockBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 5,
    padding: "5px 9px",
    display: "flex",
    alignItems: "center",
    borderRadius: "999px",
    fontSize: "9px",
    fontWeight: "800",
    backdropFilter: "blur(8px)",
  },

  stockBadgeAvailable: {
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.45)",
    color: "#86efac",
  },

  stockBadgeOut: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.45)",
    color: "#fca5a5",
  },

  imageBox: {
    height: "180px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
    background:
      "radial-gradient(circle at center, rgba(124,58,237,0.16), transparent 62%), #171a3b",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  body: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: "17px",
    minHeight: 0,
  },

  category: {
    display: "inline-block",
    marginBottom: "7px",
    color: "#a855f7",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
  },

  productName: {
    margin: "0 0 8px",
    color: "#f8fafc",
    fontSize: "16px",
    lineHeight: "1.25",
    fontWeight: "800",
    minHeight: "40px",
  },

  description: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    minHeight: "34px",
    margin: 0,
    color: "#94a3b8",
    fontSize: "11px",
    lineHeight: "1.55",
  },

  priceRow: {
    marginTop: "14px",
  },

  price: {
    margin: 0,
    color: "#c084fc",
    fontSize: "21px",
    fontWeight: "800",
  },

  stock: {
    margin: "7px 0 13px",
    fontSize: "10px",
  },

  counter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "12px",
  },

  counterBtn: {
    width: "32px",
    height: "32px",
    border: "1px solid rgba(139,92,246,0.35)",
    borderRadius: "9px",
    background: "rgba(124,58,237,0.18)",
    color: "white",
    fontSize: "17px",
    fontWeight: "800",
    cursor: "pointer",
  },

  counterBtnDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },

  counterValue: {
    minWidth: "25px",
    textAlign: "center",
    color: "#f8fafc",
    fontSize: "15px",
    fontWeight: "800",
  },

  totalBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "9px 11px",
    marginBottom: "10px",
    borderRadius: "9px",
    background: "rgba(124,58,237,0.08)",
    border: "1px solid rgba(139,92,246,0.1)",
  },

  totalLabel: {
    color: "#64748b",
    fontSize: "10px",
  },

  total: {
    fontSize: "13px",
  },

  button: {
    width: "100%",
    minHeight: "39px",
    marginTop: "auto",
    padding: "0 12px",
    border: "1px solid rgba(168,85,247,0.35)",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    color: "white",
    fontWeight: "800",
    fontSize: "11px",
    cursor: "pointer",
    boxShadow: "0 7px 18px rgba(79,70,229,0.18)",
  },

  buttonDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  empty: {
    maxWidth: "1150px",
    margin: "30px auto 0",
    padding: "55px 25px",
    textAlign: "center",
    borderRadius: "17px",
    border: "1px solid rgba(148,163,184,0.1)",
    background: "rgba(15,23,42,0.65)",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    margin: "0 auto 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "rgba(124,58,237,0.12)",
    color: "#c084fc",
    fontSize: "25px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
  },

  emptyText: {
    margin: "0 0 20px",
    color: "#94a3b8",
    fontSize: "13px",
  },

  emptyButton: {
    padding: "10px 16px",
    border: "1px solid rgba(168,85,247,0.35)",
    borderRadius: "9px",
    background: "rgba(124,58,237,0.12)",
    color: "#c084fc",
    fontWeight: "700",
    cursor: "pointer",
  },

  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 999,
    maxWidth: "330px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(34,197,94,0.3)",
    background: "rgba(15,23,42,0.96)",
    color: "#e2e8f0",
    boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
    backdropFilter: "blur(14px)",
    fontSize: "12px",
    fontWeight: "600",
  },

  toastIcon: {
    width: "22px",
    height: "22px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "rgba(34,197,94,0.15)",
    color: "#86efac",
    fontWeight: "800",
  },

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "25px",
    background: "linear-gradient(135deg, #070b18, #10152b)",
    color: "white",
  },

  loader: {
    width: "48px",
    height: "48px",
    border: "4px solid rgba(255,255,255,0.12)",
    borderTop: "4px solid #a855f7",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: "16px",
    color: "#cbd5e1",
    fontSize: "14px",
  },

  errorCard: {
    width: "min(420px, 100%)",
    padding: "30px",
    boxSizing: "border-box",
    textAlign: "center",
    borderRadius: "18px",
    border: "1px solid rgba(248,113,113,0.25)",
    background: "rgba(127,29,29,0.14)",
  },

  errorIcon: {
    width: "45px",
    height: "45px",
    margin: "0 auto 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "rgba(239,68,68,0.14)",
    color: "#f87171",
    fontSize: "24px",
    fontWeight: "800",
  },

  errorTitle: {
    margin: "0 0 8px",
    fontSize: "19px",
  },

  errorText: {
    margin: "0 0 20px",
    color: "#fca5a5",
    fontSize: "13px",
  },

  retryButton: {
    padding: "10px 17px",
    border: "1px solid rgba(168,85,247,0.35)",
    borderRadius: "9px",
    background: "rgba(124,58,237,0.15)",
    color: "#d8b4fe",
    fontWeight: "700",
    cursor: "pointer",
  },
};
