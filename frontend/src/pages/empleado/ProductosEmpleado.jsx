import { useEffect, useState } from "react";
import api from "../../services/api";

function ProductosEmpleado() {

  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= OBTENER ================= */

  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/productos");
      const data = Array.isArray(res.data) ? res.data : [];
      setProductos(data);

      // inicializar cantidades
      const inicial = {};
      data.forEach(p => inicial[p.id] = 1);
      setCantidades(inicial);

    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  /* ================= CANTIDAD ================= */

  const aumentar = (id) => {
    setCantidades({
      ...cantidades,
      [id]: cantidades[id] + 1
    });
  };

  const disminuir = (id) => {
    if (cantidades[id] > 1) {
      setCantidades({
        ...cantidades,
        [id]: cantidades[id] - 1
      });
    }
  };

  /* ================= VENDER ================= */

  const venderProducto = async (producto) => {

    const cantidad = cantidades[producto.id];

    if (!cantidad || cantidad <= 0) {
      alert("Cantidad inválida");
      return;
    }

    try {

      await api.post("/empleado/vender", {
        productoId: producto.id,
        cantidad
      });

      alert("Venta realizada correctamente ✅");

      obtenerProductos();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "No se pudo registrar la venta"
      );
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <p style={{ padding: "30px" }}>Cargando productos...</p>;
  }

  return (

    <div style={styles.container}>

      <h2 style={styles.title}>🧾 Registrar Venta</h2>

      {productos.length === 0 ? (

        <p>No hay productos disponibles</p>

      ) : (

        <div style={styles.grid}>

          {productos.map((p) => {

            const cantidad = cantidades[p.id] || 1;
            const total = p.precio * cantidad;

            return (

              <div key={p.id} style={styles.card}>

                {p.imagen && (
                  <img src={p.imagen} style={styles.imagen} />
                )}

                <div style={styles.body}>

                  <h4>{p.nombre}</h4>

                  <p><strong>Precio:</strong> ${p.precio}</p>
                  <p><strong>Stock:</strong> {p.stock}</p>

                  {/* CONTADOR */}
                  <div style={styles.counter}>

                    <button onClick={() => disminuir(p.id)}>-</button>

                    <span>{cantidad}</span>

                    <button onClick={() => aumentar(p.id)}>+</button>

                  </div>

                  {/* TOTAL */}
                  <p style={styles.total}>
                    Total: ${total}
                  </p>

                  {/* BOTÓN */}
                  <button
                    style={styles.boton}
                    disabled={p.stock <= 0}
                    onClick={() => venderProducto(p)}
                  >
                    Vender
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
    padding: "30px",
    background: "#f5f7fb",
    minHeight: "100vh"
  },

  title: {
    marginBottom: "25px",
    fontSize: "26px",
    fontWeight: "bold"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#fff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    transition: "0.2s"
  },

  imagen: {
    width: "100%",
    height: "180px",
    objectFit: "cover"
  },

  body: {
    padding: "15px"
  },

  counter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    margin: "10px 0"
  },

  total: {
    fontWeight: "bold",
    color: "#198754"
  },

  boton: {
    width: "100%",
    background: "#198754",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer"
  }

};