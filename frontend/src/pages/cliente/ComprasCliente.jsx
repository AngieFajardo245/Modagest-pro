import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function ComprasCliente() {

  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= OBTENER COMPRAS ================= */

  const obtenerCompras = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        "/cliente/compras"
      );

      setCompras(

        Array.isArray(res.data)

          ? res.data.sort(

              (a, b) =>

                new Date(b.createdAt) -
                new Date(a.createdAt)

            )

          : []

      );

    } catch (error) {

      console.error(
        "Error obteniendo compras:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    obtenerCompras();

  }, []);

  /* ================= FORMATOS ================= */

  const formatearFecha = (fecha) => {

    if (!fecha) return "Fecha no disponible";

    return new Date(fecha)
      .toLocaleString("es-CO");

  };

  const formatearMoneda = (valor) => {

    return Number(valor || 0)
      .toLocaleString("es-CO", {

        style: "currency",

        currency: "COP"

      });

  };

  /* ================= RESUMEN ================= */

  const totalCompras = compras.length;

  const totalGastado = useMemo(() => {

    return compras.reduce(

      (acc, compra) =>
        acc + Number(compra.total || 0),

      0

    );

  }, [compras]);

  const ultimaCompra = compras[0];

  /* ================= LOADING ================= */

  if (loading) {

    return (

      <div style={styles.loadingContainer}>

        <div style={styles.loader}></div>

        <p style={styles.loadingText}>
          Cargando historial...
        </p>

      </div>

    );

  }

  /* ================= UI ================= */

  return (

    <div style={styles.container}>

      {/* ================= HERO ================= */}

      <div style={styles.hero}>

        <div>

          <p style={styles.badgeTop}>
            ✨ Historial Premium
          </p>

          <h1 style={styles.title}>
            🧾 Mis Compras
          </h1>

          <p style={styles.subtitle}>
            Revisa todos tus pedidos realizados
            en ModaGest Pro
          </p>

        </div>

      </div>

      {/* ================= RESUMEN ================= */}

      {compras.length > 0 && (

        <div style={styles.summaryGrid}>

          <div style={styles.summaryCard}>

            <div style={styles.iconCircle}>
              📦
            </div>

            <div>

              <p style={styles.summaryLabel}>
                Compras realizadas
              </p>

              <h3 style={styles.summaryValue}>
                {totalCompras}
              </h3>

            </div>

          </div>

          <div style={styles.summaryCard}>

            <div style={styles.iconCircle}>
              💰
            </div>

            <div>

              <p style={styles.summaryLabel}>
                Total gastado
              </p>

              <h3 style={styles.summaryValue}>
                {formatearMoneda(
                  totalGastado
                )}
              </h3>

            </div>

          </div>

          <div style={styles.summaryCard}>

            <div style={styles.iconCircle}>
              🕒
            </div>

            <div>

              <p style={styles.summaryLabel}>
                Última compra
              </p>

              <h3 style={styles.summaryDate}>
                {ultimaCompra

                  ? formatearFecha(
                      ultimaCompra.createdAt
                    )

                  : "Sin compras"}

              </h3>

            </div>

          </div>

        </div>

      )}

      {/* ================= EMPTY ================= */}

      {compras.length === 0 ? (

        <div style={styles.empty}>

          <div style={styles.emptyIcon}>
            🛍️
          </div>

          <h2>
            No has realizado compras aún
          </h2>

          <p style={styles.emptyText}>
            Explora productos y realiza
            tu primera compra.
          </p>

        </div>

      ) : (

        /* ================= GRID ================= */

        <div style={styles.grid}>

          {compras.map((compra) => (

            <div
              key={compra.id}
              style={styles.card}
            >

              <div style={styles.body}>

                <h2 style={styles.total}>
                  {formatearMoneda(compra.total)}
                </h2>

                <p style={styles.date}>
                  {formatearFecha(
                    compra.createdAt
                  )}
                </p>

                <div style={styles.purchaseBadge}>
                  ✔ Compra realizada
                </div>

                <div style={{ marginTop: "25px" }}>

                  {compra.Detalles?.map((detalle) => (

                    <div
                      key={detalle.id}
                      style={styles.detailCard}
                    >

                      <div style={styles.imageBox}>

                        <img
                          src={
                            detalle.Producto?.imagen

                              ? `http://localhost:5000/uploads/${detalle.Producto.imagen}`

                              : "https://via.placeholder.com/300x200?text=Producto"
                          }

                          alt={
                            detalle.Producto?.nombre ||
                            "Producto"
                          }

                          style={styles.image}

                          onError={(e) => {

                            e.target.src =
                              "https://via.placeholder.com/300x200?text=Sin+Imagen";

                          }}
                        />

                      </div>

                      <h3 style={styles.productName}>
                        {detalle.Producto?.nombre ||
                          "Producto"}
                      </h3>

                      <p style={styles.info}>
                        <strong>Cantidad:</strong>{" "}
                        {detalle.cantidad}
                      </p>

                      <p style={styles.info}>
                        <strong>Precio:</strong>{" "}
                        {formatearMoneda(
                          detalle.precio
                        )}
                      </p>

                      <p style={styles.info}>
                        <strong>Subtotal:</strong>{" "}
                        {formatearMoneda(
                          detalle.subtotal
                        )}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default ComprasCliente;

/* ================= ESTILOS ================= */

const styles = {

  container: {

    minHeight: "100vh",

    padding: "35px",

    background: "#050816",

    color: "white"

  },

  hero: {

    background:
      "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(76,29,149,0.18))",

    border: "1px solid rgba(139,92,246,0.2)",

    borderRadius: "26px",

    padding: "40px",

    marginBottom: "35px",

    backdropFilter: "blur(14px)",

    boxShadow:
      "0 0 30px rgba(139,92,246,0.12)"

  },

  badgeTop: {

    color: "#c084fc",

    fontWeight: "600",

    marginBottom: "12px",

    letterSpacing: "1px"

  },

  title: {

    fontSize: "42px",

    margin: 0,

    marginBottom: "15px",

    fontWeight: "700"

  },

  subtitle: {

    color: "#cbd5e1",

    fontSize: "16px"

  },

  summaryGrid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",

    gap: "22px",

    marginBottom: "40px"

  },

  summaryCard: {

    background: "rgba(255,255,255,0.05)",

    border: "1px solid rgba(139,92,246,0.15)",

    borderRadius: "22px",

    padding: "24px",

    display: "flex",

    alignItems: "center",

    gap: "18px",

    backdropFilter: "blur(10px)",

    boxShadow:
      "0 0 20px rgba(139,92,246,0.08)"

  },

  iconCircle: {

    width: "65px",

    height: "65px",

    borderRadius: "50%",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "28px",

    background:
      "linear-gradient(135deg,#7c3aed,#9333ea)",

    boxShadow:
      "0 0 20px rgba(139,92,246,0.35)"

  },

  summaryLabel: {

    margin: 0,

    color: "#94a3b8",

    fontSize: "14px"

  },

  summaryValue: {

    marginTop: "8px",

    fontSize: "26px",

    color: "#ffffff"

  },

  summaryDate: {

    marginTop: "8px",

    fontSize: "15px",

    color: "#e2e8f0"

  },

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",

    gap: "28px"

  },

  card: {

    background: "rgba(255,255,255,0.05)",

    borderRadius: "24px",

    overflow: "hidden",

    border: "1px solid rgba(139,92,246,0.16)",

    backdropFilter: "blur(12px)",

    boxShadow:
      "0 0 25px rgba(139,92,246,0.08)"

  },

  detailCard: {

    background: "rgba(255,255,255,0.05)",

    borderRadius: "18px",

    padding: "15px",

    marginBottom: "15px",

    border:
      "1px solid rgba(139,92,246,0.12)"

  },

  imageBox: {

    height: "260px",

    background:
      "linear-gradient(to bottom, rgba(17,24,39,0.95), rgba(30,41,59,0.9))",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    padding: "18px",

    borderRadius: "18px",

    marginBottom: "15px"

  },

  image: {

    width: "100%",

    height: "100%",

    objectFit: "contain"

  },

  body: {

    padding: "24px",

    textAlign: "center"

  },

  productName: {

    marginBottom: "14px",

    fontSize: "22px",

    color: "#ffffff"

  },

  info: {

    color: "#cbd5e1",

    marginBottom: "10px"

  },

  total: {

    color: "#c084fc",

    fontSize: "32px",

    marginBottom: "15px"

  },

  purchaseBadge: {

    display: "inline-block",

    background:
      "rgba(139,92,246,0.18)",

    color: "#d8b4fe",

    border:
      "1px solid rgba(139,92,246,0.3)",

    padding: "10px 18px",

    borderRadius: "30px",

    fontSize: "13px",

    fontWeight: "600"

  },

  date: {

    marginTop: "18px",

    color: "#94a3b8",

    fontSize: "13px"

  },

  empty: {

    background: "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(139,92,246,0.18)",

    borderRadius: "24px",

    padding: "60px 30px",

    textAlign: "center",

    backdropFilter: "blur(10px)",

    boxShadow:
      "0 0 25px rgba(139,92,246,0.08)"

  },

  emptyIcon: {

    fontSize: "70px",

    marginBottom: "20px"

  },

  emptyText: {

    color: "#cbd5e1"

  },

  loadingContainer: {

    minHeight: "100vh",

    background: "#050816",

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    alignItems: "center",

    gap: "25px"

  },

  loader: {

    width: "60px",

    height: "60px",

    border:
      "5px solid rgba(255,255,255,0.15)",

    borderTop:
      "5px solid #9333ea",

    borderRadius: "50%",

    animation:
      "spin 1s linear infinite"

  },

  loadingText: {

    color: "#cbd5e1",

    fontSize: "18px"

  }

};