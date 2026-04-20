import { useEffect, useState } from "react";
import api from "../../services/api";

function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= OBTENER USUARIOS ================= */

  const obtenerUsuarios = async () => {

    try {

      setLoading(true);

      const response = await api.get("/admin/usuarios");

      setUsuarios(response.data);

    } catch (error) {

      console.error("Error al obtener usuarios:", error);
      alert("No se pudieron cargar los usuarios");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  /* ================= ELIMINAR USUARIO ================= */

  const eliminarUsuario = async (id) => {

    const confirmar = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmar) return;

    try {

      await api.delete(`/admin/usuarios/${id}`);

      alert("Usuario eliminado correctamente");

      obtenerUsuarios();

    } catch (error) {

      console.error(error);
      alert("No se pudo eliminar el usuario");

    }

  };

  /* ================= CAMBIAR ROL ================= */

  const cambiarRol = async (id, nuevoRol) => {

    const confirmar = window.confirm("¿Deseas cambiar el rol de este usuario?");

    if (!confirmar) return;

    try {

      await api.put(`/admin/usuarios/${id}/rol`, { rol: nuevoRol });

      alert("Rol actualizado correctamente");

      obtenerUsuarios();

    } catch (error) {

      console.error(error);
      alert("No se pudo actualizar el rol");

    }

  };

  /* ================= INTERFAZ ================= */

  return (

    <div className="container mt-4">

      <h2>Gestión de Usuarios</h2>

      {loading ? (

        <p>Cargando usuarios...</p>

      ) : (

        <table className="table table-striped mt-3">

          <thead>

            <tr>

              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>

            </tr>

          </thead>

          <tbody>

            {usuarios.length > 0 ? (

              usuarios.map((usuario) => (

                <tr key={usuario.id}>

                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>

                  <td>

                    {usuario.rol === "administrador" ? (

                      <span className="badge bg-dark">
                        Administrador
                      </span>

                    ) : (

                      <select
                        className="form-select form-select-sm"
                        value={usuario.rol}
                        onChange={(e) =>
                          cambiarRol(usuario.id, e.target.value)
                        }
                      >

                        <option value="cliente">Cliente</option>
                        <option value="empleado">Empleado</option>

                      </select>

                    )}

                  </td>

                  <td>

                    {usuario.rol !== "administrador" && (

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarUsuario(usuario.id)}
                      >

                        Eliminar

                      </button>

                    )}

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="5" className="text-center">

                  No hay usuarios registrados

                </td>

              </tr>

            )}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default Usuarios;