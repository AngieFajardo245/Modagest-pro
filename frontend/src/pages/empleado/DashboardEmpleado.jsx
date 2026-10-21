import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FaBoxOpen,
  FaShoppingBag,
  FaCashRegister,
  FaChartLine,
  FaArrowRight,
  FaMoneyBillWave,
  FaUserTie,
  FaClock,
  FaCheckCircle,
  FaCalendarDay,
  FaCalendarAlt,
  FaTrophy,
  FaBoxes,
  FaSyncAlt,
} from "react-icons/fa";

const ESTADISTICAS_INICIALES = {
  productos: 0,
  ventas: 0,
  totalVendido: 0,
  ventasHoy: 0,
  totalHoy: 0,
  ventasMes: 0,
  totalMes: 0,
  unidadesVendidas: 0,
};

const moneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const formatoMoneda = (valor) => moneda.format(Number(valor) || 0);

const obtenerNombreUsuario = () => {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    return usuario?.nombre || "Empleado";
  } catch {
    return "Empleado";
  }
};

const obtenerPago = (venta) =>
  venta?.Pago || (Array.isArray(venta?.Pagos) ? venta.Pagos[0] : null);

const ventaAprobada = (venta) => {
  const pago = obtenerPago(venta);

  if (!pago) return true;

  const estado = String(pago.estado || "")
    .trim()
    .toLowerCase();
  return ["aprobado", "aprobada", "approved"].includes(estado);
};

const esMismoMes = (fecha, referencia) =>
  fecha.getFullYear() === referencia.getFullYear() &&
  fecha.getMonth() === referencia.getMonth();

const formatoFecha = (valor) => {
  if (!valor) return "Sin fecha";

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) return "Fecha inválida";

  return fecha.toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

function Indicador({ icono: Icono, color, titulo, valor, descripcion }) {
  return (
    <div style={styles.statCard}>
      <div
        style={{
          ...styles.iconBox,
          background: color,
          color: "#fff",
        }}
      >
        <Icono aria-hidden="true" />
      </div>

      <div style={styles.flexContent}>
        <p style={styles.statLabel}>{titulo}</p>
        <h2 style={styles.statValue}>{valor}</h2>
        <span style={styles.description}>{descripcion}</span>
      </div>
    </div>
  );
}

function Rendimiento({ icono: Icono, color, titulo, valor, descripcion }) {
  return (
    <div style={styles.performanceCard}>
      <div
        style={{
          ...styles.iconBox,
          background: `${color}20`,
          color,
        }}
      >
        <Icono aria-hidden="true" />
      </div>

      <div style={styles.flexContent}>
        <span style={styles.statLabel}>{titulo}</span>
        <strong style={styles.performanceValue}>{valor}</strong>
        <span style={styles.description}>{descripcion}</span>
      </div>
    </div>
  );
}

