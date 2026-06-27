import styles from "./usuariosStyles";

export default function UsuarioTable({
  usuarios,
  cambiarRol,
  eliminarUsuario,
}) {
  const confirmarCambioRol = (usuarioId, nuevoRol) => {
    const confirmar = window.confirm(`¿Deseas cambiar el rol a ${nuevoRol}?`);

    if (confirmar) {
      cambiarRol(usuarioId, nuevoRol);
    }
  };

  const confirmarEliminar = (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este usuario?",
    );

    if (confirmar) {
      eliminarUsuario(id);
    }
  };

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Usuario</th>

            <th style={styles.th}>Correo</th>

            <th style={styles.th}>Rol</th>

            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.userInfo}>
                    <div style={styles.avatar}>
                      {usuario.nombre?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <strong>{usuario.nombre}</strong>

                      <p style={styles.idText}>ID: {usuario.id}</p>
                    </div>
                  </div>
                </td>

                <td style={styles.td}>{usuario.email}</td>

                <td style={styles.td}>
                  <select
                    value={usuario.rol}
                    onChange={(e) =>
                      confirmarCambioRol(usuario.id, e.target.value)
                    }
                    style={styles.roleSelect}
                  >
                    <option value="cliente">Cliente</option>

                    <option value="empleado">Empleado</option>

                    <option value="administrador">Administrador</option>
                  </select>
                </td>

                <td style={styles.td}>
                  {usuario.email !== "admin@modagest.com" && (
                    <button
                      style={styles.deleteBtn}
                      onClick={() => confirmarEliminar(usuario.id)}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={styles.empty}>
                No se encontraron usuarios
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
