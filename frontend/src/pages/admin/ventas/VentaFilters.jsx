import React from "react";

export default function VentaFilters({
  busqueda,
  setBusqueda,
  desde,
  setDesde,
  hasta,
  setHasta,
  filtrarVentas,
  obtenerVentas,
  styles,
}) {
  const limpiarFiltros = () => {
    setBusqueda("");
    setDesde("");
    setHasta("");

    if (obtenerVentas) {
      obtenerVentas();
    }
  };

  const aplicarFiltro = () => {
    if (!desde && !hasta) {
      if (filtrarVentas) {
        filtrarVentas();
      }
      return;
    }

    if (desde && !hasta) {
      alert("Selecciona también la fecha final.");
      return;
    }

    if (!desde && hasta) {
      alert("Selecciona también la fecha inicial.");
      return;
    }

    if (desde > hasta) {
      alert("La fecha inicial no puede ser mayor que la fecha final.");
      return;
    }

    if (filtrarVentas) {
      filtrarVentas();
    }
  };

  return (
    <div style={styles.filters}>
      {/* ================= BUSCADOR ================= */}

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>
          🔎 Buscar
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

      {/* ================= FECHA INICIAL ================= */}

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>
          📅 Desde
        </label>

        <input
          type="date"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          style={styles.dateInput}
          aria-label="Fecha inicial"
        />
      </div>

      {/* ================= FECHA FINAL ================= */}

      <div style={styles.filterGroup}>
        <label style={styles.filterLabel}>
          📅 Hasta
        </label>

        <input
          type="date"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          style={styles.dateInput}
          aria-label="Fecha final"
        />
      </div>

      {/* ================= BOTONES ================= */}

      <div style={styles.filterButtons}>
        <button
          type="button"
          onClick={aplicarFiltro}
          style={styles.filterBtn}
          title="Aplicar filtros"
        >
          🔎 Filtrar
        </button>

        <button
          type="button"
          onClick={limpiarFiltros}
          style={styles.resetBtn}
          title="Limpiar todos los filtros"
        >
          🔄 Limpiar
        </button>
      </div>
    </div>
  );
}