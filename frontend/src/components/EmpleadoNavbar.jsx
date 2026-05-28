import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  FaBoxOpen,
  FaChartLine,
  FaSignOutAlt,
  FaUserTie
} from "react-icons/fa";

export default function EmpleadoNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  let usuario = null;

  try {

    usuario = JSON.parse(
      localStorage.getItem("usuario")
    );

  } catch {

    usuario = null;

  }

  const nombre =
    usuario?.nombre || "Empleado";

  /* ================= LOGOUT ================= */

  const cerrarSesion = () => {

    localStorage.clear();

    navigate("/login", {
      replace: true
    });

  };

  /* ================= LINK ACTIVO ================= */

  const linkStyle = (path) => ({

    ...styles.link,

    background:
      location.pathname === path
        ? "rgba(255,255,255,0.12)"
        : "transparent",

    border:
      location.pathname === path
        ? "1px solid rgba(255,255,255,0.15)"
        : "1px solid transparent",

    color:
      location.pathname === path
        ? "#ffffff"
        : "#cbd5e1"

  });

  return (

    <nav style={styles.nav}>

      {/* LOGO */}

      <div
        style={styles.logoContainer}
        onClick={() => navigate("/empleado")}
      >

        <div style={styles.logoIcon}>
          👨‍💼
        </div>

        <div>

          <h2 style={styles.logo}>
            ModaGest Pro
          </h2>

          <p style={styles.logoSub}>
            Panel Empleado
          </p>

        </div>

      </div>

      {/* LINKS */}

      <div style={styles.linksContainer}>

        <Link
          to="/empleado"
          style={linkStyle("/empleado")}
        >
          <FaChartLine />
          Dashboard
        </Link>

        <Link
          to="/empleado/productos"
          style={linkStyle("/empleado/productos")}
        >
          <FaBoxOpen />
          Productos
        </Link>

      </div>

      {/* DERECHA */}

      <div style={styles.rightSection}>

        <div style={styles.userBox}>

          <FaUserTie />

          <span>
            {nombre}
          </span>

        </div>

        <button
          onClick={cerrarSesion}
          style={styles.logoutBtn}
        >

          <FaSignOutAlt />

          Salir

        </button>

      </div>

    </nav>

  );

}

/* ================= ESTILOS ================= */

const styles = {

  nav: {

    position: "sticky",

    top: 0,

    zIndex: 999,

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    padding: "18px 35px",

    background:
      "rgba(15,23,42,0.72)",

    backdropFilter: "blur(18px)",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)",

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.35)"

  },

  /* ================= LOGO ================= */

  logoContainer: {

    display: "flex",

    alignItems: "center",

    gap: "14px",

    cursor: "pointer"

  },

  logoIcon: {

    width: "50px",

    height: "50px",

    borderRadius: "16px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "24px",

    background:
      "linear-gradient(135deg, #7c3aed, #2563eb)",

    boxShadow:
      "0 6px 20px rgba(124,58,237,0.45)"

  },

  logo: {

    margin: 0,

    color: "#fff",

    fontSize: "22px",

    fontWeight: "700"

  },

  logoSub: {

    margin: 0,

    color: "#94a3b8",

    fontSize: "13px"

  },

  /* ================= LINKS ================= */

  linksContainer: {

    display: "flex",

    alignItems: "center",

    gap: "15px"

  },

  link: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    padding: "12px 18px",

    borderRadius: "14px",

    textDecoration: "none",

    fontWeight: "600",

    transition: "0.3s ease"

  },

  /* ================= DERECHA ================= */

  rightSection: {

    display: "flex",

    alignItems: "center",

    gap: "16px"

  },

  userBox: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    padding: "12px 18px",

    borderRadius: "14px",

    background:
      "rgba(255,255,255,0.06)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    color: "#e2e8f0",

    fontWeight: "500"

  },

  /* ================= BOTON ================= */

  logoutBtn: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    background:
      "linear-gradient(135deg, #ef4444, #dc2626)",

    border: "none",

    color: "#fff",

    padding: "12px 18px",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: "600",

    transition: "0.3s ease",

    boxShadow:
      "0 6px 18px rgba(239,68,68,0.35)"

  }

};