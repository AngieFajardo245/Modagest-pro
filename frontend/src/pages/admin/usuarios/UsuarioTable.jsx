export default function UsuarioTable({
  usuarios,
  cambiarRol,
  eliminarUsuario
}) {

  return (

    <div style={styles.tableContainer}>

      <table style={styles.table}>

        <thead>

          <tr>

            <th style={styles.th}>
              Usuario
            </th>

            <th style={styles.th}>
              Correo
            </th>

            <th style={styles.th}>
              Rol
            </th>

            <th style={styles.th}>
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {usuarios.length > 0 ? (

            usuarios.map((usuario) => (

              <tr
                key={usuario.id}
                style={styles.tr}
              >

                <td style={styles.td}>

                  <div style={styles.userInfo}>

                    <div style={styles.avatar}>

                      {usuario.nombre
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                    <div>

                      <strong>
                        {usuario.nombre}
                      </strong>

                      <p style={styles.idText}>
                        ID: {usuario.id}
                      </p>

                    </div>

                  </div>

                </td>

                <td style={styles.td}>
                  {usuario.email}
                </td>

                <td style={styles.td}>

                  <select
                    value={usuario.rol}
                    onChange={(e) =>
                      cambiarRol(
                        usuario.id,
                        e.target.value
                      )
                    }
                    style={styles.roleSelect}
                  >

                    <option value="cliente">
                      Cliente
                    </option>

                    <option value="empleado">
                      Empleado
                    </option>

                    <option value="administrador">
                      Administrador
                    </option>

                  </select>

                </td>

                <td style={styles.td}>

                  {usuario.email !==
                    "admin@modagest.com" && (

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        eliminarUsuario(usuario.id)
                      }
                    >

                      Eliminar

                    </button>

                  )}

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="4"
                style={styles.empty}
              >

                No se encontraron usuarios

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}

const styles = {

  tableContainer: {

    background:
      "rgba(255,255,255,0.05)",

    borderRadius: "28px",

    overflow: "hidden",

    border:
      "1px solid rgba(139,92,246,0.15)",

    backdropFilter: "blur(12px)"

  },

  table: {

    width: "100%",

    borderCollapse: "collapse",

    color: "#fff"

  },

  th: {

    padding: "20px",

    textAlign: "left",

    background:
      "rgba(17,24,39,0.9)"

  },

  td: {

    padding: "20px",

    borderBottom:
      "1px solid rgba(255,255,255,0.06)"

  },

  userInfo: {

    display: "flex",

    alignItems: "center",

    gap: "15px"

  },

  avatar: {

    width: "50px",

    height: "50px",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg,#7c3aed,#9333ea)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontWeight: "bold"

  },

  idText: {

    margin: 0,

    color: "#94a3b8",

    fontSize: "13px"

  },

  roleSelect: {

    padding: "10px 12px",

    borderRadius: "10px",

    border: "none",

    fontWeight: "600"

  },

  deleteBtn: {

    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",

    color: "#fff",

    border: "none",

    padding: "12px 18px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "600"

  },

  empty: {

    textAlign: "center",

    padding: "40px",

    color: "#cbd5e1"

  }

};