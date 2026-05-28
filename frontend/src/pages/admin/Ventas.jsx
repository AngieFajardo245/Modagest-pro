import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

export default function AdminVentas() {

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [busqueda, setBusqueda] = useState("");

  /* ===================================================== */
  /* ================= FORMATO MONEDA ==================== */
  /* ===================================================== */

  const formatoMoneda = (valor) => {

    return Number(valor || 0).toLocaleString(
      "es-CO",
      {
        style: "currency",
        currency: "COP"
      }
    );

  };

  /* ===================================================== */
  /* ================= OBTENER VENTAS ==================== */
  /* ===================================================== */

  const obtenerVentas = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        "/admin/ventas"
      );

      setVentas(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.error(error);

      alert(
        "No se pudieron cargar las ventas"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    obtenerVentas();

  }, []);

  /* ===================================================== */
  /* ================= FILTRO FECHAS ===================== */
  /* ===================================================== */

  const filtrarVentas = async () => {

    try {

      if (!desde || !hasta) {

        alert(
          "Selecciona ambas fechas"
        );

        return;

      }

      setLoading(true);

      const res = await api.get(
        `/admin/ventas?desde=${desde}&hasta=${hasta}`
      );

      setVentas(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.error(error);

      alert(
        "Error filtrando ventas"
      );

    } finally {

      setLoading(false);

    }

  };

  /* ===================================================== */
  /* ================= BUSQUEDA ========================== */
  /* ===================================================== */

  const ventasFiltradas = useMemo(() => {

    return ventas.filter((venta) => {

      const cliente =
        venta.Cliente?.nombre
          ?.toLowerCase() || "";

      const productos =

        venta.Detalles?.map(
          d =>
            d.Producto?.nombre || ""
        )

          .join(" ")

          .toLowerCase();

      return (

        cliente.includes(
          busqueda.toLowerCase()
        ) ||

        productos.includes(
          busqueda.toLowerCase()
        )

      );

    });

  }, [ventas, busqueda]);

  /* ===================================================== */
  /* ================= ESTADISTICAS ====================== */
  /* ===================================================== */

  const totalVentas =
    ventasFiltradas.length;

  const ingresosTotales =
    ventasFiltradas.reduce(

      (acc, venta) =>

        acc + Number(venta.total || 0),

      0

    );

  const productosVendidos =
    ventasFiltradas.reduce(

      (acc, venta) => {

        const cantidad =

          venta.Detalles?.reduce(

            (sum, detalle) =>

              sum +
              Number(detalle.cantidad || 0),

            0

          ) || 0;

        return acc + cantidad;

      },

      0

    );

  /* ===================================================== */
  /* ======================= UI ========================== */
  /* ===================================================== */

  return (

    <div style={styles.container}>

      {/* ================= HEADER ================= */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            📊 Gestión de Ventas
          </h1>

          <p style={styles.subtitle}>
            Historial completo de ventas realizadas
          </p>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div style={styles.statsGrid}>

        <div style={styles.statCard}>

          <div style={styles.statIcon}>
            💰
          </div>

          <h4 style={styles.statTitle}>
            Ingresos Totales
          </h4>

          <p style={styles.statValue}>
            {formatoMoneda(
              ingresosTotales
            )}
          </p>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statIcon}>
            🛒
          </div>

          <h4 style={styles.statTitle}>
            Total Ventas
          </h4>

          <p style={styles.statValue}>
            {totalVentas}
          </p>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statIcon}>
            📦
          </div>

          <h4 style={styles.statTitle}>
            Productos Vendidos
          </h4>

          <p style={styles.statValue}>
            {productosVendidos}
          </p>

        </div>

      </div>

      {/* ================= FILTROS ================= */}

      <div style={styles.filters}>

        <input
          type="text"
          placeholder="Buscar cliente o producto..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(
              e.target.value
            )
          }
          style={styles.searchInput}
        />

        <input
          type="date"
          value={desde}
          onChange={(e) =>
            setDesde(e.target.value)
          }
          style={styles.dateInput}
        />

        <input
          type="date"
          value={hasta}
          onChange={(e) =>
            setHasta(e.target.value)
          }
          style={styles.dateInput}
        />

        <button
          onClick={filtrarVentas}
          style={styles.filterBtn}
        >
          Filtrar
        </button>

        <button
          onClick={obtenerVentas}
          style={styles.resetBtn}
        >
          Mostrar Todas
        </button>

      </div>

      {/* ================= TABLA ================= */}

      <div style={styles.tableContainer}>

        {loading ? (

          <div style={styles.center}>

            <div style={styles.loader}></div>

            <p>
              Cargando ventas...
            </p>

          </div>

        ) : ventasFiltradas.length === 0 ? (

          <div style={styles.empty}>

            No hay ventas registradas

          </div>

        ) : (

          <table style={styles.table}>

            <thead>

              <tr>

                <th style={styles.th}>
                  Venta
                </th>

                <th style={styles.th}>
                  Cliente
                </th>

                <th style={styles.th}>
                  Productos
                </th>

                <th style={styles.th}>
                  Pago
                </th>

                <th style={styles.th}>
                  Total
                </th>

                <th style={styles.th}>
                  Fecha
                </th>

              </tr>

            </thead>

            <tbody>

              {ventasFiltradas.map((venta) => (

                <tr
                  key={venta.id}
                  style={styles.tr}
                >

                  <td style={styles.td}>

                    <div style={styles.saleId}>

                      #{venta.id}

                    </div>

                  </td>

                  <td style={styles.td}>

                    <div style={styles.userInfo}>

                      <div style={styles.avatar}>

                        {venta.Cliente?.nombre
                          ?.charAt(0)
                          ?.toUpperCase()}

                      </div>

                      <div>

                        <strong>

                          {
                            venta.Cliente?.nombre ||
                            "Cliente eliminado"
                          }

                        </strong>

                        <p style={styles.email}>

                          {
                            venta.Cliente?.email
                          }

                        </p>

                      </div>

                    </div>

                  </td>

                  <td style={styles.td}>

                    <div style={styles.productsBox}>

                      {venta.Detalles?.map(
                        (detalle, index) => (

                          <div
                            key={index}
                            style={styles.productItem}
                          >

                            <strong>

                              {
                                detalle.Producto?.nombre ||
                                "Producto eliminado"
                              }

                            </strong>

                            <span>

                              Cantidad:
                              {" "}
                              {
                                detalle.cantidad
                              }

                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </td>

                  <td style={styles.td}>

                    <span style={styles.badge}>

                      {
                        venta.Pago?.metodoPago ||
                        "Sin pago"
                      }

                    </span>

                  </td>

                  <td style={styles.total}>

                    {formatoMoneda(
                      venta.total
                    )}

                  </td>

                  <td style={styles.td}>

                    {new Date(
                      venta.createdAt
                    ).toLocaleString("es-CO")}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );

}

/* ===================================================== */
/* ======================= ESTILOS ===================== */
/* ===================================================== */

const styles = {

  container: {
    width: "100%"
  },

  header: {
    marginBottom: "30px"
  },

  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "700",
    color: "#ffffff"
  },

  subtitle: {
    marginTop: "8px",
    color: "#cbd5e1"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },

  statCard: {
    background:
      "rgba(255,255,255,0.06)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "24px",
    backdropFilter: "blur(12px)",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.25)"
  },

  statIcon: {
    fontSize: "32px"
  },

  statTitle: {
    marginTop: "14px",
    color: "#cbd5e1"
  },

  statValue: {
    fontSize: "30px",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#fff"
  },

  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
    flexWrap: "wrap",
    background:
      "rgba(255,255,255,0.05)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "20px",
    backdropFilter: "blur(12px)"
  },

  searchInput: {
    flex: 1,
    minWidth: "260px",
    padding: "14px",
    borderRadius: "14px",
    border:
      "1px solid rgba(255,255,255,0.15)",
    outline: "none",
    background:
      "rgba(255,255,255,0.08)",
    color: "#fff"
  },

  dateInput: {
    padding: "14px",
    borderRadius: "14px",
    border:
      "1px solid rgba(255,255,255,0.15)",
    background:
      "rgba(255,255,255,0.08)",
    color: "#fff",
    outline: "none"
  },

  filterBtn: {
    background:
      "linear-gradient(135deg, #7c3aed, #4f46e5)",
    color: "#fff",
    border: "none",
    padding: "14px 20px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "600"
  },

  resetBtn: {
    background:
      "linear-gradient(135deg, #0ea5e9, #2563eb)",
    color: "#fff",
    border: "none",
    padding: "14px 20px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "600"
  },

  tableContainer: {
    background:
      "rgba(255,255,255,0.05)",
    borderRadius: "24px",
    overflowX: "auto",
    border:
      "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.25)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    background:
      "rgba(15,23,42,0.9)",
    color: "#fff",
    padding: "18px",
    textAlign: "left",
    fontWeight: "600"
  },

  tr: {
    transition: "0.3s"
  },

  td: {
    padding: "18px",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)",
    color: "#e2e8f0",
    verticalAlign: "top"
  },

  total: {
    padding: "18px",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)",
    color: "#22c55e",
    fontWeight: "800"
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "14px"
  },

  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "18px"
  },

  email: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px"
  },

  badge: {
    background:
      "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600"
  },

  productsBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  productItem: {
    background:
      "rgba(255,255,255,0.06)",
    padding: "12px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },

  saleId: {
    fontWeight: "700",
    color: "#a78bfa"
  },

  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#cbd5e1"
  },

  center: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    color: "#fff"
  },

  loader: {
    width: "45px",
    height: "45px",
    border:
      "5px solid rgba(255,255,255,0.2)",
    borderTop:
      "5px solid #8b5cf6",
    borderRadius: "50%"
  }

};