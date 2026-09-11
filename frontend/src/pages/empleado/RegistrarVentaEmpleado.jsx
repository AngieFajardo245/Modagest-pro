import { useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaCashRegister,
  FaCheckCircle,
  FaCubes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function RegistrarVentaEmpleado() {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const respuesta = await api.get("/productos");

      setProductos(
        Array.isArray(respuesta.data)
          ? respuesta.data.filter((producto) => Number(producto.stock) > 0)
          : [],
      );
    } catch (error) {
      console.error("Error cargando productos:", error);
      toast.error("No se pudieron cargar los productos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const productoSeleccionado = useMemo(
    () =>
      productos.find(
        (producto) => Number(producto.id) === Number(productoId),
      ) || null,
    [productos, productoId],
  );

  const total = productoSeleccionado
    ? Number(productoSeleccionado.precio) * Number(cantidad || 0)
    : 0;

  const formatoMoneda = (valor) =>
    Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const registrarVenta = async (e) => {
    e.preventDefault();
    setError("");

    const id = Number(productoId);
    const unidades = Number(cantidad);

    if (!Number.isInteger(id) || id < 1) {
      setError("Selecciona un producto");
      return;
    }

    if (!Number.isInteger(unidades) || unidades < 1) {
      setError("La cantidad debe ser un número entero mayor que cero");
      return;
    }

    if (unidades > Number(productoSeleccionado?.stock || 0)) {
      setError("La cantidad supera el stock disponible");
      return;
    }

    try {
      setProcesando(true);

      await api.post("/empleado/vender", {
        productoId: id,
        cantidad: unidades,
      });

      toast.success("Venta registrada correctamente");
      setProductoId("");
      setCantidad(1);
      await cargarProductos();
    } catch (error) {
      console.error("Error registrando venta:", error);

      const mensaje =
        error.response?.data?.message || "No se pudo registrar la venta";

      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>PUNTO DE VENTA</p>
          <h1 style={styles.title}>Registrar venta</h1>
          <p style={styles.subtitle}>
            Selecciona un producto, indica la cantidad y confirma la venta.
          </p>
        </div>

        <div style={styles.headerIcon}>
          <FaCashRegister />
        </div>
      </header>

      <section style={styles.panel}>
        {cargando ? (
          <div style={styles.state}>Cargando productos...</div>
        ) : productos.length === 0 ? (
          <div style={styles.state}>No hay productos con stock disponible.</div>
        ) : (
          <form onSubmit={registrarVenta} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}

            <label style={styles.field}>
              <span style={styles.label}>Producto</span>

              <select
                value={productoId}
                onChange={(e) => {
                  setProductoId(e.target.value);
                  setCantidad(1);
                  setError("");
                }}
                style={styles.input}
                disabled={procesando}
              >
                <option value="">Selecciona un producto</option>

                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} — {formatoMoneda(producto.precio)}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Cantidad</span>

              <input
                type="number"
                value={cantidad}
                onChange={(e) => {
                  setCantidad(e.target.value);
                  setError("");
                }}
                min="1"
                max={productoSeleccionado?.stock || 1}
                step="1"
                style={styles.input}
                disabled={procesando || !productoSeleccionado}
              />
            </label>

            {productoSeleccionado && (
              <div style={styles.summary}>
                <div style={styles.productIcon}>
                  <FaBoxOpen />
                </div>

                <div style={styles.productData}>
                  <span style={styles.summaryLabel}>Producto seleccionado</span>
                  <strong style={styles.productName}>
                    {productoSeleccionado.nombre}
                  </strong>
                  <span style={styles.stock}>
                    <FaCubes />
                    {productoSeleccionado.stock} unidades disponibles
                  </span>
                </div>

                <div style={styles.total}>
                  <span>Total</span>
                  <strong>{formatoMoneda(total)}</strong>
                </div>
              </div>
            )}

            <div style={styles.payment}>
              <FaCheckCircle />

              <div style={styles.paymentContent}>
                <strong>Pago en efectivo</strong>

                <span>
                  La venta quedará registrada automáticamente como aprobada.
                </span>
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.submit,
                opacity: procesando || !productoSeleccionado ? 0.6 : 1,
              }}
              disabled={procesando || !productoSeleccionado}
            >
              <FaCashRegister />
              {procesando ? "Registrando..." : "Confirmar venta"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100%",
    padding: "36px",
    boxSizing: "border-box",
    color: "#f8fafc",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "28px",
  },
  eyebrow: {
    margin: "0 0 8px",
    color: "#a78bfa",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },
  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "900",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: "15px",
  },
  headerIcon: {
    width: "64px",
    height: "64px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "20px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    fontSize: "27px",
    boxShadow: "0 12px 30px rgba(124,58,237,0.35)",
  },
  panel: {
    maxWidth: "900px",
    padding: "28px",
    borderRadius: "24px",
    background: "linear-gradient(145deg, #172033, #111827)",
    border: "1px solid rgba(167,139,250,0.18)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "700",
  },
  input: {
    width: "100%",
    padding: "14px 15px",
    boxSizing: "border-box",
    borderRadius: "13px",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
    background: "#252f42",
    color: "#fff",
    fontSize: "15px",
  },
  error: {
    gridColumn: "1 / -1",
    padding: "13px 15px",
    borderRadius: "12px",
    background: "rgba(127,29,29,0.8)",
    border: "1px solid rgba(248,113,113,0.3)",
    color: "#fff",
    fontWeight: "600",
  },
  summary: {
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    borderRadius: "18px",
    background: "rgba(124,58,237,0.1)",
    border: "1px solid rgba(167,139,250,0.2)",
  },
  productIcon: {
    width: "52px",
    height: "52px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "15px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    fontSize: "22px",
  },
  productData: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "4px",
  },
  summaryLabel: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  productName: {
    color: "#fff",
    fontSize: "17px",
  },
  stock: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#34d399",
    fontSize: "13px",
  },
  total: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
    color: "#94a3b8",
  },
  payment: {
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    borderRadius: "15px",
    background: "rgba(16,185,129,0.09)",
    border: "1px solid rgba(52,211,153,0.18)",
    color: "#34d399",
  },

  paymentContent: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  submit: {
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    padding: "15px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    fontWeight: "800",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(124,58,237,0.3)",
  },
  state: {
    padding: "60px 20px",
    color: "#94a3b8",
    textAlign: "center",
  },
};
