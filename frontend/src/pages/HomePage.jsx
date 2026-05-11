import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PublicNavbar from "../components/PublicNavbar";
import api from "../services/api";
import {
  FaShoppingCart,
  FaShippingFast,
  FaTshirt,
  FaHeadset,
  FaStar,
  FaSearch
} from "react-icons/fa";

function HomePage() {

  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [mensaje, setMensaje] = useState("");

  /* ================= OBTENER PRODUCTOS ================= */

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await api.get("/productos");
        setProductos(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  /* ================= FILTROS ================= */

  const productosFiltrados = productos.filter(p => {

    const coincideNombre = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincidePrecio = precioMax
      ? p.precio <= Number(precioMax)
      : true;

    return coincideNombre && coincidePrecio;
  });

  /* ================= MENSAJE BONITO ================= */

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 2000);
  };

  /* ================= AGREGAR AL CARRITO  ================= */

  const agregarAlCarrito = (producto) => {

    // ❌ SIN STOCK
    if (producto.stock <= 0) {
      mostrarMensaje("Producto sin stock ❌");
      return;
    }

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existe = carrito.find(p => p.id === producto.id);

    if (existe) {

      // ❌ VALIDAR STOCK
      if (existe.cantidad >= producto.stock) {
        mostrarMensaje("No puedes agregar más de lo disponible ⚠️");
        return;
      }

      existe.cantidad += 1;

    } else {

      // IMPORTANTE: GUARDAR STOCK
      carrito.push({
        ...producto,
        cantidad: 1,
        stock: producto.stock
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("storage"));

    mostrarMensaje("Producto agregado 🛒");
  };

  return (
    <>
      <PublicNavbar />

      {/* ================= HERO ================= */}
      <section style={styles.hero}>
        <div style={styles.overlay}>
          <h1 style={styles.heroTitle}>ModaGest Pro</h1>
          <p style={styles.heroText}>
            Descubre estilo, calidad y tendencias
          </p>

          <button
            style={styles.heroBtn}
            onClick={() =>
              document
                .getElementById("productos")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explorar productos
          </button>
        </div>
      </section>

      {/* ================= MENSAJE ================= */}
      {mensaje && (
        <div style={styles.toast}>
          {mensaje}
        </div>
      )}

      {/* ================= PRODUCTOS ================= */}
      <section id="productos" style={styles.container}>

        <h2 style={styles.title}>Productos</h2>

        {/* FILTROS */}
        <div style={styles.filtros}>

          <div style={styles.searchBox}>
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={styles.input}
            />
          </div>

          <input
            type="number"
            placeholder="Precio máximo"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            style={styles.input}
          />

        </div>

        {loading ? (
          <p style={{ textAlign: "center" }}>Cargando...</p>
        ) : productosFiltrados.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            No hay productos
          </p>
        ) : (

          <div style={styles.grid}>

            {productosFiltrados.map((p) => (

              <div key={p.id} style={styles.card}>

                <div style={styles.imageBox}>
                  <img src={p.imagen} alt={p.nombre} style={styles.image} />
                </div>

                <div style={styles.cardBody}>

                  <h5>{p.nombre}</h5>

                  <div style={styles.stars}>
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>

                  <h4 style={styles.price}>
                    ${p.precio.toLocaleString()}
                  </h4>

                  {/* STOCK */}
                  <p style={{
                    color: p.stock > 0 ? "#28a745" : "#dc3545",
                    fontSize: "14px"
                  }}>
                    {p.stock > 0
                      ? `Stock: ${p.stock}`
                      : "Sin stock"}
                  </p>

                  <div style={styles.buttons}>

                    {/* AGREGAR */}
                    <button
                      style={{
                        ...styles.cartBtn,
                        opacity: p.stock === 0 ? 0.5 : 1,
                        cursor: p.stock === 0 ? "not-allowed" : "pointer"
                      }}
                      disabled={p.stock === 0}
                      onClick={() => agregarAlCarrito(p)}
                    >
                      🛒
                    </button>

                    {/* COMPRAR */}
                    <button
                      style={{
                        ...styles.buyBtn,
                        opacity: p.stock === 0 ? 0.5 : 1,
                        cursor: p.stock === 0 ? "not-allowed" : "pointer"
                      }}
                      disabled={p.stock === 0}
                      onClick={() => {
                        agregarAlCarrito(p);
                        navigate("/carrito");
                      }}
                    >
                      Comprar
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* ================= BENEFICIOS ================= */}
      <section style={styles.benefits}>
        <div style={styles.benefitCard}>
          <FaShippingFast size={40} />
          <h5>Envíos rápidos</h5>
          <p>Entrega segura</p>
        </div>

        <div style={styles.benefitCard}>
          <FaTshirt size={40} />
          <h5>Gran variedad</h5>
          <p>Moda para todos</p>
        </div>

        <div style={styles.benefitCard}>
          <FaHeadset size={40} />
          <h5>Soporte 24/7</h5>
          <p>Siempre contigo</p>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2026 ModaGest Pro</p>
      </footer>
    </>
  );
}

export default HomePage;

const styles = {

  hero: {
    height: "90vh",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1512436991641-6745cdb1723f)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  overlay: {
    background: "rgba(0,0,0,0.6)",
    padding: "50px",
    borderRadius: "12px",
    textAlign: "center",
    color: "white"
  },

  heroTitle: {
    fontSize: "50px",
    fontWeight: "bold"
  },

  heroText: {
    marginBottom: "20px"
  },

  heroBtn: {
    padding: "12px 25px",
    background: "#ff4d4d",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer"
  },

  toast: {
    position: "fixed",
    top: "80px",
    right: "20px",
    background: "#28a745",
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    zIndex: 999
  },

  container: {
    padding: "60px 40px",
    background: "#f5f7fb"
  },

  title: {
    textAlign: "center",
    marginBottom: "30px"
  },

  filtros: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "30px",
    flexWrap: "wrap"
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    padding: "8px",
    borderRadius: "6px",
    gap: "5px"
  },

  input: {
    border: "none",
    outline: "none",
    padding: "6px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "30px"
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },

  imageBox: {
    height: "220px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain"
  },

  cardBody: {
    padding: "20px",
    textAlign: "center"
  },

  stars: {
    color: "#ffc107"
  },

  price: {
    color: "#28a745"
  },

  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },

  cartBtn: {
    flex: 1,
    background: "#0d6efd",
    color: "white",
    border: "none",
    padding: "8px",
    cursor: "pointer"
  },

  buyBtn: {
    flex: 2,
    background: "#198754",
    color: "white",
    border: "none",
    padding: "8px",
    cursor: "pointer"
  },

  benefits: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    padding: "50px",
    background: "#fff"
  },

  benefitCard: {
    textAlign: "center"
  },

  footer: {
    background: "#111",
    color: "white",
    textAlign: "center",
    padding: "20px"
  }

};