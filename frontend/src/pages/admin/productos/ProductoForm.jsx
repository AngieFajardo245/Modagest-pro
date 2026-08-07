import { useState } from "react";
import { FaPlus, FaImage, FaTimes } from "react-icons/fa";

export default function ProductoForm({
  formulario,
  categorias,
  handleChange,
  handleImagen,
  crearProducto,
  previewImagen,
}) {
  const [error, setError] = useState("");

  /* ===================================================== */
  /* ================= VALIDAR FORMULARIO ================= */
  /* ===================================================== */

  const validarFormulario = () => {
    setError("");

    if (formulario.nombre.trim().length < 3) {
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

    if (formulario.descripcion.trim().length < 10) {
      setError("La descripción debe tener mínimo 10 caracteres.");
      return false;
    }

    return true;
  };

  /* ===================================================== */
  /* ================= QUITAR IMAGEN ===================== */
  /* ===================================================== */

  const quitarImagen = () => {
    const input = document.getElementById("producto-imagen");

    if (input) {
      input.value = "";
    }

    handleImagen({
      target: {
        files: [],
      },
    });
  };

  /* ===================================================== */
  /* ======================== RETURN ===================== */
  /* ===================================================== */

  return (
    <div style={styles.formContainer}>
      {/* ================= TITULO ================= */}

      <div style={styles.formHeader}>
        <div>
          <h2 style={styles.formTitle}>Crear nuevo producto</h2>

          <p style={styles.formSubtitle}>
            Registra un nuevo producto para tu tienda.
          </p>
        </div>

        <div style={styles.headerIcon}>
          <FaPlus />
        </div>
      </div>

      {/* ================= ERROR ================= */}

      {error && <div style={styles.errorBox}>{error}</div>}

      {/* ================= FORMULARIO ================= */}

      <form
        onSubmit={(e) => {
          if (!validarFormulario()) {
            e.preventDefault();
            return;
          }

          crearProducto(e);
        }}
        style={styles.form}
      >
        {/* ================= NOMBRE ================= */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Nombre del producto</label>

          <input
            type="text"
            name="nombre"
            placeholder="Ej: Blusa Elegante Satinada"
            value={formulario.nombre}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* ================= PRECIO ================= */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Precio</label>

          <input
            type="number"
            name="precio"
            placeholder="Ej: 85000"
            value={formulario.precio}
            onChange={handleChange}
            min="1"
            step="0.01"
            style={styles.input}
          />
        </div>

        {/* ================= STOCK ================= */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Stock disponible</label>

          <input
            type="number"
            name="stock"
            placeholder="Ej: 15"
            value={formulario.stock}
            onChange={handleChange}
            min="0"
            step="1"
            style={styles.input}
          />
        </div>

        {/* ================= CATEGORIA ================= */}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Categoría</label>

          <select
            name="categoriaId"
            value={formulario.categoriaId}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Seleccionar categoría</option>

            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* ================= DESCRIPCION ================= */}

        <div style={styles.fieldGroupFull}>
          <label style={styles.label}>Descripción</label>

          <textarea
            name="descripcion"
            placeholder="Describe las características del producto..."
            value={formulario.descripcion}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        {/* ================= IMAGEN ================= */}

        <div style={styles.fieldGroupFull}>
          <label style={styles.label}>Imagen del producto</label>

          <div style={styles.imageUploadContainer}>
            <input
              id="producto-imagen"
              type="file"
              accept="image/*"
              onChange={handleImagen}
              style={styles.fileInput}
            />

            <label htmlFor="producto-imagen" style={styles.fileLabel}>
              <FaImage />

              <span>Seleccionar imagen</span>
            </label>

            <p style={styles.fileHelp}>
              Selecciona una imagen para visualizar cómo quedará el producto
              antes de guardarlo.
            </p>
          </div>
        </div>

        {/* ================= VISTA PREVIA ================= */}

        {previewImagen && (
          <div style={styles.previewSection}>
            <div style={styles.previewHeader}>
              <div>
                <h3 style={styles.previewTitle}>Vista previa</h3>

                <p style={styles.previewSubtitle}>
                  Así se verá la imagen del producto.
                </p>
              </div>

              <button
                type="button"
                style={styles.removeImageButton}
                onClick={quitarImagen}
                aria-label="Quitar imagen"
              >
                <FaTimes />
              </button>
            </div>

            <div style={styles.previewContainer}>
              <img
                src={previewImagen}
                alt="Vista previa del producto"
                style={styles.previewImage}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        {/* ================= BOTON ================= */}

        <button type="submit" style={styles.button}>
          <FaPlus />
          Crear Producto
        </button>
      </form>
    </div>
  );
}

/* ===================================================== */
/* ======================= ESTILOS ===================== */
/* ===================================================== */

const styles = {
  formContainer: {
    background: "rgba(255,255,255,0.05)",

    backdropFilter: "blur(14px)",

    border: "1px solid rgba(255,255,255,0.08)",

    padding: "30px",

    borderRadius: "28px",

    marginBottom: "30px",

    boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
  },

  /* ================= HEADER ================= */

  formHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    marginBottom: "28px",
  },

  formTitle: {
    margin: 0,

    color: "#fff",

    fontSize: "24px",

    fontWeight: "800",
  },

  formSubtitle: {
    margin: "7px 0 0",

    color: "#94a3b8",

    fontSize: "14px",
  },

  headerIcon: {
    width: "48px",

    height: "48px",

    borderRadius: "14px",

    background: "linear-gradient(135deg,#7c3aed,#9333ea)",

    color: "#fff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "18px",

    boxShadow: "0 8px 25px rgba(124,58,237,0.3)",

    flexShrink: 0,
  },

  /* ================= FORM ================= */

  form: {
    display: "grid",

    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",

    gap: "20px",
  },

  fieldGroup: {
    display: "flex",

    flexDirection: "column",

    gap: "8px",
  },

  fieldGroupFull: {
    gridColumn: "1 / -1",

    display: "flex",

    flexDirection: "column",

    gap: "8px",
  },

  label: {
    color: "#e2e8f0",

    fontSize: "14px",

    fontWeight: "700",
  },

  input: {
    width: "100%",

    padding: "15px 18px",

    borderRadius: "16px",

    border: "1px solid rgba(255,255,255,0.10)",

    background: "rgba(255,255,255,0.92)",

    color: "#111827",

    outline: "none",

    fontSize: "15px",

    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",

    minHeight: "120px",

    resize: "vertical",

    padding: "15px 18px",

    borderRadius: "16px",

    border: "1px solid rgba(255,255,255,0.10)",

    background: "rgba(255,255,255,0.92)",

    color: "#111827",

    outline: "none",

    fontSize: "15px",

    fontFamily: "Arial, sans-serif",

    boxSizing: "border-box",
  },

  /* ================= ERROR ================= */

  errorBox: {
    background: "rgba(127,29,29,0.90)",

    color: "#fff",

    padding: "13px 16px",

    borderRadius: "14px",

    marginBottom: "20px",

    textAlign: "center",

    fontWeight: "600",

    border: "1px solid rgba(248,113,113,0.30)",
  },

  /* ================= IMAGEN ================= */

  imageUploadContainer: {
    padding: "20px",

    borderRadius: "18px",

    border: "1px dashed rgba(167,139,250,0.45)",

    background: "rgba(124,58,237,0.06)",
  },

  fileInput: {
    display: "none",
  },

  fileLabel: {
    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    padding: "15px",

    borderRadius: "14px",

    background: "linear-gradient(135deg,#7c3aed,#9333ea)",

    color: "#fff",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow: "0 8px 20px rgba(124,58,237,0.25)",
  },

  fileHelp: {
    margin: "10px 0 0",

    textAlign: "center",

    color: "#94a3b8",

    fontSize: "13px",
  },

  /* ================= PREVIEW ================= */

  previewSection: {
    gridColumn: "1 / -1",

    padding: "20px",

    borderRadius: "20px",

    background: "rgba(255,255,255,0.04)",

    border: "1px solid rgba(255,255,255,0.08)",
  },

  previewHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    gap: "15px",

    marginBottom: "15px",
  },

  previewTitle: {
    margin: 0,

    color: "#fff",

    fontSize: "18px",

    fontWeight: "800",
  },

  previewSubtitle: {
    margin: "5px 0 0",

    color: "#94a3b8",

    fontSize: "13px",
  },

  removeImageButton: {
    width: "36px",

    height: "36px",

    borderRadius: "10px",

    border: "none",

    background: "rgba(239,68,68,0.85)",

    color: "#fff",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",
  },

  previewContainer: {
    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    minHeight: "220px",

    padding: "15px",

    borderRadius: "16px",

    background: "rgba(0,0,0,0.20)",
  },

  previewImage: {
    width: "220px",

    height: "220px",

    objectFit: "contain",

    borderRadius: "20px",

    border: "3px solid #9333ea",

    background: "#fff",

    boxShadow: "0 10px 30px rgba(147,51,234,0.35)",
  },

  /* ================= BUTTON ================= */

  button: {
    gridColumn: "1 / -1",

    border: "none",

    padding: "18px",

    borderRadius: "18px",

    background: "linear-gradient(135deg,#7c3aed,#9333ea,#c026d3)",

    color: "#fff",

    fontWeight: "700",

    fontSize: "16px",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    boxShadow: "0 10px 25px rgba(124,58,237,0.35)",
  },
};
