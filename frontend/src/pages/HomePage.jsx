import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaHeadset,
  FaSearch,
  FaShippingFast,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import PublicNavbar from "../components/PublicNavbar";
import api from "../services/api";
import { obtenerUrlImagen } from "../utils/media";

const leerUsuario = () => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    return usuario && typeof usuario === "object" ? usuario : null;
  } catch {
    return null;
  }
};

const obtenerClienteId = () => {
  const rol = (localStorage.getItem("rol") || "").trim().toLowerCase();

  if (rol !== "cliente") {
    return null;
  }

  const usuario = leerUsuario();
  const idUsuario =
    usuario?.id ||
    usuario?.usuarioId ||
    usuario?.clienteId ||
    usuario?.usuario?.id ||
    usuario?.data?.id;

  if (Number.isInteger(Number(idUsuario)) && Number(idUsuario) > 0) {
    return Number(idUsuario);
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const partes = token.split(".");

    if (partes.length < 2) {
      return null;
    }

    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    const base64Completo =
      padding === 0 ? base64 : base64 + "=".repeat(4 - padding);
    const payload = JSON.parse(atob(base64Completo));
    const idToken =
      payload?.id ||
      payload?.usuarioId ||
      payload?.clienteId ||
      payload?.userId ||
      payload?.sub;

    if (Number.isInteger(Number(idToken)) && Number(idToken) > 0) {
      return Number(idToken);
    }
  } catch {
    return null;
  }

  return null;
};

const obtenerClaveCarrito = () => {
  const clienteId = obtenerClienteId();
  return clienteId ? `carrito_cliente_${clienteId}` : "carrito_publico";
};

