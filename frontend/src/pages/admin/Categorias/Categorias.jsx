import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

import {
  FaTags,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import { toast } from "react-toastify";

export default function Categorias() {
  /* ===================================================== */
  /* ======================= STATES ====================== */
  /* ===================================================== */

  const [categorias, setCategorias] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [editando, setEditando] = useState(null);

  const [nombre, setNombre] = useState("");

  const [cargando, setCargando] = useState(false);

  const token = localStorage.getItem("token");

  /* ===================================================== */
  /* ================= OBTENER CATEGORIAS ================ */
  /* ===================================================== */

  const obtenerCategorias = async () => {
    try {
      setCargando(true);

      const res = await api.get("/categorias");

      setCategorias(res.data);
    } catch (error) {
      console.error("Error obteniendo categorías:", error);

      toast.error("No se pudieron cargar las categorías");
    } finally {
      setCargando(false);
    }
  };

  /* ===================================================== */
  /* ====================== USE EFFECT =================== */
  /* ===================================================== */

  useEffect(() => {
    obtenerCategorias();
  }, []);

  /* ===================================================== */
  /* ======================= FILTRAR ===================== */
  /* ===================================================== */

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((categoria) =>
      categoria.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase()),
    );
  }, [categorias, busqueda]);

  /* ===================================================== */
  /* ==================== ABRIR CREAR ==================== */
  /* ===================================================== */

  const abrirCrear = () => {
    setEditando(null);
    setNombre("");
    setMostrarFormulario(true);
  };

  /* ===================================================== */
  /* ===================== ABRIR EDITAR ================== */
  /* ===================================================== */

  const abrirEditar = (categoria) => {
    setEditando(categoria.id);
    setNombre(categoria.nombre);
    setMostrarFormulario(true);
  };

  /* ===================================================== */
  /* ===================== CERRAR FORM =================== */
  /* ===================================================== */

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditando(null);
    setNombre("");
  };

  /* ===================================================== */
  /* ====================== GUARDAR ====================== */
  /* ===================================================== */

  const guardarCategoria = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error("El nombre de la categoría es obligatorio");
      return;
    }

    try {
      setCargando(true);

      /* ================= EDITAR ================= */

      if (editando) {
        await api.put(
          `/categorias/${editando}`,
          {
            nombre: nombre.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Categoría actualizada correctamente");
      } else {
        /* ================= CREAR ================= */

        await api.post(
          "/categorias",
          {
            nombre: nombre.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Categoría creada correctamente");
      }

      cerrarFormulario();

      await obtenerCategorias();
    } catch (error) {
      console.error("Error guardando categoría:", error);

      const mensaje =
        error.response?.data?.message ||
        "No se pudo guardar la categoría";

      toast.error(mensaje);
    } finally {
      setCargando(false);
    }
  };

  /* ===================================================== */
  /* ===================== ELIMINAR ====================== */
  /* ===================================================== */

  const eliminarCategoria = async (id) => {
    const categoria = categorias.find(
      (item) => item.id === id,
    );

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la categoría "${categoria?.nombre}"?`,
    );

    if (!confirmar) return;

    try {
      setCargando(true);

      await api.delete(`/categorias/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Categoría eliminada correctamente");

      await obtenerCategorias();
    } catch (error) {
      console.error("Error eliminando categoría:", error);

      const mensaje =
        error.response?.data?.message ||
        "No se pudo eliminar la categoría";

      toast.error(mensaje);
    } finally {
      setCargando(false);
    }
  };

  /* ===================================================== */
  /* ========================= RETURN ==================== */
  /* ===================================================== */

  return (
    <div style={styles.container}>
      {/* ================================================= */}
      {/* ====================== HEADER =================== */}
      {/* ================================================= */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <FaTags />

            Gestión de Categorías
          </h1>

          <p style={styles.subtitle}>
            Administra las categorías de productos de ModaGest Pro.
          </p>
        </div>

        <button
          type="button"
          style={styles.addButton}
          onClick={abrirCrear}
        >
          <FaPlus />

          Nueva categoría
        </button>
      </div>

      {/* ================================================= */}
      {/* ======================= STATS =================== */}
      {/* ================================================= */}

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FaTags />
          </div>

          <div>
            <span style={styles.statLabel}>
              Categorías registradas
            </span>

            <strong style={styles.statValue}>
              {categorias.length}
            </strong>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FaSearch />
          </div>

          <div>
            <span style={styles.statLabel}>
              Resultados
            </span>

            <strong style={styles.statValue}>
              {categoriasFiltradas.length}
            </strong>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ====================== BUSCADOR ================= */}
      {/* ================================================= */}

      <div style={styles.searchContainer}>
        <FaSearch style={styles.searchIcon} />

        <input
          type="text"
          placeholder="Buscar categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.search}
        />

        {busqueda && (
          <button
            type="button"
            style={styles.clearSearch}
            onClick={() => setBusqueda("")}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* ================================================= */}
      {/* ======================== TABLA ================== */}
      {/* ================================================= */}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>

              <th style={styles.th}>Categoría</th>

              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando && categorias.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  style={styles.loading}
                >
                  Cargando categorías...
                </td>
              </tr>
            ) : categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((categoria) => (
                <tr
                  key={categoria.id}
                  style={styles.row}
                >
                  <td style={styles.idCell}>
                    #{categoria.id}
                  </td>

                  <td style={styles.nameCell}>
                    <div style={styles.categoryName}>
                      <div style={styles.categoryIcon}>
                        <FaTags />
                      </div>

                      <span>
                        {categoria.nombre}
                      </span>
                    </div>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        type="button"
                        style={styles.editButton}
                        onClick={() =>
                          abrirEditar(categoria)
                        }
                        disabled={cargando}
                      >
                        <FaEdit />

                        Editar
                      </button>

                      <button
                        type="button"
                        style={styles.deleteButton}
                        onClick={() =>
                          eliminarCategoria(categoria.id)
                        }
                        disabled={cargando}
                      >
                        <FaTrash />

                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={styles.empty}
                >
                  <FaTags style={styles.emptyIcon} />

                  <div>
                    {busqueda
                      ? "No se encontraron categorías"
                      : "No hay categorías registradas"}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================================================= */}
      {/* ======================= MODAL ================== */}
      {/* ================================================= */}

      {mostrarFormulario && (
        <div
          style={styles.overlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              cerrarFormulario();
            }
          }}
        >
          <div style={styles.modal}>
            {/* ================= HEADER MODAL ============= */}

            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>
                  {editando
                    ? "Editar Categoría"
                    : "Nueva Categoría"}
                </h2>

                <p style={styles.modalSubtitle}>
                  {editando
                    ? "Modifica el nombre de la categoría."
                    : "Registra una nueva categoría para tus productos."}
                </p>
              </div>

              <button
                type="button"
                style={styles.closeButton}
                onClick={cerrarFormulario}
              >
                <FaTimes />
              </button>
            </div>

            {/* ================= FORMULARIO ================ */}

            <form onSubmit={guardarCategoria}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Nombre de la categoría
                </label>

                <input
                  type="text"
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  placeholder="Ej: Faldas"
                  style={styles.input}
                  autoFocus
                  disabled={cargando}
                />
              </div>

              {/* ================= BOTONES ================= */}

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={cerrarFormulario}
                  disabled={cargando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={styles.saveButton}
                  disabled={cargando}
                >
                  {editando ? (
                    <>
                      <FaSave />

                      Guardar cambios
                    </>
                  ) : (
                    <>
                      <FaPlus />

                      Crear categoría
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================================================== */
/* ======================== ESTILOS ==================== */
/* ===================================================== */

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    background:
      "radial-gradient(circle at top left, #312e81 0%, #0f172a 35%, #020617 100%)",
    color: "#fff",
  },

  /* ================= HEADER ================= */

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  title: {
    color: "#fff",
    fontSize: "38px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: 0,
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: "10px",
    fontSize: "15px",
  },

  addButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    background:
      "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    border: "none",
    padding: "14px 20px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow:
      "0 8px 25px rgba(124,58,237,0.3)",
  },

  /* ================= STATS ================= */

  statsContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
  },

  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(124,58,237,0.18)",
    color: "#a78bfa",
    fontSize: "20px",
  },

  statLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "5px",
  },

  statValue: {
    display: "block",
    color: "#fff",
    fontSize: "25px",
    fontWeight: "800",
  },

  /* ================= BUSCADOR ================= */

  searchContainer: {
    position: "relative",
    marginBottom: "25px",
  },

  searchIcon: {
    position: "absolute",
    left: "18px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
    pointerEvents: "none",
  },

  search: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px 50px 16px 48px",
    borderRadius: "18px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },

  clearSearch: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,0.1)",
    color: "#cbd5e1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* ================= TABLA ================= */

  tableContainer: {
    background:
      "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    overflow: "hidden",
    boxShadow:
      "0 10px 40px rgba(0,0,0,0.25)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#fff",
  },

  th: {
    background:
      "rgba(255,255,255,0.06)",
    padding: "20px",
    textAlign: "left",
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "700",
  },

  row: {
    transition: "0.2s",
  },

  td: {
    padding: "18px",
    borderBottom:
      "1px solid rgba(255,255,255,0.06)",
  },

  idCell: {
    padding: "18px",
    color: "#e2e8f0",
    fontWeight: "700",
    borderBottom:
      "1px solid rgba(255,255,255,0.06)",
  },

  nameCell: {
    padding: "18px",
    borderBottom:
      "1px solid rgba(255,255,255,0.06)",
  },

  categoryName: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    fontWeight: "700",
    fontSize: "16px",
  },

  categoryIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background:
      "rgba(124,58,237,0.15)",
    color: "#a78bfa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#d97706",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#94a3b8",
  },

  empty: {
    textAlign: "center",
    padding: "50px",
    color: "#94a3b8",
    fontSize: "15px",
  },

  emptyIcon: {
    fontSize: "35px",
    marginBottom: "12px",
    color: "#64748b",
  },

  /* ================= MODAL ================= */

