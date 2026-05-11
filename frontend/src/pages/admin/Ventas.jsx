import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminVentas() {

  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  /* ================= OBTENER VENTAS ================= */

  const obtenerVentas = async () => {

    try {

      setLoading(true);

      const res = await api.get("/admin/ventas");

      setVentas(res.data);

    } catch (error) {

      console.error("Error al cargar ventas:", error);
      alert("No se pudieron cargar las ventas");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  /* ================= FILTRAR ================= */

  const filtrarVentas = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        `/admin/ventas?desde=${desde}&hasta=${hasta}`
      );

      setVentas(response.data);

    } catch (error) {

      console.error("Error al filtrar ventas:", error);

    } finally {

      setLoading(false);

    }

  };

  /* ================= EXPORTAR ================= */

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
      alert("Error al exportar Excel");

    }

  };

  /* ================= UI ================= */

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.title}>📊 Historial de Ventas</h2>

        <button onClick={exportarExcel} style={styles.botonExportar}>
          📁 Exportar a Excel
        </button>

        {/* FILTROS */}

        <div style={styles.filtros}>

          <div>
            <label>Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              style={styles.input}
            />
          </div>

          <div>
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

        {/* TABLA */}

        {loading ? (

          <p>Cargando ventas...</p>

        ) : (

          <table style={styles.table}>

            <thead>

              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Cliente</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>

            </thead>

            <tbody>

              {ventas.length > 0 ? (

                ventas.map((venta) => (

                  <tr key={venta.id}>

                    <td>{venta.id}</td>

                    <td>
                      {venta.Producto?.nombre || "Sin producto"}
                    </td>

                    <td>
                      {venta.Cliente?.nombre || "Sin cliente"}
                    </td>

                    <td>{venta.cantidad}</td>

                    <td>${venta.total}</td>

                    <td>
                      {new Date(venta.createdAt).toLocaleString()}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No hay ventas registradas
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );

}

/* ================= ESTILOS ================= */

const styles = {

  container: {
    padding: "30px",
    display: "flex",
    justifyContent: "center"
  },

  card: {
    width: "100%",
    maxWidth: "1000px",
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },

  title: {
    marginBottom: "20px"
  },

  filtros: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },

  input: {
    padding: "8px"
  },

  botonPrimario: {
    background: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  botonSecundario: {
    background: "#6c757d",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  botonExportar: {
    marginBottom: "15px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  }

};