import { useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaCashRegister,
  FaCheckCircle,
  FaCubes,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function RegistrarVentaEmpleado() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [esMovil, setEsMovil] = useState(() => window.innerWidth <= 640);

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const respuesta = await api.get("/productos");
      const disponibles = Array.isArray(respuesta.data)
        ? respuesta.data.filter((producto) => Number(producto.stock) > 0)
        : [];

      setProductos(disponibles);
    } catch (err) {
      console.error("Error cargando productos:", err);
      toast.error("No se pudieron cargar los productos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    const actualizarVista = () => setEsMovil(window.innerWidth <= 640);

    window.addEventListener("resize", actualizarVista);

    return () => window.removeEventListener("resize", actualizarVista);
  }, []);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return productos;

    return productos.filter((producto) =>
      String(producto.nombre || "")
        .toLowerCase()
        .includes(texto),
    );
  }, [productos, busqueda]);

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

  const actualizarBusqueda = (valor) => {
    setBusqueda(valor);
    setProductoId("");
    setCantidad(1);
    setError("");
  };

  const registrarVenta = async (event) => {
    event.preventDefault();
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
      setBusqueda("");
      setProductoId("");
      setCantidad(1);
      await cargarProductos();
    } catch (err) {
      console.error("Error registrando venta:", err);

      const mensaje =
        err.response?.data?.message || "No se pudo registrar la venta";

      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setProcesando(false);
    }
  };

  const styles = crearEstilos(esMovil);

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <p style={styles.eyebrow}>PUNTO DE VENTA</p>
          <h1 style={styles.title}>Registrar venta</h1>
          <p style={styles.subtitle}>
            Busca un producto, indica la cantidad y confirma la venta.
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

            <label style={styles.searchField}>
              <span style={styles.label}>Buscar producto</span>

              <div style={styles.searchWrapper}>
                <FaSearch style={styles.searchIcon} />

                <input
                  type="search"
                  value={busqueda}
                  onChange={(event) => actualizarBusqueda(event.target.value)}
                  placeholder="Nombre del producto..."
                  style={styles.searchInput}
                  disabled={procesando}
                />
              </div>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Producto</span>

              <select
                value={productoId}
                onChange={(event) => {
                  setProductoId(event.target.value);
                  setCantidad(1);
                  setError("");
                }}
                style={styles.input}
                disabled={procesando || productosFiltrados.length === 0}
              >
                <option value="">
                  {productosFiltrados.length > 0
                    ? "Selecciona un producto"
                    : "No se encontraron productos"}
                </option>

                {productosFiltrados.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} — {formatoMoneda(producto.precio)}
                  </option>
                ))}
              </select>

              <small style={styles.resultText}>
                {productosFiltrados.length}{" "}
                {productosFiltrados.length === 1
                  ? "producto encontrado"
                  : "productos encontrados"}
              </small>
            </label>

            <label style={styles.field}>
              <span style={styles.label}>Cantidad</span>

              <input
                type="number"
                value={cantidad}
                onChange={(event) => {
                  setCantidad(event.target.value);
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
                <div style={styles.summaryProduct}>
                  <div style={styles.productIcon}>
                    <FaBoxOpen />
                  </div>

                  <div style={styles.productData}>
                    <span style={styles.summaryLabel}>
                      Producto seleccionado
                    </span>

                    <strong style={styles.productName}>
                      {productoSeleccionado.nombre}
                    </strong>

                    <span style={styles.stock}>
                      <FaCubes />
                      {productoSeleccionado.stock} unidades disponibles
                    </span>
                  </div>
                </div>

                <div style={styles.total}>
                  <span>Total</span>
                  <strong>{formatoMoneda(total)}</strong>
                </div>
              </div>
            )}

            <div style={styles.payment}>
              <FaCheckCircle style={styles.paymentIcon} />

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
                cursor:
                  procesando || !productoSeleccionado
                    ? "not-allowed"
                    : "pointer",
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

