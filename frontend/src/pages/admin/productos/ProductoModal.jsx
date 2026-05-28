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
  limpiarFormulario

}) {

  if (!mostrarModal) return null;

  return (

    <div style={styles.modalOverlay}>

      <div style={styles.modal}>

        {/* ================= HEADER ================= */}

        <div style={styles.modalHeader}>

          <h2 style={styles.modalTitle}>
            Editar Producto
          </h2>

          <button
            style={styles.closeBtn}
            onClick={() => {

              setMostrarModal(false);

              limpiarFormulario();

            }}
          >

            <FaTimes />

          </button>

        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={guardarEdicion}
          style={styles.modalForm}
        >

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
              style={styles.input}
            />

            <select
              name="categoriaId"
              value={formulario.categoriaId}
              onChange={handleChange}
              style={styles.input}
            >

              <option value="">
                Categoría
              </option>

              {categorias.map((categoria) => (

                <option
                  key={categoria.id}
                  value={categoria.id}
                >

                  {categoria.nombre}

                </option>

              ))}

            </select>

          </div>

          <input
            type="file"
            onChange={handleImagen}
            style={styles.input}
          />

          {/* ================= PREVIEW ================= */}

          {previewImagen && (

            <div style={styles.previewContainer}>

              <img
                src={previewImagen}
                alt="preview"
                style={styles.previewImage}
              />

            </div>

          )}

          {/* ================= BOTONES ================= */}

          <div style={styles.modalButtons}>

            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => {

                setMostrarModal(false);

                limpiarFormulario();

              }}
            >

              Cancelar

            </button>

            <button
              type="submit"
              style={styles.saveBtn}
            >

              Guardar Cambios

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

    top: 0,

    left: 0,

    width: "100%",

    height: "100%",

    background:
      "rgba(0,0,0,0.7)",

    backdropFilter: "blur(8px)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    zIndex: 999

  },

  modal: {

    width: "700px",

    maxWidth: "95%",

    background:
      "linear-gradient(135deg,#111827,#1f2937)",

    borderRadius: "30px",

    padding: "30px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    boxShadow:
      "0 20px 50px rgba(0,0,0,0.45)"

  },

  modalHeader: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "25px"

  },

  modalTitle: {

    color: "#fff",

    fontSize: "30px",

    fontWeight: "800",

    margin: 0

  },

  closeBtn: {

    border: "none",

    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",

    width: "42px",

    height: "42px",

    borderRadius: "50%",

    color: "#fff",

    cursor: "pointer",

    fontSize: "16px"

  },

  modalForm: {

    display: "flex",

    flexDirection: "column",

    gap: "18px"

  },

  row: {

    display: "grid",

    gridTemplateColumns: "1fr 1fr",

    gap: "16px"

  },

  input: {

    width: "100%",

    padding: "16px",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.08)",

    color: "#fff",

    outline: "none",

    boxSizing: "border-box"

  },

  textarea: {

    width: "100%",

    minHeight: "120px",

    resize: "none",

    padding: "16px",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.08)",

    color: "#fff",

    outline: "none",

    boxSizing: "border-box",

    fontFamily: "Arial"

  },

  previewContainer: {

    display: "flex",

    justifyContent: "center"

  },

  previewImage: {

    width: "180px",

    height: "180px",

    objectFit: "cover",

    borderRadius: "22px",

    border:
      "3px solid #9333ea",

    boxShadow:
      "0 10px 30px rgba(147,51,234,0.4)"

  },

  modalButtons: {

    display: "flex",

    gap: "16px",

    marginTop: "10px"

  },

  cancelBtn: {

    flex: 1,

    border: "none",

    padding: "16px",

    borderRadius: "16px",

    background: "#374151",

    color: "#fff",

    fontWeight: "700",

    cursor: "pointer"

  },

  saveBtn: {

    flex: 1,

    border: "none",

    padding: "16px",

    borderRadius: "16px",

    background:
      "linear-gradient(135deg,#7c3aed,#9333ea)",

    color: "#fff",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 10px 25px rgba(124,58,237,0.35)"

  }

};