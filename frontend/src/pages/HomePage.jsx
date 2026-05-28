import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import PublicNavbar from "../components/PublicNavbar";
import api from "../services/api";

import {
  FaShoppingCart,
  FaShippingFast,
  FaHeadset,
  FaStar,
  FaSearch,
  FaArrowRight
} from "react-icons/fa";

function HomePage() {

  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");

  const [mensaje, setMensaje] = useState("");

  /* ================= MENSAJE ================= */

  const mostrarMensaje = (texto) => {

    setMensaje(texto);

    setTimeout(() => {

      setMensaje("");

    }, 2000);

  };

  /* ================= PRODUCTOS ================= */

  useEffect(() => {

    const obtenerProductos = async () => {

      try {

        setLoading(true);

        const res = await api.get("/productos");

        setProductos(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (error) {

        console.error(error);

        mostrarMensaje(
          "Error cargando productos ❌"
        );

      } finally {

        setLoading(false);

      }

    };

    obtenerProductos();

  }, []);

  /* ================= FILTRO ================= */

  const productosFiltrados =
    productos.filter((p) =>

      (p.nombre || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase())

    );

  /* ================= CARRITO ================= */

  const agregarAlCarrito = (producto) => {

    if (Number(producto.stock) <= 0) {

      mostrarMensaje(
        "Producto sin stock ❌"
      );

      return;

    }

    let carrito = [];

    try {

      carrito =
        JSON.parse(
          localStorage.getItem("carrito")
        ) || [];

    } catch {

      carrito = [];

    }

    const index =
      carrito.findIndex(
        (p) => p.id === producto.id
      );

    if (index >= 0) {

      carrito[index].cantidad += 1;

    } else {

      carrito.push({

        ...producto,

        cantidad: 1

      });

    }

    localStorage.setItem(
      "carrito",
      JSON.stringify(carrito)
    );

    window.dispatchEvent(
      new Event("storage")
    );

    mostrarMensaje(
      "Producto agregado 🛒"
    );

  };

  return (

    <>

      <PublicNavbar />

      {/* ================= HERO ================= */}

      <section style={styles.hero}>

        <div style={styles.heroDark}></div>

        <div style={styles.overlay}>

          <p style={styles.subtitle}>
            NUEVA COLECCIÓN
          </p>

          <h1 style={styles.heroTitle}>
            Estilo que te define
          </h1>

          <p style={styles.heroText}>
            Descubre las últimas tendencias
            en moda para hombres y mujeres.
          </p>

          <button
            style={styles.heroBtn}
            onClick={() =>

              document
                .getElementById("productos")
                ?.scrollIntoView({
                  behavior: "smooth"
                })

            }
          >

            Explorar productos

            <FaArrowRight />

          </button>

        </div>

      </section>

      {/* ================= BENEFICIOS ================= */}

      <section style={styles.benefits}>

        <div style={styles.benefitCard}>

          <FaShippingFast size={28} />

          <div>

            <h4>
              Envíos rápidos
            </h4>

            <p>
              A todo el país
            </p>

          </div>

        </div>

        <div style={styles.benefitCard}>

          <FaShoppingCart size={28} />

          <div>

            <h4>
              Compra segura
            </h4>

            <p>
              Pagos protegidos
            </p>

          </div>

        </div>

        <div style={styles.benefitCard}>

          <FaHeadset size={28} />

          <div>

            <h4>
              Soporte 24/7
            </h4>

            <p>
              Siempre contigo
            </p>

          </div>

        </div>

      </section>

      {/* ================= MENSAJE ================= */}

      {mensaje && (

        <div style={styles.toast}>
          {mensaje}
        </div>

      )}

      {/* ================= PRODUCTOS ================= */}

      <section
        id="productos"
        style={styles.container}
      >

        <div style={styles.productsHeader}>

          <h2 style={styles.title}>
            Productos destacados
          </h2>

          <div style={styles.searchBox}>

            <FaSearch color="#888" />

            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              style={styles.input}
            />

          </div>

        </div>

        {loading ? (

          <p style={styles.center}>
            Cargando productos...
          </p>

        ) : productosFiltrados.length === 0 ? (

          <p style={styles.center}>
            No hay productos
          </p>

        ) : (

          <div style={styles.grid}>

            {productosFiltrados.map((p) => (

              <div
                key={p.id}
                style={styles.card}
              >

                <div style={styles.imageBox}>

                  <img

                    src={
                      p.imagen ||
                      "https://via.placeholder.com/300x300?text=ModaGest"
                    }

                    alt={p.nombre}

                    style={styles.image}

                  />

                </div>

                <div style={styles.cardBody}>

                  <h3 style={styles.productName}>
                    {p.nombre}
                  </h3>

                  <div style={styles.stars}>

                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />

                  </div>

                  <h2 style={styles.price}>

                    $

                    {Number(
                      p.precio
                    ).toLocaleString("es-CO")}

                  </h2>

                  <p style={styles.stock}>

                    Stock disponible:
                    {" "}
                    {p.stock}

                  </p>

                  <button

                    style={styles.cartBtn}

                    onClick={() =>
                      agregarAlCarrito(p)
                    }
                  >

                    <FaShoppingCart />

                    Agregar al carrito

                  </button>

                  <button

                    style={styles.buyBtn}

                    onClick={() => {

                      agregarAlCarrito(p);

                      navigate("/carrito");

                    }}
                  >

                    Comprar ahora

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </>

  );

}

export default HomePage;

/* ================= ESTILOS ================= */

const styles = {

  hero: {
    height: "80vh",

    backgroundImage:
      "url(https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600)",

    backgroundSize: "cover",
    backgroundPosition: "center",

    display: "flex",
    alignItems: "center",

    padding: "0 7%",

    position: "relative"
  },

  heroDark: {

    position: "absolute",

    inset: 0,

    background:
      "linear-gradient(to right, rgba(2,6,23,0.78), rgba(2,6,23,0.40), rgba(2,6,23,0.10))",

    zIndex: 1

  },

  overlay: {

    color: "#fff",

    maxWidth: "600px",

    zIndex: 2,

    position: "relative"

  },

  subtitle: {

    color: "#C084FC",

    letterSpacing: "3px",

    marginBottom: "20px",

    fontWeight: "bold"
  },

  heroTitle: {

    fontSize: "72px",

    fontWeight: "bold",

    lineHeight: "1.1",

    marginBottom: "20px",

    textShadow:
      "0 4px 14px rgba(0,0,0,0.75)"

  },

  heroText: {

    fontSize: "24px",

    marginBottom: "35px",

    color: "#F1F5F9",

    textShadow:
      "0 2px 10px rgba(0,0,0,0.70)"

  },

  heroBtn: {

    background:
      "linear-gradient(90deg,#7C3AED,#9333EA)",

    border: "none",

    padding: "18px 30px",

    borderRadius: "14px",

    color: "#fff",

    fontWeight: "bold",

    fontSize: "16px",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    gap: "10px"
  },

  benefits: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",

    gap: "20px",

    padding: "40px 7%",

    background: "#050816"
  },

  benefitCard: {

    background: "#0B1225",

    border: "1px solid #1E293B",

    padding: "25px",

    borderRadius: "18px",

    display: "flex",

    alignItems: "center",

    gap: "18px",

    color: "#9333EA"
  },

  toast: {

    position: "fixed",

    top: "90px",

    right: "20px",

    background:
      "linear-gradient(90deg,#7C3AED,#9333EA)",

    color: "#fff",

    padding: "14px 20px",

    borderRadius: "12px",

    zIndex: 9999
  },

  container: {

    padding: "70px 7%",

    background: "#020617",

    minHeight: "100vh"
  },

  productsHeader: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "40px",

    flexWrap: "wrap",

    gap: "20px"
  },

  title: {

    color: "#fff",

    fontSize: "52px",

    fontWeight: "bold"
  },

  searchBox: {

    display: "flex",

    alignItems: "center",

    background: "#0F172A",

    border: "1px solid #1E293B",

    borderRadius: "12px",

    padding: "12px 18px",

    minWidth: "300px",

    gap: "10px"
  },

  input: {

    background: "transparent",

    border: "none",

    outline: "none",

    color: "#fff",

    width: "100%"
  },

  center: {

    color: "#fff",

    textAlign: "center"
  },

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",

    gap: "30px"
  },

  card: {

    background:
      "linear-gradient(180deg,#221B5C,#1E1B4B)",

    borderRadius: "28px",

    overflow: "hidden",

    border:
      "1px solid rgba(255,255,255,0.08)",

    transition: "all 0.3s ease",

    cursor: "pointer",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.35)"
  },

  imageBox: {

    height: "260px",

    background:
      "linear-gradient(135deg,#2B236B,#312E81)",

    overflow: "hidden",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    padding: "20px"
  },

  image: {

    width: "100%",

    height: "100%",

    objectFit: "contain",

    transition: "0.3s ease"
  },

  cardBody: {

    padding: "24px",

    textAlign: "center"
  },

  productName: {

    color: "#fff",

    marginBottom: "12px",

    fontSize: "22px",

    fontWeight: "800"
  },

  stars: {

    color: "#FACC15",

    marginBottom: "15px"
  },

  price: {

    color: "#C084FC",

    marginBottom: "15px",

    fontSize: "28px",

    fontWeight: "bold"
  },

  stock: {

    color: "#4ADE80",

    marginBottom: "20px",

    fontSize: "14px"
  },

  cartBtn: {

    width: "100%",

    padding: "14px",

    borderRadius: "12px",

    border: "none",

    background:
      "linear-gradient(90deg,#7C3AED,#9333EA)",

    color: "#fff",

    fontWeight: "bold",

    cursor: "pointer",

    marginBottom: "10px",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "10px"
  },

  buyBtn: {

    width: "100%",

    padding: "14px",

    borderRadius: "12px",

    border: "1px solid #7C3AED",

    background: "transparent",

    color: "#fff",

    fontWeight: "bold",

    cursor: "pointer"
  }

};