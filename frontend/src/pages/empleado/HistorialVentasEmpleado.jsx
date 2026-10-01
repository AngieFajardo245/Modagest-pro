import { useEffect, useState } from "react";
import api from "../../services/api";
import { obtenerUrlImagen } from "../../utils/media";

import {
  FaSyncAlt,
  FaSearch,
  FaFilter,
  FaShoppingBag,
  FaReceipt,
  FaMoneyBillWave,
  FaBoxes,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCreditCard,
  FaBoxOpen,
} from "react-icons/fa";

function HistorialVentasEmpleado() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [orden, setOrden] = useState("recientes");
  const [ventaAbierta, setVentaAbierta] = useState(null);

  const obtenerVentas = async (mostrarActualizando = false) => {
    try {
      if (mostrarActualizando) {
        setActualizando(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/empleado/ventas");

      let data = [];

      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response.data?.ventas)) {
        data = response.data.ventas;
      } else if (Array.isArray(response.data?.data)) {
        data = response.data.data;
      }

      setVentas(data);
    } catch (err) {
      console.error("Error cargando historial de ventas:", err);

      setError(
        err?.response?.data?.mensaje ||
          err?.response?.data?.message ||
          "No fue posible cargar el historial de ventas.",
      );

      setVentas([]);
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  };

  useEffect(() => {
    obtenerVentas();
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

    const fechaObjeto = new Date(fecha);

    if (Number.isNaN(fechaObjeto.getTime())) {
      return "Sin fecha";
    }

    return fechaObjeto.toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const obtenerIdVenta = (venta) => {
    return (
      venta?.id || venta?.idVenta || venta?.ventaId || venta?.numero || "—"
    );
  };

  const obtenerTotalVenta = (venta) => {
    return Number(
      venta?.total ??
        venta?.totalVenta ??
        venta?.montoTotal ??
        venta?.monto ??
        0,
    );
  };

  const obtenerEstadoVenta = (venta) => {
    const estado = String(
      venta?.estado || venta?.status || "aprobada",
    ).toLowerCase();

    if (
      estado.includes("aprobad") ||
      estado.includes("complet") ||
      estado.includes("confirm")
    ) {
      return "aprobada";
    }

    if (estado.includes("pend")) {
      return "pendiente";
    }

    if (estado.includes("cancel") || estado.includes("rechaz")) {
      return "cancelada";
    }

    return estado;
  };

  const textoEstado = (estado) => {
    switch (estado) {
      case "aprobada":
        return "Aprobada";
      case "pendiente":
        return "Pendiente";
      case "cancelada":
        return "Cancelada";
      default:
        return estado
          ? estado.charAt(0).toUpperCase() + estado.slice(1)
          : "Aprobada";
    }
  };

  const iconoEstado = (estado) => {
    switch (estado) {
      case "aprobada":
        return <FaCheckCircle />;
      case "pendiente":
        return <FaClock />;
      case "cancelada":
        return <FaTimesCircle />;
      default:
        return <FaCheckCircle />;
    }
  };

  const estiloEstado = (estado) => {
    switch (estado) {
      case "aprobada":
        return styles.statusApproved;
      case "pendiente":
        return styles.statusPending;
      case "cancelada":
        return styles.statusCancelled;
      default:
        return styles.statusApproved;
    }
  };

  const obtenerMetodoPago = (venta) => {
    return (
      venta?.metodoPago ||
      venta?.metodo_pago ||
      venta?.formaPago ||
      venta?.paymentMethod ||
      "Efectivo"
    );
  };

  const obtenerReferencia = (venta) => {
    return (
      venta?.referencia ||
      venta?.referenciaPago ||
      venta?.codigoReferencia ||
      venta?.reference ||
      `EMP-${obtenerIdVenta(venta)}`
    );
  };

  const obtenerFechaVenta = (venta) => {
    return (
      venta?.createdAt ||
      venta?.fecha ||
      venta?.fechaVenta ||
      venta?.updatedAt ||
      null
    );
  };

  const obtenerDetalles = (venta) => {
    const posiblesDetalles =
      venta?.Detalles ||
      venta?.detalles ||
      venta?.DetalleVentas ||
      venta?.detalleVentas ||
      venta?.productos ||
      venta?.Productos ||
      [];

    return Array.isArray(posiblesDetalles) ? posiblesDetalles : [];
  };

  const obtenerProducto = (detalle) => {
    return detalle?.Producto || detalle?.producto || detalle?.product || null;
  };

  const obtenerNombreProducto = (detalle) => {
    const producto = obtenerProducto(detalle);

    return (
      producto?.nombre ||
      producto?.name ||
      detalle?.nombreProducto ||
      detalle?.productoNombre ||
      detalle?.nombre ||
      "Producto"
    );
  };

  const obtenerImagenProducto = (detalle) => {
    const producto = obtenerProducto(detalle);

    return (
      producto?.imagen ||
      producto?.imagenUrl ||
      producto?.image ||
      producto?.foto ||
      detalle?.imagen ||
      detalle?.imagenUrl ||
      null
    );
  };

  const construirImagen = (imagen) => {
    if (!imagen || typeof imagen !== "string") {
      return null;
    }

    const imagenLimpia = imagen.trim();

    if (!imagenLimpia) {
      return null;
    }

    return obtenerUrlImagen(imagenLimpia, null);
  };

  const obtenerCantidad = (detalle) => {
    return Number(
      detalle?.cantidad ?? detalle?.cantidadVendida ?? detalle?.quantity ?? 1,
    );
  };

  const obtenerPrecio = (detalle) => {
    const producto = obtenerProducto(detalle);

    return Number(
      detalle?.precio ??
        detalle?.precioUnitario ??
        detalle?.price ??
        producto?.precio ??
        producto?.price ??
        0,
    );
  };

  const obtenerSubtotal = (detalle) => {
    const subtotal = Number(
      detalle?.subtotal ?? detalle?.subTotal ?? detalle?.total ?? 0,
    );

    if (subtotal > 0) {
      return subtotal;
    }

    return obtenerCantidad(detalle) * obtenerPrecio(detalle);
  };

  const obtenerUnidadesVenta = (venta) => {
    const detalles = obtenerDetalles(venta);

    if (detalles.length === 0) {
      return Number(
        venta?.unidades ?? venta?.cantidad ?? venta?.totalProductos ?? 1,
      );
    }

    return detalles.reduce(
      (total, detalle) => total + obtenerCantidad(detalle),
      0,
    );
  };

  const totalUnidades = ventas.reduce(
    (total, venta) => total + obtenerUnidadesVenta(venta),
    0,
  );

  const totalVendido = ventas.reduce(
    (total, venta) => total + obtenerTotalVenta(venta),
    0,
  );

  const ventasAprobadas = ventas.filter(
    (venta) => obtenerEstadoVenta(venta) === "aprobada",
  ).length;

  const ventasFiltradas = (() => {
    let resultado = [...ventas];

    if (estadoFiltro !== "todos") {
      resultado = resultado.filter(
        (venta) => obtenerEstadoVenta(venta) === estadoFiltro,
      );
    }

    const texto = busqueda.trim().toLowerCase();

    if (texto) {
      resultado = resultado.filter((venta) => {
        const idVenta = String(obtenerIdVenta(venta)).toLowerCase();

        const productos = obtenerDetalles(venta)
          .map((detalle) => obtenerNombreProducto(detalle))
          .join(" ")
          .toLowerCase();

        const referencia = String(obtenerReferencia(venta)).toLowerCase();

        const metodoPago = String(obtenerMetodoPago(venta)).toLowerCase();

        return (
          idVenta.includes(texto) ||
          productos.includes(texto) ||
          referencia.includes(texto) ||
          metodoPago.includes(texto)
        );
      });
    }

    resultado.sort((a, b) => {
      const fechaA = new Date(obtenerFechaVenta(a) || 0).getTime();

      const fechaB = new Date(obtenerFechaVenta(b) || 0).getTime();

      if (orden === "recientes") {
        return fechaB - fechaA;
      }

      if (orden === "antiguas") {
        return fechaA - fechaB;
      }

      if (orden === "mayor") {
        return obtenerTotalVenta(b) - obtenerTotalVenta(a);
      }

      if (orden === "menor") {
        return obtenerTotalVenta(a) - obtenerTotalVenta(b);
      }

      return 0;
    });

    return resultado;
  })();

  const toggleDetalle = (idVenta) => {
    setVentaAbierta((actual) =>
      String(actual) === String(idVenta) ? null : idVenta,
    );
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstadoFiltro("todos");
    setOrden("recientes");
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Cargando historial de ventas...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>HISTORIAL COMERCIAL</p>

          <h1 style={styles.title}>Historial de ventas</h1>

          <p style={styles.subtitle}>
            Consulta y revisa todas las ventas realizadas desde tu cuenta de
            empleado.
          </p>
        </div>

        <button
          type="button"
          style={{
            ...styles.refreshButton,
            opacity: actualizando ? 0.7 : 1,
          }}
          onClick={() => obtenerVentas(true)}
          disabled={actualizando}
        >
          <FaSyncAlt style={actualizando ? styles.spinningIcon : undefined} />

          {actualizando ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <FaTimesCircle />

          <div>
            <strong>No se pudo cargar el historial</strong>

            <p>{error}</p>
          </div>
        </div>
      )}

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconPurple}>
            <FaReceipt />
          </div>

          <div>
            <p style={styles.statLabel}>Ventas realizadas</p>

            <h2 style={styles.statNumber}>{ventas.length}</h2>

            <p style={styles.statDescription}>Registros encontrados</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconBlue}>
            <FaShoppingBag />
          </div>

          <div>
            <p style={styles.statLabel}>Ventas aprobadas</p>

            <h2 style={styles.statNumber}>{ventasAprobadas}</h2>

            <p style={styles.statDescription}>Ventas completadas</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconOrange}>
            <FaBoxes />
          </div>

          <div>
            <p style={styles.statLabel}>Unidades vendidas</p>

            <h2 style={styles.statNumber}>{totalUnidades}</h2>

            <p style={styles.statDescription}>Productos vendidos</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconGreen}>
            <FaMoneyBillWave />
          </div>

          <div>
            <p style={styles.statLabel}>Total vendido</p>

            <h2 style={styles.statMoney}>{formatoMoneda(totalVendido)}</h2>

            <p style={styles.statDescription}>Valor acumulado</p>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>CONSULTA</p>

            <h2 style={styles.sectionTitle}>Historial de ventas</h2>
          </div>

          <div style={styles.countBadge}>
            {ventasFiltradas.length}{" "}
            {ventasFiltradas.length === 1 ? "venta" : "ventas"}
          </div>
        </div>

        <div style={styles.filtersGrid}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar venta o producto..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.selectWrapper}>
            <FaFilter style={styles.selectIcon} />

            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              style={styles.select}
            >
              <option value="todos">Todos los estados</option>

              <option value="aprobada">Aprobadas</option>

              <option value="pendiente">Pendientes</option>

              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          <div style={styles.selectWrapper}>
            <FaCalendarAlt style={styles.selectIcon} />

            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              style={styles.select}
            >
              <option value="recientes">Más recientes</option>

              <option value="antiguas">Más antiguas</option>

              <option value="mayor">Mayor valor</option>

              <option value="menor">Menor valor</option>
            </select>
          </div>
        </div>

        <div style={styles.salesList}>
          {ventasFiltradas.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <FaReceipt />
              </div>

              <h3 style={styles.emptyTitle}>No hay ventas para mostrar</h3>

              <p style={styles.emptyText}>
                {ventas.length === 0
                  ? "Todavía no tienes ventas registradas."
                  : "No se encontraron ventas que coincidan con los filtros seleccionados."}
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
            ventasFiltradas.map((venta, ventaIndex) => {
              const idVenta = obtenerIdVenta(venta);
              const estado = obtenerEstadoVenta(venta);
              const total = obtenerTotalVenta(venta);
              const detalles = obtenerDetalles(venta);
              const unidades = obtenerUnidadesVenta(venta);

              const abierta = String(ventaAbierta) === String(idVenta);

              return (
                <div key={`${idVenta}-${ventaIndex}`} style={styles.saleCard}>
                  <div style={styles.saleHeader}>
                    <div style={styles.saleHeaderLeft}>
                      <div style={styles.saleIcon}>
                        <FaReceipt />
                      </div>

                      <div>
                        <h3 style={styles.saleTitle}>Venta #{idVenta}</h3>

                        <p style={styles.saleDate}>
                          <FaCalendarAlt />

                          {formatoFecha(obtenerFechaVenta(venta))}
                        </p>
                      </div>
                    </div>

                    <span style={estiloEstado(estado)}>
                      {iconoEstado(estado)}

                      {textoEstado(estado)}
                    </span>
                  </div>

                  <div style={styles.saleSummary}>
                    <div style={styles.saleSummaryItem}>
                      <span style={styles.summaryItemLabel}>PRODUCTOS</span>

                      <strong style={styles.summaryItemValue}>
                        {detalles.length || (unidades > 0 ? 1 : 0)}
                      </strong>
                    </div>

                    <div style={styles.saleSummaryItem}>
                      <span style={styles.summaryItemLabel}>UNIDADES</span>

                      <strong style={styles.summaryItemValue}>
                        {unidades}
                      </strong>
                    </div>

                    <div style={styles.saleSummaryItem}>
                      <span style={styles.summaryItemLabel}>
                        MÉTODO DE PAGO
                      </span>

                      <strong style={styles.paymentValue}>
                        <FaCreditCard />

                        {obtenerMetodoPago(venta)}
                      </strong>
                    </div>

                    <div style={styles.totalItem}>
                      <span style={styles.summaryItemLabel}>TOTAL</span>

                      <strong style={styles.totalValue}>
                        {formatoMoneda(total)}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    style={styles.detailButton}
                    onClick={() => toggleDetalle(idVenta)}
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

                        <span>Productos de la venta</span>
                      </div>

                      {detalles.length > 0 ? (
                        <div style={styles.productsList}>
                          {detalles.map((detalle, index) => {
                            const imagen = construirImagen(
                              obtenerImagenProducto(detalle),
                            );

                            const cantidad = obtenerCantidad(detalle);

                            const precio = obtenerPrecio(detalle);

                            const subtotal = obtenerSubtotal(detalle);

                            const producto = obtenerProducto(detalle);

                            return (
                              <div
                                key={
                                  detalle?.id ||
                                  detalle?.idDetalle ||
                                  `detalle-${index}`
                                }
                                style={styles.productRow}
                              >
                                <div style={styles.productImageWrapper}>
                                  {imagen ? (
                                    <img
                                      src={imagen}
                                      alt={obtenerNombreProducto(detalle)}
                                      style={styles.productImage}
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";

                                        const placeholder =
                                          e.currentTarget.nextElementSibling;

                                        if (placeholder) {
                                          placeholder.style.display = "flex";
                                        }
                                      }}
                                    />
                                  ) : null}

                                  <div
                                    style={{
                                      ...styles.productImagePlaceholder,
                                      display: imagen ? "none" : "flex",
                                    }}
                                  >
                                    <FaShoppingBag />
                                  </div>
                                </div>

                                <div style={styles.productName}>
                                  <strong style={styles.productNameStrong}>
                                    {obtenerNombreProducto(detalle)}
                                  </strong>

                                  <small style={styles.productNameSmall}>
                                    {producto?.id
                                      ? `Producto #${producto.id}`
                                      : "Producto vendido"}
                                  </small>
                                </div>

                                <div style={styles.productColumn}>
                                  <span style={styles.productColumnSpan}>
                                    Cantidad
                                  </span>

                                  <strong style={styles.productColumnStrong}>
                                    {cantidad}
                                  </strong>
                                </div>

                                <div style={styles.productColumn}>
                                  <span style={styles.productColumnSpan}>
                                    Precio
                                  </span>

                                  <strong style={styles.productColumnStrong}>
                                    {formatoMoneda(precio)}
                                  </strong>
                                </div>

                                <div style={styles.productSubtotal}>
                                  <span style={styles.productColumnSpan}>
                                    Subtotal
                                  </span>

                                  <strong style={styles.productSubtotalStrong}>
                                    {formatoMoneda(subtotal)}
                                  </strong>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={styles.noProducts}>
                          <FaBoxOpen />

                          <span>
                            No hay detalles de productos disponibles para esta
                            venta.
                          </span>
                        </div>
                      )}

                      <div style={styles.saleDetailsBottom}>
                        <div style={styles.detailInfo}>
                          <span style={styles.detailInfoSpan}>
                            MÉTODO DE PAGO
                          </span>

                          <strong style={styles.detailInfoStrong}>
                            <FaCreditCard />

                            {obtenerMetodoPago(venta)}
                          </strong>
                        </div>

                        <div style={styles.detailInfo}>
                          <span style={styles.detailInfoSpan}>ESTADO</span>

                          <strong style={styles.detailApproved}>
                            {iconoEstado(estado)}

                            {textoEstado(estado)}
                          </strong>
                        </div>

                        <div style={styles.detailInfo}>
                          <span style={styles.detailInfoSpan}>REFERENCIA</span>

                          <strong style={styles.detailInfoStrong}>
                            {obtenerReferencia(venta)}
                          </strong>
                        </div>

                        <div style={styles.detailInfo}>
                          <span style={styles.detailInfoSpan}>
                            MONTO PAGADO
                          </span>

                          <strong style={styles.detailMoney}>
                            {formatoMoneda(total)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
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
            .historial-filters {
              grid-template-columns: 1fr !important;
            }

            .historial-summary {
              grid-template-columns: repeat(2, 1fr) !important;
            }

            .historial-product-row {
              grid-template-columns: 52px 1fr 1fr !important;
            }
          }

          @media (max-width: 600px) {
            .historial-container {
              padding: 20px !important;
            }

            .historial-summary {
              grid-template-columns: 1fr !important;
            }

            .historial-product-row {
              grid-template-columns: 52px 1fr !important;
            }

            .historial-product-row > div:nth-child(n + 3) {
              grid-column: span 1;
            }

            .historial-details-bottom {
              grid-template-columns: 1fr 1fr !important;
              gap: 15px 0;
            }

            .historial-sale-header {
              align-items: flex-start !important;
              flex-direction: column !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default HistorialVentasEmpleado;

const styles = {
  container: {
    minHeight: "100vh",
    padding: "32px",
    color: "#ffffff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "25px",
    flexWrap: "wrap",
    marginBottom: "32px",
  },

  eyebrow: {
    margin: "0 0 8px",
    color: "#a78bfa",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: "34px",
    fontWeight: "800",
    letterSpacing: "-0.8px",
  },

  subtitle: {
    margin: "10px 0 0",
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: "1.5",
    maxWidth: "680px",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    border: "none",
    borderRadius: "12px",
    padding: "13px 19px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(76,29,149,0.25)",
  },

  spinningIcon: {
    animation: "spin 1s linear infinite",
  },

  errorBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    padding: "17px 20px",
    marginBottom: "25px",
    borderRadius: "16px",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    color: "#fca5a5",
    fontSize: "14px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "16px",
    marginBottom: "38px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    minHeight: "105px",
    padding: "20px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.075)",
    backdropFilter: "blur(15px)",
  },

  statIconPurple: {
    width: "56px",
    height: "56px",
    flexShrink: 0,
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    color: "#ffffff",
    fontSize: "22px",
  },

  statIconBlue: {
    width: "56px",
    height: "56px",
    flexShrink: 0,
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#ffffff",
    fontSize: "22px",
  },

  statIconOrange: {
    width: "56px",
    height: "56px",
    flexShrink: 0,
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #d97706, #f59e0b)",
    color: "#ffffff",
    fontSize: "22px",
  },

  statIconGreen: {
    width: "56px",
    height: "56px",
    flexShrink: 0,
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #059669, #10b981)",
    color: "#ffffff",
    fontSize: "22px",
  },

  statLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
  },

  statNumber: {
    margin: "5px 0 2px",
    color: "#ffffff",
    fontSize: "29px",
    fontWeight: "800",
  },

  statMoney: {
    margin: "5px 0 2px",
    color: "#34d399",
    fontSize: "22px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  statDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "11px",
  },

  section: {
    marginTop: "5px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "18px",
  },

  sectionEyebrow: {
    margin: 0,
    color: "#8b5cf6",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.4px",
  },

  sectionTitle: {
    margin: "5px 0 0",
    color: "#ffffff",
    fontSize: "23px",
    fontWeight: "800",
  },

  countBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 13px",
    borderRadius: "999px",
    background: "rgba(124,58,237,0.12)",
    border: "1px solid rgba(139,92,246,0.25)",
    color: "#c4b5fd",
    fontSize: "12px",
    fontWeight: "700",
  },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(280px, 1.5fr) minmax(210px, 0.8fr) minmax(210px, 0.8fr)",
    gap: "12px",
    marginBottom: "22px",
  },

  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  searchIcon: {
    position: "absolute",
    left: "15px",
    color: "#64748b",
    fontSize: "14px",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    height: "46px",
    boxSizing: "border-box",
    padding: "0 15px 0 40px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
    background: "rgba(255,255,255,0.045)",
    color: "#ffffff",
    fontSize: "14px",
  },

  selectWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  selectIcon: {
    position: "absolute",
    left: "15px",
    color: "#64748b",
    fontSize: "13px",
    pointerEvents: "none",
    zIndex: 1,
  },

  select: {
    width: "100%",
    height: "46px",
    boxSizing: "border-box",
    padding: "0 35px 0 39px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
    background: "#17152f",
    color: "#ffffff",
    fontSize: "14px",
    cursor: "pointer",
  },

  salesList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    paddingBottom: "40px",
  },

  saleCard: {
    overflow: "hidden",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.085)",
    backdropFilter: "blur(15px)",
  },

  saleHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "20px 22px",
    minHeight: "72px",
  },

  saleHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  saleIcon: {
    width: "44px",
    height: "44px",
    flexShrink: 0,
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(124,58,237,0.14)",
    border: "1px solid rgba(139,92,246,0.2)",
    color: "#a78bfa",
    fontSize: "17px",
  },

  saleTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "800",
  },

  saleDate: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    margin: "6px 0 0",
    color: "#7f8ba3",
    fontSize: "12px",
  },

  statusApproved: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 13px",
    borderRadius: "999px",
    background: "rgba(16,185,129,0.12)",
    border: "1px solid rgba(16,185,129,0.25)",
    color: "#6ee7b7",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  statusPending: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 13px",
    borderRadius: "999px",
    background: "rgba(245,158,11,0.12)",
    border: "1px solid rgba(245,158,11,0.25)",
    color: "#fcd34d",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  statusCancelled: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 13px",
    borderRadius: "999px",
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.25)",
    color: "#fca5a5",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  saleSummary: {
    display: "grid",
    gridTemplateColumns: "0.9fr 0.9fr 1.4fr 1fr",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },

  saleSummaryItem: {
    minHeight: "82px",
    padding: "17px 20px",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.018)",
  },

  summaryItemLabel: {
    display: "block",
    marginBottom: "8px",
    color: "#718096",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  summaryItemValue: {
    color: "#e2e8f0",
    fontSize: "17px",
    fontWeight: "800",
  },

  paymentValue: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "700",
  },

  totalItem: {
    minHeight: "82px",
    padding: "17px 20px",
    background: "rgba(59,130,246,0.08)",
  },

  totalValue: {
    color: "#34d399",
    fontSize: "19px",
    fontWeight: "800",
  },

  detailButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    height: "42px",
    border: "none",
    background: "rgba(124,58,237,0.045)",
    color: "#b9a3ff",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  detailSection: {
    padding: "22px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(10,10,25,0.16)",
  },

  detailTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "14px",
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "800",
  },

  productsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  productRow: {
    display: "grid",
    gridTemplateColumns: "52px minmax(180px, 1.5fr) 0.6fr 0.9fr 0.9fr",
    alignItems: "center",
    gap: "14px",
    padding: "13px",
    borderRadius: "13px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  productImageWrapper: {
    width: "46px",
    height: "46px",
    borderRadius: "11px",
    overflow: "hidden",
    background: "rgba(0,0,0,0.18)",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  productImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#8b5cf6",
    fontSize: "16px",
  },

  productName: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },

  productNameStrong: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
  },

  productNameSmall: {
    color: "#718096",
    fontSize: "11px",
  },

  productColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  productColumnSpan: {
    color: "#718096",
    fontSize: "10px",
  },

  productColumnStrong: {
    color: "#e2e8f0",
    fontSize: "13px",
  },

  productSubtotal: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  productSubtotalStrong: {
    color: "#34d399",
    fontSize: "14px",
    fontWeight: "800",
  },

  noProducts: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    padding: "22px",
    borderRadius: "13px",
    background: "rgba(255,255,255,0.025)",
    color: "#718096",
    fontSize: "13px",
  },

  saleDetailsBottom: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },

  detailInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    padding: "0 14px",
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },

  detailInfoSpan: {
    color: "#718096",
    fontSize: "10px",
    fontWeight: "700",
  },

  detailInfoStrong: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#cbd5e1",
    fontSize: "12px",
  },

  detailApproved: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#6ee7b7",
    fontSize: "12px",
  },

  detailMoney: {
    color: "#34d399",
    fontSize: "14px",
    fontWeight: "800",
  },

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
    padding: "35px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.06)",
    textAlign: "center",
  },

  emptyIcon: {
    width: "65px",
    height: "65px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
    borderRadius: "18px",
    background: "rgba(124,58,237,0.1)",
    color: "#8b5cf6",
    fontSize: "25px",
  },

  emptyTitle: {
    margin: 0,
    color: "#e2e8f0",
    fontSize: "18px",
  },

  emptyText: {
    maxWidth: "480px",
    margin: "9px 0 18px",
    color: "#718096",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  clearButton: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    background: "rgba(124,58,237,0.13)",
    color: "#b9a3ff",
    fontSize: "12px",
    fontWeight: "700",
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
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "4px solid rgba(255,255,255,0.08)",
    borderTop: "4px solid #8b5cf6",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "15px",
  },
};
