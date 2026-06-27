import styles from "./usuariosStyles";

export default function UsuarioFilters({
  busqueda,
  setBusqueda,
  filtroRol,
  setFiltroRol,
}) {
  return (
    <div style={styles.filters}>
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={styles.searchInput}
      />

      <select
        value={filtroRol}
        onChange={(e) => setFiltroRol(e.target.value)}
        style={styles.select}
      >
        <option value="todos">Todos los roles</option>

        <option value="administrador">Administradores</option>

        <option value="empleado">Empleados</option>

        <option value="cliente">Clientes</option>
      </select>
    </div>
  );
}
