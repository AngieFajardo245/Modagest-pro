import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ProductosCliente() {

  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);

  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= FILTROS ================= */

  const [busqueda, setBusqueda] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [soloStock, setSoloStock] = useState(false);
  const [orden, setOrden] = useState("");

  /* ================= FORMATO ================= */

  const formatear = (valor) => {
    return new Intl.NumberFormat("es-CO").format(valor);
  };

  /* ================= CARGAR ================= */

  const obtenerProductos = async () => {

    try {

      setLoading(true);

      const res = await api.get("/productos");

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setProductos(data);
      setFiltrados(data);

      const inicial = {};

      data.forEach((p) => {
        inicial[p.id] = 1;
      });

      setCantidades(inicial);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  /* ================= FILTRAR ================= */

  useEffect(() => {

    let data = [...productos];

    if (busqueda) {

      data = data.filter((p) =>
        p.nombre
          .toLowerCase()
          .includes(busqueda.toLowerCase())
      );

    }

    if (precioMax) {

      data = data.filter(
        (p) => p.precio <= Number(precioMax)
      );

    }

    if (soloStock) {

      data = data.filter((p) => p.stock > 0);

    }

    if (orden === "precio-asc") {

      data.sort((a, b) => a.precio - b.precio);

    }

    if (orden === "precio-desc") {

      data.sort((a, b) => b.precio - a.precio);

    }

    setFiltrados(data);

  }, [
    busqueda,
    precioMax,
    soloStock,
    orden,
    productos
  ]);

  /* ================= CANTIDAD ================= */

  const aumentar = (id, stock) => {

    if (cantidades[id] < stock) {

      setCantidades({
        ...cantidades,
        [id]: cantidades[id] + 1
      });

    }

  };

  const disminuir = (id) => {

    if (cantidades[id] > 1) {

      setCantidades({
        ...cantidades,
        [id]: cantidades[id] - 1
      });

    }

  };

  /* ================= CARRITO ================= */
const agregarAlCarrito = (producto) => {

  const token = localStorage.getItem("token");

  if (!token) {

    alert("Debes iniciar sesión");

    navigate("/login");

    return;

  }

  const carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];

  const cantidadAgregar =
    cantidades[producto.id] || 1;

  const existe = carrito.find(
    (p) => p.id === producto.id
  );

  if (existe) {

    const nuevaCantidad =
      existe.cantidad + cantidadAgregar;

    if (nuevaCantidad > producto.stock) {

      alert(
        `Solo hay ${producto.stock} unidades disponibles`
      );

      return;

    }

    existe.cantidad = nuevaCantidad;

  } else {

    carrito.push({

      ...producto,

      cantidad: cantidadAgregar

    });

  }

  localStorage.setItem(
    "carrito",
    JSON.stringify(carrito)
  );

  window.dispatchEvent(
    new Event("carritoActualizado")
  );

  alert("Producto agregado al carrito 🛒");

};

  /* ================= LOADING ================= */

  if (loading) {

    return (

      <div style={styles.loadingContainer}>

        <div style={styles.loader}></div>

        <p style={styles.loadingText}>
          Cargando productos...
        </p>

      </div>

    );

  }

  /* ================= UI ================= */

  return (

    <div style={styles.container}>

      {/* HEADER */}

      <div style={styles.header}>

        <h1 style={styles.title}>
          🛍️ Tienda ModaGest
        </h1>

        <p style={styles.subtitle}>
          Descubre productos premium para tu estilo
        </p>

      </div>

      {/* FILTROS */}

      <div style={styles.filters}>

        <input
          type="text"
          placeholder="Buscar producto..."
          style={styles.input}
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Precio máximo"
          style={styles.input}
          value={precioMax}
          onChange={(e) =>
            setPrecioMax(e.target.value)
          }
        />

        <select
          style={styles.input}
          value={orden}
          onChange={(e) =>
            setOrden(e.target.value)
          }
        >
          <option value="">
            Ordenar
          </option>

          <option value="precio-asc">
            Menor precio
          </option>

          <option value="precio-desc">
            Mayor precio
          </option>

        </select>

        <label style={styles.stockLabel}>

          <input
            type="checkbox"
            checked={soloStock}
            onChange={(e) =>
              setSoloStock(e.target.checked)
            }
          />

          <span style={{ marginLeft: "8px" }}>
            Solo disponibles
          </span>

        </label>

      </div>

      {/* PRODUCTOS */}

      {filtrados.length === 0 ? (

        <div style={styles.empty}>

          <h3>No hay productos disponibles</h3>

        </div>

      ) : (

        <div style={styles.grid}>

          {filtrados.map((p) => {

            const cantidad =
              cantidades[p.id] || 1;

            const total =
              p.precio * cantidad;

            return (

              <div
                key={p.id}
                style={styles.card}
              >

                {/* STOCK */}

                <div
                  style={{
                    ...styles.stockBadge,
                    background:
                      p.stock > 0
                        ? "#22c55e"
                        : "#ef4444"
                  }}
                >
                  {p.stock > 0
                    ? "Disponible"
                    : "Agotado"}
                </div>

                {/* IMAGEN */}

                <div style={styles.imageBox}>

                  <img
                    src={
                      p.imagen ||
                      "https://via.placeholder.com/300x200"
                    }
                    alt={p.nombre}
                    style={styles.image}
                  />

                </div>

                {/* BODY */}

                <div style={styles.body}>

                  <h3 style={styles.productName}>
                    {p.nombre}
                  </h3>

                  <p style={styles.description}>
                    {p.descripcion}
                  </p>

                  <h2 style={styles.price}>
                    ${formatear(p.precio)}
                  </h2>

                  <p style={styles.stock}>
                    Stock disponible: {p.stock}
                  </p>

                  {/* CONTADOR */}

                  <div style={styles.counter}>

                    <button
                      style={styles.counterBtn}
                      onClick={() =>
                        disminuir(p.id)
                      }
                    >
                      -
                    </button>

                    <span style={styles.counterValue}>
                      {cantidad}
                    </span>

                    <button
                      style={styles.counterBtn}
                      onClick={() =>
                        aumentar(
                          p.id,
                          p.stock
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <h4 style={styles.total}>
                    Total:
                    {" "}
                    ${formatear(total)}
                  </h4>

                  {/* BOTON */}

                  <button
                    style={styles.button}
                    onClick={() =>
                      agregarAlCarrito(p)
                    }
                  >
                    🛒 Agregar al carrito
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

export default ProductosCliente;

/* ================= ESTILOS ================= */

const styles = {

  container: {
    minHeight: "100vh",
    padding: "35px",
    background:
      "linear-gradient(135deg, #0f172a, #1e1b4b, #312e81)",
    color: "white"
  },

  header: {
    marginBottom: "35px"
  },

  title: {
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "10px"
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: "17px"
  },

  /* FILTROS */

  filters: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "15px",
    marginBottom: "35px"
  },

  input: {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
    backdropFilter: "blur(12px)"
  },

  stockLabel: {
    display: "flex",
    alignItems: "center",
    color: "#e2e8f0"
  },

  /* GRID */

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "28px"
  },

  /* CARD */

  card: {
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    overflow: "hidden",
    backdropFilter: "blur(16px)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.35)",
    transition: "0.3s",
    position: "relative"
  },

  stockBadge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "white",
    zIndex: 10
  },

  imageBox: {
    height: "260px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg,#1e1b4b,#312e81)",
    padding: "20px"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain"
  },

  body: {
    padding: "24px",
    textAlign: "center"
  },

  productName: {
    fontSize: "24px",
    marginBottom: "10px"
  },

  description: {
    color: "#cbd5e1",
    minHeight: "50px"
  },

  price: {
    color: "#a855f7",
    marginTop: "18px",
    fontSize: "30px",
    fontWeight: "700"
  },

  stock: {
    color: "#94a3b8",
    marginBottom: "20px"
  },

  /* CONTADOR */

  counter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "18px",
    marginBottom: "20px"
  },

  counterBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    border: "none",
    background:
      "linear-gradient(135deg,#7c3aed,#4f46e5)",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  counterValue: {
    fontSize: "20px",
    fontWeight: "700"
  },

  total: {
    marginBottom: "20px",
    color: "#22c55e"
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg,#7c3aed,#4f46e5)",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "0.3s"
  },

  /* EMPTY */

  empty: {
    textAlign: "center",
    padding: "60px"
  },

  /* LOADING */

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,#0f172a,#1e1b4b)"
  },

  loader: {
    width: "60px",
    height: "60px",
    border:
      "5px solid rgba(255,255,255,0.2)",
    borderTop:
      "5px solid #8b5cf6",
    borderRadius: "50%",
    animation:
      "spin 1s linear infinite"
  },

  loadingText: {
    marginTop: "20px",
    color: "white",
    fontSize: "18px"
  }

};