import { FaCalendarAlt, FaSearch, FaSyncAlt } from "react-icons/fa";

export default function VentaFilters({
  busqueda = "",
  setBusqueda,
  desde = "",
  setDesde,
  hasta = "",
  setHasta,
  filtrarVentas,
  obtenerVentas,
  styles,
}) {
  const limpiarFiltros = () => {
    setBusqueda("");
    setDesde("");
    setHasta("");

    if (typeof obtenerVentas === "function") {
      obtenerVentas();
    }
  };

  const aplicarFiltro = () => {
    if (!desde && !hasta) {
      if (typeof obtenerVentas === "function") {
        obtenerVentas();
      }

      return;
    }

    if (!desde) {
      alert("Selecciona la fecha inicial.");
      return;
    }

    if (!hasta) {
      alert("Selecciona la fecha final.");
      return;
    }

    if (desde > hasta) {
      alert("La fecha inicial no puede ser mayor que la fecha final.");
      return;
    }

    if (typeof filtrarVentas === "function") {
      filtrarVentas();
    }
  };

  return (
    <div style={styles.filters}>
      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>
          <FaSearch style={{ marginRight: "6px", verticalAlign: "middle" }} />
          Buscar
        </label>

        <input
          type="text"
          placeholder="Cliente o producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.searchInput}
          aria-label="Buscar ventas por cliente o producto"
        />
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>
          <FaCalendarAlt
            style={{ marginRight: "6px", verticalAlign: "middle" }}
          />
          Desde
        </label>

        <input
          type="date"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          style={styles.dateInput}
          aria-label="Fecha inicial"
        />
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>
          <FaCalendarAlt
            style={{ marginRight: "6px", verticalAlign: "middle" }}
          />
          Hasta
        </label>

        <input
          type="date"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          style={styles.dateInput}
          aria-label="Fecha final"
        />
      </div>

      <div style={styles.filterButtons}>
        <button
          type="button"
          onClick={aplicarFiltro}
          style={styles.filterBtn}
          title="Aplicar filtros"
        >
          <FaSearch style={{ marginRight: "6px", verticalAlign: "middle" }} />
          Filtrar
        </button>

        <button
          type="button"
          onClick={limpiarFiltros}
          style={styles.resetBtn}
          title="Limpiar todos los filtros"
        >
          <FaSyncAlt style={{ marginRight: "6px", verticalAlign: "middle" }} />
          Limpiar
        </button>
      </div>
    </div>
  );
}
