import { FaPlus } from "react-icons/fa";

export default function ProductoForm({

  formulario,
  categorias,
  handleChange,
  handleImagen,
  crearProducto

}) {

  return (

    <div style={styles.formContainer}>

      <form
        onSubmit={crearProducto}
        style={styles.form}
      >

        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={formulario.nombre}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formulario.precio}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formulario.stock}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <select
          name="categoriaId"
          value={formulario.categoriaId}
          onChange={handleChange}
          style={styles.input}
          required
        >

          <option value="">
            Seleccionar categoría
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

        <textarea
          name="descripcion"
          placeholder="Descripción del producto..."
          value={formulario.descripcion}
          onChange={handleChange}
          style={styles.textarea}
        />

        <input
          type="file"
          onChange={handleImagen}
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
        >

          <FaPlus />

          Crear Producto

        </button>

      </form>

    </div>

  );

}

const styles = {

  formContainer: {

    background:
      "rgba(255,255,255,0.05)",

    backdropFilter: "blur(14px)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    padding: "30px",

    borderRadius: "28px",

    marginBottom: "30px",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.25)"

  },

  form: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",

    gap: "20px"

  },

  input: {

    width: "100%",

    padding: "16px 18px",

    borderRadius: "18px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.9)",

    outline: "none",

    fontSize: "15px",

    boxSizing: "border-box"

  },

  textarea: {

    gridColumn: "span 2",

    minHeight: "120px",

    resize: "none",

    padding: "16px 18px",

    borderRadius: "18px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    outline: "none",

    fontSize: "15px",

    boxSizing: "border-box",

    fontFamily: "Arial"

  },

  button: {

    gridColumn: "span 2",

    border: "none",

    padding: "18px",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg,#7c3aed,#9333ea,#c026d3)",

    color: "#fff",

    fontWeight: "700",

    fontSize: "16px",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    boxShadow:
      "0 10px 25px rgba(124,58,237,0.35)"

  }

};