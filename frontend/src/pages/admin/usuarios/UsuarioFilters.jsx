export default function UsuarioFilters({
  busqueda,
  setBusqueda,
  filtroRol,
  setFiltroRol
}) {

  return (

    <div style={styles.filters}>

      <input
        type="text"
        placeholder="Buscar usuario..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(e.target.value)
        }
        style={styles.searchInput}
      />

      <select
        value={filtroRol}
        onChange={(e) =>
          setFiltroRol(e.target.value)
        }
        style={styles.select}
      >

        <option value="todos">
          Todos los roles
        </option>

        <option value="administrador">
          Administradores
        </option>

        <option value="cliente">
          Clientes
        </option>

        <option value="empleado">
          Empleados
        </option>

      </select>

    </div>

  );

}

const styles = {

  filters: {

    display: "flex",

    gap: "15px",

    marginBottom: "25px",

    flexWrap: "wrap"

  },

  searchInput: {

    flex: 1,

    minWidth: "260px",

    padding: "16px",

    borderRadius: "18px",

    border: "none",

    outline: "none",

    background:
      "rgba(255,255,255,0.08)",

    color: "#fff",

    fontSize: "15px"

  },

  select: {

    padding: "16px",

    borderRadius: "18px",

    border: "none",

    background:
      "rgba(255,255,255,0.08)",

    color: "#fff",

    minWidth: "220px"

  }

};