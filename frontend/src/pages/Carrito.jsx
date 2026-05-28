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

  /* ================= CARGAR CARRITO ================= */
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("carrito")) || [];
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

    const corregido = carrito.map((p) => {
      if (
        p.stock !== undefined &&
        Number(p.cantidad) > Number(p.stock)
      ) {
        return { ...p, cantidad: Number(p.stock) };
      }

      return {
        ...p,
        cantidad: Number(p.cantidad || 1) < 1 ? 1 : Number(p.cantidad || 1),
      };
    });

    if (JSON.stringify(corregido) !== JSON.stringify(carrito)) {
      guardarCarrito(corregido);
    }
  }, [carrito]);

  /* ================= FORMATO MONEDA ================= */
  const formatoMoneda = (valor) =>
    Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });

  /* ================= TOTAL ================= */
  const total = carrito.reduce(
    (acc, p) => acc + Number(p.precio || 0) * Number(p.cantidad || 0),
    0
  );

  /* ================= GUARDAR ================= */
  const guardarCarrito = (nuevo) => {
    localStorage.setItem("carrito", JSON.stringify(nuevo));
    setCarrito([...nuevo]);
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  /* ================= ELIMINAR ================= */
  const eliminar = (id) => {
    const nuevo = carrito.filter((p) => p.id !== id);
    guardarCarrito(nuevo);
  };

  /* ================= CAMBIAR CANTIDAD ================= */
  const cambiarCantidad = (id, nuevaCantidad) => {
    const cantidad = Number(nuevaCantidad);
    if (cantidad < 1) return;

    const producto = carrito.find((p) => p.id === id);
    if (!producto) return;

    if (
      producto.stock !== undefined &&
      cantidad > Number(producto.stock)
    ) {
      alert(`Solo hay ${producto.stock} unidades disponibles`);
      return;
    }

    const nuevo = carrito.map((p) =>
      p.id === id ? { ...p, cantidad } : p
    );

    guardarCarrito(nuevo);
  };

  /* ================= ABRIR PAGO ================= */
  const abrirPago = () => {
    if (!token) {
      alert("Debes iniciar sesión para comprar");
      navigate("/login");
      return;
    }

    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    setMostrarPago(true);
  };

  /* ================= CONFIRMAR COMPRA ================= */
  const confirmarPago = async () => {
    if (!metodoPago) {
      alert("Selecciona un método de pago");
      return;
    }

    if (procesando) return;

    try {
      setProcesando(true);

      for (const producto of carrito) {
        await api.post("/cliente/comprar", {
          productoId: producto.id,
          cantidad: Number(producto.cantidad),
        });
      }

      alert(`Pago aprobado con ${metodoPago} ✅`);

      localStorage.removeItem("carrito");
      setCarrito([]);
      setMostrarPago(false);
      setMetodoPago("");

      window.dispatchEvent(new Event("carritoActualizado"));
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

  /* ================= IR A TIENDA ================= */
  const irATienda = () => {
    if (!token) return navigate("/");

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

  if (cargando) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>🛒 Carrito de Compras</h2>

        {carrito.length === 0 ? (
          <div style={styles.empty}>
            <h3>Tu carrito está vacío</h3>
            <p style={styles.emptyText}>
              Agrega productos para comenzar tu compra.
            </p>

            <button style={styles.shopBtn} onClick={irATienda}>
              Ir a la tienda
            </button>
          </div>
        ) : (
          <>
            {carrito.map((p) => (
              <div key={p.id} style={styles.card}>
                <img
                  src={p.imagen || "https://via.placeholder.com/120"}
                  alt={p.nombre}
                  style={styles.img}
                />

                <div style={styles.info}>
                  <h3 style={styles.productName}>{p.nombre}</h3>

                  {p.stock !== undefined && (
                    <p style={styles.stock}>
                      Stock disponible: {p.stock}
                    </p>
                  )}

                  <div style={styles.controls}>
                    <button
                      style={styles.btnQty}
                      onClick={() =>
                        cambiarCantidad(p.id, p.cantidad - 1)
                      }
                    >
                      −
                    </button>

                    <span style={styles.qty}>{p.cantidad}</span>

                    <button
                      style={styles.btnQty}
                      disabled={
                        p.stock !== undefined &&
                        p.cantidad >= p.stock
                      }
                      onClick={() =>
                        cambiarCantidad(p.id, p.cantidad + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p style={styles.price}>
                    Precio: {formatoMoneda(p.precio)}
                  </p>

                  <p style={styles.subtotal}>
                    Subtotal:{" "}
                    {formatoMoneda(
                      Number(p.precio) * Number(p.cantidad)
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
                Total: {formatoMoneda(total)}
              </h3>

              <button
                style={{
                  ...styles.buyBtn,
                  opacity: procesando ? 0.7 : 1,
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
            <h2 style={styles.modalTitle}>💳 Método de Pago</h2>

            <p style={styles.modalTotal}>
              Total: {formatoMoneda(total)}
            </p>

            <div style={styles.metodos}>
              {["Tarjeta", "PSE", "Nequi", "Contra Entrega"].map(
                (m) => (
                  <label key={m} style={styles.option}>
                    <input
                      type="radio"
                      value={m}
                      checked={metodoPago === m}
                      onChange={(e) =>
                        setMetodoPago(e.target.value)
                      }
                    />
                    {m}
                  </label>
                )
              )}
            </div>

            <div style={styles.actions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setMostrarPago(false)}
              >
                Cancelar
              </button>

              <button
                style={{
                  ...styles.confirmBtn,
                  opacity: procesando ? 0.7 : 1,
                }}
                onClick={confirmarPago}
              >
                {procesando ? "Procesando..." : "Confirmar Pago"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;