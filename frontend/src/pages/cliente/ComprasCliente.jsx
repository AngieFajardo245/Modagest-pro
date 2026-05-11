import { useEffect, useState } from "react";
import api from "../../services/api";

function ComprasCliente() {

  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= OBTENER COMPRAS ================= */

  const obtenerCompras = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cliente/compras");
      setCompras(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error obteniendo compras:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCompras();
  }, []);

  /* ================= FORMATOS ================= */

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-CO");
  };

  const formatearMoneda = (valor) => {
    return Number(valor).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    });
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div style={styles.center}>
        <p style={{ fontSize: "18px" }}>Cargando historial...</p>
      </div>
    );
  }

  return (

    <div style={styles.container}>

      <h2 style={styles.title}>🧾 Historial de Compras</h2>

      {compras.length === 0 ? (

        <div style={styles.empty}>
          <h4>No has comprado aún 😕</h4>
          <p>Explora productos y realiza tu primera compra</p>
        </div>

      ) : (

        <div style={styles.grid}>

          {compras.map((c) => (

            <div
              key={c.id}
              style={styles.card}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >

              {/* IMAGEN */}
              <div style={styles.imageBox}>
                <img
                  src={
                    c.Producto?.imagen ||
                    "https://via.placeholder.com/300x200?text=Sin+imagen"
                  }
                  alt="producto"
                  style={styles.imagen}
                />
              </div>

              <div style={styles.body}>

                <h4 style={styles.nombre}>
                  {c.Producto?.nombre || "Producto eliminado"}
                </h4>

                <p>
                  <strong>Cantidad:</strong> {c.cantidad}
                </p>

                <p style={styles.total}>
                  {formatearMoneda(c.total)}
                </p>

                <span style={styles.badge}>
                  ✔ Compra realizada
                </span>

                <p style={styles.fecha}>
                  {formatearFecha(c.createdAt)}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default ComprasCliente;

/* ================= ESTILOS PRO ================= */

const styles = {

  container: {
    padding: "30px",
    background: "#f5f7fb",
    minHeight: "100vh"
  },

  title: {
    marginBottom: "25px",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px"
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer"
  },

  imageBox: {
    height: "200px",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  imagen: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain"
  },

  body: {
    padding: "18px",
    textAlign: "center"
  },

  nombre: {
    marginBottom: "10px",
    fontWeight: "600"
  },

  total: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#198754"
  },

  badge: {
    display: "inline-block",
    background: "#d1e7dd",
    color: "#0f5132",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    marginTop: "8px"
  },

  fecha: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#777"
  },

  center: {
    padding: "40px",
    textAlign: "center"
  },

  empty: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
  }

};