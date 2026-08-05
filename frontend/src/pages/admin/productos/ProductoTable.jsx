import { FaEdit, FaTrash, FaBoxOpen, FaTag } from "react-icons/fa";

export default function ProductoTable({
  productos,
  editarProducto,
  eliminarProducto,
}) {

  /* ================ GENERAR URL IMAGEN ================= */

  const obtenerImagen = (imagen) => {
    if (!imagen) {
      return "https://placehold.co/120x120?text=Sin+Imagen";
    }

    if (imagen.startsWith("http")) {
      return imagen;
    }

    if (imagen.startsWith("/uploads")) {
      return `http://localhost:5000${imagen}`;
    }

    return `http://localhost:5000/uploads/${imagen}`;
  };


  /* ================= INFORMACION STOCK ================= */

  const obtenerEstadoStock = (stock) => {
    if (stock === 0) {
      return {
        texto: "Agotado",
        detalle: "Sin unidades",
        color: "#ef4444",
        background: "rgba(239,68,68,0.12)",
        border: "rgba(239,68,68,0.25)",
      };
    }

    if (stock <= 5) {
      return {
        texto: "Stock bajo",
        detalle: `${stock} ${stock === 1 ? "unidad" : "unidades"}`,
        color: "#f59e0b",
        background: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.25)",
      };
    }

    return {
      texto: "Disponible",
      detalle: `${stock} unidades`,
      color: "#10b981",
      background: "rgba(16,185,129,0.12)",
      border: "rgba(16,185,129,0.25)",
    };
  };

  /* ======================= RETURN ====================== */

  return (
    <div style={styles.tableWrapper}>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
      
          {/* ==================== ENCABEZADO ================= */}

          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Producto</th>
              <th style={styles.th}>Categoría</th>
              <th style={styles.th}>Precio</th>
              <th style={styles.th}>Inventario</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>


          {/* ====================== CUERPO =================== */}

          <tbody>
            {productos.length > 0 ? (
              productos.map((producto) => {
                const stock = Number(producto.stock);
                const estadoStock = obtenerEstadoStock(stock);


                const nombreCategoria =
                  producto.Categorium?.nombre ||
                  producto.Categoria?.nombre ||
                  producto.categoria?.nombre ||
                  "Sin categoría";

                return (
                  <tr
                    key={producto.id}
                    style={styles.row}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.045)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* ================= ID ================= */}

                    <td style={styles.idCell}>
                      <span style={styles.idBadge}>#{producto.id}</span>
                    </td>

                    {/* ================= PRODUCTO ============= */}

                    <td style={styles.productCell}>
                      <div style={styles.productInfo}>
                        <div style={styles.imageContainer}>
                          <img
                            src={obtenerImagen(producto.imagen)}
                            alt={producto.nombre}
                            style={styles.productImage}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/120x120?text=Sin+Imagen";
                            }}
                          />
                        </div>

                        <div style={styles.productText}>
                          <strong style={styles.productName}>
                            {producto.nombre}
                          </strong>

                          {producto.descripcion && (
                            <span style={styles.description}>
                              {producto.descripcion.length > 65
                                ? `${producto.descripcion.substring(0, 65)}...`
                                : producto.descripcion}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ================= CATEGORIA ============= */}

                    <td style={styles.categoryCell}>
                      <span style={styles.categoryBadge}>
                        <FaTag />
                        {nombreCategoria}
                      </span>
                    </td>

                    {/* ================= PRECIO ================= */}

                    <td style={styles.priceCell}>
                      <span style={styles.price}>
                        ${Number(producto.precio || 0).toLocaleString("es-CO")}
                      </span>

                      <span style={styles.currency}>COP</span>
                    </td>

                    {/* ================= STOCK ================= */}

                    <td style={styles.stockCell}>
                      <div
                        style={{
                          ...styles.stockBadge,
                          background: estadoStock.background,
                          border: `1px solid ${estadoStock.border}`,
                          color: estadoStock.color,
                        }}
                      >
                        <span
                          style={{
                            ...styles.stockDot,
                            background: estadoStock.color,
                          }}
                        />

                        <div>
                          <strong style={styles.stockTitle}>
                            {estadoStock.texto}
                          </strong>

                          <span style={styles.stockDetail}>
                            {estadoStock.detalle}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ================= ACCIONES ============= */}

                    <td style={styles.actionsCell}>
                      <div style={styles.actions}>
                        {/* EDITAR */}

                        <button
                          type="button"
                          style={styles.editBtn}
                          onClick={() => editarProducto(producto)}
                          title="Editar producto"
                        >
                          <FaEdit />
                          <span>Editar</span>
                        </button>

                        {/* ELIMINAR */}

                        <button
                          type="button"
                          style={styles.deleteBtn}
                          onClick={() => eliminarProducto(producto.id)}
                          title="Eliminar producto"
                        >
                          <FaTrash />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
            
              /* ================= SIN PRODUCTOS ================= */
        

              <tr>
                <td colSpan="6" style={styles.empty}>
                  <div style={styles.emptyContent}>
                    <div style={styles.emptyIcon}>
                      <FaBoxOpen />
                    </div>

                    <strong style={styles.emptyTitle}>
                      No hay productos registrados
                    </strong>

                    <span style={styles.emptyText}>
                      Los productos que registres aparecerán aquí.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ======================= ESTILOS ===================== */

const styles = {
  /* ================= CONTENEDOR ================= */

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    borderRadius: "28px",
  },

  tableContainer: {

  width: "100%",

  overflowX: "auto",
  
  background: "rgba(255,255,255,0.05)",
  
  backdropFilter: "blur(12px)",
  
  border: "1px solid rgba(255,255,255,0.08)",
  
  borderRadius: "28px",
  
  boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
},

 
table: {
  
  width: "100%",
  
  minWidth: "1100px",
  
  borderCollapse: "collapse",
  
  color: "#fff",
},

  /* ================= ENCABEZADO ================= */

  th: {
    background: "rgba(255,255,255,0.065)",

    padding: "19px 20px",

    textAlign: "left",

    color: "#cbd5e1",

    fontSize: "12px",

    fontWeight: "800",

    textTransform: "uppercase",

    letterSpacing: "0.7px",

    borderBottom: "1px solid rgba(255,255,255,0.08)",

    whiteSpace: "nowrap",
  },

  /* ================= FILAS ================= */

  row: {
    transition: "background 0.25s ease",

    borderBottom: "1px solid rgba(255,255,255,0.055)",
  },

  /* ================= ID ================= */

  idCell: {
    padding: "18px 20px",

    whiteSpace: "nowrap",

    verticalAlign: "middle",
  },

  idBadge: {
    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    padding: "7px 10px",

    borderRadius: "10px",

    background: "rgba(148,163,184,0.10)",

    border: "1px solid rgba(148,163,184,0.12)",

    color: "#94a3b8",

    fontSize: "13px",

    fontWeight: "700",
  },

  /* ================= PRODUCTO ================= */

  productCell: {
    padding: "16px 20px",

    verticalAlign: "middle",

    minWidth: "280px",
  },

  productInfo: {
    display: "flex",

    alignItems: "center",

    gap: "14px",
  },

  imageContainer: {
    width: "72px",

    height: "72px",

    flexShrink: 0,

    borderRadius: "18px",

    padding: "2px",

    background:
      "linear-gradient(135deg, rgba(124,58,237,0.8), rgba(37,99,235,0.7))",

    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
  },

  productImage: {
    width: "100%",

    height: "100%",

    objectFit: "cover",

    borderRadius: "16px",

    display: "block",

    background: "#111827",
  },

  productText: {
    display: "flex",

    flexDirection: "column",

    gap: "5px",

    minWidth: 0,
  },

  productName: {
    color: "#fff",

    fontSize: "15px",

    fontWeight: "800",

    lineHeight: "1.3",
  },

  description: {
    color: "#94a3b8",

    fontSize: "12px",

    lineHeight: "1.4",

    maxWidth: "280px",
  },

  /* ================= CATEGORIA ================= */

  categoryCell: {
    padding: "18px 20px",

    verticalAlign: "middle",
  },

  categoryBadge: {
    display: "inline-flex",

    alignItems: "center",

    gap: "7px",

    padding: "8px 12px",

    borderRadius: "999px",

    background: "rgba(124,58,237,0.12)",

    border: "1px solid rgba(124,58,237,0.20)",

    color: "#c4b5fd",

    fontSize: "13px",

    fontWeight: "700",

    whiteSpace: "nowrap",
  },

  /* ================= PRECIO ================= */

  priceCell: {
    padding: "18px 20px",

    verticalAlign: "middle",

    whiteSpace: "nowrap",
  },

  price: {
    display: "block",

    color: "#34d399",

    fontSize: "16px",

    fontWeight: "800",
  },

  currency: {
    display: "block",

    marginTop: "3px",

    color: "#64748b",

    fontSize: "10px",

    fontWeight: "700",

    letterSpacing: "0.7px",
  },

  /* ================= STOCK ================= */

  stockCell: {
    padding: "18px 20px",

    verticalAlign: "middle",
  },

  stockBadge: {
    display: "inline-flex",

    alignItems: "center",

    gap: "9px",

    padding: "8px 12px",

    borderRadius: "14px",

    minWidth: "115px",

    boxSizing: "border-box",
  },

  stockDot: {
    width: "8px",

    height: "8px",

    borderRadius: "50%",

    flexShrink: 0,

    boxShadow: "0 0 10px currentColor",
  },

  stockTitle: {
    display: "block",

    fontSize: "12px",

    fontWeight: "800",

    lineHeight: "1.2",
  },

  stockDetail: {
    display: "block",

    marginTop: "2px",

    fontSize: "10px",

    opacity: 0.75,

    fontWeight: "600",
  },

  /* ================= ACCIONES ================= */

  actionsCell: {
    padding: "18px 20px",

    verticalAlign: "middle",
  },

  actions: {

  display: "flex",

  alignItems: "center",

  justifyContent: "flex-start",

  gap: "10px",

  flexWrap: "nowrap",

  whiteSpace: "nowrap",
},

 editBtn: {
  
  display: "inline-flex",
  
  alignItems: "center",

  justifyContent: "center",

  gap: "8px",

  background: "#d97706",

  color: "#fff",

  border: "none",

  padding: "10px 14px",

  borderRadius: "12px",

  cursor: "pointer",

  fontWeight: "600",

  whiteSpace: "nowrap",

  flexShrink: 0,
},

deleteBtn: {
  display: "inline-flex",

  alignItems: "center",

  justifyContent: "center",

  gap: "8px",

  background: "#dc2626",

  color: "#fff",

  border: "none",

  padding: "10px 14px",

  borderRadius: "12px",

  cursor: "pointer",

  fontWeight: "600",

  whiteSpace: "nowrap",

  flexShrink: 0,
},
   /* ================= VACIO ================= */

  empty: {
    padding: "70px 30px",

    textAlign: "center",

    color: "#94a3b8",
  },

  emptyContent: {
    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "8px",
  },

  emptyIcon: {
    width: "64px",

    height: "64px",

    borderRadius: "20px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    marginBottom: "8px",

    background: "rgba(124,58,237,0.12)",

    border: "1px solid rgba(124,58,237,0.18)",

    color: "#a78bfa",

    fontSize: "25px",
  },

  emptyTitle: {
    color: "#e2e8f0",

    fontSize: "16px",
  },

  emptyText: {
    color: "#64748b",

    fontSize: "13px",
  },
};