const crearEstilos = (esMovil) => ({
  container: {
    width: "100%",
    minWidth: 0,
    minHeight: "100%",
    padding: esMovil ? "18px 14px 28px" : "clamp(20px, 4vw, 36px)",
    boxSizing: "border-box",
    color: "#f8fafc",
    overflowX: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: esMovil ? "flex-start" : "center",
    gap: esMovil ? "14px" : "20px",
    marginBottom: esMovil ? "20px" : "28px",
  },
  headerContent: {
    minWidth: 0,
    flex: 1,
  },
  eyebrow: {
    margin: "0 0 8px",
    color: "#a78bfa",
    fontSize: esMovil ? "10px" : "12px",
    fontWeight: "800",
    letterSpacing: "1.3px",
  },
  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: esMovil ? "clamp(27px, 9vw, 32px)" : "clamp(30px, 4vw, 34px)",
    lineHeight: 1.05,
    fontWeight: "900",
    overflowWrap: "anywhere",
  },
  subtitle: {
    margin: "9px 0 0",
    maxWidth: "520px",
    color: "#94a3b8",
    fontSize: esMovil ? "13px" : "15px",
    lineHeight: 1.55,
  },
  headerIcon: {
    display: "grid",
    placeItems: "center",
    width: esMovil ? "48px" : "64px",
    height: esMovil ? "48px" : "64px",
    flexShrink: 0,
    marginTop: esMovil ? "2px" : 0,
    borderRadius: esMovil ? "15px" : "20px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    boxShadow: "0 12px 30px rgba(124,58,237,0.35)",
    fontSize: esMovil ? "20px" : "27px",
  },
  panel: {
    width: "100%",
    maxWidth: "900px",
    minWidth: 0,
    padding: esMovil ? "16px" : "clamp(20px, 4vw, 28px)",
    boxSizing: "border-box",
    border: "1px solid rgba(167,139,250,0.18)",
    borderRadius: esMovil ? "18px" : "24px",
    background: "linear-gradient(145deg, #172033, #111827)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
  },
  form: {
    display: "grid",
    gridTemplateColumns: esMovil
      ? "minmax(0, 1fr)"
      : "repeat(auto-fit, minmax(240px, 1fr))",
    gap: esMovil ? "16px" : "20px",
    minWidth: 0,
  },
  searchField: {
    gridColumn: "1 / -1",
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: "8px",
  },
  searchWrapper: {
    position: "relative",
    minWidth: 0,
  },
  searchIcon: {
    position: "absolute",
    top: "50%",
    left: "14px",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    minWidth: 0,
    padding: esMovil ? "13px 12px 13px 40px" : "14px 15px 14px 44px",
    boxSizing: "border-box",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "13px",
    outline: "none",
    background: "#252f42",
    color: "#ffffff",
    fontSize: esMovil ? "14px" : "15px",
  },
  field: {
    display: "flex",
    minWidth: 0,
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
    minWidth: 0,
    padding: esMovil ? "13px 12px" : "14px 15px",
    boxSizing: "border-box",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "13px",
    outline: "none",
    background: "#252f42",
    color: "#ffffff",
    fontSize: esMovil ? "14px" : "15px",
  },
  resultText: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  error: {
    gridColumn: "1 / -1",
    padding: "13px 15px",
    border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: "12px",
    background: "rgba(127,29,29,0.8)",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: esMovil ? "13px" : "14px",
  },
  summary: {
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: esMovil ? "stretch" : "center",
    flexDirection: esMovil ? "column" : "row",
    gap: esMovil ? "14px" : "16px",
    minWidth: 0,
    padding: esMovil ? "15px" : "20px",
    border: "1px solid rgba(167,139,250,0.2)",
    borderRadius: "18px",
    background: "rgba(124,58,237,0.1)",
  },
  summaryProduct: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
    flex: 1,
  },
  productIcon: {
    display: "grid",
    placeItems: "center",
    width: esMovil ? "44px" : "52px",
    height: esMovil ? "44px" : "52px",
    flexShrink: 0,
    borderRadius: "15px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    fontSize: esMovil ? "18px" : "22px",
  },
  productData: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: "4px",
  },
  summaryLabel: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  productName: {
    color: "#ffffff",
    fontSize: esMovil ? "15px" : "17px",
    overflowWrap: "anywhere",
  },
  stock: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#34d399",
    fontSize: esMovil ? "12px" : "13px",
  },
  total: {
    display: "flex",
    flexDirection: esMovil ? "row" : "column",
    alignItems: esMovil ? "center" : "flex-end",
    justifyContent: esMovil ? "space-between" : "center",
    gap: "5px",
    paddingTop: esMovil ? "12px" : 0,
    borderTop: esMovil ? "1px solid rgba(255,255,255,0.08)" : "none",
    color: "#94a3b8",
  },
  payment: {
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    minWidth: 0,
    padding: esMovil ? "14px" : "16px",
    border: "1px solid rgba(52,211,153,0.18)",
    borderRadius: "15px",
    background: "rgba(16,185,129,0.09)",
    color: "#34d399",
  },
  paymentIcon: {
    flexShrink: 0,
    marginTop: "2px",
  },
  paymentContent: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: "4px",
    fontSize: esMovil ? "12px" : "14px",
    lineHeight: 1.45,
  },
  submit: {
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    width: "100%",
    minHeight: "48px",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    boxShadow: "0 10px 25px rgba(124,58,237,0.3)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "800",
  },
  state: {
    padding: esMovil ? "40px 12px" : "60px 20px",
    color: "#94a3b8",
    textAlign: "center",
  },
});
