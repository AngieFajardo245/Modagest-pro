import { useEffect, useState } from "react";
import {
  FaCity,
  FaMapMarkerAlt,
  FaPen,
  FaPhoneAlt,
  FaPlus,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

const formularioInicial = {
  direccion: "",
  ciudad: "",
  telefono: "",
};

export default function DireccionesCliente() {
  const [direcciones, setDirecciones] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [editando, setEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const obtenerDirecciones = async () => {
    try {
      setCargando(true);
      const respuesta = await api.get("/cliente/direcciones");
      setDirecciones(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.error("Error obteniendo direcciones:", error);
      toast.error("No se pudieron cargar las direcciones");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerDirecciones();
  }, []);

  const abrirFormulario = () => {
    setFormulario(formularioInicial);
    setEditando(null);
    setError("");
    setMostrarFormulario(true);
  };

  const editarDireccion = (direccion) => {
    setFormulario({
      direccion: direccion.direccion || "",
      ciudad: direccion.ciudad || "",
      telefono: direccion.telefono || "",
    });
    setEditando(direccion.id);
    setError("");
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    if (guardando) return;

    setFormulario(formularioInicial);
    setEditando(null);
    setError("");
    setMostrarFormulario(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const validarFormulario = () => {
    if (formulario.direccion.trim().length < 5) {
      return "La dirección debe tener mínimo 5 caracteres";
    }

    if (formulario.ciudad.trim().length < 2) {
      return "La ciudad debe tener mínimo 2 caracteres";
    }

    if (formulario.telefono.trim().length < 7) {
      return "El teléfono debe tener mínimo 7 caracteres";
    }

    return "";
  };

  const guardarDireccion = async (e) => {
    e.preventDefault();

    const mensajeError = validarFormulario();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    const datos = {
      direccion: formulario.direccion.trim(),
      ciudad: formulario.ciudad.trim(),
      telefono: formulario.telefono.trim(),
    };

    try {
      setGuardando(true);
      setError("");

      if (editando) {
        await api.put(`/cliente/direcciones/${editando}`, datos);
        toast.success("Dirección actualizada correctamente");
      } else {
        await api.post("/cliente/direcciones", datos);
        toast.success("Dirección creada correctamente");
      }

      setFormulario(formularioInicial);
      setEditando(null);
      setMostrarFormulario(false);
      await obtenerDirecciones();
    } catch (error) {
      console.error("Error guardando dirección:", error);

      const mensaje =
        error.response?.data?.message || "No se pudo guardar la dirección";

      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarDireccion = async (direccion) => {
    const confirmar = window.confirm(
      `¿Deseas eliminar la dirección "${direccion.direccion}"?`,
    );

    if (!confirmar) return;

    try {
      await api.delete(`/cliente/direcciones/${direccion.id}`);

      setDirecciones((anteriores) =>
        anteriores.filter((item) => item.id !== direccion.id),
      );

      toast.success("Dirección eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando dirección:", error);

      const mensaje =
        error.response?.data?.message || "No se pudo eliminar la dirección";

      toast.error(mensaje);
    }
  };

  return (
    <main style={styles.container}>
      <section style={styles.encabezado}>
        <div>
          <p style={styles.etiqueta}>MI CUENTA</p>
          <h1 style={styles.titulo}>Mis direcciones</h1>
          <p style={styles.subtitulo}>
            Administra las direcciones que utilizarás en tus compras.
          </p>
        </div>

        <button
          type="button"
          style={styles.botonNuevo}
          onClick={abrirFormulario}
        >
          <FaPlus />
          Nueva dirección
        </button>
      </section>

      {cargando ? (
        <section style={styles.estado}>
          <div style={styles.spinner} />
          <p>Cargando direcciones...</p>
        </section>
      ) : direcciones.length === 0 ? (
        <section style={styles.estado}>
          <div style={styles.iconoVacio}>
            <FaMapMarkerAlt />
          </div>
          <h2 style={styles.tituloVacio}>No tienes direcciones guardadas</h2>
          <p style={styles.textoVacio}>
            Agrega una dirección para facilitar tus próximas compras.
          </p>
          <button
            type="button"
            style={styles.botonNuevo}
            onClick={abrirFormulario}
          >
            <FaPlus />
            Agregar dirección
          </button>
        </section>
      ) : (
        <section style={styles.cuadricula}>
          {direcciones.map((item) => (
            <article key={item.id} style={styles.tarjeta}>
              <div style={styles.tarjetaEncabezado}>
                <div style={styles.iconoDireccion}>
                  <FaMapMarkerAlt />
                </div>
                <span style={styles.identificador}>Dirección #{item.id}</span>
              </div>

              <h2 style={styles.direccion}>{item.direccion}</h2>

              <div style={styles.dato}>
                <FaCity />
                <span>{item.ciudad}</span>
              </div>

              <div style={styles.dato}>
                <FaPhoneAlt />
                <span>{item.telefono}</span>
              </div>

              <div style={styles.acciones}>
                <button
                  type="button"
                  style={styles.botonEditar}
                  onClick={() => editarDireccion(item)}
                >
                  <FaPen />
                  Editar
                </button>

                <button
                  type="button"
                  style={styles.botonEliminar}
                  onClick={() => eliminarDireccion(item)}
                >
                  <FaTrash />
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {mostrarFormulario && (
        <div style={styles.overlay} onMouseDown={cerrarFormulario}>
          <section
            style={styles.modal}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <header style={styles.modalEncabezado}>
              <div>
                <p style={styles.etiqueta}>
                  {editando ? "ACTUALIZAR DATOS" : "NUEVA UBICACIÓN"}
                </p>
                <h2 style={styles.modalTitulo}>
                  {editando ? "Editar dirección" : "Agregar dirección"}
                </h2>
              </div>

              <button
                type="button"
                style={styles.botonCerrar}
                onClick={cerrarFormulario}
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>
            </header>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={guardarDireccion} style={styles.formulario}>
              <label style={styles.campoCompleto}>
                <span style={styles.label}>Dirección</span>
                <input
                  type="text"
                  name="direccion"
                  value={formulario.direccion}
                  onChange={handleChange}
                  placeholder="Ejemplo: Carrera 15 # 45-20"
                  maxLength={255}
                  style={styles.input}
                  disabled={guardando}
                />
              </label>

              <label style={styles.campo}>
                <span style={styles.label}>Ciudad</span>
                <input
                  type="text"
                  name="ciudad"
                  value={formulario.ciudad}
                  onChange={handleChange}
                  placeholder="Ejemplo: Bogotá"
                  maxLength={100}
                  style={styles.input}
                  disabled={guardando}
                />
              </label>

              <label style={styles.campo}>
                <span style={styles.label}>Teléfono</span>
                <input
                  type="tel"
                  name="telefono"
                  value={formulario.telefono}
                  onChange={handleChange}
                  placeholder="Ejemplo: 3001234567"
                  maxLength={20}
                  style={styles.input}
                  disabled={guardando}
                />
              </label>

              <div style={styles.botones}>
                <button
                  type="button"
                  style={styles.botonCancelar}
                  onClick={cerrarFormulario}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={styles.botonGuardar}
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : editando
                      ? "Guardar cambios"
                      : "Guardar dirección"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100%",
    padding: "36px",
    boxSizing: "border-box",
    color: "#f8fafc",
  },
  encabezado: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "30px",
  },
  etiqueta: {
    margin: "0 0 8px",
    color: "#a78bfa",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },
  titulo: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "900",
  },
  subtitulo: {
    margin: "8px 0 0",
    color: "#94a3b8",
    fontSize: "15px",
  },
  botonNuevo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    padding: "14px 20px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(124,58,237,0.35)",
  },
  cuadricula: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  tarjeta: {
    padding: "24px",
    borderRadius: "22px",
    background: "linear-gradient(145deg, #172033, #111827)",
    border: "1px solid rgba(167,139,250,0.18)",
    boxShadow: "0 16px 35px rgba(0,0,0,0.25)",
  },
  tarjetaEncabezado: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "20px",
  },
  iconoDireccion: {
    width: "46px",
    height: "46px",
    display: "grid",
    placeItems: "center",
    borderRadius: "14px",
    color: "#fff",
    fontSize: "20px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  },
  identificador: {
    padding: "7px 11px",
    borderRadius: "999px",
    color: "#c4b5fd",
    background: "rgba(124,58,237,0.14)",
    fontSize: "12px",
    fontWeight: "800",
  },
  direccion: {
    margin: "0 0 18px",
    color: "#fff",
    fontSize: "19px",
    lineHeight: 1.4,
  },
  dato: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "12px",
    color: "#cbd5e1",
    fontSize: "14px",
  },
  acciones: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "24px",
  },
  botonEditar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px",
    border: "none",
    borderRadius: "12px",
    background: "#7c3aed",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },
  botonEliminar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px",
    border: "none",
    borderRadius: "12px",
    background: "rgba(239,68,68,0.15)",
    color: "#f87171",
    fontWeight: "700",
    cursor: "pointer",
  },
  estado: {
    minHeight: "360px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "35px",
    borderRadius: "24px",
    textAlign: "center",
    background: "rgba(17,24,39,0.75)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  iconoVacio: {
    width: "76px",
    height: "76px",
    display: "grid",
    placeItems: "center",
    marginBottom: "18px",
    borderRadius: "22px",
    color: "#c4b5fd",
    fontSize: "32px",
    background: "rgba(124,58,237,0.18)",
  },
  tituloVacio: {
    margin: "0 0 8px",
    fontSize: "22px",
  },
  textoVacio: {
    margin: "0 0 22px",
    color: "#94a3b8",
  },
  spinner: {
    width: "42px",
    height: "42px",
    border: "4px solid rgba(255,255,255,0.15)",
    borderTopColor: "#8b5cf6",
    borderRadius: "50%",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1100,
    display: "grid",
    placeItems: "center",
    padding: "20px",
    background: "rgba(2,6,23,0.78)",
    backdropFilter: "blur(8px)",
  },
  modal: {
    width: "620px",
    maxWidth: "100%",
    padding: "28px",
    boxSizing: "border-box",
    borderRadius: "26px",
    background: "linear-gradient(145deg, #172033, #111827)",
    border: "1px solid rgba(167,139,250,0.2)",
    boxShadow: "0 25px 70px rgba(0,0,0,0.5)",
  },
  modalEncabezado: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "22px",
  },
  modalTitulo: {
    margin: 0,
    color: "#fff",
    fontSize: "26px",
  },
  botonCerrar: {
    width: "42px",
    height: "42px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    border: "none",
    borderRadius: "50%",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    marginBottom: "18px",
    padding: "12px 15px",
    borderRadius: "12px",
    background: "rgba(127,29,29,0.8)",
    border: "1px solid rgba(248,113,113,0.3)",
    color: "#fff",
    fontWeight: "600",
  },
  formulario: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  campo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  campoCompleto: {
    display: "flex",
    flexDirection: "column",
    gridColumn: "1 / -1",
    gap: "8px",
  },
  label: {
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "700",
  },
  input: {
    width: "100%",
    padding: "14px 15px",
    boxSizing: "border-box",
    borderRadius: "13px",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    fontSize: "15px",
  },
  botones: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridColumn: "1 / -1",
    gap: "14px",
    marginTop: "8px",
  },
  botonCancelar: {
    padding: "14px",
    border: "none",
    borderRadius: "13px",
    background: "#374151",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
  },
  botonGuardar: {
    padding: "14px",
    border: "none",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(124,58,237,0.3)",
  },
};
