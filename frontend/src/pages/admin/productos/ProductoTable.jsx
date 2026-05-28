import {
  FaEdit,
  FaTrash
} from "react-icons/fa";

export default function ProductoTable({
  productos,
  editarProducto,
  eliminarProducto
}) {

  /* ===================================================== */
  /* ================= GENERAR URL IMAGEN ================ */
  /* ===================================================== */

  const obtenerImagen = (imagen) => {

    if (!imagen) {

      return "https://placehold.co/100x100?text=Sin+Imagen";

    }

    /* SI YA ES URL COMPLETA */

    if (imagen.startsWith("http")) {

      return imagen;

    }

    /* SI VIENE COMO /uploads/archivo.png */

    if (imagen.startsWith("/uploads")) {

      return `http://localhost:5000${imagen}`;

    }

    /* SI SOLO VIENE archivo.png */

    return `http://localhost:5000/uploads/${imagen}`;

  };

  return (

    <div style={styles.tableContainer}>

      <table style={styles.table}>

        <thead>

          <tr>

            <th style={styles.th}>
              ID
            </th>

            <th style={styles.th}>
              Imagen
            </th>

            <th style={styles.th}>
              Nombre
            </th>

            <th style={styles.th}>
              Precio
            </th>

            <th style={styles.th}>
              Stock
            </th>

            <th style={styles.th}>
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {productos.length > 0 ? (

            productos.map((producto) => (

              <tr
                key={producto.id}
                style={styles.rowTable}
              >

                <td style={styles.td}>
                  #{producto.id}
                </td>

                {/* ================= IMAGEN ================= */}

                <td style={styles.td}>

                  <img

                    src={obtenerImagen(
                      producto.imagen
                    )}

                    alt={producto.nombre}

                    style={styles.productImage}

                    onError={(e) => {

                      e.target.onerror = null;

                      e.target.src =
                        "https://placehold.co/100x100?text=Sin+Imagen";

                    }}

                  />

                </td>

                {/* ================= NOMBRE ================= */}

                <td style={styles.tdBold}>
                  {producto.nombre}
                </td>

                {/* ================= PRECIO ================= */}

                <td style={styles.price}>
                  $
                  {Number(
                    producto.precio
                  ).toLocaleString()}
                </td>

                {/* ================= STOCK ================= */}

                <td style={styles.td}>

                  <span
                    style={{
                      ...styles.stockBadge,

                      background:
                        producto.stock <= 5
                          ? "#ef444420"
                          : "#10b98120",

                      color:
                        producto.stock <= 5
                          ? "#ef4444"
                          : "#10b981"
                    }}
                  >

                    {producto.stock}

                  </span>

                </td>

                {/* ================= ACCIONES ================= */}

                <td style={styles.td}>

                  <div style={styles.actions}>

                    <button
                      style={styles.editBtn}
                      onClick={() =>
                        editarProducto(producto)
                      }
                    >

                      <FaEdit />

                      Editar

                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        eliminarProducto(producto.id)
                      }
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
                colSpan="6"
                style={styles.empty}
              >

                No hay productos registrados

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}

/* ===================================================== */
/* ======================= ESTILOS ===================== */
/* ===================================================== */

const styles = {

  tableContainer: {

    background:
      "rgba(255,255,255,0.05)",

    backdropFilter: "blur(12px)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "28px",

    overflow: "hidden",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.25)"

  },

  table: {

    width: "100%",

    borderCollapse: "collapse",

    color: "#fff"

  },

  th: {

    background:
      "rgba(255,255,255,0.06)",

    padding: "20px",

    textAlign: "left",

    color: "#cbd5e1",

    fontSize: "14px"

  },

  td: {

    padding: "18px",

    borderBottom:
      "1px solid rgba(255,255,255,0.06)"

  },

  tdBold: {

    padding: "18px",

    fontWeight: "700",

    borderBottom:
      "1px solid rgba(255,255,255,0.06)"

  },

  rowTable: {

    transition: "0.3s"

  },

  productImage: {

    width: "85px",

    height: "85px",

    objectFit: "cover",

    borderRadius: "18px",

    border:
      "2px solid rgba(255,255,255,0.1)",

    display: "block"

  },

  actions: {

    display: "flex",

    gap: "10px"

  },

  editBtn: {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    background: "#d97706",

    color: "#fff",

    border: "none",

    padding: "10px 14px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "600"

  },

  deleteBtn: {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    background: "#dc2626",

    color: "#fff",

    border: "none",

    padding: "10px 14px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "600"

  },

  stockBadge: {

    padding: "8px 14px",

    borderRadius: "999px",

    fontWeight: "700",

    fontSize: "14px"

  },

  price: {

    color: "#10b981",

    fontWeight: "700",

    padding: "18px",

    borderBottom:
      "1px solid rgba(255,255,255,0.06)"

  },

  empty: {

    textAlign: "center",

    padding: "30px",

    color: "#cbd5e1"

  }

};

