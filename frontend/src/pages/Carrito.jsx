import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../services/api";

function Carrito() {

  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);

  /* ================= PASARELA ================= */

  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [procesando, setProcesando] = useState(false);

  /* ================= VALIDAR SI HAY SESIÓN ================= */

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  /* ================= CARGAR CARRITO ================= */

  useEffect(() => {

    try {

      const data =
        JSON.parse(localStorage.getItem("carrito")) || [];

      setCarrito(Array.isArray(data) ? data : []);

    } catch {

      setCarrito([]);

    } finally {

      setCargando(false);

    }

  }, []);

  /* ================= VALIDAR STOCK ================= */

  useEffect(() => {

    if (carrito.length === 0) return;

    let cambios = false;

    const corregido = carrito
      .filter((p) => p && p.id)
      .map((p) => {

        const stock = Number(p.stock || 0);
        const cantidad = Number(p.cantidad || 1);

        if (
          stock > 0 &&
          cantidad > stock
        ) {

          cambios = true;

          return {
            ...p,
            cantidad: stock
          };

        }

        return {
          ...p,
          cantidad:
            cantidad < 1 ? 1 : cantidad
        };

      });

    if (cambios) {

      guardarCarrito(corregido);

    }

  }, []);

  /* ================= FORMATO MONEDA ================= */

  const formatoMoneda = (valor) => {

    return Number(valor || 0).toLocaleString(
      "es-CO",
      {
        style: "currency",
        currency: "COP"
      }
    );

  };

  /* ================= TOTAL ================= */

  const total = carrito.reduce((acc, p) => {

    return (
      acc +
      Number(p.precio || 0) *
      Number(p.cantidad || 0)
    );

  }, 0);

  /* ================= GUARDAR CARRITO ================= */

  const guardarCarrito = (nuevo) => {

    localStorage.setItem(
      "carrito",
      JSON.stringify(nuevo)
    );

    setCarrito([...nuevo]);

    window.dispatchEvent(
      new Event("carritoActualizado")
    );

  };

  /* ================= ELIMINAR ================= */

  const eliminar = (id) => {

    const nuevo = carrito.filter(
      (p) => p.id !== id
    );

    guardarCarrito(nuevo);

  };

  /* ================= CAMBIAR CANTIDAD ================= */

  const cambiarCantidad = (
    id,
    nuevaCantidad
  ) => {

    const producto =
      carrito.find((p) => p.id === id);

    if (!producto) return;

    const cantidadNumero =
      Number(nuevaCantidad);

    if (cantidadNumero < 1) return;

    if (
      producto.stock !== undefined &&
      cantidadNumero > Number(producto.stock)
    ) {

      alert(
        `Solo hay ${producto.stock} unidades disponibles`
      );

      return;

    }

    const nuevo = carrito.map((p) =>

      p.id === id
        ? {
            ...p,
            cantidad: cantidadNumero
          }
        : p

    );

    guardarCarrito(nuevo);

  };

  /* ================= ABRIR PASARELA ================= */

  const abrirPago = () => {

    if (!token) {

      alert(
        "Debes iniciar sesión para comprar"
      );

      navigate("/login");

      return;

    }

    if (carrito.length === 0) {

      alert(
        "El carrito está vacío"
      );

      return;

    }

    setMostrarPago(true);

  };

  /* ================= CONFIRMAR COMPRA ================= */

  const confirmarPago = async () => {

    if (!metodoPago) {

      alert(
        "Selecciona un método de pago"
      );

      return;

    }

    if (procesando) return;

    try {

      setProcesando(true);

      for (const producto of carrito) {

        await api.post(
          "/cliente/comprar",
          {
            productoId: producto.id,
            cantidad: Number(producto.cantidad)
          }
        );

      }

      alert(
        `Pago aprobado con ${metodoPago} ✅`
      );

      localStorage.removeItem("carrito");

      setCarrito([]);

      setMostrarPago(false);

      setMetodoPago("");

      window.dispatchEvent(
        new Event("carritoActualizado")
      );

      navigate("/cliente/compras");

    } catch (error) {

      console.error(error);

      const mensaje =
        error.response?.data?.message ||
        "Error al procesar la compra";

      alert(mensaje);

    } finally {

      setProcesando(false);

    }

  };

  /* ================= IR A TIENDA ================= */

  const irATienda = () => {

    if (!token) {

      navigate("/");

      return;

    }

    switch (rol?.toLowerCase()) {

      case "cliente":

        navigate("/cliente/productos");
        break;

      case "administrador":

        navigate("/admin/productos");
        break;

      case "empleado":

        navigate("/empleado/productos");
        break;

      default:

        navigate("/");
        break;

    }

  };

  /* ================= CARGANDO ================= */

  if (cargando) {

    return (

      <div style={styles.loadingContainer}>

        <p style={styles.loadingText}>
          Cargando carrito...
        </p>

      </div>

    );

  }

  /* ================= UI ================= */

  return (

    <div style={styles.page}>

      <div style={styles.container}>

        <h2 style={styles.title}>
          🛒 Carrito de Compras
        </h2>

        {carrito.length === 0 ? (

          <div style={styles.empty}>

            <h3>
              Tu carrito está vacío
            </h3>

            <p style={styles.emptyText}>
              Agrega productos para comenzar tu compra.
            </p>

            <button
              style={styles.shopBtn}
              onClick={irATienda}
            >
              Ir a la tienda
            </button>

          </div>

        ) : (

          <>

            {carrito.map((p) => (

              <div
                key={p.id}
                style={styles.card}
              >

                <img
                  src={
                    p.imagen ||
                    "https://via.placeholder.com/120"
                  }
                  alt={p.nombre}
                  style={styles.img}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/120";
                  }}
                />

                <div style={styles.info}>

                  <h3 style={styles.productName}>
                    {p.nombre}
                  </h3>

                  {p.stock !== undefined && (

                    <p style={styles.stock}>
                      Stock disponible: {p.stock}
                    </p>

                  )}

                  <div style={styles.controls}>

                    <button
                      style={styles.btnQty}
                      onClick={() =>
                        cambiarCantidad(
                          p.id,
                          Number(p.cantidad) - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span style={styles.qty}>
                      {p.cantidad}
                    </span>

                    <button
                      style={styles.btnQty}
                      disabled={
                        p.stock !== undefined &&
                        Number(p.cantidad) >=
                        Number(p.stock)
                      }
                      onClick={() =>
                        cambiarCantidad(
                          p.id,
                          Number(p.cantidad) + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <p style={styles.price}>
                    Precio:
                    {" "}
                    {formatoMoneda(p.precio)}
                  </p>

                  <p style={styles.subtotal}>
                    Subtotal:
                    {" "}
                    {formatoMoneda(
                      Number(p.precio) *
                      Number(p.cantidad)
                    )}
                  </p>

                </div>

                <button
                  style={styles.deleteBtn}
                  onClick={() => eliminar(p.id)}
                >
                  ✕
                </button>

              </div>

            ))}

            <div style={styles.summary}>

              <h3 style={styles.total}>
                Total:
                {" "}
                {formatoMoneda(total)}
              </h3>

              <button
                style={{
                  ...styles.buyBtn,
                  opacity: procesando ? 0.7 : 1
                }}
                onClick={abrirPago}
                disabled={procesando}
              >
                Finalizar Compra
              </button>

            </div>

          </>

        )}

      </div>

      {/* ================= MODAL ================= */}

      {mostrarPago && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <h2 style={styles.modalTitle}>
              💳 Método de Pago
            </h2>

            <p style={styles.modalTotal}>
              Total:
              {" "}
              {formatoMoneda(total)}
            </p>

            <div style={styles.metodos}>

              <label style={styles.option}>

                <input
                  type="radio"
                  name="pago"
                  value="Tarjeta"
                  checked={metodoPago === "Tarjeta"}
                  onChange={(e) =>
                    setMetodoPago(
                      e.target.value
                    )
                  }
                />

                💳 Tarjeta Crédito/Débito

              </label>

              <label style={styles.option}>

                <input
                  type="radio"
                  name="pago"
                  value="PSE"
                  checked={metodoPago === "PSE"}
                  onChange={(e) =>
                    setMetodoPago(
                      e.target.value
                    )
                  }
                />

                🏦 PSE

              </label>

              <label style={styles.option}>

                <input
                  type="radio"
                  name="pago"
                  value="Nequi"
                  checked={metodoPago === "Nequi"}
                  onChange={(e) =>
                    setMetodoPago(
                      e.target.value
                    )
                  }
                />

                📱 Nequi

              </label>

              <label style={styles.option}>

                <input
                  type="radio"
                  name="pago"
                  value="Contra Entrega"
                  checked={
                    metodoPago === "Contra Entrega"
                  }
                  onChange={(e) =>
                    setMetodoPago(
                      e.target.value
                    )
                  }
                />

                🚚 Contra Entrega

              </label>

            </div>

            <div style={styles.actions}>

              <button
                style={styles.cancelBtn}
                onClick={() =>
                  setMostrarPago(false)
                }
              >
                Cancelar
              </button>

              <button
                style={{
                  ...styles.confirmBtn,
                  opacity: procesando ? 0.7 : 1
                }}
                onClick={confirmarPago}
                disabled={procesando}
              >

                {procesando
                  ? "Procesando..."
                  : "Confirmar Pago"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default Carrito;

/* ================= ESTILOS ================= */

const styles = {

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(135deg, #0f172a, #1e293b)",

    padding: "40px 20px"

  },

  container: {

    maxWidth: "1000px",

    margin: "0 auto"

  },

  loadingContainer: {

    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    background:
      "linear-gradient(135deg, #0f172a, #1e293b)"

  },

  loadingText: {

    color: "#fff",

    fontSize: "18px"

  },

  title: {

    textAlign: "center",

    color: "#fff",

    marginBottom: "35px",

    fontSize: "38px",

    fontWeight: "700"

  },

  empty: {

    background:
      "rgba(255,255,255,0.06)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "24px",

    padding: "50px",

    textAlign: "center",

    color: "#fff",

    backdropFilter: "blur(10px)"

  },

  emptyText: {

    color: "#cbd5e1",

    marginTop: "10px"

  },

  shopBtn: {

    marginTop: "20px",

    padding: "14px 24px",

    border: "none",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg, #7c3aed, #9333ea)",

    color: "#fff",

    fontWeight: "600",

    cursor: "pointer"

  },

  card: {

    display: "flex",

    gap: "20px",

    alignItems: "center",

    background:
      "rgba(255,255,255,0.06)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "22px",

    padding: "20px",

    marginBottom: "20px",

    position: "relative",

    backdropFilter: "blur(10px)"

  },

  img: {

    width: "120px",

    height: "120px",

    objectFit: "cover",

    borderRadius: "16px"

  },

  info: {

    flex: 1,

    color: "#fff"

  },

  productName: {

    fontSize: "22px",

    marginBottom: "10px"

  },

  stock: {

    color: "#cbd5e1",

    marginBottom: "14px"

  },

  controls: {

    display: "flex",

    alignItems: "center",

    gap: "14px",

    marginBottom: "15px"

  },

  btnQty: {

    width: "36px",

    height: "36px",

    border: "none",

    borderRadius: "10px",

    background:
      "linear-gradient(135deg,#7c3aed,#9333ea)",

    color: "#fff",

    fontSize: "20px",

    cursor: "pointer"

  },

  qty: {

    color: "#fff",

    fontSize: "18px",

    fontWeight: "700"

  },

  price: {

    color: "#cbd5e1",

    marginBottom: "8px"

  },

  subtotal: {

    color: "#22c55e",

    fontWeight: "700"

  },

  deleteBtn: {

    position: "absolute",

    top: "15px",

    right: "15px",

    width: "35px",

    height: "35px",

    borderRadius: "50%",

    border: "none",

    background: "#ef4444",

    color: "#fff",

    cursor: "pointer",

    fontSize: "18px"

  },

  summary: {

    marginTop: "35px",

    background:
      "rgba(255,255,255,0.06)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "24px",

    padding: "30px",

    textAlign: "center"

  },

  total: {

    color: "#fff",

    fontSize: "32px",

    marginBottom: "20px"

  },

  buyBtn: {

    padding: "16px 28px",

    border: "none",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg,#22c55e,#16a34a)",

    color: "#fff",

    fontWeight: "700",

    fontSize: "16px",

    cursor: "pointer"

  },

  overlay: {

    position: "fixed",

    inset: 0,

    background: "rgba(0,0,0,0.6)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    zIndex: 999

  },

  modal: {

    width: "100%",

    maxWidth: "450px",

    background: "#111827",

    borderRadius: "24px",

    padding: "30px",

    color: "#fff"

  },

  modalTitle: {

    textAlign: "center",

    marginBottom: "15px"

  },

  modalTotal: {

    textAlign: "center",

    color: "#22c55e",

    fontWeight: "700",

    marginBottom: "25px"

  },

  metodos: {

    display: "flex",

    flexDirection: "column",

    gap: "15px"

  },

  option: {

    background:
      "rgba(255,255,255,0.05)",

    padding: "14px",

    borderRadius: "12px",

    display: "flex",

    gap: "10px",

    alignItems: "center",

    cursor: "pointer"

  },

  actions: {

    marginTop: "25px",

    display: "flex",

    justifyContent: "space-between",

    gap: "15px"

  },

  cancelBtn: {

    flex: 1,

    padding: "14px",

    border: "none",

    borderRadius: "12px",

    background: "#374151",

    color: "#fff",

    cursor: "pointer"

  },

  confirmBtn: {

    flex: 1,

    padding: "14px",

    border: "none",

    borderRadius: "12px",

    background:
      "linear-gradient(135deg,#7c3aed,#9333ea)",

    color: "#fff",

    cursor: "pointer",

    fontWeight: "700"

  }

};