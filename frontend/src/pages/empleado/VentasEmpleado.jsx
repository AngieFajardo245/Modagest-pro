import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
FaReceipt,
FaShoppingBag,
FaMoneyBillWave,
FaBoxOpen,
FaSearch,
FaFilter,
FaSyncAlt,
FaChevronDown,
FaChevronUp,
FaCheckCircle,
FaClock,
FaTimesCircle,
FaCalendarAlt,
FaCreditCard,
FaBoxes,
} from "react-icons/fa";

function VentasEmpleado() {
const [ventas, setVentas] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [busqueda, setBusqueda] = useState("");
const [filtroEstado, setFiltroEstado] = useState("todos");
const [orden, setOrden] = useState("recientes");
const [ventaAbierta, setVentaAbierta] = useState(null);

const obtenerVentas = async () => {
try {
setLoading(true);
setError("");

  const res = await api.get("/empleado/ventas");
  const data = Array.isArray(res.data) ? res.data : [];

  setVentas(data);
} catch (err) {
  console.error("Error obteniendo ventas:", err);

  setError(
    err.response?.data?.message || "No se pudieron cargar las ventas.",
  );
} finally {
  setLoading(false);
}


};

useEffect(() => {
obtenerVentas();
}, []);

const formatoMoneda = (valor) =>
new Intl.NumberFormat("es-CO", {
style: "currency",
currency: "COP",
maximumFractionDigits: 0,
}).format(Number(valor) || 0);

const formatoFecha = (fecha) => {
if (!fecha) return "Sin fecha";

const fechaObj = new Date(fecha);

if (Number.isNaN(fechaObj.getTime())) {
  return "Fecha inválida";
}

return fechaObj.toLocaleDateString("es-CO", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});


};

const formatoHora = (fecha) => {
if (!fecha) return "";

const fechaObj = new Date(fecha);

if (Number.isNaN(fechaObj.getTime())) {
  return "";
}

return fechaObj.toLocaleTimeString("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
});


};

const obtenerDetalles = (venta) =>
Array.isArray(venta?.Detalles) ? venta.Detalles : [];

const obtenerUnidadesVenta = (venta) =>
obtenerDetalles(venta).reduce(
(total, detalle) => total + Number(detalle?.cantidad || 0),
0,
);

const obtenerNombreProducto = (detalle) =>
detalle?.Producto?.nombre ||
`Producto #${detalle?.productoId || "N/A"}`;

const obtenerImagenProducto = (detalle) => {
const imagen = detalle?.Producto?.imagen;

if (!imagen) {
  return null;
}

if (imagen.startsWith("http")) {
  return imagen;
}

return `http://localhost:5000/uploads/${imagen}`;


};

const obtenerEstadoPago = (venta) => {
const pago = venta?.Pago;


if (!pago) {
  return {
    texto: "Sin pago",
    tipo: "sin-pago",
    icono: <FaClock />,
  };
}

const estado = String(pago.estado || "").toLowerCase();

if (
  estado === "aprobado" ||
  estado === "aprobada" ||
  estado === "approved"
) {
  return {
    texto: "Aprobada",
    tipo: "aprobado",
    icono: <FaCheckCircle />,
  };
}

if (estado === "pendiente" || estado === "pending") {
  return {
    texto: "Pendiente",
    tipo: "pendiente",
    icono: <FaClock />,
  };
}

if (
  estado === "rechazado" ||
  estado === "rechazada" ||
  estado === "rejected"
) {
  return {
    texto: "Rechazada",
    tipo: "rechazado",
    icono: <FaTimesCircle />,
  };
}

return {
  texto: pago.estado || "Desconocido",
  tipo: "sin-pago",
  icono: <FaClock />,
};


};

