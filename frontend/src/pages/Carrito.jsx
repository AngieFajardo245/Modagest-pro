import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Carrito() {

  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);

  /* ================= CARGAR ================= */

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("carrito")) || [];
      setCarrito(data);
    } catch {
      setCarrito([]);
    } finally {
      setCargando(false);
    }
  }, []);

  /* ================= TOTAL ================= */

  const total = carrito.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  /* ================= GUARDAR ================= */

  const guardarCarrito = (nuevo) => {
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
    window.dispatchEvent(new Event("storage"));
  };

  /* ================= ELIMINAR ================= */

  const eliminar = (id) => {
    const nuevo = carrito.filter(p => p.id !== id);
    guardarCarrito(nuevo);
  };

  /* ================= CONTROL DE STOCK 🔥 ================= */

  const cambiarCantidad = (id, nuevaCantidad) => {

    const producto = carrito.find(p => p.id === id);
    if (!producto) return;

    // ❌ No menos de 1
    if (nuevaCantidad < 1) return;

    // ❌ No pasar stock
    if (producto.stock && nuevaCantidad > producto.stock) {
      alert(`Solo hay ${producto.stock} unidades disponibles`);
      return;
    }

    const nuevo = carrito.map(p =>
      p.id === id ? { ...p, cantidad: nuevaCantidad } : p
    );

    guardarCarrito(nuevo);
  };

  /* ================= CORRECCION AUTOMATICA 🔥 ================= */

  useEffect(() => {

    const corregido = carrito.map(p => {

      if (p.stock && p.cantidad > p.stock) {
        return { ...p, cantidad: p.stock };
      }

      return p;
    });

    if (JSON.stringify(corregido) !== JSON.stringify(carrito)) {
      guardarCarrito(corregido);
    }

  }, [carrito]);

  /* ================= COMPRAR ================= */

  const comprar = () => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión para comprar");
      navigate("/login");
      return;
    }

    alert("Compra simulada exitosa 🛍");

    localStorage.removeItem("carrito");
    setCarrito([]);

    navigate("/cliente/compras");
  };

  /* ================= UI ================= */

  if (cargando) {
    return <p style={{ padding: "30px" }}>Cargando carrito...</p>;
  }

  return (

    <div style={styles.container}>

      <h2 style={styles.title}>🛒 Carrito</h2>

      {carrito.length === 0 ? (

        <div style={styles.empty}>
          <p>No hay productos en el carrito</p>

          <button style={styles.shopBtn} onClick={() => navigate("/")}>
            Ir a la tienda
          </button>
        </div>

      ) : (

        <>
          {carrito.map(p => (

            <div key={p.id} style={styles.card}>

              <img
                src={p.imagen || "https://via.placeholder.com/100"}
                alt={p.nombre}
                style={styles.img}
              />

              <div style={{ flex: 1 }}>

                <h4>{p.nombre}</h4>

                {/* 🔥 STOCK INFO */}
                {p.stock !== undefined && (
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    Stock disponible: {p.stock}
                  </p>
                )}

                {/* CONTADOR */}
                <div style={styles.controls}>

                  <button
                    style={styles.btnQty}
                    onClick={() => cambiarCantidad(p.id, p.cantidad - 1)}
                  >
                    -
                  </button>

                  <span style={styles.qty}>{p.cantidad}</span>

                  <button
                    style={{
                      ...styles.btnQty,
                      opacity: (p.stock && p.cantidad >= p.stock) ? 0.5 : 1,
                      cursor: (p.stock && p.cantidad >= p.stock) ? "not-allowed" : "pointer"
                    }}
                    disabled={p.stock && p.cantidad >= p.stock}
                    onClick={() => cambiarCantidad(p.id, p.cantidad + 1)}
                  >
                    +
                  </button>

                </div>

                <p>Precio: ${p.precio}</p>

                <p style={styles.subtotal}>
                  Subtotal: ${p.precio * p.cantidad}
                </p>

              </div>

              <button
                style={styles.deleteBtn}
                onClick={() => eliminar(p.id)}
              >
                ❌
              </button>

            </div>

          ))}

          <h3 style={styles.total}>
            Total: ${total}
          </h3>

          <button style={styles.buyBtn} onClick={comprar}>
            Finalizar compra
          </button>
        </>

      )}

    </div>
  );
}

export default Carrito;

/* ================= ESTILOS ================= */

const styles = {

  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "auto"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  empty: {
    textAlign: "center"
  },

  shopBtn: {
    marginTop: "10px",
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
    padding: "15px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },

  img: {
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px"
  },

  controls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "10px 0"
  },

  btnQty: {
    padding: "5px 10px",
    border: "none",
    background: "#eee",
    borderRadius: "4px"
  },

  qty: {
    fontWeight: "bold"
  },

  subtotal: {
    fontWeight: "bold",
    color: "#28a745"
  },

  deleteBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  total: {
    textAlign: "right",
    marginTop: "20px"
  },

  buyBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "12px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px"
  }

};