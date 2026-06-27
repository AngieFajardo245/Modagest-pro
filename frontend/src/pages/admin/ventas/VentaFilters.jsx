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
  return (
    <div style={styles.filters}>
      {/* BUSCADOR */}

      <input
        type="text"
        placeholder="Buscar cliente o producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={styles.searchInput}
        aria-label="Buscar ventas"
      />

      {/* FECHA DESDE */}

      <input
        type="date"
        value={desde}
        onChange={(e) => setDesde(e.target.value)}
        style={styles.dateInput}
        title="Fecha inicial"
      />

      {/* FECHA HASTA */}

      <input
        type="date"
        value={hasta}
        onChange={(e) => setHasta(e.target.value)}
        style={styles.dateInput}
        title="Fecha final"
      />

      {/* FILTRAR */}

      <button
        onClick={() => filtrarVentas && filtrarVentas()}
        style={styles.filterBtn}
        title="Aplicar filtro"
      >
        🔎 Filtrar
      </button>

      {/* LIMPIAR FILTRO */}

      <button
        onClick={() => obtenerVentas && obtenerVentas()}
        style={styles.resetBtn}
        title="Mostrar todas las ventas"
      >
        🔄 Mostrar Todas
      </button>
    </div>
  );
}