const ventasFiltradas = useMemo(() => {
let data = [...ventas];
const texto = busqueda.trim().toLowerCase();


if (texto) {
  data = data.filter((venta) => {
    const numeroVenta = String(venta?.id || "").toLowerCase();

    const productos = obtenerDetalles(venta)
      .map((detalle) => obtenerNombreProducto(detalle).toLowerCase())
      .join(" ");

    return numeroVenta.includes(texto) || productos.includes(texto);
  });
}

if (filtroEstado !== "todos") {
  data = data.filter(
    (venta) => obtenerEstadoPago(venta).tipo === filtroEstado,
  );
}

data.sort((a, b) => {
  const fechaA = new Date(a?.createdAt || 0).getTime();
  const fechaB = new Date(b?.createdAt || 0).getTime();

  if (orden === "recientes") {
    return fechaB - fechaA;
  }

  if (orden === "antiguas") {
    return fechaA - fechaB;
  }

  if (orden === "mayor") {
    return Number(b?.total || 0) - Number(a?.total || 0);
  }

  if (orden === "menor") {
    return Number(a?.total || 0) - Number(b?.total || 0);
  }

  return 0;
});

return data;

}, [ventas, busqueda, filtroEstado, orden]);

const estadisticas = useMemo(() => {
const ventasAprobadas = ventas.filter(
(venta) => obtenerEstadoPago(venta).tipo === "aprobado",
);

const totalVendido = ventasAprobadas.reduce(
  (total, venta) => total + Number(venta?.total || 0),
  0,
);

const unidadesVendidas = ventasAprobadas.reduce(
  (total, venta) => total + obtenerUnidadesVenta(venta),
  0,
);

return {
  ventas: ventas.length,
  ventasAprobadas: ventasAprobadas.length,
  totalVendido,
  unidadesVendidas,
};


}, [ventas]);

const alternarDetalle = (id) => {
setVentaAbierta((actual) => (actual === id ? null : id));
};

const limpiarFiltros = () => {
setBusqueda("");
setFiltroEstado("todos");
setOrden("recientes");
};

if (loading) {
return ( <div style={styles.loadingContainer}> <div style={styles.loader} /> <p style={styles.loadingText}>Cargando historial de ventas...</p> </div>
);
}

if (error) {
return ( <div style={styles.container}> <div style={styles.errorBox}> <FaTimesCircle style={styles.errorIcon} />

      <h2 style={styles.errorTitle}>
        No se pudieron cargar las ventas
      </h2>

      <p style={styles.errorText}>{error}</p>

      <button
        type="button"
        style={styles.retryButton}
        onClick={obtenerVentas}
      >
        <FaSyncAlt />
        Intentar nuevamente
      </button>
    </div>
  </div>
);


}

