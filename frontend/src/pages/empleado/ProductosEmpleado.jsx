import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  FaCashRegister,
  FaBoxes,
  FaPlus,
  FaMinus
} from "react-icons/fa";

function ProductosEmpleado() {

  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= OBTENER ================= */

  const obtenerProductos = async () => {

    try {

      setLoading(true);

      const res = await api.get("/productos");

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setProductos(data);

      const inicial = {};

      data.forEach((p) => {

        inicial[p.id] = 1;

      });

      setCantidades(inicial);

    } catch (error) {

      console.error(
        "Error al obtener productos:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    obtenerProductos();

  }, []);

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

  /* ================= FORMATO ================= */

  const formatear = (valor) => {

    return new Intl.NumberFormat(
      "es-CO"
    ).format(valor);

  };

  /* ================= VENDER ================= */

  const venderProducto = async (producto) => {

    const cantidad =
      cantidades[producto.id];

    if (!cantidad || cantidad <= 0) {

      alert("Cantidad inválida");

      return;

    }

    try {

      await api.post(
        "/empleado/vender",
        {

          productoId: producto.id,

          cantidad

        }
      );

      alert(
        "Venta realizada correctamente ✅"
      );

      obtenerProductos();

    } catch (error) {

      alert(

        error.response?.data?.message ||

        "No se pudo registrar la venta"

      );

    }

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

      {/* ================= HEADER ================= */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            🧾 Registrar Venta
          </h1>

          <p style={styles.subtitle}>
            Gestiona ventas de productos
            fácilmente
          </p>

        </div>

        <div style={styles.badge}>

          <FaCashRegister />

          Área Comercial

        </div>

      </div>

      {/* ================= GRID ================= */}

      {productos.length === 0 ? (

        <div style={styles.empty}>

          <FaBoxes size={60} />

          <h3>
            No hay productos disponibles
          </h3>

        </div>

      ) : (

        <div style={styles.grid}>

          {productos.map((p) => {

            const cantidad =
              cantidades[p.id] || 1;

            const total =
              p.precio * cantidad;

            return (

              <div
                key={p.id}
                style={styles.card}
              >

                {/* IMAGEN */}

                <div style={styles.imageBox}>

                  <img
                    src={
                      p.imagen ||
                      "https://via.placeholder.com/300x250"
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

                  <div style={styles.infoBox}>

                    <p style={styles.info}>
                      💰 $
                      {formatear(p.precio)}
                    </p>

                    <p style={styles.stock}>
                      📦 Stock: {p.stock}
                    </p>

                  </div>

                  {/* CONTADOR */}

                  <div style={styles.counter}>

                    <button
                      style={styles.counterBtn}
                      onClick={() =>
                        disminuir(p.id)
                      }
                    >
                      <FaMinus />
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
                      <FaPlus />
                    </button>

                  </div>

                  {/* TOTAL */}

                  <div style={styles.totalBox}>

                    <span>
                      Total:
                    </span>

                    <h2 style={styles.total}>
                      $
                      {formatear(total)}
                    </h2>

                  </div>

                  {/* BOTÓN */}

                  <button
                    style={
                      p.stock <= 0
                        ? styles.disabledBtn
                        : styles.sellBtn
                    }
                    disabled={p.stock <= 0}
                    onClick={() =>
                      venderProducto(p)
                    }
                  >

                    {p.stock <= 0
                      ? "Sin stock"
                      : "💳 Registrar Venta"}

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

/* ================= ESTILOS ================= */

const styles = {

  container: {

    minHeight: "100vh",

    padding: "10px"

  },

  /* ================= HEADER ================= */

  header: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "20px",

    marginBottom: "35px"

  },

  title: {

    margin: 0,

    fontSize: "38px",

    color: "#fff",

    fontWeight: "700"

  },

  subtitle: {

    marginTop: "10px",

    color: "#cbd5e1"

  },

  badge: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    background:
      "rgba(255,255,255,0.06)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    padding: "14px 18px",

    borderRadius: "16px",

    color: "#fff",

    backdropFilter: "blur(14px)",

    fontWeight: "600"

  },

  /* ================= GRID ================= */

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",

    gap: "28px"

  },

  card: {

    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "28px",

    overflow: "hidden",

    backdropFilter: "blur(16px)",

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.28)",

    transition: "0.3s ease"

  },

  imageBox: {

    height: "250px",

    background:
      "rgba(255,255,255,0.03)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    padding: "18px"

  },

  image: {

    width: "100%",

    height: "100%",

    objectFit: "contain"

  },

  body: {

    padding: "24px"

  },

  productName: {

    color: "#fff",

    marginBottom: "10px",

    fontSize: "24px"

  },

  description: {

    color: "#cbd5e1",

    fontSize: "14px",

    minHeight: "40px"

  },

  infoBox: {

    marginTop: "20px",

    marginBottom: "20px"

  },

  info: {

    color: "#38bdf8",

    fontWeight: "700",

    marginBottom: "8px"

  },

  stock: {

    color: "#cbd5e1"

  },

  /* ================= CONTADOR ================= */

  counter: {

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "20px",

    marginBottom: "24px"

  },

  counterBtn: {

    width: "42px",

    height: "42px",

    borderRadius: "14px",

    border: "none",

    background:
      "linear-gradient(135deg, #7c3aed, #2563eb)",

    color: "#fff",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "14px"

  },

  counterValue: {

    color: "#fff",

    fontSize: "22px",

    fontWeight: "700"

  },

  /* ================= TOTAL ================= */

  totalBox: {

    background:
      "rgba(255,255,255,0.04)",

    border:
      "1px solid rgba(255,255,255,0.06)",

    padding: "18px",

    borderRadius: "18px",

    textAlign: "center",

    marginBottom: "22px",

    color: "#cbd5e1"

  },

  total: {

    marginTop: "10px",

    color: "#22c55e",

    fontSize: "30px"

  },

  /* ================= BOTÓN ================= */

  sellBtn: {

    width: "100%",

    padding: "14px",

    borderRadius: "16px",

    border: "none",

    background:
      "linear-gradient(135deg, #7c3aed, #2563eb)",

    color: "#fff",

    fontSize: "16px",

    fontWeight: "600",

    cursor: "pointer",

    transition: "0.3s"

  },

  disabledBtn: {

    width: "100%",

    padding: "14px",

    borderRadius: "16px",

    border: "none",

    background: "#475569",

    color: "#cbd5e1",

    cursor: "not-allowed"

  },

  /* ================= EMPTY ================= */

  empty: {

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "20px",

    padding: "80px",

    background:
      "rgba(255,255,255,0.05)",

    borderRadius: "28px",

    color: "#fff"

  },

  /* ================= LOADING ================= */

  loadingContainer: {

    minHeight: "80vh",

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    alignItems: "center",

    gap: "20px"

  },

  loader: {

    width: "60px",

    height: "60px",

    border:
      "5px solid rgba(255,255,255,0.15)",

    borderTop:
      "5px solid #7c3aed",

    borderRadius: "50%",

    animation:
      "spin 1s linear infinite"

  },

  loadingText: {

    color: "#cbd5e1",

    fontSize: "18px"

  }

};