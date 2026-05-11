import { useEffect, useState } from "react";
import api from "../../services/api";

function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= OBTENER USUARIOS ================= */

  const obtenerUsuarios = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/admin/usuarios");

      console.log("Usuarios:", response.data);

      const data = Array.isArray(response.data) ? response.data : [];

      setUsuarios(data);

    } catch (error) {

      console.error("Error al obtener usuarios:", error);

      setError("No se pudieron cargar los usuarios");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  /* ================= ELIMINAR ================= */

  const eliminarUsuario = async (id) => {

    const confirmar = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmar) return;

    try {

      await api.delete(`/admin/usuarios/${id}`);

      setUsuarios(prev => prev.filter(u => u.id !== id));

    } catch (error) {

      console.error(error);
      alert("No se pudo eliminar el usuario");

    }

  };

  /* ================= CAMBIAR ROL ================= */

  const cambiarRol = async (id, nuevoRol) => {

    const confirmar = window.confirm("¿Deseas cambiar el rol?");
    if (!confirmar) return;

    try {

      await api.put(`/admin/usuarios/${id}/rol`, { rol: nuevoRol });

      setUsuarios(prev =>
        prev.map(u =>
          u.id === id ? { ...u, rol: nuevoRol } : u
        )
      );

    } catch (error) {

      console.error(error);
      alert("No se pudo actualizar el rol");

    }

  };

  /* ================= UI ================= */

  if (loading) {
    return <p style={{ padding: "20px" }}>Cargando usuarios...</p>;
  }

  if (error) {
    return <p style={{ color: "red", padding: "20px" }}>{error}</p>;
  }

  return (

    <div className="container mt-4">

      <h2>Gestión de Usuarios</h2>

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

    </div>

  );

}

export default Usuarios;