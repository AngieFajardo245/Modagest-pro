import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminVentas() {
  const [ventas, setVentas] = useState([]);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    ingresosTotales: 0,
    ventasHoy: 0,
  });

  const [rankingProductos, setRankingProductos] = useState([]);

  useEffect(() => {
    obtenerVentas();
    obtenerEstadisticas();
    obtenerRanking();
  }, []);

  const obtenerVentas = async () => {
    try {
      const res = await api.get("/admin/ventas");
      setVentas(res.data);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }
  };

  const obtenerEstadisticas = async () => {
    try {
      const res = await api.get("/admin/estadisticas");

      console.log("Respuesta estadísticas:", res.data);

      setEstadisticas({
        totalVentas: res.data.totalVentas || 0,
        ingresosTotales: res.data.ingresosTotales || 0,
        ventasHoy: res.data.ventasHoy || 0,
      });

    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const obtenerRanking = async () => {
    try {
      const res = await api.get("/admin/ventas-por-producto");

      console.log("Ranking productos:", res.data);

      let rankingFormateado = [];

      if (!Array.isArray(res.data)) {
        rankingFormateado = Object.entries(res.data).map(
          ([nombre, cantidad]) => ({
            nombre,
            cantidad,
          })
        );
      } else {
        rankingFormateado = res.data;
      }

      rankingFormateado.sort((a, b) => b.cantidad - a.cantidad);

      setRankingProductos(rankingFormateado);

    } catch (error) {
      console.error("Error al cargar ranking:", error);
    }
  };

  const filtrarVentas = async () => {
    try {
      const response = await api.get(
        `/admin/ventas?desde=${desde}&hasta=${hasta}`
      );
      setVentas(response.data);
    } catch (error) {
      console.error("Error al filtrar ventas:", error);
    }
  };

  const exportarExcel = async () => {
    try {
      const response = await api.get("/admin/exportar-ventas", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ventas.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al exportar:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📊 Historial de Ventas</h2>

        {/* ================= ESTADÍSTICAS ================= */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h4>Total Ventas</h4>
            <p style={styles.statNumber}>{estadisticas.totalVentas}</p>
          </div>

          <div style={styles.statCard}>
            <h4>Ingresos Totales</h4>
            <p style={styles.statNumber}>
              ${estadisticas.ingresosTotales}
            </p>
          </div>

          <div style={styles.statCard}>
            <h4>Ventas Hoy</h4>
            <p style={styles.statNumber}>{estadisticas.ventasHoy}</p>
          </div>
        </div>

        <button onClick={exportarExcel} style={styles.botonExportar}>
          📁 Exportar a Excel
        </button>

        {/* ================= RANKING ================= */}
        <div style={styles.rankingContainer}>
          <h3 style={{ marginBottom: "15px" }}>
            🏆 Productos más vendidos
          </h3>

          {rankingProductos.length > 0 ? (
            rankingProductos.map((producto, index) => (
              <div key={index} style={styles.rankingItem}>
                <span>
                  {index + 1}. {producto.nombre}
                </span>
                <strong>
                  {producto.cantidad} ventas
                </strong>
              </div>
            ))
          ) : (
            <p>No hay datos disponibles</p>
          )}
        </div>

        {/* ================= FILTROS ================= */}
        <div style={styles.filtros}>
          <div style={styles.inputGroup}>
            <label>Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              style={styles.input}
            />
          </div>

          <button onClick={filtrarVentas} style={styles.botonPrimario}>
            Filtrar
          </button>

          <button onClick={obtenerVentas} style={styles.botonSecundario}>
            Mostrar todas
          </button>
        </div>

        {/* ================= TABLA ================= */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Empleado</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length > 0 ? (
                ventas.map((venta) => (
                  <tr key={venta.id} style={styles.row}>
                    <td>{venta.id}</td>
                    <td>{venta.Producto?.nombre}</td>
                    <td>{venta.Usuario?.nombre}</td>
                    <td>{venta.cantidad}</td>
                    <td style={styles.total}>${venta.total}</td>
                    <td>
                      {new Date(venta.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={styles.noData}>
                    No hay ventas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}