return ( <div style={styles.container}> <div style={styles.header}> <div> <div style={styles.eyebrow}> <FaReceipt />
HISTORIAL COMERCIAL </div>

      <h1 style={styles.title}>Mis ventas</h1>

      <p style={styles.subtitle}>
        Consulta y revisa todas las ventas realizadas desde tu cuenta de
        empleado.
      </p>
    </div>

    <button
      type="button"
      style={styles.refreshButton}
      onClick={obtenerVentas}
    >
      <FaSyncAlt />
      Actualizar
    </button>
  </div>

  <div style={styles.statsGrid}>
    <div style={styles.statCard}>
      <div style={styles.statIconPurple}>
        <FaReceipt />
      </div>

      <div>
        <p style={styles.statLabel}>Ventas realizadas</p>
        <h2 style={styles.statNumber}>{estadisticas.ventas}</h2>
        <p style={styles.statDescription}>Registros encontrados</p>
      </div>
    </div>

    <div style={styles.statCard}>
      <div style={styles.statIconBlue}>
        <FaShoppingBag />
      </div>

      <div>
        <p style={styles.statLabel}>Ventas aprobadas</p>
        <h2 style={styles.statNumber}>
          {estadisticas.ventasAprobadas}
        </h2>
        <p style={styles.statDescription}>Ventas completadas</p>
      </div>
    </div>

    <div style={styles.statCard}>
      <div style={styles.statIconOrange}>
        <FaBoxes />
      </div>

      <div>
        <p style={styles.statLabel}>Unidades vendidas</p>
        <h2 style={styles.statNumber}>
          {estadisticas.unidadesVendidas}
        </h2>
        <p style={styles.statDescription}>Productos vendidos</p>
      </div>
    </div>

    <div style={styles.statCard}>
      <div style={styles.statIconGreen}>
        <FaMoneyBillWave />
      </div>

      <div>
        <p style={styles.statLabel}>Total vendido</p>

        <h2 style={styles.statMoney}>
          {formatoMoneda(estadisticas.totalVendido)}
        </h2>

        <p style={styles.statDescription}>Ventas aprobadas</p>
      </div>
    </div>
  </div>

  <div style={styles.filtersSection}>
    <div style={styles.filtersHeader}>
      <div>
        <p style={styles.sectionEyebrow}>CONSULTA</p>
        <h2 style={styles.sectionTitle}>Historial de ventas</h2>
      </div>

      <span style={styles.resultBadge}>
        {ventasFiltradas.length}{" "}
        {ventasFiltradas.length === 1 ? "venta" : "ventas"}
      </span>
    </div>

    <div style={styles.filtersGrid}>
      <div style={styles.inputWrapper}>
        <FaSearch style={styles.inputIcon} />

        <input
          type="text"
          placeholder="Buscar venta o producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.selectWrapper}>
        <FaFilter style={styles.selectIcon} />

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={styles.select}
        >
          <option value="todos">Todos los estados</option>
          <option value="aprobado">Aprobadas</option>
          <option value="pendiente">Pendientes</option>
          <option value="rechazado">Rechazadas</option>
        </select>
      </div>

      <select
        value={orden}
        onChange={(e) => setOrden(e.target.value)}
        style={styles.orderSelect}
      >
        <option value="recientes">Más recientes</option>
        <option value="antiguas">Más antiguas</option>
        <option value="mayor">Mayor valor</option>
        <option value="menor">Menor valor</option>
      </select>
    </div>
  </div>

  {ventasFiltradas.length === 0 ? (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>
        <FaReceipt />
      </div>

      <h3 style={styles.emptyTitle}>No hay ventas para mostrar</h3>

      <p style={styles.emptyText}>
        {ventas.length === 0
          ? "Todavía no has registrado ninguna venta."
          : "No encontramos ventas que coincidan con los filtros seleccionados."}
      </p>

      {ventas.length > 0 && (
        <button
          type="button"
          style={styles.clearButton}
          onClick={limpiarFiltros}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  ) : (
    <div style={styles.salesList}>
      {ventasFiltradas.map((venta) => {
        const detalles = obtenerDetalles(venta);
        const estado = obtenerEstadoPago(venta);
        const unidades = obtenerUnidadesVenta(venta);
        const abierta = ventaAbierta === venta.id;

        return (
          <div key={venta.id} style={styles.saleCard}>
            <div style={styles.saleHeader}>
              <div style={styles.saleMainInfo}>
                <div style={styles.saleIcon}>
                  <FaReceipt />
                </div>

                <div>
                  <div style={styles.saleNumber}>
                    Venta #{venta.id}
                  </div>

                  <div style={styles.saleDate}>
                    <FaCalendarAlt />

                    {formatoFecha(venta.createdAt)}

                    <span style={styles.dateSeparator}>•</span>

                    {formatoHora(venta.createdAt)}
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...styles.statusBadge,
                  ...(estado.tipo === "aprobado"
                    ? styles.statusApproved
                    : estado.tipo === "pendiente"
                      ? styles.statusPending
                      : estado.tipo === "rechazado"
                        ? styles.statusRejected
                        : styles.statusUnknown),
                }}
              >
                {estado.icono}
                {estado.texto}
              </div>
            </div>

            <div style={styles.saleSummary}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Productos</span>

                <strong style={styles.summaryValue}>
                  {detalles.length}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Unidades</span>

                <strong style={styles.summaryValue}>
                  {unidades}
                </strong>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>
                  Método de pago
                </span>

                <strong style={styles.paymentValue}>
                  <FaCreditCard />

                  {venta?.Pago?.metodoPago || "No registrado"}
                </strong>
              </div>

              <div style={styles.summaryTotal}>
                <span style={styles.summaryLabel}>Total</span>

                <strong style={styles.totalValue}>
                  {formatoMoneda(venta.total)}
                </strong>
              </div>
            </div>

            <button
              type="button"
              style={styles.detailButton}
              onClick={() => alternarDetalle(venta.id)}
            >
              {abierta ? (
                <>
                  <FaChevronUp />
                  Ocultar detalle
                </>
              ) : (
                <>
                  <FaChevronDown />
                  Ver detalle
                </>
              )}
            </button>

            {abierta && (
              <div style={styles.detailSection}>
                <div style={styles.detailTitle}>
                  <FaBoxOpen />
                  Productos de la venta
                </div>

                {detalles.length === 0 ? (
                  <div style={styles.noDetails}>
                    No hay detalles registrados para esta venta.
                  </div>
                ) : (
                  <div style={styles.detailsList}>
                    {detalles.map((detalle) => {
                      const precio = Number(detalle?.precio || 0);
                      const cantidad = Number(
                        detalle?.cantidad || 0,
                      );

                      const subtotal = Number(
                        detalle?.subtotal || precio * cantidad,
                      );

                      const imagen = obtenerImagenProducto(detalle);

                      return (
                        <div
                          key={detalle.id}
                          style={styles.detailItem}
                        >
                          <div style={styles.detailProduct}>
                            <div style={styles.productImage}>
                              {imagen ? (
                                <img
                                  src={imagen}
                                  alt={obtenerNombreProducto(detalle)}
                                  style={styles.image}
                                  onError={(e) => {
                                    e.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : null}

                              <FaBoxOpen
                                style={styles.fallbackIcon}
                              />
                            </div>

                            <div>
                              <strong
                                style={styles.detailProductName}
                              >
                                {obtenerNombreProducto(detalle)}
                              </strong>

                              <span
                                style={styles.detailProductId}
                              >
                                Producto #{detalle.productoId}
                              </span>
                            </div>
                          </div>

                          <div style={styles.detailData}>
                            <span>Cantidad</span>
                            <strong>{cantidad}</strong>
                          </div>

                          <div style={styles.detailData}>
                            <span>Precio</span>
                            <strong>
                              {formatoMoneda(precio)}
                            </strong>
                          </div>

                          <div style={styles.detailData}>
                            <span>Subtotal</span>

                            <strong
                              style={styles.detailSubtotalValue}
                            >
                              {formatoMoneda(subtotal)}
                            </strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={styles.paymentSection}>
                  <div>
                    <span style={styles.paymentLabel}>
                      Método de pago
                    </span>

                    <strong style={styles.paymentMethod}>
                      <FaMoneyBillWave />

                      {venta?.Pago?.metodoPago || "No registrado"}
                    </strong>
                  </div>

                  <div>
                    <span style={styles.paymentLabel}>Estado</span>

                    <strong style={styles.paymentMethod}>
                      {estado.icono}
                      {estado.texto}
                    </strong>
                  </div>

                  <div>
                    <span style={styles.paymentLabel}>
                      Referencia
                    </span>

                    <strong style={styles.reference}>
                      {venta?.Pago?.referencia || "Sin referencia"}
                    </strong>
                  </div>

                  <div>
                    <span style={styles.paymentLabel}>
                      Monto pagado
                    </span>

                    <strong style={styles.paymentAmount}>
                      {formatoMoneda(
                        venta?.Pago?.monto || venta.total,
                      )}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  )}
</div>

);
}

export default VentasEmpleado;

const styles = {
container: {
minHeight: "100vh",
padding: "20px",
color: "#ffffff",
boxSizing: "border-box",
},

header: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: "25px",
flexWrap: "wrap",
marginBottom: "35px",
},

eyebrow: {
display: "flex",
alignItems: "center",
gap: "8px",
color: "#a78bfa",
fontSize: "11px",
fontWeight: "800",
letterSpacing: "1.5px",
marginBottom: "10px",
},

title: {
margin: 0,
fontSize: "clamp(30px, 4vw, 42px)",
fontWeight: "800",
color: "#ffffff",
letterSpacing: "-1px",
},

subtitle: {
margin: "10px 0 0",
color: "#94a3b8",
fontSize: "15px",
lineHeight: "1.6",
maxWidth: "700px",
},

refreshButton: {
display: "flex",
alignItems: "center",
justifyContent: "center",
gap: "8px",
padding: "13px 18px",
border: "1px solid rgba(255,255,255,0.08)",
borderRadius: "14px",
background: "linear-gradient(135deg, #7c3aed, #2563eb)",
color: "#ffffff",
fontWeight: "800",
fontSize: "13px",
cursor: "pointer",
boxShadow: "0 8px 20px rgba(79,70,229,0.25)",
},

statsGrid: {
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
gap: "18px",
marginBottom: "35px",
},

statCard: {
display: "flex",
alignItems: "center",
gap: "16px",
minHeight: "96px",
padding: "20px",
borderRadius: "22px",
background: "rgba(255,255,255,0.045)",
border: "1px solid rgba(255,255,255,0.075)",
backdropFilter: "blur(15px)",
boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
boxSizing: "border-box",
},

statIconPurple: {
width: "54px",
height: "54px",
flexShrink: 0,
borderRadius: "16px",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "rgba(124,58,237,0.14)",
border: "1px solid rgba(124,58,237,0.22)",
color: "#a78bfa",
fontSize: "21px",
},

statIconBlue: {
width: "54px",
height: "54px",
flexShrink: 0,
borderRadius: "16px",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "rgba(37,99,235,0.14)",
border: "1px solid rgba(37,99,235,0.22)",
color: "#60a5fa",
fontSize: "21px",
},

statIconOrange: {
width: "54px",
height: "54px",
flexShrink: 0,
borderRadius: "16px",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "rgba(217,119,6,0.14)",
border: "1px solid rgba(217,119,6,0.22)",
color: "#fbbf24",
fontSize: "21px",
},

statIconGreen: {
width: "54px",
height: "54px",
flexShrink: 0,
borderRadius: "16px",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "rgba(16,185,129,0.14)",
border: "1px solid rgba(16,185,129,0.22)",
color: "#6ee7b7",
fontSize: "21px",
},

statLabel: {
margin: 0,
color: "#94a3b8",
fontSize: "11px",
fontWeight: "700",
},

statNumber: {
margin: "4px 0 2px",
color: "#ffffff",
fontSize: "28px",
lineHeight: "1.1",
fontWeight: "800",
},

statMoney: {
margin: "4px 0 2px",
color: "#34d399",
fontSize: "20px",
lineHeight: "1.1",
fontWeight: "800",
whiteSpace: "nowrap",
},

statDescription: {
margin: 0,
color: "#64748b",
fontSize: "10px",
lineHeight: "1.4",
},

filtersSection: {
marginBottom: "25px",
},

filtersHeader: {
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: "15px",
marginBottom: "18px",
flexWrap: "wrap",
},

sectionEyebrow: {
margin: 0,
color: "#8b5cf6",
fontSize: "10px",
fontWeight: "800",
letterSpacing: "1.5px",
},

sectionTitle: {
margin: "5px 0 0",
color: "#ffffff",
fontSize: "25px",
fontWeight: "800",
},

resultBadge: {
padding: "8px 13px",
borderRadius: "999px",
background: "rgba(124,58,237,0.12)",
border: "1px solid rgba(124,58,237,0.2)",
color: "#c4b5fd",
fontSize: "12px",
fontWeight: "700",
},

filtersGrid: {
display: "grid",
gridTemplateColumns:
"minmax(240px, 1.5fr) minmax(200px, 1fr) minmax(180px, 0.8fr)",
gap: "13px",
},

inputWrapper: {
position: "relative",
},

inputIcon: {
position: "absolute",
left: "14px",
top: "50%",
transform: "translateY(-50%)",
color: "#64748b",
fontSize: "13px",
},

input: {
width: "100%",
boxSizing: "border-box",
padding: "13px 14px 13px 40px",
borderRadius: "14px",
border: "1px solid rgba(255,255,255,0.08)",
background: "rgba(255,255,255,0.045)",
color: "#ffffff",
outline: "none",
fontSize: "13px",
},

selectWrapper: {
position: "relative",
},

selectIcon: {
position: "absolute",
left: "14px",
top: "50%",
transform: "translateY(-50%)",
color: "#64748b",
fontSize: "12px",
pointerEvents: "none",
},

select: {
width: "100%",
boxSizing: "border-box",
padding: "13px 14px 13px 38px",
borderRadius: "14px",
border: "1px solid rgba(255,255,255,0.08)",
background: "#17152d",
color: "#ffffff",
outline: "none",
fontSize: "13px",
},

orderSelect: {
width: "100%",
boxSizing: "border-box",
padding: "13px 14px",
borderRadius: "14px",
border: "1px solid rgba(255,255,255,0.08)",
background: "#17152d",
color: "#ffffff",
outline: "none",
fontSize: "13px",
},

salesList: {
display: "flex",
flexDirection: "column",
gap: "16px",
},

saleCard: {
border: "1px solid rgba(255,255,255,0.075)",
borderRadius: "22px",
background: "rgba(255,255,255,0.045)",
overflow: "hidden",
backdropFilter: "blur(15px)",
boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
},

saleHeader: {
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: "15px",
padding: "20px 22px",
flexWrap: "wrap",
},

saleMainInfo: {
display: "flex",
alignItems: "center",
gap: "13px",
},

saleIcon: {
width: "48px",
height: "48px",
borderRadius: "15px",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "rgba(124,58,237,0.14)",
border: "1px solid rgba(124,58,237,0.2)",
color: "#a78bfa",
fontSize: "19px",
},

saleNumber: {
color: "#ffffff",
fontSize: "17px",
fontWeight: "800",
},

saleDate: {
display: "flex",
alignItems: "center",
gap: "6px",
marginTop: "5px",
color: "#64748b",
fontSize: "11px",
},

dateSeparator: {
color: "#475569",
},

statusBadge: {
display: "flex",
alignItems: "center",
gap: "6px",
padding: "7px 11px",
borderRadius: "999px",
fontSize: "11px",
fontWeight: "800",
},

statusApproved: {
background: "rgba(16,185,129,0.12)",
border: "1px solid rgba(16,185,129,0.2)",
color: "#6ee7b7",
},

statusPending: {
background: "rgba(245,158,11,0.12)",
border: "1px solid rgba(245,158,11,0.2)",
color: "#fbbf24",
},

statusRejected: {
background: "rgba(239,68,68,0.12)",
border: "1px solid rgba(239,68,68,0.2)",
color: "#f87171",
},

statusUnknown: {
background: "rgba(148,163,184,0.12)",
border: "1px solid rgba(148,163,184,0.2)",
color: "#cbd5e1",
},

saleSummary: {
display: "grid",
gridTemplateColumns: "repeat(4, 1fr)",
gap: "1px",
background: "rgba(255,255,255,0.06)",
borderTop: "1px solid rgba(255,255,255,0.06)",
borderBottom: "1px solid rgba(255,255,255,0.06)",
},

summaryItem: {
padding: "17px",
background: "rgba(15,23,42,0.2)",
},

summaryTotal: {
padding: "17px",
background: "rgba(16,185,129,0.06)",
},

summaryLabel: {
display: "block",
marginBottom: "6px",
color: "#64748b",
fontSize: "10px",
fontWeight: "700",
textTransform: "uppercase",
},

summaryValue: {
color: "#cbd5e1",
fontSize: "15px",
fontWeight: "800",
},

paymentValue: {
display: "flex",
alignItems: "center",
gap: "6px",
color: "#cbd5e1",
fontSize: "13px",
fontWeight: "700",
textTransform: "capitalize",
},

totalValue: {
color: "#34d399",
fontSize: "18px",
fontWeight: "800",
},

detailButton: {
width: "100%",
display: "flex",
alignItems: "center",
justifyContent: "center",
gap: "8px",
padding: "12px",
border: "none",
background: "rgba(255,255,255,0.025)",
color: "#a78bfa",
fontSize: "12px",
fontWeight: "800",
cursor: "pointer",
},

detailSection: {
padding: "20px 22px 22px",
borderTop: "1px solid rgba(255,255,255,0.06)",
},

detailTitle: {
display: "flex",
alignItems: "center",
gap: "8px",
marginBottom: "15px",
color: "#ffffff",
fontSize: "14px",
fontWeight: "800",
},

detailsList: {
display: "flex",
flexDirection: "column",
gap: "9px",
},

detailItem: {
display: "grid",
gridTemplateColumns: "2fr 0.7fr 1fr 1fr",
alignItems: "center",
gap: "15px",
padding: "13px",
borderRadius: "15px",
background: "rgba(255,255,255,0.035)",
border: "1px solid rgba(255,255,255,0.05)",
},

detailProduct: {
display: "flex",
alignItems: "center",
gap: "10px",
minWidth: 0,
},

productImage: {
position: "relative",
width: "44px",
height: "44px",
flexShrink: 0,
borderRadius: "12px",
background: "rgba(124,58,237,0.1)",
color: "#a78bfa",
display: "flex",
alignItems: "center",
justifyContent: "center",
overflow: "hidden",
},

image: {
position: "relative",
zIndex: 2,
width: "100%",
height: "100%",
objectFit: "contain",
},

fallbackIcon: {
position: "absolute",
zIndex: 1,
fontSize: "18px",
},

detailProductName: {
display: "block",
color: "#ffffff",
fontSize: "13px",
fontWeight: "800",
},

detailProductId: {
display: "block",
marginTop: "3px",
color: "#64748b",
fontSize: "10px",
},

detailData: {
display: "flex",
flexDirection: "column",
gap: "4px",
color: "#94a3b8",
fontSize: "11px",
},

detailSubtotalValue: {
color: "#34d399",
},

noDetails: {
padding: "20px",
borderRadius: "14px",
background: "rgba(255,255,255,0.03)",
color: "#64748b",
fontSize: "13px",
textAlign: "center",
},

paymentSection: {
display: "grid",
gridTemplateColumns: "repeat(4, 1fr)",
gap: "12px",
marginTop: "15px",
paddingTop: "15px",
borderTop: "1px solid rgba(255,255,255,0.06)",
},

paymentLabel: {
display: "block",
marginBottom: "5px",
color: "#64748b",
fontSize: "10px",
textTransform: "uppercase",
fontWeight: "700",
},

paymentMethod: {
display: "flex",
alignItems: "center",
gap: "6px",
color: "#cbd5e1",
fontSize: "12px",
textTransform: "capitalize",
},

reference: {
color: "#94a3b8",
fontSize: "11px",
wordBreak: "break-all",
},

paymentAmount: {
color: "#34d399",
fontSize: "13px",
fontWeight: "800",
},

empty: {
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
padding: "75px 30px",
borderRadius: "25px",
background: "rgba(255,255,255,0.04)",
border: "1px solid rgba(255,255,255,0.07)",
textAlign: "center",
},

emptyIcon: {
width: "75px",
height: "75px",
borderRadius: "23px",
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "rgba(124,58,237,0.12)",
color: "#a78bfa",
fontSize: "30px",
},

emptyTitle: {
margin: "18px 0 8px",
color: "#ffffff",
fontSize: "20px",
},

emptyText: {
margin: 0,
color: "#64748b",
fontSize: "13px",
maxWidth: "500px",
lineHeight: "1.6",
},

clearButton: {
marginTop: "20px",
padding: "11px 18px",
border: "none",
borderRadius: "13px",
background: "linear-gradient(135deg, #7c3aed, #2563eb)",
color: "#ffffff",
fontSize: "12px",
fontWeight: "800",
cursor: "pointer",
},

errorBox: {
minHeight: "65vh",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
textAlign: "center",
padding: "30px",
},

errorIcon: {
color: "#f87171",
fontSize: "48px",
marginBottom: "18px",
},

errorTitle: {
margin: 0,
color: "#ffffff",
fontSize: "22px",
},

errorText: {
margin: "10px 0 20px",
color: "#94a3b8",
fontSize: "14px",
maxWidth: "500px",
},

retryButton: {
display: "flex",
alignItems: "center",
gap: "8px",
padding: "12px 18px",
border: "none",
borderRadius: "13px",
background: "linear-gradient(135deg, #7c3aed, #2563eb)",
color: "#ffffff",
fontWeight: "800",
cursor: "pointer",
},

loadingContainer: {
minHeight: "75vh",
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
gap: "18px",
},

loader: {
width: "52px",
height: "52px",
borderRadius: "50%",
border: "4px solid rgba(255,255,255,0.1)",
borderTop: "4px solid #8b5cf6",
animation: "spin 1s linear infinite",
},

loadingText: {
margin: 0,
color: "#94a3b8",
fontSize: "15px",
},
};
