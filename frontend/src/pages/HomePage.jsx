import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PublicNavbar from "../components/PublicNavbar";
import api from "../services/api";
import { obtenerUrlImagen } from "../utils/media";

import {
  FaShoppingCart,
  FaShippingFast,
  FaHeadset,
  FaStar,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

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
    if (!mensaje) return;

    const timer = setTimeout(() => {
      setMensaje("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [mensaje]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setLoading(true);

        const res = await api.get("/productos");

        setProductos(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error cargando productos:", error);
        setProductos([]);
        mostrarMensaje("Error cargando productos ❌");
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return true;

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

  const obtenerImagen = (producto) => {
    return obtenerUrlImagen(producto.imagen);
  };

  const agregarAlCarrito = (producto) => {
    const stock = Number(producto.stock || 0);

    if (stock <= 0) {
      mostrarMensaje("Producto sin stock ❌");
      return false;
    }

    let carrito = [];

    try {
      const carritoGuardado = localStorage.getItem("carrito");
      carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

      if (!Array.isArray(carrito)) {
        carrito = [];
      }
    } catch (error) {
      console.error("Error leyendo el carrito:", error);
      carrito = [];
    }

    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
      const cantidadActual = Number(productoExistente.cantidad || 0);

      if (cantidadActual >= stock) {
        mostrarMensaje(`Solo hay ${stock} unidades disponibles.`);
        return false;
      }

      productoExistente.cantidad = cantidadActual + 1;
    } else {
      carrito.push({
        ...producto,
        cantidad: 1,
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    window.dispatchEvent(new Event("carritoActualizado"));

    mostrarMensaje("Producto agregado 🛒");

    return true;
  };

  const comprarAhora = (producto) => {
    const agregado = agregarAlCarrito(producto);

    if (!agregado) return;

    const token = localStorage.getItem("token");

    if (token) {
      navigate("/cliente/carrito");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <PublicNavbar />

      <section style={styles.hero}>
        <div style={styles.heroDark}></div>

        <div style={styles.overlay}>
          <p style={styles.subtitle}>NUEVA COLECCIÓN</p>

          <h1 style={styles.heroTitle}>Estilo que te define</h1>

          <p style={styles.heroText}>
            Descubre las últimas tendencias en moda para hombres y mujeres.
          </p>

          <button
            type="button"
            style={styles.heroBtn}
            onClick={() =>
              document.getElementById("productos")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Explorar productos
            <FaArrowRight />
          </button>
        </div>
      </section>

      <section style={styles.benefits}>
        <div style={styles.benefitCard}>
          <FaShippingFast size={28} />

          <div>
            <h4>Envíos rápidos</h4>
            <p>A todo el país</p>
          </div>
        </div>

        <div style={styles.benefitCard}>
          <FaShoppingCart size={28} />

          <div>
            <h4>Compra segura</h4>
            <p>Pagos protegidos</p>
          </div>
        </div>

        <div style={styles.benefitCard}>
          <FaHeadset size={28} />

          <div>
            <h4>Soporte 24/7</h4>
            <p>Siempre contigo</p>
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
              onChange={(e) => setBusqueda(e.target.value)}
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
            <FaSearch size={28} color="#C084FC" />

            <h3>No encontramos productos</h3>

            <p>Prueba utilizando otro nombre, categoría o descripción.</p>

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
                      src={obtenerImagen(producto)}
                      alt={producto.nombre || "Producto"}
                      style={styles.image}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://placehold.co/300x300/161a2f/ffffff?text=ModaGest";
                      }}
                    />
                  </div>

                  <div style={styles.cardBody}>
                    <h3 style={styles.productName}>
                      {producto.nombre || "Producto sin nombre"}
                    </h3>

                    <div style={styles.stars}>
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
                        color: agotado ? "#f87171" : "#4ADE80",
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
    </>
  );
}

export default HomePage;

const styles = {
  hero: {
    height: "80vh",
    minHeight: "560px",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    padding: "0 7%",
    position: "relative",
  },

  heroDark: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(2,6,23,0.78), rgba(2,6,23,0.40), rgba(2,6,23,0.10))",
    zIndex: 1,
  },

  overlay: {
    color: "#fff",
    maxWidth: "600px",
    zIndex: 2,
    position: "relative",
  },

  subtitle: {
    color: "#C084FC",
    letterSpacing: "4px",
    marginBottom: "20px",
    fontWeight: "600",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "13px",
    textTransform: "uppercase",
  },

  heroTitle: {
    fontSize: "76px",
    fontWeight: "600",
    fontFamily: "'Playfair Display', serif",
    lineHeight: "1.15",
    marginBottom: "24px",
    textShadow: "0 4px 14px rgba(0,0,0,0.75)",
    letterSpacing: "0.5px",
  },

  heroText: {
    fontSize: "20px",
    fontWeight: "300",
    fontFamily: "'Montserrat', sans-serif",
    marginBottom: "35px",
    color: "#F1F5F9",
    textShadow: "0 2px 10px rgba(0,0,0,0.70)",
    lineHeight: "1.6",
  },

  heroBtn: {
    background: "linear-gradient(90deg,#7C3AED,#9333EA)",
    border: "none",
    padding: "18px 30px",
    borderRadius: "14px",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  benefits: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
    padding: "40px 7%",
    background: "#050816",
  },

  benefitCard: {
    background: "#0B1225",
    border: "1px solid #1E293B",
    padding: "25px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    color: "#9333EA",
  },

  toast: {
    position: "fixed",
    top: "90px",
    right: "20px",
    background: "linear-gradient(90deg,#7C3AED,#9333EA)",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "12px",
    zIndex: 9999,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },

  container: {
    padding: "70px 7%",
    background: "#020617",
    minHeight: "100vh",
  },

  productsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px",
  },

  title: {
    color: "#fff",
    fontSize: "52px",
    fontWeight: "bold",
    margin: 0,
  },

  productCount: {
    color: "#64748B",
    fontSize: "13px",
    margin: "8px 0 0",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: "12px",
    padding: "12px 18px",
    minWidth: "300px",
    gap: "10px",
  },

  input: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    width: "100%",
    fontSize: "14px",
  },

  center: {
    color: "#fff",
    textAlign: "center",
    padding: "60px 0",
  },

  empty: {
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#fff",
    gap: "8px",
  },

  emptyTitle: {
    margin: 0,
  },

  emptyText: {
    color: "#94A3B8",
    margin: 0,
  },

  clearButton: {
    marginTop: "12px",
    padding: "10px 18px",
    borderRadius: "10px",
    border: "1px solid #7C3AED",
    background: "rgba(124,58,237,0.12)",
    color: "#C084FC",
    fontWeight: "bold",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "30px",
  },

  card: {
    position: "relative",
    background: "linear-gradient(180deg,#221B5C,#1E1B4B)",
    borderRadius: "28px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
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
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.45)",
    color: "#86EFAC",
  },

  stockBadgeOut: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.45)",
    color: "#FCA5A5",
  },

  imageBox: {
    height: "260px",
    background: "linear-gradient(135deg,#2B236B,#312E81)",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "0.3s ease",
  },

  cardBody: {
    padding: "24px",
    textAlign: "center",
  },

  productName: {
    color: "#fff",
    marginBottom: "12px",
    fontSize: "22px",
    fontWeight: "800",
  },

  stars: {
    color: "#FACC15",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "center",
    gap: "3px",
  },

  price: {
    color: "#C084FC",
    marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold",
  },

  stock: {
    marginBottom: "20px",
    fontSize: "14px",
  },

  cartBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg,#7C3AED,#9333EA)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },

  buyBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #7C3AED",
    background: "transparent",
    color: "#fff",
    fontWeight: "bold",
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