export default function DashboardEmpleado() {
  const navigate = useNavigate();
  const [nombre] = useState(obtenerNombreUsuario);
  const [stats, setStats] = useState(ESTADISTICAS_INICIALES);
  const [productoMasVendido, setProductoMasVendido] = useState(null);
  const [ultimaVenta, setUltimaVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  const obtenerDatos = useCallback(async () => {
    setActualizando(true);
    setError("");

    try {
      const [productosRes, ventasRes] = await Promise.all([
        api.get("/productos"),
        api.get("/empleado/ventas"),
      ]);

      const productos = Array.isArray(productosRes.data)
        ? productosRes.data
        : [];

      const ventas = (
        Array.isArray(ventasRes.data) ? ventasRes.data : []
      ).filter(ventaAprobada);

      const ahora = new Date();
      const productosVendidos = {};
      let totalVendido = 0;
      let ventasHoy = 0;
      let totalHoy = 0;
      let ventasMes = 0;
      let totalMes = 0;
      let unidadesVendidas = 0;

      ventas.forEach((venta) => {
        const total = Number(venta?.total) || 0;
        const fecha = new Date(venta?.createdAt);
        totalVendido += total;

        if (!Number.isNaN(fecha.getTime()) && esMismoMes(fecha, ahora)) {
          ventasMes += 1;
          totalMes += total;

          if (fecha.getDate() === ahora.getDate()) {
            ventasHoy += 1;
            totalHoy += total;
          }
        }

        const detalles = Array.isArray(venta?.Detalles) ? venta.Detalles : [];

        detalles.forEach((detalle) => {
          const cantidad = Number(detalle?.cantidad) || 0;
          unidadesVendidas += cantidad;

          const id = detalle?.productoId;

          if (!id || cantidad <= 0) return;

          if (!productosVendidos[id]) {
            productosVendidos[id] = {
              id,
              nombre: detalle?.Producto?.nombre || `Producto #${id}`,
              cantidad: 0,
            };
          }

          productosVendidos[id].cantidad += cantidad;
        });
      });

      const ranking = Object.values(productosVendidos).sort(
        (a, b) => b.cantidad - a.cantidad,
      );

      const ventasOrdenadas = [...ventas].sort(
        (a, b) =>
          (new Date(b?.createdAt).getTime() || 0) -
          (new Date(a?.createdAt).getTime() || 0),
      );

      setStats({
        productos: productos.length,
        ventas: ventas.length,
        totalVendido,
        ventasHoy,
        totalHoy,
        ventasMes,
        totalMes,
        unidadesVendidas,
      });

      setProductoMasVendido(ranking[0] || null);
      setUltimaVenta(ventasOrdenadas[0] || null);
    } catch (error) {
      console.error("Error cargando datos del empleado:", error);
      setError(
        "No se pudieron actualizar los datos. Revisa tu conexión e inténtalo nuevamente.",
      );
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  }, []);

  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      obtenerDatos();
    }, 0);

    return () => window.clearTimeout(temporizador);
  }, [obtenerDatos]);

  const porcentajeHoyVsMes = useMemo(() => {
    if (stats.totalMes <= 0 || stats.totalHoy <= 0) return 0;

    return Math.min(100, Math.round((stats.totalHoy / stats.totalMes) * 100));
  }, [stats.totalHoy, stats.totalMes]);

  const productoUltimaVenta = useMemo(() => {
    const detalles = ultimaVenta?.Detalles;

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return "Venta registrada";
    }

    const nombres = detalles.map(
      (detalle) =>
        detalle?.Producto?.nombre ||
        `Producto #${detalle?.productoId || "N/A"}`,
    );

    return nombres.length === 1
      ? nombres[0]
      : `${nombres[0]} y ${nombres.length - 1} producto(s) más`;
  }, [ultimaVenta]);

  if (loading) {
    return (
      <div style={styles.loadingContainer} role="status">
        <FaSyncAlt style={styles.loadingIcon} aria-hidden="true" />
        <p style={styles.loadingText}>Cargando panel del empleado...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <div style={styles.flexContent}>
            <div style={styles.welcomeBadge}>
              <FaUserTie aria-hidden="true" />
              Panel de empleado
            </div>

            <h1 style={styles.title}>
              Hola, <span style={styles.titleSpan}>{nombre}</span>
            </h1>

            <p style={styles.subtitle}>
              Consulta tu actividad comercial y gestiona tus ventas desde un
              solo lugar.
            </p>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.commercialBadge}>
              <div style={styles.commercialIcon}>
                <FaChartLine aria-hidden="true" />
              </div>

              <div style={styles.flexContent}>
                <strong style={styles.commercialStrong}>Área Comercial</strong>
                <span style={styles.description}>Gestión de ventas</span>
              </div>
            </div>

            <button
              type="button"
              style={{
                ...styles.refreshButton,
                opacity: actualizando ? 0.7 : 1,
                cursor: actualizando ? "wait" : "pointer",
              }}
              onClick={obtenerDatos}
              disabled={actualizando}
            >
              <FaSyncAlt aria-hidden="true" />
              {actualizando ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </header>

        {error && (
          <div style={styles.error} role="alert">
            {error}
          </div>
        )}

        <section style={styles.statsGrid} aria-label="Indicadores generales">
          <Indicador
            icono={FaBoxOpen}
            color="linear-gradient(135deg, #7c3aed, #8b5cf6)"
            titulo="Productos disponibles"
            valor={stats.productos}
            descripcion="Productos registrados"
          />

          <Indicador
            icono={FaShoppingBag}
            color="linear-gradient(135deg, #2563eb, #3b82f6)"
            titulo="Ventas realizadas"
            valor={stats.ventas}
            descripcion="Ventas aprobadas"
          />

          <Indicador
            icono={FaMoneyBillWave}
            color="linear-gradient(135deg, #059669, #10b981)"
            titulo="Total vendido"
            valor={formatoMoneda(stats.totalVendido)}
            descripcion="Acumulado general"
          />
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.eyebrow}>RENDIMIENTO</span>
            <h2 style={styles.sectionTitle}>Tu actividad comercial</h2>
            <p style={styles.sectionSubtitle}>
              Una vista rápida de tus principales indicadores.
            </p>
          </div>

          <div style={styles.performanceGrid}>
            <Rendimiento
              icono={FaCalendarDay}
              color="#60a5fa"
              titulo="Ventas de hoy"
              valor={stats.ventasHoy}
              descripcion={formatoMoneda(stats.totalHoy)}
            />

            <Rendimiento
              icono={FaCalendarAlt}
              color="#a78bfa"
              titulo="Ventas del mes"
              valor={stats.ventasMes}
              descripcion={formatoMoneda(stats.totalMes)}
            />

            <Rendimiento
              icono={FaBoxes}
              color="#fbbf24"
              titulo="Unidades vendidas"
              valor={stats.unidadesVendidas}
              descripcion="Productos vendidos"
            />

            <Rendimiento
              icono={FaTrophy}
              color="#fcd34d"
              titulo="Producto destacado"
              valor={productoMasVendido?.nombre || "Sin ventas"}
              descripcion={
                productoMasVendido
                  ? `${productoMasVendido.cantidad} unidad(es)`
                  : "Aún no hay datos"
              }
            />
          </div>
        </section>

        <section style={styles.monthCard}>
          <div style={styles.monthTop}>
            <div style={styles.flexContent}>
              <span style={styles.eyebrow}>RESUMEN DEL MES</span>
              <h2 style={styles.monthTitle}>Actividad de hoy</h2>
            </div>

            <div style={styles.percentageBox}>
              <strong style={styles.percentageStrong}>
                {porcentajeHoyVsMes}%
              </strong>
              <span style={styles.description}>del mes</span>
            </div>
          </div>

          <div
            style={styles.progressBackground}
            role="progressbar"
            aria-label="Porcentaje de ingresos de hoy respecto al mes"
            aria-valuenow={porcentajeHoyVsMes}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              style={{
                ...styles.progressFill,
                width: `${porcentajeHoyVsMes}%`,
              }}
            />
          </div>

          <p style={styles.monthDescription}>
            Las ventas de hoy representan <strong>{porcentajeHoyVsMes}%</strong>{" "}
            del valor vendido durante este mes.
          </p>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.eyebrow}>GESTIÓN COMERCIAL</span>
            <h2 style={styles.sectionTitle}>Acciones rápidas</h2>
            <p style={styles.sectionSubtitle}>
              Accede a las funciones principales de tu panel.
            </p>
          </div>

          <div style={styles.actionsGrid}>
            <button
              type="button"
              style={styles.actionCard}
              onClick={() => navigate("/empleado/productos")}
            >
              <div style={styles.actionTop}>
                <div style={styles.actionIcon}>
                  <FaCashRegister aria-hidden="true" />
                </div>
                <FaArrowRight aria-hidden="true" />
              </div>

              <span style={styles.actionTag}>VENTAS</span>
              <h3 style={styles.actionTitle}>Registrar una venta</h3>
              <p style={styles.actionText}>
                Selecciona productos, indica cantidades y registra una nueva
                venta rápidamente.
              </p>

              <div style={styles.actionFooter}>
                <span>Ir a productos</span>
                <FaArrowRight aria-hidden="true" />
              </div>
            </button>

            <button
              type="button"
              style={styles.actionCardBlue}
              onClick={() => navigate("/empleado/ventas")}
            >
              <div style={styles.actionTop}>
                <div style={styles.actionIconBlue}>
                  <FaShoppingBag aria-hidden="true" />
                </div>
                <FaArrowRight aria-hidden="true" />
              </div>

              <span style={styles.actionTagBlue}>HISTORIAL</span>
              <h3 style={styles.actionTitle}>Historial de ventas</h3>
              <p style={styles.actionText}>
                Consulta tus ventas realizadas y revisa los detalles de cada
                operación.
              </p>

              <div style={styles.actionFooterBlue}>
                <span>Ver ventas</span>
                <FaArrowRight aria-hidden="true" />
              </div>
            </button>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.lastSaleHeader}>
            <div style={styles.commercialIcon}>
              <FaClock aria-hidden="true" />
            </div>

            <div style={styles.flexContent}>
              <span style={styles.eyebrow}>ACTIVIDAD RECIENTE</span>
              <h2 style={styles.lastSaleTitle}>Última venta realizada</h2>
            </div>
          </div>

          {ultimaVenta ? (
            <div style={styles.saleCard}>
              <div style={styles.saleMain}>
                <span style={styles.saleLabel}>Venta #{ultimaVenta.id}</span>
                <strong style={styles.saleProduct}>
                  {productoUltimaVenta}
                </strong>
                <span style={styles.description}>
                  {formatoFecha(ultimaVenta.createdAt)}
                </span>
              </div>

              <div style={styles.saleRight}>
                <strong style={styles.saleTotal}>
                  {formatoMoneda(ultimaVenta.total)}
                </strong>
                <span style={styles.saleStatus}>
                  <FaCheckCircle aria-hidden="true" />
                  Aprobada
                </span>
              </div>
            </div>
          ) : (
            <div style={styles.noSale}>
              <FaShoppingBag aria-hidden="true" />
              <span>Todavía no has realizado ventas aprobadas.</span>
            </div>
          )}
        </section>

        <section style={styles.summarySection}>
          <div style={styles.commercialIcon}>
            <FaChartLine aria-hidden="true" />
          </div>

          <div style={styles.flexContent}>
            <span style={styles.eyebrow}>RESUMEN DE ACTIVIDAD</span>
            <h3 style={styles.summaryTitle}>Tu desempeño comercial</h3>
            <p style={styles.summaryText}>
              Actualmente tienes <strong>{stats.ventas}</strong> ventas
              aprobadas, has vendido <strong>{stats.unidadesVendidas}</strong>{" "}
              unidades y has generado{" "}
              <strong>{formatoMoneda(stats.totalVendido)}</strong>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

