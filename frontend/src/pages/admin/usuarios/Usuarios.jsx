import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

import { toast } from "react-toastify";

import styles from "./usuariosStyles";

import UsuarioStats from "./UsuarioStats";
import UsuarioFilters from "./UsuarioFilters";
import UsuarioTable from "./UsuarioTable";
import UsuarioForm from "./UsuarioForm";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* ================= FILTROS ================= */

  const [busqueda, setBusqueda] = useState("");

  const [filtroRol, setFiltroRol] = useState("todos");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  /* ===================================================== */
  /* ================= OBTENER USUARIOS ================== */
  /* ===================================================== */

  const obtenerUsuarios = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await api.get("/admin/usuarios");

      setUsuarios(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);

      setError("No se pudieron cargar los usuarios");
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
      "¿Seguro que deseas eliminar este usuario?",
    );

    if (!confirmar) return;

    try {
      await api.delete(`/admin/usuarios/${id}`);

      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));

      toast.success("Usuario eliminado correctamente");
    } catch (err) {
      console.error(err);

      toast.error("No se pudo eliminar el usuario");
    }
  };

  /* ===================================================== */
  /* ================= CAMBIAR ROL ======================= */
  /* ===================================================== */

  const cambiarRol = async (id, nuevoRol) => {
    try {
      await api.put(
        `/admin/usuarios/${id}/rol`,

        {
          rol: nuevoRol,
        },
      );

      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === id
            ? {
                ...usuario,
                rol: nuevoRol,
              }
            : usuario,
        ),
      );

      toast.success("Rol actualizado");
    } catch (err) {
      console.error(err);

      toast.error("No se pudo actualizar el rol");
    }
  };

  /* ===================================================== */
/* ================= CREAR USUARIO ====================== */
/* ===================================================== */

const crearUsuario = async (datos) => {
  try {

    await api.post("/admin/usuarios", datos);

    toast.success("Usuario creado correctamente");

    setMostrarFormulario(false);

    obtenerUsuarios();

  } catch (err) {

    console.error(err);

    toast.error(
      err.response?.data?.message ||
      "No se pudo crear el usuario"
    );

  }
};

  /* ===================================================== */
  /* ================= FILTROS =========================== */
  /* ===================================================== */

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        usuario.nombre?.toLowerCase().includes(texto) ||
        usuario.email?.toLowerCase().includes(texto);

      const coincideRol =
        filtroRol === "todos" ? true : usuario.rol === filtroRol;

      return coincideBusqueda && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  /* ===================================================== */
  /* ================= ESTADISTICAS ====================== */
  /* ===================================================== */

  const totalUsuarios = usuarios.length;

  const totalAdmins = usuarios.filter((u) => u.rol === "administrador").length;

  const totalClientes = usuarios.filter((u) => u.rol === "cliente").length;

  const totalEmpleados = usuarios.filter((u) => u.rol === "empleado").length;

  /* ===================================================== */
  /* ================= LOADING =========================== */
  /* ===================================================== */

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loader}></div>

        <p>Cargando usuarios...</p>
      </div>
    );
  }

  /* ===================================================== */
  /* ================= ERROR ============================= */
  /* ===================================================== */

  if (error) {
    return (
      <div style={styles.center}>
        <p style={styles.error}>{error}</p>

        <button onClick={obtenerUsuarios} style={styles.filterBtn}>
          Reintentar
        </button>
      </div>
    );
  }

  /* ===================================================== */
  /* ================= UI ================================ */
  /* ===================================================== */

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <p style={styles.badgeTop}>✨ Panel Administrativo</p>

        <h1 style={styles.title}>👥 Gestión de Usuarios</h1>

        <p style={styles.subtitle}>
          Administra usuarios y permisos del sistema
        </p>
      </div>

      <button
        style={styles.addButton}
        onClick={() => {
          console.log("Botón presionado");
          setMostrarFormulario(true);
        }}
      >
        + Nuevo Usuario
      </button>

      <UsuarioStats
        totalUsuarios={totalUsuarios}
        totalAdmins={totalAdmins}
        totalClientes={totalClientes}
        totalEmpleados={totalEmpleados}
      />

      <UsuarioFilters
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroRol={filtroRol}
        setFiltroRol={setFiltroRol}
      />

      <UsuarioTable
        usuarios={usuariosFiltrados}
        cambiarRol={cambiarRol}
        eliminarUsuario={eliminarUsuario}
      />

      <UsuarioForm
        visible={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        onGuardar={crearUsuario}
      />
    </div>
  );
}