function HomePage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
  };

  useEffect(() => {
    if (!mensaje) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setMensaje("");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [mensaje]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setLoading(true);
        const respuesta = await api.get("/productos");
        setProductos(Array.isArray(respuesta.data) ? respuesta.data : []);
      } catch (error) {
        console.error("Error cargando productos:", error);
        setProductos([]);
        mostrarMensaje("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return true;
    }

    const nombre = String(producto?.nombre || "").toLowerCase();
    const descripcion = String(producto?.descripcion || "").toLowerCase();
    const categoria = String(
      producto?.Categoria?.nombre ||
        producto?.categoria?.nombre ||
        producto?.categoriaNombre ||
        "",
    ).toLowerCase();

    return (
      nombre.includes(texto) ||
      descripcion.includes(texto) ||
      categoria.includes(texto)
    );
  });

  const agregarAlCarrito = (producto) => {
    const stock = Number(producto.stock || 0);

    if (stock <= 0) {
      mostrarMensaje("Producto sin existencias disponibles");
      return false;
    }

    const claveCarrito = obtenerClaveCarrito();
    let carrito = [];

    try {
      const carritoGuardado = localStorage.getItem(claveCarrito);
      carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

      if (!Array.isArray(carrito)) {
        carrito = [];
      }
    } catch (error) {
      console.error("Error leyendo el carrito:", error);
      carrito = [];
    }

    const productoExistente = carrito.find(
      (item) => Number(item.id) === Number(producto.id),
    );

    if (productoExistente) {
      const cantidadActual = Number(productoExistente.cantidad || 0);

      if (cantidadActual >= stock) {
        mostrarMensaje(`Solo hay ${stock} unidades disponibles.`);
        return false;
      }

      productoExistente.cantidad = cantidadActual + 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
    window.dispatchEvent(
      new CustomEvent("carritoActualizado", {
        detail: {
          clave: claveCarrito,
          claveCarrito,
          clienteId: obtenerClienteId(),
          carrito,
        },
      }),
    );

    mostrarMensaje("Producto agregado al carrito");
    return true;
  };

  const comprarAhora = (producto) => {
    if (!agregarAlCarrito(producto)) {
      return;
    }

    const token = localStorage.getItem("token");
    navigate(token ? "/cliente/carrito" : "/login");
  };

  const irAProductos = () => {
    document.getElementById("productos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div style={styles.page}>
      <PublicNavbar />

      <section style={styles.hero}>
        <div style={styles.heroDark}></div>
        <div style={styles.overlay}>
          <p style={styles.subtitle}>NUEVA COLECCIÓN</p>
          <h1 style={styles.heroTitle}>Estilo que te define</h1>
          <p style={styles.heroText}>
            Descubre las últimas tendencias en moda para hombres y mujeres.
          </p>
          <button type="button" style={styles.heroBtn} onClick={irAProductos}>
            Explorar productos
            <FaArrowRight />
          </button>
        </div>
      </section>

      <section style={styles.benefits}>
        <div style={styles.benefitCard}>
          <FaShippingFast size={28} />
          <div>
            <h4 style={styles.benefitTitle}>Envíos rápidos</h4>
            <p style={styles.benefitText}>A todo el país</p>
          </div>
        </div>

        <div style={styles.benefitCard}>
          <FaShoppingCart size={28} />
          <div>
            <h4 style={styles.benefitTitle}>Compra segura</h4>
            <p style={styles.benefitText}>Pagos protegidos</p>
          </div>
        </div>

        <div style={styles.benefitCard}>
          <FaHeadset size={28} />
          <div>
            <h4 style={styles.benefitTitle}>Soporte 24/7</h4>
            <p style={styles.benefitText}>Siempre contigo</p>
          </div>
        </div>
      </section>

      {mensaje && <div style={styles.toast}>{mensaje}</div>}

      <section id="productos" style={styles.container}>
        <div style={styles.productsHeader}>
          <div>
            <h2 style={styles.title}>Productos destacados</h2>
            <p style={styles.productCount}>
              {productosFiltrados.length}{" "}
              {productosFiltrados.length === 1
                ? "producto encontrado"
                : "productos encontrados"}
            </p>
          </div>

          <div style={styles.searchBox}>
            <FaSearch color="#888" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        {loading ? (
          <div style={styles.center}>
            <p>Cargando productos...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div style={styles.empty}>
            <FaSearch size={28} color="#c084fc" />
            <h3 style={styles.emptyTitle}>No encontramos productos</h3>
            <p style={styles.emptyText}>
              Prueba utilizando otro nombre, categoría o descripción.
            </p>
            {busqueda && (
              <button
                type="button"
                style={styles.clearButton}
                onClick={() => setBusqueda("")}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {productosFiltrados.map((producto) => {
              const stock = Number(producto.stock || 0);
              const agotado = stock <= 0;

              return (
                <div key={producto.id} style={styles.card}>
                  <div
                    style={{
                      ...styles.stockBadge,
                      ...(agotado
                        ? styles.stockBadgeOut
                        : styles.stockBadgeAvailable),
                    }}
                  >
                    {agotado ? "Agotado" : "Disponible"}
                  </div>

                  <div style={styles.imageBox}>
                    <img
                      src={obtenerUrlImagen(producto.imagen)}
                      alt={producto.nombre || "Producto"}
                      style={styles.image}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://placehold.co/300x300/161a2f/ffffff?text=ModaGest";
                      }}
                    />
                  </div>

                  <div style={styles.cardBody}>
                    <h3 style={styles.productName}>
                      {producto.nombre || "Producto sin nombre"}
                    </h3>

                    <div style={styles.stars} aria-label="Cinco estrellas">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>

                    <h2 style={styles.price}>
                      ${Number(producto.precio || 0).toLocaleString("es-CO")}
                    </h2>

                    <p
                      style={{
                        ...styles.stock,
                        color: agotado ? "#f87171" : "#4ade80",
                      }}
                    >
                      {agotado
                        ? "Producto agotado"
                        : `Stock disponible: ${stock}`}
                    </p>

                    <button
                      type="button"
                      style={{
                        ...styles.cartBtn,
                        ...(agotado ? styles.buttonDisabled : {}),
                      }}
                      disabled={agotado}
                      onClick={() => agregarAlCarrito(producto)}
                    >
                      <FaShoppingCart />
                      {agotado ? "Producto agotado" : "Agregar al carrito"}
                    </button>

                    <button
                      type="button"
                      style={{
                        ...styles.buyBtn,
                        ...(agotado ? styles.buttonDisabledOutline : {}),
                      }}
                      disabled={agotado}
                      onClick={() => comprarAhora(producto)}
                    >
                      Comprar ahora
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;

const styles = {
  page: {
    width: "100%",
    maxWidth: "100vw",
    overflowX: "clip",
    background: "#020617",
  },
  hero: {
    width: "100%",
    minHeight: "clamp(540px, 80vh, 760px)",
    boxSizing: "border-box",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    padding: "clamp(60px, 8vw, 110px) clamp(20px, 7vw, 110px)",
    position: "relative",
    overflow: "hidden",
  },
  heroDark: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(2,6,23,0.84), rgba(2,6,23,0.54), rgba(2,6,23,0.22))",
    zIndex: 1,
  },
  overlay: {
    width: "100%",
    maxWidth: "600px",
    color: "#ffffff",
    zIndex: 2,
    position: "relative",
  },
  subtitle: {
    color: "#c084fc",
    letterSpacing: "clamp(2px, 1vw, 4px)",
    margin: "0 0 18px",
    fontWeight: "600",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "clamp(11px, 2.5vw, 13px)",
    lineHeight: 1.5,
    textTransform: "uppercase",
  },
  heroTitle: {
    maxWidth: "100%",
    margin: "0 0 22px",
    fontSize: "clamp(42px, 8vw, 76px)",
    fontWeight: "600",
    fontFamily: "'Playfair Display', serif",
    lineHeight: 1.08,
    overflowWrap: "break-word",
    textShadow: "0 4px 14px rgba(0,0,0,0.75)",
    letterSpacing: "0.3px",
  },
  heroText: {
    maxWidth: "540px",
    margin: "0 0 30px",
    fontSize: "clamp(15px, 3vw, 20px)",
    fontWeight: "300",
    fontFamily: "'Montserrat', sans-serif",
    color: "#f1f5f9",
    textShadow: "0 2px 10px rgba(0,0,0,0.7)",
    lineHeight: 1.6,
  },
  heroBtn: {
    maxWidth: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "15px 22px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(90deg,#7c3aed,#9333ea)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "clamp(14px, 3vw, 16px)",
    cursor: "pointer",
  },
  benefits: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))",
    gap: "18px",
    padding: "clamp(28px, 5vw, 40px) clamp(18px, 7vw, 110px)",
    background: "#050816",
  },
  benefitCard: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "22px",
    border: "1px solid #1e293b",
    borderRadius: "18px",
    background: "#0b1225",
    color: "#9333ea",
  },
  benefitTitle: {
    margin: "0 0 5px",
    color: "#ffffff",
    fontSize: "16px",
  },
  benefitText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },
  toast: {
    position: "fixed",
    top: "86px",
    right: "clamp(12px, 4vw, 20px)",
    left: "auto",
    maxWidth: "calc(100vw - 24px)",
    boxSizing: "border-box",
    padding: "13px 18px",
    borderRadius: "12px",
    background: "linear-gradient(90deg,#7c3aed,#9333ea)",
    color: "#ffffff",
    zIndex: 9999,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    fontSize: "14px",
  },
  container: {
    minHeight: "100vh",
    padding: "clamp(48px, 7vw, 70px) clamp(18px, 7vw, 110px)",
    scrollMarginTop: "86px",
    background: "#020617",
  },
  productsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "22px",
    marginBottom: "36px",
  },
  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(32px, 6vw, 52px)",
    fontWeight: "700",
    lineHeight: 1.1,
    overflowWrap: "break-word",
  },
  productCount: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
  },
  searchBox: {
    width: "min(100%, 340px)",
    minWidth: 0,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    background: "#0f172a",
  },
  input: {
    minWidth: 0,
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#ffffff",
    fontSize: "14px",
  },
  center: {
    padding: "60px 0",
    color: "#ffffff",
    textAlign: "center",
  },
  empty: {
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    color: "#ffffff",
    textAlign: "center",
  },
  emptyTitle: {
    margin: 0,
  },
  emptyText: {
    maxWidth: "420px",
    margin: 0,
    color: "#94a3b8",
  },
  clearButton: {
    marginTop: "12px",
    padding: "10px 18px",
    border: "1px solid #7c3aed",
    borderRadius: "10px",
    background: "rgba(124,58,237,0.12)",
    color: "#c084fc",
    fontWeight: "700",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
    gap: "clamp(20px, 4vw, 30px)",
  },
  card: {
    minWidth: 0,
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "clamp(20px, 5vw, 28px)",
    background: "linear-gradient(180deg,#221b5c,#1e1b4b)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    transition: "all 0.3s ease",
  },
  stockBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 3,
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "800",
    backdropFilter: "blur(8px)",
  },
  stockBadgeAvailable: {
    border: "1px solid rgba(34,197,94,0.45)",
    background: "rgba(34,197,94,0.15)",
    color: "#86efac",
  },
  stockBadgeOut: {
    border: "1px solid rgba(239,68,68,0.45)",
    background: "rgba(239,68,68,0.15)",
    color: "#fca5a5",
  },
  imageBox: {
    height: "clamp(220px, 65vw, 280px)",
    boxSizing: "border-box",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "18px",
    background: "linear-gradient(135deg,#2b236b,#312e81)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "0.3s ease",
  },
  cardBody: {
    padding: "clamp(19px, 5vw, 24px)",
    textAlign: "center",
  },
  productName: {
    margin: "0 0 12px",
    color: "#ffffff",
    fontSize: "clamp(19px, 5vw, 22px)",
    fontWeight: "800",
    overflowWrap: "break-word",
  },
  stars: {
    display: "flex",
    justifyContent: "center",
    gap: "3px",
    marginBottom: "15px",
    color: "#facc15",
  },
  price: {
    margin: "0 0 15px",
    color: "#c084fc",
    fontSize: "clamp(24px, 7vw, 28px)",
    fontWeight: "700",
  },
  stock: {
    margin: "0 0 20px",
    fontSize: "14px",
  },
  cartBtn: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(90deg,#7c3aed,#9333ea)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
  buyBtn: {
    width: "100%",
    padding: "14px",
    border: "1px solid #7c3aed",
    borderRadius: "12px",
    background: "transparent",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  buttonDisabledOutline: {
    opacity: 0.35,
    cursor: "not-allowed",
  },
};
