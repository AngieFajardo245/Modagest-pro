import { useEffect, useMemo, useState } from "react";
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

function DashboardEmpleado() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("Empleado");
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);

  const [stats, setStats] = useState({
    productos: 0,
    ventas: 0,
    totalVendido: 0,
    ventasHoy: 0,
    totalHoy: 0,
    ventasMes: 0,
    totalMes: 0,
    unidadesVendidas: 0,
  });

  const [productoMasVendido, setProductoMasVendido] = useState(null);
  const [ultimaVenta, setUltimaVenta] = useState(null);
  const [loading, setLoading] = useState(true);

  const obtenerUsuario = () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        setNombre("Empleado");
        return;
      }

      const usuario = JSON.parse(usuarioGuardado);
      setNombre(usuario?.nombre || "Empleado");
    } catch (error) {
      console.error("Error leyendo usuario:", error);
      setNombre("Empleado");
    }
  };

  const obtenerPago = (venta) => {
    if (!venta) return null;

    if (venta.Pago) return venta.Pago;

    if (Array.isArray(venta.Pagos) && venta.Pagos.length > 0) {
      return venta.Pagos[0];
    }

    return null;
  };

  const ventaAprobada = (venta) => {
    const pago = obtenerPago(venta);

    if (!pago) return true;

    const estado = String(pago.estado || "")
      .toLowerCase()
      .trim();

    return (
      estado === "aprobado" || estado === "aprobada" || estado === "approved"
    );
  };

  const obtenerDatos = async () => {
    try {
      setLoading(true);

      const [productosRes, ventasRes] = await Promise.all([
        api.get("/productos"),
        api.get("/empleado/ventas"),
      ]);

      const productosData = Array.isArray(productosRes.data)
        ? productosRes.data
        : [];

      const ventasData = Array.isArray(ventasRes.data) ? ventasRes.data : [];

      setProductos(productosData);
      setVentas(ventasData);

      const ahora = new Date();

      const diaActual = ahora.getDate();
      const mesActual = ahora.getMonth();
      const anioActual = ahora.getFullYear();

      const ventasAprobadas = ventasData.filter(ventaAprobada);

      const ventasOrdenadas = [...ventasAprobadas].sort((a, b) => {
        return (
          new Date(b?.createdAt || 0).getTime() -
          new Date(a?.createdAt || 0).getTime()
        );
      });

      setUltimaVenta(ventasOrdenadas.length > 0 ? ventasOrdenadas[0] : null);

      const totalVendido = ventasAprobadas.reduce(
        (total, venta) => total + Number(venta?.total || 0),
        0,
      );

      const ventasHoy = ventasAprobadas.filter((venta) => {
        if (!venta?.createdAt) return false;

        const fechaVenta = new Date(venta.createdAt);

        if (Number.isNaN(fechaVenta.getTime())) return false;

        return (
          fechaVenta.getDate() === diaActual &&
          fechaVenta.getMonth() === mesActual &&
          fechaVenta.getFullYear() === anioActual
        );
      });

      const totalHoy = ventasHoy.reduce(
        (total, venta) => total + Number(venta?.total || 0),
        0,
      );

      const ventasMes = ventasAprobadas.filter((venta) => {
        if (!venta?.createdAt) return false;

        const fechaVenta = new Date(venta.createdAt);

        if (Number.isNaN(fechaVenta.getTime())) return false;

        return (
          fechaVenta.getMonth() === mesActual &&
          fechaVenta.getFullYear() === anioActual
        );
      });

      const totalMes = ventasMes.reduce(
        (total, venta) => total + Number(venta?.total || 0),
        0,
      );

      const unidadesVendidas = ventasAprobadas.reduce((totalVenta, venta) => {
        if (!Array.isArray(venta?.Detalles)) return totalVenta;

        return (
          totalVenta +
          venta.Detalles.reduce(
            (totalDetalle, detalle) =>
              totalDetalle + Number(detalle?.cantidad || 0),
            0,
          )
        );
      }, 0);

      const productosVendidos = {};

      ventasAprobadas.forEach((venta) => {
        if (!Array.isArray(venta?.Detalles)) return;

        venta.Detalles.forEach((detalle) => {
          const productoId = detalle?.productoId;

          if (!productoId) return;

          const cantidad = Number(detalle?.cantidad || 0);

          const nombreProducto =
            detalle?.Producto?.nombre || `Producto #${productoId}`;

          if (!productosVendidos[productoId]) {
            productosVendidos[productoId] = {
              id: productoId,
              nombre: nombreProducto,
              cantidad: 0,
            };
          }

          productosVendidos[productoId].cantidad += cantidad;
        });
      });

      const rankingProductos = Object.values(productosVendidos).sort(
        (a, b) => b.cantidad - a.cantidad,
      );

      setProductoMasVendido(
        rankingProductos.length > 0 ? rankingProductos[0] : null,
      );

      setStats({
        productos: productosData.length,
        ventas: ventasAprobadas.length,
        totalVendido,
        ventasHoy: ventasHoy.length,
        totalHoy,
        ventasMes: ventasMes.length,
        totalMes,
        unidadesVendidas,
      });
    } catch (error) {
      console.error("Error cargando datos del empleado:", error);

      setVentas([]);
      setProductos([]);

      setStats({
        productos: 0,
        ventas: 0,
        totalVendido: 0,
        ventasHoy: 0,
        totalHoy: 0,
        ventasMes: 0,
        totalMes: 0,
        unidadesVendidas: 0,
      });

      setProductoMasVendido(null);
      setUltimaVenta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuario();
    obtenerDatos();
  }, []);

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(valor) || 0);
  };

  const formatoFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return "Fecha inválida";
    }

    return fechaObj.toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const obtenerProductoUltimaVenta = () => {
    if (
      !ultimaVenta ||
      !Array.isArray(ultimaVenta.Detalles) ||
      ultimaVenta.Detalles.length === 0
    ) {
      return "Venta registrada";
    }

    const nombres = ultimaVenta.Detalles.map(
      (detalle) =>
        detalle?.Producto?.nombre ||
        `Producto #${detalle?.productoId || "N/A"}`,
    );

    if (nombres.length === 1) {
      return nombres[0];
    }

    return `${nombres[0]} y ${nombres.length - 1} producto(s) más`;
  };

  const porcentajeHoyVsMes = useMemo(() => {
    if (stats.totalMes <= 0) return 0;

    return Math.round((stats.totalHoy / stats.totalMes) * 100);
  }, [stats.totalHoy, stats.totalMes]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Cargando panel del empleado...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundGlowOne}></div>
      <div style={styles.backgroundGlowTwo}></div>

      <div style={styles.content}>
        <header style={styles.header}>
          <div>
            <div style={styles.welcomeBadge}>
              <FaUserTie />
              Panel de empleado
            </div>

            <h1 style={styles.title}>
              Hola, <span>{nombre}</span> 👋
            </h1>

            <p style={styles.subtitle}>
              Consulta tu actividad comercial y gestiona tus ventas desde un
              solo lugar.
            </p>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.commercialBadge}>
              <div style={styles.commercialIcon}>
                <FaChartLine />
              </div>

              <div>
                <strong>Área Comercial</strong>
                <small>Gestión de ventas</small>
              </div>
            </div>

            <button
              type="button"
              style={styles.refreshButton}
              onClick={obtenerDatos}
            >
              <FaSyncAlt />
              Actualizar
            </button>
          </div>
        </header>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIconPurple}>
              <FaBoxOpen />
            </div>

            <div>
              <p style={styles.statLabel}>Productos disponibles</p>
              <h2 style={styles.statNumber}>{stats.productos}</h2>
              <span style={styles.statDescription}>Productos registrados</span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIconBlue}>
              <FaShoppingBag />
            </div>

            <div>
              <p style={styles.statLabel}>Ventas realizadas</p>
              <h2 style={styles.statNumber}>{stats.ventas}</h2>
              <span style={styles.statDescription}>Ventas aprobadas</span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIconGreen}>
              <FaMoneyBillWave />
            </div>

            <div style={{ minWidth: 0 }}>
              <p style={styles.statLabel}>Total vendido</p>
              <h2 style={styles.statMoney}>
                {formatoMoneda(stats.totalVendido)}
              </h2>
              <span style={styles.statDescription}>Acumulado general</span>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <span style={styles.eyebrow}>RENDIMIENTO</span>
              <h2 style={styles.sectionTitle}>Tu actividad comercial</h2>
              <p style={styles.sectionSubtitle}>
                Una vista rápida de tus principales indicadores.
              </p>
            </div>
          </div>

          <div style={styles.performanceGrid}>
            <div style={styles.performanceCard}>
              <div style={styles.performanceIconBlue}>
                <FaCalendarDay />
              </div>

              <div style={styles.performanceContent}>
                <span style={styles.performanceLabel}>Ventas de hoy</span>

                <strong style={styles.performanceNumber}>
                  {stats.ventasHoy}
                </strong>

                <span style={styles.performanceDescription}>
                  {formatoMoneda(stats.totalHoy)}
                </span>
              </div>
            </div>

            <div style={styles.performanceCard}>
              <div style={styles.performanceIconPurple}>
                <FaCalendarAlt />
              </div>

              <div style={styles.performanceContent}>
                <span style={styles.performanceLabel}>Ventas del mes</span>

                <strong style={styles.performanceNumber}>
                  {stats.ventasMes}
                </strong>

                <span style={styles.performanceDescription}>
                  {formatoMoneda(stats.totalMes)}
                </span>
              </div>
            </div>

            <div style={styles.performanceCard}>
              <div style={styles.performanceIconOrange}>
                <FaBoxes />
              </div>

              <div style={styles.performanceContent}>
                <span style={styles.performanceLabel}>Unidades vendidas</span>

                <strong style={styles.performanceNumber}>
                  {stats.unidadesVendidas}
                </strong>

                <span style={styles.performanceDescription}>
                  Productos vendidos
                </span>
              </div>
            </div>

            <div style={styles.performanceCard}>
              <div style={styles.performanceIconGold}>
                <FaTrophy />
              </div>

              <div style={styles.performanceContent}>
                <span style={styles.performanceLabel}>Producto destacado</span>

                <strong style={styles.bestProductName}>
                  {productoMasVendido
                    ? productoMasVendido.nombre
                    : "Sin ventas"}
                </strong>

                <span style={styles.performanceDescription}>
                  {productoMasVendido
                    ? `${productoMasVendido.cantidad} unidad(es)`
                    : "Aún no hay datos"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.monthCard}>
          <div style={styles.monthTop}>
            <div>
              <span style={styles.eyebrow}>RESUMEN DEL MES</span>
              <h2 style={styles.monthTitle}>Actividad de hoy</h2>
            </div>

            <div style={styles.percentageBox}>
              <strong>{porcentajeHoyVsMes}%</strong>
              <span>del mes</span>
            </div>
          </div>

          <div style={styles.progressBackground}>
            <div
              style={{
                ...styles.progressFill,
                width: `${Math.min(porcentajeHoyVsMes, 100)}%`,
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
            <div>
              <span style={styles.eyebrow}>GESTIÓN COMERCIAL</span>

              <h2 style={styles.sectionTitle}>Acciones rápidas</h2>

              <p style={styles.sectionSubtitle}>
                Accede a las funciones principales de tu panel.
              </p>
            </div>
          </div>

          <div style={styles.actionsGrid}>
            <button
              type="button"
              style={styles.actionCard}
              onClick={() => navigate("/empleado/productos")}
            >
              <div style={styles.actionTop}>
                <div style={styles.actionIcon}>
                  <FaCashRegister />
                </div>

                <div style={styles.actionCircle}>
                  <FaArrowRight />
                </div>
              </div>

              <span style={styles.actionTag}>VENTAS</span>

              <h3 style={styles.actionTitle}>Registrar una venta</h3>

              <p style={styles.actionText}>
                Selecciona productos, indica cantidades y registra una nueva
                venta rápidamente.
              </p>

              <div style={styles.actionFooter}>
                <span>Ir a productos</span>
                <FaArrowRight />
              </div>
            </button>

            <button
              type="button"
              style={styles.actionCardBlue}
              onClick={() => navigate("/empleado/ventas")}
            >
              <div style={styles.actionTop}>
                <div style={styles.actionIconBlue}>
                  <FaShoppingBag />
                </div>

                <div style={styles.actionCircle}>
                  <FaArrowRight />
                </div>
              </div>

              <span style={styles.actionTagBlue}>HISTORIAL</span>

              <h3 style={styles.actionTitle}>Historial de ventas</h3>

              <p style={styles.actionText}>
                Consulta tus ventas realizadas y revisa los detalles de cada
                operación.
              </p>

              <div style={styles.actionFooterBlue}>
                <span>Ver ventas</span>
                <FaArrowRight />
              </div>
            </button>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.lastSaleHeader}>
            <div style={styles.lastSaleIcon}>
              <FaClock />
            </div>

            <div>
              <span style={styles.eyebrow}>ACTIVIDAD RECIENTE</span>

              <h2 style={styles.lastSaleTitle}>Última venta realizada</h2>
            </div>
          </div>

          {ultimaVenta ? (
            <div style={styles.saleCard}>
              <div style={styles.saleMain}>
                <span style={styles.saleLabel}>Venta #{ultimaVenta.id}</span>

                <strong style={styles.saleProduct}>
                  {obtenerProductoUltimaVenta()}
                </strong>

                <span style={styles.saleDate}>
                  {formatoFecha(ultimaVenta.createdAt)}
                </span>
              </div>

              <div style={styles.saleRight}>
                <strong style={styles.saleTotal}>
                  {formatoMoneda(ultimaVenta.total)}
                </strong>

                <span style={styles.saleStatus}>
                  <FaCheckCircle />
                  Aprobada
                </span>
              </div>
            </div>
          ) : (
            <div style={styles.noSale}>
              <FaShoppingBag />
              <span>Todavía no has realizado ventas aprobadas.</span>
            </div>
          )}
        </section>

        <section style={styles.summarySection}>
          <div style={styles.summaryIcon}>
            <FaChartLine />
          </div>

          <div>
            <span style={styles.eyebrow}>RESUMEN DE ACTIVIDAD</span>

            <h3 style={styles.summaryTitle}>Tu desempeño comercial</h3>

            <p style={styles.summaryText}>
              Actualmente tienes <strong>{stats.ventas}</strong> ventas
              registradas, has vendido <strong>{stats.unidadesVendidas}</strong>{" "}
              unidades y has generado{" "}
              <strong>{formatoMoneda(stats.totalVendido)}</strong>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardEmpleado;

const styles = {
  container: {
    position: "relative",
    minHeight: "100vh",
    padding: "30px",
    background:
      "linear-gradient(145deg, #080b14 0%, #0d1220 48%, #090d18 100%)",
    color: "#ffffff",
    overflow: "hidden",
  },

  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1450px",
    margin: "0 auto",
  },

  backgroundGlowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    top: "-180px",
    right: "-100px",
    borderRadius: "50%",
    background: "rgba(124,58,237,0.10)",
    filter: "blur(100px)",
    pointerEvents: "none",
  },

  backgroundGlowTwo: {
    position: "absolute",
    width: "350px",
    height: "350px",
    bottom: "5%",
    left: "-180px",
    borderRadius: "50%",
    background: "rgba(37,99,235,0.08)",
    filter: "blur(100px)",
    pointerEvents: "none",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
    flexWrap: "wrap",
    marginBottom: "35px",
  },

  welcomeBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(139,92,246,0.10)",
    border: "1px solid rgba(139,92,246,0.20)",
    color: "#c4b5fd",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.3px",
    marginBottom: "15px",
  },

  title: {
    margin: 0,
    fontSize: "clamp(32px, 4vw, 48px)",
    fontWeight: "850",
    letterSpacing: "-1.5px",
    lineHeight: "1.1",
    color: "#f8fafc",
  },

  titleSpan: {
    color: "#a78bfa",
  },

  subtitle: {
    maxWidth: "650px",
    margin: "13px 0 0",
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  commercialBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 17px",
    borderRadius: "17px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
  },

  commercialIcon: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "13px",
    background: "rgba(139,92,246,0.14)",
    color: "#a78bfa",
    fontSize: "18px",
  },

  commercialBadgeStrong: {
    color: "#ffffff",
    fontSize: "13px",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "13px 17px",
    border: "1px solid rgba(139,92,246,0.25)",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(37,99,235,0.95))",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(79,70,229,0.20)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
    marginBottom: "42px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "17px",
    padding: "23px",
    borderRadius: "22px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.16)",
    backdropFilter: "blur(18px)",
  },

  statIconPurple: {
    width: "58px",
    height: "58px",
    flexShrink: 0,
    borderRadius: "17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    color: "#ffffff",
    fontSize: "23px",
    boxShadow: "0 10px 25px rgba(124,58,237,0.22)",
  },

  statIconBlue: {
    width: "58px",
    height: "58px",
    flexShrink: 0,
    borderRadius: "17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#ffffff",
    fontSize: "23px",
    boxShadow: "0 10px 25px rgba(37,99,235,0.22)",
  },

  statIconGreen: {
    width: "58px",
    height: "58px",
    flexShrink: 0,
    borderRadius: "17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #059669, #10b981)",
    color: "#ffffff",
    fontSize: "23px",
    boxShadow: "0 10px 25px rgba(16,185,129,0.20)",
  },

  statLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "700",
  },

  statNumber: {
    margin: "5px 0 2px",
    color: "#f8fafc",
    fontSize: "30px",
    fontWeight: "850",
  },

  statMoney: {
    margin: "5px 0 2px",
    color: "#34d399",
    fontSize: "22px",
    fontWeight: "850",
    whiteSpace: "nowrap",
  },

  statDescription: {
    color: "#64748b",
    fontSize: "11px",
  },

  section: {
    marginBottom: "40px",
  },

  sectionHeader: {
    marginBottom: "20px",
  },

  eyebrow: {
    display: "block",
    marginBottom: "6px",
    color: "#8b5cf6",
    fontSize: "10px",
    fontWeight: "850",
    letterSpacing: "1.6px",
  },

  sectionTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "26px",
    fontWeight: "850",
    letterSpacing: "-0.5px",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  performanceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "15px",
  },

  performanceCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minWidth: 0,
    padding: "19px",
    borderRadius: "19px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.065)",
    backdropFilter: "blur(15px)",
  },

  performanceIconBlue: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    background: "rgba(37,99,235,0.13)",
    color: "#60a5fa",
    fontSize: "18px",
  },

  performanceIconPurple: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    background: "rgba(124,58,237,0.13)",
    color: "#a78bfa",
    fontSize: "18px",
  },

  performanceIconOrange: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    background: "rgba(245,158,11,0.12)",
    color: "#fbbf24",
    fontSize: "18px",
  },

  performanceIconGold: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    background: "rgba(251,191,36,0.12)",
    color: "#fcd34d",
    fontSize: "18px",
  },

  performanceContent: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  performanceLabel: {
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "750",
  },

  performanceNumber: {
    color: "#f8fafc",
    fontSize: "24px",
    fontWeight: "850",
  },

  performanceDescription: {
    color: "#64748b",
    fontSize: "10px",
  },

  bestProductName: {
    maxWidth: "180px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#f8fafc",
    fontSize: "14px",
    fontWeight: "850",
  },

  monthCard: {
    marginBottom: "42px",
    padding: "23px",
    borderRadius: "22px",
    background:
      "linear-gradient(145deg, rgba(124,58,237,0.10), rgba(37,99,235,0.045))",
    border: "1px solid rgba(139,92,246,0.16)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.12)",
  },

  monthTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "18px",
  },

  monthTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "20px",
    fontWeight: "800",
  },

  percentageBox: {
    display: "flex",
    alignItems: "flex-end",
    gap: "5px",
    color: "#a78bfa",
  },

  percentageBoxStrong: {
    fontSize: "25px",
    fontWeight: "850",
  },

  percentageBoxSpan: {
    fontSize: "11px",
    color: "#64748b",
    paddingBottom: "4px",
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
    color: "#64748b",
    fontSize: "11px",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "18px",
  },

  actionCard: {
    width: "100%",
    textAlign: "left",
    border: "1px solid rgba(139,92,246,0.16)",
    borderRadius: "23px",
    padding: "25px",
    background:
      "linear-gradient(145deg, rgba(124,58,237,0.15), rgba(37,99,235,0.07))",
    color: "#ffffff",
    cursor: "pointer",
    backdropFilter: "blur(16px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
  },

  actionCardBlue: {
    width: "100%",
    textAlign: "left",
    border: "1px solid rgba(59,130,246,0.16)",
    borderRadius: "23px",
    padding: "25px",
    background:
      "linear-gradient(145deg, rgba(37,99,235,0.15), rgba(14,165,233,0.06))",
    color: "#ffffff",
    cursor: "pointer",
    backdropFilter: "blur(16px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
  },

  actionTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  actionIcon: {
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "17px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    color: "#ffffff",
    fontSize: "23px",
  },

  actionIconBlue: {
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "17px",
    background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
    color: "#ffffff",
    fontSize: "23px",
  },

  actionCircle: {
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    color: "#94a3b8",
    fontSize: "12px",
  },

  actionTag: {
    color: "#a78bfa",
    fontSize: "9px",
    fontWeight: "850",
    letterSpacing: "1.5px",
  },

  actionTagBlue: {
    color: "#60a5fa",
    fontSize: "9px",
    fontWeight: "850",
    letterSpacing: "1.5px",
  },

  actionTitle: {
    margin: "7px 0 0",
    color: "#f8fafc",
    fontSize: "20px",
    fontWeight: "850",
  },

  actionText: {
    margin: "9px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.65",
  },

  actionFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "22px",
    paddingTop: "15px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    color: "#a78bfa",
    fontSize: "12px",
    fontWeight: "750",
  },

  actionFooterBlue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "22px",
    paddingTop: "15px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    color: "#60a5fa",
    fontSize: "12px",
    fontWeight: "750",
  },

  lastSaleHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "18px",
  },

  lastSaleIcon: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    background: "rgba(59,130,246,0.12)",
    color: "#60a5fa",
    fontSize: "18px",
  },

  lastSaleTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "21px",
    fontWeight: "850",
  },

  saleCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    padding: "21px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    backdropFilter: "blur(15px)",
  },

  saleMain: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  saleLabel: {
    color: "#8b5cf6",
    fontSize: "11px",
    fontWeight: "850",
  },

  saleProduct: {
    color: "#f8fafc",
    fontSize: "17px",
    fontWeight: "750",
  },

  saleDate: {
    color: "#64748b",
    fontSize: "11px",
  },

  saleRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "6px",
  },

  saleTotal: {
    color: "#34d399",
    fontSize: "21px",
    fontWeight: "850",
  },

  saleStatus: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#6ee7b7",
    fontSize: "11px",
    fontWeight: "750",
  },

  noSale: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    padding: "28px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "#64748b",
    fontSize: "13px",
  },

  summarySection: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginTop: "40px",
    padding: "22px",
    borderRadius: "21px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  summaryIcon: {
    width: "52px",
    height: "52px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    background: "rgba(124,58,237,0.13)",
    color: "#a78bfa",
    fontSize: "21px",
  },

  summaryTitle: {
    margin: "5px 0",
    color: "#f8fafc",
    fontSize: "17px",
    fontWeight: "800",
  },

  summaryText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.65",
  },

  loadingContainer: {
    minHeight: "75vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "17px",
    background: "#080b14",
  },

  loader: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "4px solid rgba(255,255,255,0.08)",
    borderTop: "4px solid #8b5cf6",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },
};
