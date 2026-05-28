import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

import styles from "./usuariosStyles";

import UsuarioStats from "./UsuarioStats";
import UsuarioFilters from "./UsuarioFilters";
import UsuarioTable from "./UsuarioTable";

function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FILTROS ================= */

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");

  /* ===================================================== */
  /* ================= OBTENER USUARIOS ================== */
  /* ===================================================== */

  const obtenerUsuarios = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/usuarios"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setUsuarios(data);

    } catch (error) {

      console.error(error);

      setError(
        "No se pudieron cargar los usuarios"
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    obtenerUsuarios();

  }, []);

  /* ===================================================== */
  /* ================= ELIMINAR USUARIO ================== */
  /* ===================================================== */

  const eliminarUsuario = async (id) => {

    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este usuario?"
    );

    if (!confirmar) return;

    try {

      await api.delete(
        `/admin/usuarios/${id}`
      );

      setUsuarios((prev) =>
        prev.filter((u) => u.id !== id)
      );

      alert("✅ Usuario eliminado");

    } catch (error) {

      console.error(error);

      alert(
        "❌ No se pudo eliminar el usuario"
      );

    }

  };

  /* ===================================================== */
  /* ==================== CAMBIAR ROL ==================== */
  /* ===================================================== */

  const cambiarRol = async (
    id,
    nuevoRol
  ) => {

    try {

      await api.put(
        `/admin/usuarios/${id}/rol`,
        {
          rol: nuevoRol
        }
      );

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                rol: nuevoRol
              }
            : u
        )
      );

      alert("✅ Rol actualizado");

    } catch (error) {

      console.error(error);

      alert(
        "❌ No se pudo actualizar el rol"
      );

    }

  };

  /* ===================================================== */
  /* =================== FILTRAR DATOS =================== */
  /* ===================================================== */

  const usuariosFiltrados = useMemo(() => {

    return usuarios.filter((u) => {

      const coincideBusqueda =

        u.nombre
          ?.toLowerCase()
          .includes(
            busqueda.toLowerCase()
          ) ||

        u.email
          ?.toLowerCase()
          .includes(
            busqueda.toLowerCase()
          );

      const coincideRol =

        filtroRol === "todos"
          ? true
          : u.rol === filtroRol;

      return (
        coincideBusqueda &&
        coincideRol
      );

    });

  }, [
    usuarios,
    busqueda,
    filtroRol
  ]);

  /* ===================================================== */
  /* =================== ESTADISTICAS ==================== */
  /* ===================================================== */

  const totalUsuarios =
    usuarios.length;

  const totalAdmins =
    usuarios.filter(
      (u) =>
        u.rol === "administrador"
    ).length;

  const totalClientes =
    usuarios.filter(
      (u) =>
        u.rol === "cliente"
    ).length;

  const totalEmpleados =
    usuarios.filter(
      (u) =>
        u.rol === "empleado"
    ).length;

  /* ===================================================== */
  /* ======================= LOADING ===================== */
  /* ===================================================== */

  if (loading) {

    return (

      <div style={styles.center}>

        <div style={styles.loader}></div>

        <p style={styles.loadingText}>
          Cargando usuarios...
        </p>

      </div>

    );

  }

  /* ===================================================== */
  /* ======================== ERROR ====================== */
  /* ===================================================== */

  if (error) {

    return (

      <div style={styles.center}>

        <p style={styles.error}>
          {error}
        </p>

      </div>

    );

  }

  /* ===================================================== */
  /* ========================== UI ======================= */
  /* ===================================================== */

  return (

    <div style={styles.container}>

      {/* ================= HEADER ================= */}

      <div style={styles.header}>

        <div>

          <p style={styles.badgeTop}>
            ✨ Panel Administrativo
          </p>

          <h1 style={styles.title}>
            👥 Gestión de Usuarios
          </h1>

          <p style={styles.subtitle}>
            Administra usuarios y roles del sistema
          </p>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <UsuarioStats
        totalUsuarios={totalUsuarios}
        totalAdmins={totalAdmins}
        totalClientes={totalClientes}
        totalEmpleados={totalEmpleados}
      />

      {/* ================= FILTROS ================= */}

      <UsuarioFilters
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroRol={filtroRol}
        setFiltroRol={setFiltroRol}
      />

      {/* ================= TABLA ================= */}

      <UsuarioTable
        usuarios={usuariosFiltrados}
        cambiarRol={cambiarRol}
        eliminarUsuario={eliminarUsuario}
      />

    </div>

  );

}

export default Usuarios;