overlay: {
  position: "fixed",
  inset: 0,

  background: "rgba(2,6,23,0.78)",

  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  padding: "20px",

  zIndex: 9999,

  animation: "fadeIn 0.2s ease",
},

modal: {
  width: "100%",
  maxWidth: "520px",

  background:
    "linear-gradient(145deg, #1e293b 0%, #111827 100%)",

  border:
    "1px solid rgba(255,255,255,0.10)",

  borderRadius: "26px",

  padding: "30px",

  boxSizing: "border-box",

  boxShadow:
    "0 30px 90px rgba(0,0,0,0.65)",

  animation: "modalIn 0.25s ease",
},

modalHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",

  gap: "20px",

  marginBottom: "28px",
},

modalTitle: {
  margin: 0,

  color: "#fff",

  fontSize: "28px",

  fontWeight: "800",

  letterSpacing: "-0.5px",
},

modalSubtitle: {
  margin: "8px 0 0",

  color: "#94a3b8",

  fontSize: "14px",

  lineHeight: "1.5",
},

closeButton: {
  width: "44px",
  height: "44px",

  borderRadius: "50%",

  border: "none",

  background:
    "linear-gradient(135deg, #ef4444, #dc2626)",

  color: "#fff",

  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  fontSize: "16px",

  flexShrink: 0,

  boxShadow:
    "0 8px 20px rgba(239,68,68,0.25)",

  transition: "all 0.2s ease",
},

 formGroup: {
  marginBottom: "28px",
},

label: {
  display: "block",

  color: "#e2e8f0",

  fontSize: "14px",

  fontWeight: "700",

  marginBottom: "10px",
},

input: {
  width: "100%",

  boxSizing: "border-box",

  padding: "16px 18px",

  borderRadius: "15px",

  border:
    "1px solid rgba(255,255,255,0.10)",

  background:
    "rgba(255,255,255,0.07)",

  color: "#fff",

  fontSize: "15px",

  outline: "none",

  transition: "all 0.2s ease",
},

modalActions: {
  display: "flex",

  gap: "14px",

  marginTop: "10px",
},

cancelButton: {
  flex: 1,

  border:
    "1px solid rgba(255,255,255,0.08)",

  background: "#334155",

  color: "#fff",

  padding: "15px",

  borderRadius: "14px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "15px",

  transition: "all 0.2s ease",
},

saveButton: {
  flex: 1,

  border: "none",

  background:
    "linear-gradient(135deg, #7c3aed, #9333ea)",

  color: "#fff",

  padding: "15px",

  borderRadius: "14px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "15px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: "8px",

  boxShadow:
    "0 10px 28px rgba(124,58,237,0.28)",

  transition: "all 0.2s ease",
},

}