const panel = {
  minWidth: 0,
  boxSizing: "border-box",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  borderRadius: "20px",
  padding: "clamp(14px, 2vw, 22px)",
};

const icono = {
  width: "44px",
  height: "44px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "13px",
  fontSize: "20px",
};

const accion = {
  ...panel,
  width: "100%",
  textAlign: "left",
  color: "#fff",
  cursor: "pointer",
  fontFamily: "inherit",
  overflowWrap: "anywhere",
  boxShadow: "0 12px 30px rgba(0,0,0,0.16)",
};

const pieAccion = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  marginTop: "18px",
  paddingTop: "14px",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  fontSize: "12px",
  fontWeight: 700,
};

const styles = {
  container: {
    position: "relative",
    width: "100%",
    minWidth: 0,
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "clamp(8px, 2vw, 24px)",
    background:
      "linear-gradient(145deg, #080b14 0%, #0d1220 48%, #090d18 100%)",
    color: "#fff",
    overflowWrap: "anywhere",
  },

  content: {
    width: "100%",
    minWidth: 0,
    maxWidth: "1450px",
    margin: "0 auto",
  },

  flexContent: {
    minWidth: 0,
  },

  header: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
    alignItems: "center",
    gap: "18px",
    marginBottom: "24px",
    minWidth: 0,
  },

  welcomeBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(139,92,246,0.10)",
    border: "1px solid rgba(139,92,246,0.20)",
    color: "#c4b5fd",
    fontSize: "12px",
    fontWeight: 800,
    marginBottom: "12px",
  },

  title: {
    margin: 0,
    fontSize: "clamp(24px, 3vw, 42px)",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
    color: "#f8fafc",
    overflowWrap: "anywhere",
  },

  titleSpan: {
    color: "#a78bfa",
  },

  subtitle: {
    maxWidth: "650px",
    margin: "10px 0 0",
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    minWidth: 0,
  },

  commercialBadge: {
    ...panel,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    flex: "1 1 180px",
  },

  commercialIcon: {
    ...icono,
    background: "rgba(139,92,246,0.14)",
    color: "#a78bfa",
  },

  commercialStrong: {
    display: "block",
    marginBottom: "4px",
    color: "#fff",
    fontSize: "13px",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minHeight: "44px",
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    border: "1px solid rgba(139,92,246,0.25)",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    color: "#fff",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: 700,
    boxShadow: "0 10px 25px rgba(79,70,229,0.20)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
    gap: "12px",
    marginBottom: "28px",
    minWidth: 0,
  },

  statCard: {
    ...panel,
    display: "grid",
    gridTemplateColumns: "44px minmax(0, 1fr)",
    alignItems: "center",
    gap: "12px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))",
    boxShadow: "0 12px 30px rgba(0,0,0,0.16)",
  },

  iconBox: {
    ...icono,
  },

  statLabel: {
    display: "block",
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.4,
  },

  statValue: {
    margin: "5px 0",
    color: "#f8fafc",
    fontSize: "clamp(22px, 2.5vw, 30px)",
    fontWeight: 800,
    lineHeight: 1.3,
    overflowWrap: "anywhere",
  },

  description: {
    display: "block",
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  section: {
    minWidth: 0,
    marginBottom: "28px",
  },

  sectionHeader: {
    marginBottom: "16px",
  },

  eyebrow: {
    display: "block",
    marginBottom: "6px",
    color: "#a78bfa",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.2px",
    lineHeight: 1.5,
  },

  sectionTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "clamp(20px, 2.5vw, 26px)",
    fontWeight: 800,
    lineHeight: 1.3,
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  performanceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: "12px",
    minWidth: 0,
  },

  performanceCard: {
    ...panel,
    display: "grid",
    gridTemplateColumns: "44px minmax(0, 1fr)",
    alignItems: "center",
    gap: "12px",
  },

  performanceValue: {
    display: "block",
    margin: "5px 0",
    color: "#f8fafc",
    fontSize: "20px",
    fontWeight: 800,
    lineHeight: 1.4,
    overflowWrap: "anywhere",
  },

  monthCard: {
    ...panel,
    marginBottom: "28px",
    background:
      "linear-gradient(145deg, rgba(124,58,237,0.10), rgba(37,99,235,0.045))",
    borderColor: "rgba(139,92,246,0.16)",
  },

  monthTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "16px",
  },

  monthTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "20px",
    fontWeight: 800,
  },

  percentageBox: {
    display: "flex",
    alignItems: "baseline",
    gap: "5px",
    color: "#a78bfa",
  },

  percentageStrong: {
    fontSize: "25px",
    fontWeight: 800,
  },

  progressBackground: {
    width: "100%",
    height: "8px",
    overflow: "hidden",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.07)",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #7c3aed, #2563eb)",
    transition: "width 0.4s ease",
  },

  monthDescription: {
    margin: "12px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: 1.6,
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
    gap: "12px",
    minWidth: 0,
  },

  actionCard: {
    ...accion,
    borderColor: "rgba(139,92,246,0.16)",
    background:
      "linear-gradient(145deg, rgba(124,58,237,0.15), rgba(37,99,235,0.07))",
  },

  actionCardBlue: {
    ...accion,
    borderColor: "rgba(59,130,246,0.16)",
    background:
      "linear-gradient(145deg, rgba(37,99,235,0.15), rgba(14,165,233,0.06))",
  },

  actionTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "16px",
  },

  actionIcon: {
    ...icono,
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    color: "#fff",
  },

  actionIconBlue: {
    ...icono,
    background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
    color: "#fff",
  },

  actionTag: {
    color: "#a78bfa",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.2px",
  },

  actionTagBlue: {
    color: "#60a5fa",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.2px",
  },

  actionTitle: {
    margin: "7px 0 0",
    color: "#f8fafc",
    fontSize: "20px",
    fontWeight: 800,
    lineHeight: 1.3,
  },

  actionText: {
    margin: "9px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  actionFooter: {
    ...pieAccion,
    color: "#a78bfa",
  },

  actionFooterBlue: {
    ...pieAccion,
    color: "#60a5fa",
  },

  lastSaleHeader: {
    display: "grid",
    gridTemplateColumns: "44px minmax(0, 1fr)",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },

  lastSaleTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "clamp(18px, 2vw, 21px)",
    fontWeight: 800,
    lineHeight: 1.3,
  },

  saleCard: {
    ...panel,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
  },

  saleMain: {
    minWidth: 0,
    flex: "1 1 180px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  saleLabel: {
    color: "#a78bfa",
    fontSize: "12px",
    fontWeight: 800,
  },

  saleProduct: {
    color: "#f8fafc",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1.4,
    overflowWrap: "anywhere",
  },

  saleRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "6px",
    minWidth: 0,
    maxWidth: "100%",
  },

  saleTotal: {
    color: "#34d399",
    fontSize: "21px",
    fontWeight: 800,
    overflowWrap: "anywhere",
  },

  saleStatus: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#6ee7b7",
    fontSize: "12px",
    fontWeight: 700,
  },

  noSale: {
    ...panel,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
    color: "#94a3b8",
    fontSize: "13px",
    textAlign: "center",
    lineHeight: 1.5,
  },

  summarySection: {
    ...panel,
    display: "grid",
    gridTemplateColumns: "44px minmax(0, 1fr)",
    alignItems: "start",
    gap: "12px",
    marginTop: "28px",
  },

  summaryTitle: {
    margin: "5px 0",
    color: "#f8fafc",
    fontSize: "17px",
    fontWeight: 800,
    lineHeight: 1.4,
  },

  summaryText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  error: {
    ...panel,
    marginBottom: "20px",
    borderColor: "rgba(248,113,113,0.35)",
    background: "rgba(127,29,29,0.20)",
    color: "#fecaca",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  loadingContainer: {
    minHeight: "75vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "17px",
    padding: "16px",
    boxSizing: "border-box",
    background: "#080b14",
  },

  loadingIcon: {
    fontSize: "36px",
    color: "#a78bfa",
  },

  loadingText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
    textAlign: "center",
  },
};
