import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function ProductoModal({
  mostrarModal,
  setMostrarModal,
  formulario,
  categorias,
  handleChange,
  handleImagen,
  guardarEdicion,
  previewImagen,
  limpiarFormulario,
}) {
  const [error, setError] = useState("");

  if (!mostrarModal) return null;

  const validarFormulario = () => {
    setError("");

    if (!formulario.nombre?.trim() || formulario.nombre.trim().length < 3) {
      setError("El nombre debe tener mínimo 3 caracteres.");
      return false;
    }

    if (!formulario.precio || Number(formulario.precio) < 1000) {
      setError(
        "El precio debe ser mínimo de $1.000 COP. Ingresa el valor completo. Ejemplo: 18000 para $18.000.",
      );
      return false;
    }

    if (
      !Number.isInteger(Number(formulario.stock)) ||
      Number(formulario.stock) < 0
    ) {
      setError("El stock debe ser un número entero mayor o igual a cero.");
      return false;
    }

    if (!formulario.categoriaId) {
      setError("Selecciona una categoría.");
      return false;
    }

    if (
      !formulario.descripcion?.trim() ||
      formulario.descripcion.trim().length < 10
    ) {
      setError("La descripción debe tener mínimo 10 caracteres.");
      return false;
    }

    return true;
  };

  const cerrarModal = () => {
    setError("");
    setMostrarModal(false);
    limpiarFormulario();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    guardarEdicion(e);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Editar Producto</h2>

          <button
            type="button"
            style={styles.closeBtn}
            onClick={cerrarModal}
            aria-label="Cerrar"
          >
            <FaTimes />
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.modalForm}>
          <div style={styles.row}>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              style={styles.input}
            />

            <input
              type="number"
              name="precio"
              value={formulario.precio}
              onChange={handleChange}
              placeholder="Precio"
              min="1000"
              step="0.01"
              style={styles.input}
            />
          </div>

          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            style={styles.textarea}
          />

          <div style={styles.row}>
            <input
              type="number"
              name="stock"
              value={formulario.stock}
              onChange={handleChange}
              placeholder="Stock"
              min="0"
              step="1"
              style={styles.input}
            />

            <select
              name="categoriaId"
              value={formulario.categoriaId}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="" style={styles.option}>
                Seleccionar categoría
              </option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                  style={styles.option}
                >
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleImagen}
            style={styles.fileInput}
          />

          {previewImagen && (
            <div style={styles.previewContainer}>
              <img
                key={previewImagen}
                src={previewImagen}
                alt="Vista previa del producto"
                style={styles.previewImage}
              />
            </div>
          )}

          <div style={styles.modalButtons}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={cerrarModal}
            >
              Cancelar
            </button>

            <button type="submit" style={styles.saveBtn}>
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    padding: "20px",
    boxSizing: "border-box",
  },

  modal: {
    width: "700px",
    maxWidth: "95%",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "linear-gradient(135deg,#111827,#1f2937)",
    borderRadius: "30px",
    padding: "30px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
    boxSizing: "border-box",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  modalTitle: {
    color: "#fff",
    fontSize: "30px",
    fontWeight: "800",
    margin: 0,
  },

  closeBtn: {
    border: "none",
    background: "linear-gradient(135deg,#ef4444,#dc2626)",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  errorBox: {
    background: "rgba(127,29,29,0.9)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "12px",
    marginBottom: "18px",
    textAlign: "center",
    fontWeight: "600",
    border: "1px solid rgba(248,113,113,0.3)",
  },

  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },

  input: {
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "15px",
  },

  fileInput: {
    width: "100%",
    padding: "14px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    boxSizing: "border-box",
    fontSize: "15px",
    cursor: "pointer",
  },

  option: {
    background: "#1f2937",
    color: "#fff",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    resize: "vertical",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    outline:"none",
    boxSizing: "border-box",
    fontFamily: "Arial",
    fontSize: "15px",
  },

  previewContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "5px 0",
  },

  previewImage: {
    width: "180px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "22px",
    border: "3px solid #9333ea",
    background: "#fff",
    boxShadow: "0 10px 30px rgba(147,51,234,0.4)",
  },

  modalButtons: {
    display: "flex",
    gap: "16px",
    marginTop: "10px",
  },

  cancelBtn: {
    flex: 1,
    border: "none",
    padding: "16px",
    borderRadius: "16px",
    background: "#374151",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
  },

  saveBtn: {
    flex: 1,
    border: "none",
    padding: "16px",
    borderRadius: "16px",
    background: "linear-gradient(135deg,#7c3aed,#9333ea)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 10px 25px rgba(124,58,237,0.35)",
  },
};