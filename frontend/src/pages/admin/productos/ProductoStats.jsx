import {
  FaArchive,
  FaBoxOpen,
  FaExclamationTriangle,
  FaLayerGroup,
} from "react-icons/fa";

export default function ProductoStats({ productos = [], categorias = [] }) {
  const agotados = productos.filter(
    (producto) => Number(producto.stock) <= 0,
  ).length;

  const stockBajo = productos.filter((producto) => {
    const stock = Number(producto.stock);
    return stock > 0 && stock <= 5;
  }).length;

  const estadisticas = [
    {
      nombre: "Productos",
      valor: productos.length,
      icono: <FaBoxOpen />,
      fondo: "rgba(59,130,246,0.15)",
    },
    {
      nombre: "Stock bajo",
      valor: stockBajo,
      icono: <FaExclamationTriangle />,
      fondo: "rgba(245,158,11,0.15)",
    },
    {
      nombre: "Agotados",
      valor: agotados,
      icono: <FaArchive />,
      fondo: "rgba(239,68,68,0.15)",
    },
    {
      nombre: "Categorías",
      valor: categorias.length,
      icono: <FaLayerGroup />,
      fondo: "rgba(124,58,237,0.15)",
    },
  ];

  return (
    <div style={styles.grid}>
      {estadisticas.map((estadistica) => (
        <div key={estadistica.nombre} style={styles.card}>
          <div
            style={{
              ...styles.iconBox,
              background: estadistica.fondo,
            }}
          >
            {estadistica.icono}
          </div>

          <div>
            <p style={styles.label}>{estadistica.nombre}</p>
            <h2 style={styles.value}>{estadistica.valor}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(155px, 100%), 1fr))",
    gap: "clamp(12px, 2vw, 20px)",
    marginBottom: "clamp(22px, 4vw, 30px)",
  },
  card: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "clamp(12px, 2vw, 18px)",
    padding: "clamp(16px, 3vw, 24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "clamp(18px, 4vw, 26px)",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    boxSizing: "border-box",
  },
  iconBox: {
    width: "clamp(48px, 12vw, 70px)",
    height: "clamp(48px, 12vw, 70px)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "clamp(15px, 4vw, 22px)",
    color: "#fff",
    fontSize: "clamp(20px, 5vw, 28px)",
  },
  label: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "clamp(12px, 3.5vw, 15px)",
  },
  value: {
    margin: "6px 0 0",
    color: "#fff",
    fontSize: "clamp(25px, 7vw, 34px)",
    fontWeight: "800",
  },
};
