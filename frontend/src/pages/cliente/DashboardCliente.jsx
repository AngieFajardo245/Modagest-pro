import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function DashboardCliente() {
  const [nombre, setNombre] = useState("Cliente");
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const obtenerUsuario = () => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      setNombre("Cliente");
      return;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado);
      setNombre(usuario?.nombre?.trim() || "Cliente");
    } catch {
      setNombre("Cliente");
    }
  };

  const obtenerCompras = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/cliente/compras");
      const data = Array.isArray(res.data) ? res.data : [];

      setCompras(data);
    } catch (err) {
      console.error("Error obteniendo compras:", err);

      setError(
        err.response?.data?.message || "No se pudieron cargar tus compras.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuario();
    obtenerCompras();
  }, []);

  const formatearDinero = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(valor) || 0);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";

    const fechaObj = new Date(fecha);

    if (Number.isNaN(fechaObj.getTime())) {
      return "Fecha no disponible";
    }

    return fechaObj.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const obtenerFechaCompra = (compra) => {
    const fecha = new Date(
      compra?.createdAt || compra?.fecha || compra?.updatedAt || 0,
    ).getTime();

    return Number.isNaN(fecha) ? 0 : fecha;
  };

  const obtenerEstadoPago = (compra) => {
    const estado = String(
      compra?.Pago?.estado ||
        compra?.pago?.estado ||
        compra?.estadoPago ||
        compra?.estado ||
        "",
    ).toLowerCase();

    if (
      estado === "aprobado" ||
      estado === "aprobada" ||
      estado === "approved" ||
      estado === "completado" ||
      estado === "completada"
    ) {
      return "aprobado";
    }

    if (
      estado === "pendiente" ||
      estado === "pending" ||
      estado === "en proceso"
    ) {
      return "pendiente";
    }

    if (
      estado === "rechazado" ||
      estado === "rechazada" ||
      estado === "rejected" ||
      estado === "cancelado" ||
      estado === "cancelada"
    ) {
      return "rechazado";
    }

    return "desconocido";
  };

  const comprasOrdenadas = useMemo(() => {
    return [...compras].sort(
      (a, b) => obtenerFechaCompra(b) - obtenerFechaCompra(a),
    );
  }, [compras]);

  const comprasAprobadas = useMemo(() => {
    return comprasOrdenadas.filter(
      (compra) => obtenerEstadoPago(compra) === "aprobado",
    );
  }, [comprasOrdenadas]);

  const totalCompras = compras.length;

  const dineroGastado = useMemo(() => {
    return comprasAprobadas.reduce(
      (total, compra) => total + (Number(compra?.total) || 0),
      0,
    );
  }, [comprasAprobadas]);

  const comprasRecientes = comprasOrdenadas.slice(0, 3);
  const ultimaCompra = comprasOrdenadas[0];

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>

          <h2 style={styles.loadingTitle}>Cargando tu panel</h2>

          <p style={styles.loadingText}>Estamos preparando tu información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorPage}>
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>!</div>

          <h2 style={styles.errorTitle}>No pudimos cargar tu panel</h2>

          <p style={styles.errorText}>{error}</p>

          <button
            type="button"
            style={styles.retryButton}
            onClick={obtenerCompras}
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <span style={styles.badge}>Panel de cliente</span>

            <h1 style={styles.title}>
              Hola, <span style={styles.highlight}>{nombre}</span> 👋
            </h1>

            <p style={styles.subtitle}>
              Bienvenido a tu espacio personal de ModaGest Pro. Explora nuestros
              productos, administra tu carrito y consulta tus compras.
            </p>

            <div style={styles.heroActions}>
              <Link to="/cliente/productos" style={styles.primaryLink}>
                Explorar productos
              </Link>

              <Link to="/carrito" style={styles.secondaryLink}>
                Ver carrito 🛒
              </Link>
            </div>
          </div>

          <div style={styles.heroDecoration}>
            <div style={styles.decorationCircle}></div>

            <div style={styles.decorationIcon}>🛍️</div>
          </div>
        </section>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🧾</div>

            <div>
              <p style={styles.statLabel}>Compras realizadas</p>

              <h2 style={styles.statNumber}>{totalCompras}</h2>

              <p style={styles.statDescription}>Pedidos registrados</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>

            <div>
              <p style={styles.statLabel}>Total gastado</p>

              <h2 style={styles.statNumberSmall}>
                {formatearDinero(dineroGastado)}
              </h2>

              <p style={styles.statDescription}>Compras aprobadas</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📦</div>

            <div>
              <p style={styles.statLabel}>Última compra</p>

              <h2 style={styles.statNumberSmall}>
                {ultimaCompra
                  ? formatearFecha(
                      ultimaCompra.createdAt ||
                        ultimaCompra.fecha ||
                        ultimaCompra.updatedAt,
                    )
                  : "Sin compras"}
              </h2>

              <p style={styles.statDescription}>Actividad más reciente</p>
            </div>
          </div>
        </section>

        <section style={styles.contentGrid}>
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <div>
                <span style={styles.sectionTag}>Actividad</span>

                <h2 style={styles.sectionTitle}>Mis compras recientes</h2>
              </div>

              <Link to="/cliente/compras" style={styles.viewAllLink}>
                Ver todas
              </Link>
            </div>

            {comprasRecientes.length === 0 ? (
              <div style={styles.emptyPurchases}>
                <div style={styles.emptyIcon}>🛍️</div>

                <h3 style={styles.emptyTitle}>Aún no tienes compras</h3>

                <p style={styles.emptyText}>
                  Explora nuestro catálogo y encuentra productos para comenzar.
                </p>

                <Link to="/cliente/productos" style={styles.emptyButton}>
                  Explorar productos
                </Link>
              </div>
            ) : (
              <div style={styles.purchaseList}>
                {comprasRecientes.map((compra) => {
                  const estado = obtenerEstadoPago(compra);

                  return (
                    <div key={compra.id} style={styles.purchaseItem}>
                      <div style={styles.purchaseIcon}>📦</div>

                      <div style={styles.purchaseInfo}>
                        <h3 style={styles.purchaseTitle}>
                          Compra #{compra.id}
                        </h3>

                        <p style={styles.purchaseDate}>
                          {formatearFecha(
                            compra.createdAt ||
                              compra.fecha ||
                              compra.updatedAt,
                          )}
                        </p>
                      </div>

                      <div style={styles.purchaseRight}>
                        <strong style={styles.purchaseTotal}>
                          {formatearDinero(compra.total)}
                        </strong>

                        <span
                          style={{
                            ...styles.purchaseStatus,
                            ...(estado === "aprobado"
                              ? styles.statusApproved
                              : estado === "pendiente"
                                ? styles.statusPending
                                : estado === "rechazado"
                                  ? styles.statusRejected
                                  : styles.statusUnknown),
                          }}
                        >
                          {estado === "aprobado"
                            ? "Compra aprobada"
                            : estado === "pendiente"
                              ? "Pendiente"
                              : estado === "rechazado"
                                ? "Rechazada"
                                : "Estado no disponible"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={styles.quickCard}>
            <span style={styles.sectionTag}>Accesos rápidos</span>

            <h2 style={styles.sectionTitle}>¿Qué deseas hacer?</h2>

            <div style={styles.quickActions}>
              <Link to="/cliente/productos" style={styles.quickAction}>
                <div style={styles.quickIcon}>🛍️</div>

                <div>
                  <h3 style={styles.quickTitle}>Ver productos</h3>

                  <p style={styles.quickText}>Explora nuestro catálogo</p>
                </div>

                <span style={styles.arrow}>→</span>
              </Link>

              <Link to="/cliente/compras" style={styles.quickAction}>
                <div style={styles.quickIcon}>📋</div>

                <div>
                  <h3 style={styles.quickTitle}>Mis compras</h3>

                  <p style={styles.quickText}>Consulta tus pedidos</p>
                </div>

                <span style={styles.arrow}>→</span>
              </Link>

              <Link to="/carrito" style={styles.quickAction}>
                <div style={styles.quickIcon}>🛒</div>

                <div>
                  <h3 style={styles.quickTitle}>Mi carrito</h3>

                  <p style={styles.quickText}>Revisa tus productos</p>
                </div>

                <span style={styles.arrow}>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section style={styles.bottomBanner}>
          <div>
            <span style={styles.bannerTag}>ModaGest Pro</span>

            <h2 style={styles.bannerTitle}>
              Encuentra productos para tu tienda
            </h2>

            <p style={styles.bannerText}>
              Explora nuestro catálogo y descubre nuevas opciones para
              complementar tus compras.
            </p>
          </div>

          <Link to="/cliente/productos" style={styles.bannerButton}>
            Ver catálogo
          </Link>
        </section>
      </div>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 900px) {
            .cliente-content-grid {
              grid-template-columns: 1fr !important;
            }

            .cliente-hero-decoration {
              display: none !important;
            }
          }

          @media (max-width: 700px) {
            .cliente-page {
              padding: 20px 14px 35px !important;
            }

            .cliente-hero {
              padding: 30px 24px !important;
            }

            .cliente-sale-item {
              flex-wrap: wrap;
            }

            .cliente-sale-right {
              width: 100%;
              align-items: flex-start !important;
            }

            .cliente-banner {
              flex-direction: column;
              align-items: flex-start !important;
            }

            .cliente-banner-button {
              width: 100%;
              text-align: center;
              box-sizing: border-box;
            }
          }

          @media (max-width: 520px) {
            .cliente-hero-actions {
              flex-direction: column !important;
            }

            .cliente-hero-actions a {
              width: 100%;
              box-sizing: border-box;
              text-align: center;
            }

            .cliente-section-card,
            .cliente-quick-card {
              padding: 22px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default DashboardCliente;

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #050816 0%, #0f172a 55%, #111827 100%)",
    color: "#fff",
    padding: "32px 20px 50px",
  },

  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  hero: {
    minHeight: "310px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    padding: "45px",
    marginBottom: "28px",
    borderRadius: "30px",
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.30), rgba(79,70,229,0.12))",
    border: "1px solid rgba(167,139,250,0.20)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    overflow: "hidden",
    position: "relative",
  },

  heroContent: {
    maxWidth: "720px",
    position: "relative",
    zIndex: 2,
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(168,85,247,0.15)",
    border: "1px solid rgba(168,85,247,0.30)",
    color: "#c084fc",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    marginBottom: "18px",
  },

  title: {
    margin: "0 0 14px",
    fontSize: "clamp(32px, 5vw, 48px)",
    lineHeight: "1.1",
    fontWeight: "800",
    letterSpacing: "-1px",
  },

  highlight: {
    color: "#c084fc",
  },

  subtitle: {
    maxWidth: "680px",
    margin: 0,
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: "1.7",
  },

  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "28px",
  },

  primaryLink: {
    textDecoration: "none",
    color: "#fff",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    padding: "13px 20px",
    borderRadius: "14px",
    fontWeight: "700",
    boxShadow: "0 10px 25px rgba(124,58,237,0.25)",
  },

  secondaryLink: {
    textDecoration: "none",
    color: "#e2e8f0",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    padding: "13px 20px",
    borderRadius: "14px",
    fontWeight: "700",
  },

  heroDecoration: {
    width: "190px",
    height: "190px",
    flexShrink: 0,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  decorationCircle: {
    position: "absolute",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(168,85,247,0.30), rgba(124,58,237,0.03))",
    border: "1px solid rgba(168,85,247,0.18)",
  },

  decorationIcon: {
    position: "relative",
    fontSize: "75px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "24px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 12px 35px rgba(0,0,0,0.16)",
  },

  statIcon: {
    width: "58px",
    height: "58px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "17px",
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.85), rgba(147,51,234,0.75))",
    fontSize: "26px",
  },

  statLabel: {
    margin: "0 0 5px",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
  },

  statNumber: {
    margin: 0,
    color: "#fff",
    fontSize: "32px",
    fontWeight: "800",
  },

  statNumberSmall: {
    margin: 0,
    color: "#fff",
    fontSize: "22px",
    fontWeight: "800",
  },

  statDescription: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.55fr) minmax(300px, 0.85fr)",
    gap: "20px",
    marginBottom: "28px",
  },

  sectionCard: {
    padding: "28px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 12px 35px rgba(0,0,0,0.16)",
  },

  quickCard: {
    padding: "28px",
    borderRadius: "24px",
    background:
      "linear-gradient(145deg, rgba(124,58,237,0.16), rgba(255,255,255,0.035))",
    border: "1px solid rgba(167,139,250,0.15)",
    boxShadow: "0 12px 35px rgba(0,0,0,0.16)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "22px",
  },

  sectionTag: {
    color: "#a78bfa",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  sectionTitle: {
    margin: "7px 0 0",
    fontSize: "23px",
    fontWeight: "800",
    color: "#f8fafc",
  },

  viewAllLink: {
    color: "#c084fc",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  purchaseList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  purchaseItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    borderRadius: "17px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  purchaseIcon: {
    width: "46px",
    height: "46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "14px",
    background: "rgba(124,58,237,0.16)",
    fontSize: "21px",
  },

  purchaseInfo: {
    flex: 1,
    minWidth: 0,
  },

  purchaseTitle: {
    margin: "0 0 4px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#f8fafc",
  },

  purchaseDate: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
  },

  purchaseRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "5px",
  },

  purchaseTotal: {
    color: "#f8fafc",
    fontSize: "15px",
  },

  purchaseStatus: {
    fontSize: "11px",
    fontWeight: "700",
  },

  statusApproved: {
    color: "#34d399",
  },

  statusPending: {
    color: "#fbbf24",
  },

  statusRejected: {
    color: "#f87171",
  },

  statusUnknown: {
    color: "#94a3b8",
  },

  emptyPurchases: {
    textAlign: "center",
    padding: "35px 15px 20px",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
  },

  emptyText: {
    maxWidth: "430px",
    margin: "0 auto 20px",
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  emptyButton: {
    display: "inline-block",
    textDecoration: "none",
    color: "#fff",
    background: "#7c3aed",
    padding: "11px 17px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "700",
  },

  quickActions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "22px",
  },

  quickAction: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    textDecoration: "none",
    color: "#fff",
    padding: "14px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  quickIcon: {
    width: "43px",
    height: "43px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "13px",
    background: "rgba(124,58,237,0.18)",
    fontSize: "20px",
  },

  quickTitle: {
    margin: "0 0 3px",
    fontSize: "14px",
    fontWeight: "700",
  },

  quickText: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
  },

  arrow: {
    marginLeft: "auto",
    color: "#a78bfa",
    fontSize: "20px",
    fontWeight: "700",
  },

  bottomBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    padding: "30px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(79,70,229,0.10))",
    border: "1px solid rgba(167,139,250,0.16)",
  },

  bannerTag: {
    color: "#c084fc",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  bannerTitle: {
    margin: "7px 0 8px",
    fontSize: "22px",
    fontWeight: "800",
  },

  bannerText: {
    margin: 0,
    maxWidth: "650px",
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  bannerButton: {
    flexShrink: 0,
    textDecoration: "none",
    color: "#fff",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    padding: "13px 20px",
    borderRadius: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050816",
    color: "#fff",
    padding: "20px",
  },

  loadingBox: {
    textAlign: "center",
    padding: "35px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  spinner: {
    width: "42px",
    height: "42px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    border: "4px solid rgba(167,139,250,0.18)",
    borderTopColor: "#a855f7",
    animation: "spin 1s linear infinite",
  },

  loadingTitle: {
    margin: "0 0 7px",
    fontSize: "20px",
  },

  loadingText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },

  errorPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050816",
    color: "#fff",
    padding: "20px",
  },

  errorBox: {
    maxWidth: "450px",
    textAlign: "center",
    padding: "35px",
    borderRadius: "24px",
    background: "rgba(127,29,29,0.12)",
    border: "1px solid rgba(248,113,113,0.20)",
  },

  errorIcon: {
    width: "55px",
    height: "55px",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "rgba(239,68,68,0.15)",
    color: "#f87171",
    fontSize: "28px",
    fontWeight: "800",
  },

  errorTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
    color: "#fca5a5",
  },

  errorText: {
    margin: "0 0 22px",
    color: "#cbd5e1",
    lineHeight: "1.6",
  },

  retryButton: {
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    background: "#dc2626",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },
};
