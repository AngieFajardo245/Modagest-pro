import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  FaBoxOpen,
  FaShoppingBag,
  FaCashRegister,
  FaChartLine
} from "react-icons/fa";

function DashboardEmpleado() {

  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");

  const [stats, setStats] = useState({
    productos: 0,
    ventas: 0
  });

  const [loading, setLoading] = useState(true);

  /* ================= CARGAR DATOS ================= */

  useEffect(() => {

    let usuario = null;

    try {

      usuario = JSON.parse(
        localStorage.getItem("usuario")
      );

    } catch {

      usuario = null;

    }

    if (usuario) {

      setNombre(
        usuario.nombre || "Empleado"
      );

    }

    const obtenerDatos = async () => {

      try {

        const [
          productosRes,
          ventasRes
        ] = await Promise.all([

          api.get("/productos"),

          api.get("/empleado/ventas")

        ]);

        setStats({

          productos:
            productosRes.data?.length || 0,

          ventas:
            ventasRes.data?.length || 0

        });

      } catch (error) {

        console.error(
          "Error cargando datos:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    obtenerDatos();

  }, []);

  /* ================= LOADING ================= */

  if (loading) {

    return (

      <div style={styles.loadingContainer}>

        <div style={styles.loader}></div>

        <p style={styles.loadingText}>
          Cargando panel del empleado...
        </p>

      </div>

    );

  }

  /* ================= UI ================= */

  return (

    <div style={styles.container}>

      {/* ================= HEADER ================= */}

      <div style={styles.header}>

        <div>

          <h1 style={styles.title}>
            👨‍💼 Panel del Empleado
          </h1>

          <p style={styles.subtitle}>
            Bienvenido nuevamente,
            <strong> {nombre}</strong>
          </p>

        </div>

        <div style={styles.badge}>

          <FaChartLine />

          Área de Ventas

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div style={styles.grid}>

        {/* PRODUCTOS */}

        <div style={styles.card}>

          <div style={styles.iconBoxPurple}>
            <FaBoxOpen />
          </div>

          <div>

            <p style={styles.cardLabel}>
              Productos disponibles
            </p>

            <h2 style={styles.cardNumber}>
              {stats.productos}
            </h2>

          </div>

        </div>

        {/* VENTAS */}

        <div style={styles.card}>

          <div style={styles.iconBoxBlue}>
            <FaShoppingBag />
          </div>

          <div>

            <p style={styles.cardLabel}>
              Ventas realizadas
            </p>

            <h2 style={styles.cardNumber}>
              {stats.ventas}
            </h2>

          </div>

        </div>

      </div>

      {/* ================= ACCIONES ================= */}

      <div style={styles.actionsSection}>

        <h2 style={styles.sectionTitle}>
          Acciones rápidas
        </h2>

        <div style={styles.actionsGrid}>

          {/* REGISTRAR VENTA */}

          <div
            style={styles.actionCard}
            onClick={() =>
              navigate("/empleado/productos")
            }
          >

            <div style={styles.actionIcon}>
              <FaCashRegister />
            </div>

            <h3 style={styles.actionTitle}>
              Registrar Venta
            </h3>

            <p style={styles.actionText}>
              Gestiona ventas y registra
              compras rápidamente.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default DashboardEmpleado;

/* ================= ESTILOS ================= */

const styles = {

  container: {

    minHeight: "100vh",

    padding: "10px"

  },

  /* ================= HEADER ================= */

  header: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "20px",

    marginBottom: "35px"

  },

  title: {

    fontSize: "38px",

    color: "#ffffff",

    margin: 0,

    fontWeight: "700"

  },

  subtitle: {

    marginTop: "10px",

    color: "#cbd5e1",

    fontSize: "16px"

  },

  badge: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    background:
      "rgba(255,255,255,0.06)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    color: "#fff",

    padding: "14px 18px",

    borderRadius: "16px",

    backdropFilter: "blur(12px)",

    fontWeight: "600"

  },

  /* ================= GRID ================= */

  grid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",

    gap: "25px",

    marginBottom: "40px"

  },

  card: {

    display: "flex",

    alignItems: "center",

    gap: "20px",

    padding: "28px",

    borderRadius: "24px",

    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(14px)",

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.25)"

  },

  iconBoxPurple: {

    width: "70px",

    height: "70px",

    borderRadius: "20px",

    background:
      "linear-gradient(135deg, #7c3aed, #8b5cf6)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#fff",

    fontSize: "28px",

    boxShadow:
      "0 10px 25px rgba(124,58,237,0.35)"

  },

  iconBoxBlue: {

    width: "70px",

    height: "70px",

    borderRadius: "20px",

    background:
      "linear-gradient(135deg, #2563eb, #3b82f6)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#fff",

    fontSize: "28px",

    boxShadow:
      "0 10px 25px rgba(37,99,235,0.35)"

  },

  cardLabel: {

    margin: 0,

    color: "#94a3b8",

    fontSize: "15px"

  },

  cardNumber: {

    marginTop: "10px",

    marginBottom: 0,

    color: "#fff",

    fontSize: "34px",

    fontWeight: "700"

  },

  /* ================= ACTIONS ================= */

  actionsSection: {

    marginTop: "10px"

  },

  sectionTitle: {

    color: "#fff",

    marginBottom: "22px",

    fontSize: "28px"

  },

  actionsGrid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",

    gap: "25px"

  },

  actionCard: {

    background:
      "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(37,99,235,0.18))",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "26px",

    padding: "30px",

    cursor: "pointer",

    transition: "0.3s ease",

    backdropFilter: "blur(14px)",

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.25)"

  },

  actionIcon: {

    width: "75px",

    height: "75px",

    borderRadius: "22px",

    background:
      "linear-gradient(135deg, #7c3aed, #2563eb)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#fff",

    fontSize: "30px",

    marginBottom: "22px"

  },

  actionTitle: {

    color: "#fff",

    marginBottom: "10px",

    fontSize: "24px"

  },

  actionText: {

    color: "#cbd5e1",

    lineHeight: "1.6"

  },

  /* ================= LOADING ================= */

  loadingContainer: {

    minHeight: "80vh",

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    alignItems: "center",

    gap: "20px"

  },

  loader: {

    width: "60px",

    height: "60px",

    border:
      "5px solid rgba(255,255,255,0.2)",

    borderTop:
      "5px solid #7c3aed",

    borderRadius: "50%",

    animation:
      "spin 1s linear infinite"

  },

  loadingText: {

    color: "#cbd5e1",

    fontSize: "18px"

  }

};