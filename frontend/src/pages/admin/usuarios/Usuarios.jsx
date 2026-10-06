import { useEffect, useMemo, useState } from "react";
import { FaStar, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../../services/api";
import UsuarioFilters from "./UsuarioFilters";
import UsuarioForm from "./UsuarioForm";
import UsuarioStats from "./UsuarioStats";
import UsuarioTable from "./UsuarioTable";
import styles from "./usuariosStyles";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const obtenerUsuarios = async () => {
    try {
      setLoading(true);
      setError("");

      const respuesta = await api.get("/admin/usuarios");
      const datos = Array.isArray(respuesta.data) ? respuesta.data : [];

      setUsuarios(datos);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError(
        err.response?.data?.message || "No se pudieron cargar los usuarios",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const eliminarUsuario = async (id) => {
    try {
      await api.delete(`/admin/usuarios/${id}`);

      setUsuarios((actuales) =>
        actuales.filter((usuario) => Number(usuario.id) !== Number(id)),
      );

      toast.success("Usuario eliminado correctamente");
    } catch (err) {
      console.error("Error eliminando usuario:", err);

      toast.error(
        err.response?.data?.message || "No se pudo eliminar el usuario",
      );
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    try {
      await api.put(`/admin/usuarios/${id}/rol`, {
        rol: nuevoRol,
      });

      setUsuarios((actuales) =>
        actuales.map((usuario) =>
          Number(usuario.id) === Number(id)
            ? {
                ...usuario,
                rol: nuevoRol,
              }
            : usuario,
        ),
      );

      toast.success("Rol actualizado correctamente");
    } catch (err) {
      console.error("Error actualizando rol:", err);

      toast.error(
        err.response?.data?.message || "No se pudo actualizar el rol",
      );

      await obtenerUsuarios();
    }
  };

  const crearUsuario = async (datos) => {
    try {
      await api.post("/admin/usuarios", datos);

      toast.success("Usuario creado correctamente");
      setMostrarFormulario(false);
      await obtenerUsuarios();
    } catch (err) {
      console.error("Error creando usuario:", err);

      toast.error(err.response?.data?.message || "No se pudo crear el usuario");
    }
  };

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return usuarios.filter((usuario) => {
      const nombre = String(usuario?.nombre || "").toLowerCase();
      const email = String(usuario?.email || "").toLowerCase();
      const rol = String(usuario?.rol || "").toLowerCase();

      const coincideBusqueda = nombre.includes(texto) || email.includes(texto);
      const coincideRol = filtroRol === "todos" || rol === filtroRol;

      return coincideBusqueda && coincideRol;
    });
  }, [usuarios, busqueda, filtroRol]);

  const totalUsuarios = usuarios.length;

  const totalAdmins = usuarios.filter(
    (usuario) => usuario.rol === "administrador",
  ).length;

  const totalClientes = usuarios.filter(
    (usuario) => usuario.rol === "cliente",
  ).length;

  const totalEmpleados = usuarios.filter(
    (usuario) => usuario.rol === "empleado",
  ).length;

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loader}></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <p style={styles.error}>{error}</p>

        <button
          type="button"
          onClick={obtenerUsuarios}
          style={styles.filterBtn}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <p style={styles.badgeTop}>
          <FaStar style={{ marginRight: "8px", verticalAlign: "middle" }} />
          Panel Administrativo
        </p>

        <h1 style={styles.title}>
          <FaUsers style={{ marginRight: "12px", verticalAlign: "middle" }} />
          Gestión de Usuarios
        </h1>

        <p style={styles.subtitle}>
          Administra usuarios y permisos del sistema
        </p>
      </header>

      <button
        type="button"
        style={styles.addButton}
        onClick={() => setMostrarFormulario(true)}
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
    </main>
  );
}
