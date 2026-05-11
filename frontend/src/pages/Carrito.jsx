import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Carrito() {

  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);

  /* ================= PASARELA ================= */

  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [procesando, setProcesando] = useState(false);

  /* ================= CARGAR CARRITO ================= */

  useEffect(() => {

    try {

      const data =
        JSON.parse(localStorage.getItem("carrito")) || [];

      setCarrito(data);

    } catch {

      setCarrito([]);

    } finally {

      setCargando(false);

    }

  }, []);

  /* ================= FORMATO MONEDA ================= */

  const formatoMoneda = (valor) => {

    return Number(valor).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    });

  };

  /* ================= TOTAL ================= */

  const total = carrito.reduce((acc, p) => {

    return (
      acc +
      Number(p.precio) * Number(p.cantidad)
    );

  }, 0);

  /* ================= GUARDAR ================= */

  const guardarCarrito = (nuevo) => {

    localStorage.setItem(
      "carrito",
      JSON.stringify(nuevo)
    );

    setCarrito([...nuevo]);

  };

  /* ================= ELIMINAR ================= */

  const eliminar = (id) => {

    const nuevo = carrito.filter(
      p => p.id !== id
    );

    guardarCarrito(nuevo);

  };

  /* ================= CAMBIAR CANTIDAD ================= */

  const cambiarCantidad = (
    id,
    nuevaCantidad
  ) => {

    const producto =
      carrito.find(p => p.id === id);

    if (!producto) return;

    if (nuevaCantidad < 1) return;

    if (
      producto.stock !== undefined &&
      nuevaCantidad > Number(producto.stock)
    ) {

      alert(
        `Solo hay ${producto.stock} unidades disponibles`
      );

      return;

    }

    const nuevo = carrito.map(p =>

      p.id === id
        ? {
            ...p,
            cantidad: nuevaCantidad
          }
        : p

    );

    guardarCarrito(nuevo);

  };

  /* ================= CORREGIR STOCK ================= */

  useEffect(() => {

    if (carrito.length === 0) return;

    const corregido = carrito.map(p => {

      if (
        p.stock !== undefined &&
        Number(p.cantidad) > Number(p.stock)
      ) {

        return {
          ...p,
          cantidad: Number(p.stock)
        };

      }

      return p;

    });

    if (
      JSON.stringify(corregido) !==
      JSON.stringify(carrito)
    ) {

      guardarCarrito(corregido);

    }

  }, [carrito]);

  /* ================= ABRIR PASARELA ================= */

  const abrirPago = () => {

    const token =
      localStorage.getItem("token");

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

  /* ================= CONFIRMAR PAGO ================= */

  const confirmarPago = async () => {

    if (!metodoPago) {

      alert(
        "Selecciona un método de pago"
      );

      return;

    }

    try {

      setProcesando(true);

      /* ================= SIMULACION ================= */

      await new Promise(resolve =>
        setTimeout(resolve, 3500)
      );

      alert(
        `Pago aprobado con ${metodoPago} ✅`
      );

      localStorage.removeItem("carrito");

      setCarrito([]);

      setMostrarPago(false);

      navigate("/cliente/compras");

    } catch (error) {

      console.error(error);

      alert(
        "Error al procesar el pago"
      );

    } finally {

      setProcesando(false);

    }

  };

  /* ================= CARGANDO ================= */

  if (cargando) {

    return (
      <p style={{ padding: "30px" }}>
        Cargando carrito...
      </p>
    );

  }

  /* ================= UI ================= */

  return (

    <div style={styles.container}>

      <h2 style={styles.title}>
        🛒 Carrito de Compras
      </h2>

      {carrito.length === 0 ? (

        <div style={styles.empty}>

          <p>
            No hay productos en el carrito
          </p>

          <button
            style={styles.shopBtn}
            onClick={() => navigate("/")}
          >
            Ir a la tienda
          </button>

        </div>

      ) : (

        <>

          {carrito.map(p => (

            <div
              key={p.id}
              style={styles.card}
            >

              <img
                src={
                  p.imagen ||
                  "https://via.placeholder.com/100"
                }
                alt={p.nombre}
                style={styles.img}
              />

              <div style={{ flex: 1 }}>

                <h4>{p.nombre}</h4>

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
                    -
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

                <p>
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
                ❌
              </button>

            </div>

          ))}

          <h3 style={styles.total}>
            Total: {formatoMoneda(total)}
          </h3>

          <button
            style={styles.buyBtn}
            onClick={abrirPago}
          >
            Finalizar Compra
          </button>

        </>

      )}

      {/* ================= MODAL PASARELA ================= */}

      {mostrarPago && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <h2>
              💳 Método de Pago
            </h2>

            <p style={styles.modalTotal}>
              Total:
              {" "}
              {formatoMoneda(total)}
            </p>

            <div style={styles.metodos}>

              {/* ================= TARJETA ================= */}

              <label style={styles.option}>

                <input
                  type="radio"
                  name="pago"
                  value="Tarjeta"
                  onChange={(e) =>
                    setMetodoPago(e.target.value)
                  }
                />

                💳 Tarjeta Crédito/Débito

                {metodoPago === "Tarjeta" && (

                  <div style={styles.cardForm}>

                    <input
                      type="text"
                      placeholder="Número de tarjeta"
                      maxLength={16}
                      style={styles.input}
                    />

                    <input
                      type="text"
                      placeholder="Nombre del titular"
                      style={styles.input}
                    />

                    <div style={styles.row}>

                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        style={styles.input}
                      />

                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength={3}
                        style={styles.input}
                      />

                    </div>

                  </div>

                )}

              </label>

              {/* ================= PSE ================= */}

              <label style={styles.option}>

                <input
                  type="radio"
                  name="pago"
                  value="PSE"
                  onChange={(e) =>
                    setMetodoPago(e.target.value)
                  }
                />

                🏦 PSE

                {metodoPago === "PSE" && (

                  <div style={styles.cardForm}>

                    <select style={styles.input}>

                      <option>
                        Selecciona tu banco
                      </option>

                      <option>Bancolombia</option>
                      <option>Davivienda</option>
                      <option>BBVA</option>
                      <option>Banco de Bogotá</option>
                      <option>Nequi</option>

                    </select>

                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      style={styles.input}
                    />

                  </div>

                )}

              </label>

              {/* ================= NEQUI ================= */}

              <label style={styles.option}>

                <input
                  type="radio"
                  name="pago"
                  value="Nequi"
                  onChange={(e) =>
                    setMetodoPago(e.target.value)
                  }
                />

                📱 Nequi

                {metodoPago === "Nequi" && (

                  <div style={styles.cardForm}>

                    <input
                      type="text"
                      placeholder="Número Nequi"
                      maxLength={10}
                      style={styles.input}
                    />

                  </div>

                )}

              </label>

              {/* ================= CONTRA ENTREGA ================= */}

              <label style={styles.option}>

                <input
                  type="radio"
                  name="pago"
                  value="Contra Entrega"
                  onChange={(e) =>
                    setMetodoPago(e.target.value)
                  }
                />

                🚚 Contra Entrega

                {metodoPago === "Contra Entrega" && (

                  <div style={styles.cardForm}>

                    <input
                      type="text"
                      placeholder="Dirección de entrega"
                      style={styles.input}
                    />

                    <input
                      type="text"
                      placeholder="Ciudad"
                      style={styles.input}
                    />

                  </div>

                )}

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
                  opacity:
                    procesando ? 0.7 : 1
                }}
                onClick={confirmarPago}
                disabled={procesando}
              >

                {procesando
                  ? "Procesando pago..."
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
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  card: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
    padding: "15px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },

  img: {
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px"
  },

  stock: {
    fontSize: "12px",
    color: "#666"
  },

  controls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "10px 0"
  },

  btnQty: {
    padding: "5px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  qty: {
    fontWeight: "bold"
  },

  subtotal: {
    fontWeight: "bold"
  },

  deleteBtn: {
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
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold"
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },

  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "450px",
    maxWidth: "95%",
    maxHeight: "90vh",
    overflowY: "auto"
  },

  modalTotal: {
    marginBottom: "20px",
    fontWeight: "bold"
  },

  metodos: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  option: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    cursor: "pointer"
  },

  actions: {
    marginTop: "25px",
    display: "flex",
    gap: "10px"
  },

  cancelBtn: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  confirmBtn: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  cardForm: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box"
  },

  row: {
    display: "flex",
    gap: "10px"
  }

};