import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../services/api";

function Carrito() {

  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [procesando, setProcesando] = useState(false);

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  /* ===================================================== */
  /* ================= CARGAR CARRITO ==================== */
  /* ===================================================== */

  useEffect(() => {

    try {

      const data =
        JSON.parse(localStorage.getItem("carrito")) || [];

      setCarrito(
        Array.isArray(data) ? data : []
      );

    } catch {

      setCarrito([]);

    } finally {

      setCargando(false);

    }

  }, []);

  /* ===================================================== */
  /* ================= VALIDAR STOCK ===================== */
  /* ===================================================== */

  useEffect(() => {

    if (carrito.length === 0) return;

    const corregido = carrito.map((p) => {

      if (

        p.stock !== undefined &&
        Number(p.cantidad) > Number(p.stock)

      ) {

        return {
          ...p,
          cantidad: Number(p.stock)
        };

      }

      return {

        ...p,

        cantidad:
          Number(p.cantidad || 1) < 1
            ? 1
            : Number(p.cantidad || 1)

      };

    });

    if (
      JSON.stringify(corregido) !==
      JSON.stringify(carrito)
    ) {

      guardarCarrito(corregido);

    }

  }, [carrito]);

  /* ===================================================== */
  /* ================= FORMATO MONEDA ==================== */
  /* ===================================================== */

  const formatoMoneda = (valor) =>

    Number(valor || 0).toLocaleString(
      "es-CO",
      {
        style: "currency",
        currency: "COP"
      }
    );

  /* ===================================================== */
  /* ======================= TOTAL ======================= */
  /* ===================================================== */

  const total = carrito.reduce(

    (acc, p) =>

      acc +
      Number(p.precio || 0) *
        Number(p.cantidad || 0),

    0

  );

  /* ===================================================== */
  /* ================= GUARDAR CARRITO =================== */
  /* ===================================================== */

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

  /* ===================================================== */
  /* ================= ELIMINAR PRODUCTO ================= */
  /* ===================================================== */

  const eliminar = (id) => {

    const nuevo = carrito.filter(
      (p) => p.id !== id
    );

    guardarCarrito(nuevo);

  };

  /* ===================================================== */
  /* ================= CAMBIAR CANTIDAD ================== */
  /* ===================================================== */

  const cambiarCantidad = (
    id,
    nuevaCantidad
  ) => {

    const cantidad =
      Number(nuevaCantidad);

    if (cantidad < 1) return;

    const producto = carrito.find(
      (p) => p.id === id
    );

    if (!producto) return;

    if (

      producto.stock !== undefined &&
      cantidad > Number(producto.stock)

    ) {

      alert(
        `Solo hay ${producto.stock} unidades disponibles`
      );

      return;

    }

    const nuevo = carrito.map((p) =>

      p.id === id
        ? { ...p, cantidad }
        : p

    );

    guardarCarrito(nuevo);

  };

  /* ===================================================== */
  /* ==================== ABRIR PAGO ===================== */
  /* ===================================================== */

  const abrirPago = () => {

    if (!token) {

      alert(
        "Debes iniciar sesión para comprar"
      );

      navigate("/login");

      return;

    }

    if (carrito.length === 0) {

      alert("El carrito está vacío");

      return;

    }

    setMostrarPago(true);

  };

  /* ===================================================== */
  /* ================= CONFIRMAR COMPRA ================== */
  /* ===================================================== */

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

            cantidad: Number(
              producto.cantidad
            ),

            metodoPago

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

      alert(

        error.response?.data?.message ||

          "Error al procesar la compra"

      );

    } finally {

      setProcesando(false);

    }

  };

  /* ===================================================== */
  /* ===================== IR TIENDA ===================== */
  /* ===================================================== */

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

    }

  };

  /* ===================================================== */
  /* ======================= LOADING ===================== */
  /* ===================================================== */

  if (cargando) {

    return (

      <div style={styles.loadingContainer}>

        <p style={styles.loadingText}>
          Cargando carrito...
        </p>

      </div>

    );

  }

  /* ===================================================== */
  /* ======================== RETURN ===================== */
  /* ===================================================== */

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

                    p.imagen

                      ? p.imagen.startsWith("http")

                        ? p.imagen

                        : `http://localhost:5000/uploads/${p.imagen}`

                      : "https://via.placeholder.com/120?text=Sin+Imagen"

                  }

                  alt={p.nombre}

                  style={styles.img}

                  onError={(e) => {

                    e.target.src =
                      "https://via.placeholder.com/120?text=Sin+Imagen";

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
                          p.cantidad - 1
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
                        p.cantidad >= p.stock

                      }

                      onClick={() =>

                        cambiarCantidad(
                          p.id,
                          p.cantidad + 1
                        )

                      }

                    >
                      +
                    </button>

                  </div>

                  <p style={styles.price}>

                    Precio:{" "}

                    {formatoMoneda(p.precio)}

                  </p>

                  <p style={styles.subtotal}>

                    Subtotal:{" "}

                    {formatoMoneda(

                      Number(p.precio) *
                        Number(p.cantidad)

                    )}

                  </p>

                </div>

                <button

                  style={styles.deleteBtn}

                  onClick={() =>
                    eliminar(p.id)
                  }

                >
                  ✕
                </button>

              </div>

            ))}

            <div style={styles.summary}>

              <h3 style={styles.total}>

                Total: {formatoMoneda(total)}

              </h3>

              <button

                style={{
                  ...styles.buyBtn,
                  opacity: procesando
                    ? 0.7
                    : 1
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

      {/* ================= MODAL PAGO ================= */}

      {mostrarPago && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <h2 style={styles.modalTitle}>
              💳 Método de Pago
            </h2>

            <p style={styles.modalTotal}>

              Total: {formatoMoneda(total)}

            </p>

            <div style={styles.metodos}>

              {[
                "Tarjeta",
                "PSE",
                "Nequi",
                "Contra Entrega"
              ].map((m) => (

                <label
                  key={m}
                  style={styles.option}
                >

                  <input

                    type="radio"

                    value={m}

                    checked={
                      metodoPago === m
                    }

                    onChange={(e) =>

                      setMetodoPago(
                        e.target.value
                      )

                    }

                  />

                  {m}

                </label>

              ))}

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
                  opacity: procesando
                    ? 0.7
                    : 1
                }}

                onClick={confirmarPago}

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

/* ===================================================== */
/* ======================== ESTILOS ==================== */
/* ===================================================== */

const styles = {

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(135deg,#0f172a,#111827,#1e293b)",

    padding: "40px 20px",

    color: "#fff"

  },

  container: {

    maxWidth: "1100px",

    margin: "0 auto"

  },

  title: {

    fontSize: "38px",

    fontWeight: "800",

    marginBottom: "30px",

    textAlign: "center"

  },

  card: {

    display: "flex",

    alignItems: "center",

    gap: "20px",

    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "24px",

    padding: "20px",

    marginBottom: "20px",

    backdropFilter: "blur(12px)",

    position: "relative"

  },

  img: {

    width: "120px",

    height: "120px",

    objectFit: "cover",

    borderRadius: "18px",

    border:
      "2px solid rgba(255,255,255,0.1)",

    flexShrink: 0

  },

  info: {

    flex: 1

  },

  productName: {

    fontSize: "24px",

    fontWeight: "700",

    marginBottom: "10px"

  },

  stock: {

    color: "#cbd5e1",

    marginBottom: "10px"

  },

  controls: {

    display: "flex",

    alignItems: "center",

    gap: "14px",

    marginBottom: "12px"

  },

  btnQty: {

    width: "38px",

    height: "38px",

    borderRadius: "12px",

    border: "none",

    cursor: "pointer",

    fontSize: "22px",

    fontWeight: "700",

    background: "#7c3aed",

    color: "#fff"

  },

  qty: {

    fontSize: "18px",

    fontWeight: "700"

  },

  price: {

    color: "#10b981",

    fontWeight: "700",

    marginBottom: "6px"

  },

  subtotal: {

    color: "#fff",

    fontWeight: "700"

  },

  deleteBtn: {

    position: "absolute",

    top: "18px",

    right: "18px",

    background: "#dc2626",

    color: "#fff",

    border: "none",

    borderRadius: "12px",

    width: "38px",

    height: "38px",

    cursor: "pointer",

    fontSize: "18px",

    fontWeight: "700"

  },

  summary: {

    marginTop: "30px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    background:
      "rgba(255,255,255,0.05)",

    padding: "24px",

    borderRadius: "24px"

  },

  total: {

    fontSize: "30px",

    fontWeight: "800"

  },

  buyBtn: {

    background:
      "linear-gradient(135deg,#10b981,#059669)",

    color: "#fff",

    border: "none",

    padding: "18px 28px",

    borderRadius: "18px",

    cursor: "pointer",

    fontSize: "16px",

    fontWeight: "700"

  },

  empty: {

    textAlign: "center",

    padding: "80px 20px",

    background:
      "rgba(255,255,255,0.05)",

    borderRadius: "28px"

  },

  emptyText: {

    color: "#cbd5e1",

    marginTop: "10px",

    marginBottom: "30px"

  },

  shopBtn: {

    background:
      "linear-gradient(135deg,#7c3aed,#9333ea)",

    border: "none",

    padding: "16px 24px",

    borderRadius: "18px",

    color: "#fff",

    fontWeight: "700",

    cursor: "pointer"

  },

  overlay: {

    position: "fixed",

    inset: 0,

    background:
      "rgba(0,0,0,0.7)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    zIndex: 999

  },

  modal: {

    width: "420px",

    background: "#0f172a",

    padding: "30px",

    borderRadius: "24px",

    border:
      "1px solid rgba(255,255,255,0.08)"

  },

  modalTitle: {

    fontSize: "28px",

    fontWeight: "800",

    marginBottom: "20px"

  },

  modalTotal: {

    fontSize: "22px",

    fontWeight: "700",

    marginBottom: "25px",

    color: "#10b981"

  },

  metodos: {

    display: "flex",

    flexDirection: "column",

    gap: "14px",

    marginBottom: "30px"

  },

  option: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    fontSize: "16px"

  },

  actions: {

    display: "flex",

    justifyContent: "space-between",

    gap: "14px"

  },

  cancelBtn: {

    flex: 1,

    padding: "14px",

    borderRadius: "16px",

    border: "none",

    background: "#475569",

    color: "#fff",

    cursor: "pointer",

    fontWeight: "700"

  },

  confirmBtn: {

    flex: 1,

    padding: "14px",

    borderRadius: "16px",

    border: "none",

    background:
      "linear-gradient(135deg,#10b981,#059669)",

    color: "#fff",

    cursor: "pointer",

    fontWeight: "700"

  },

  loadingContainer: {

    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    background: "#020617"

  },

  loadingText: {

    color: "#fff",

    fontSize: "22px",

    fontWeight: "700"

  }

};