import {
  FaBoxOpen,
  FaExclamationTriangle,
  FaLayerGroup,
  FaArchive
} from "react-icons/fa";

export default function ProductoStats({

  productos,
  categorias

}) {

  const totalProductos =
    productos.length;

  const agotados =
    productos.filter(
      p => Number(p.stock) === 0
    ).length;

  const stockBajo =
    productos.filter(
      p =>
        Number(p.stock) > 0 &&
        Number(p.stock) <= 5
    ).length;

  const totalCategorias =
    categorias.length;

  return (

    <div style={styles.grid}>

      {/* ================= TOTAL ================= */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(59,130,246,0.15)"
          }}
        >

          <FaBoxOpen />

        </div>

        <div>

          <p style={styles.label}>
            Productos
          </p>

          <h2 style={styles.value}>
            {totalProductos}
          </h2>

        </div>

      </div>

      {/* ================= STOCK BAJO ================= */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(245,158,11,0.15)"
          }}
        >

          <FaExclamationTriangle />

        </div>

        <div>

          <p style={styles.label}>
            Stock Bajo
          </p>

          <h2 style={styles.value}>
            {stockBajo}
          </h2>

        </div>

      </div>

      {/* ================= AGOTADOS ================= */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(239,68,68,0.15)"
          }}
        >

          <FaArchive />

        </div>

        <div>

          <p style={styles.label}>
            Agotados
          </p>

          <h2 style={styles.value}>
            {agotados}
          </h2>

        </div>

      </div>

      {/* ================= CATEGORIAS ================= */}

      <div style={styles.card}>

        <div
          style={{
            ...styles.iconBox,
            background:
              "rgba(124,58,237,0.15)"
          }}
        >

          <FaLayerGroup />

        </div>

        <div>

          <p style={styles.label}>
            Categorías
          </p>

          <h2 style={styles.value}>
            {totalCategorias}
          </h2>

        </div>

      </div>

    </div>

  );

}

const styles = {

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",

    gap: "20px",

    marginBottom: "30px"

  },

  card: {

    background:
      "rgba(255,255,255,0.06)",

    backdropFilter: "blur(12px)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "26px",

    padding: "24px",

    display: "flex",

    alignItems: "center",

    gap: "18px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.25)"

  },

  iconBox: {

    width: "70px",

    height: "70px",

    borderRadius: "22px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "28px",

    color: "#fff"

  },

  label: {

    margin: 0,

    color: "#94a3b8",

    fontSize: "15px"

  },

  value: {

    margin: "8px 0 0",

    color: "#fff",

    fontSize: "34px",

    fontWeight: "800"

  }

};