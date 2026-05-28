import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  FaChartLine,
  FaUsers,
  FaBoxOpen,
  FaShoppingBag,
  FaSignOutAlt,
  FaCrown,
  FaBars
} from "react-icons/fa";

import { useState } from "react";

export default function AdminNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  /* ================= USUARIO ================= */

  let usuario = null;

  try {

    usuario = JSON.parse(
      localStorage.getItem("usuario")
    );

  } catch {

    usuario = null;

  }

  const nombre =
    usuario?.nombre || "Administrador";

  /* ================= LOGOUT ================= */

  const cerrarSesion = () => {

    localStorage.clear();

    navigate("/login", {
      replace: true
    });

  };

  /* ================= LINK STYLE ================= */

  const linkStyle = (path) => {

    const activo =
      location.pathname === path;

    return {

      ...styles.link,

      background: activo
        ? "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(37,99,235,0.28))"
        : "transparent",

      border: activo
        ? "1px solid rgba(255,255,255,0.14)"
        : "1px solid transparent",

      color: activo
        ? "#ffffff"
        : "#cbd5e1",

      boxShadow: activo
        ? "0 10px 30px rgba(124,58,237,0.18)"
        : "none"

    };

  };

  return (

    <>

      {/* ================= NAVBAR ================= */}

      <nav style={styles.nav}>

        {/* ================= IZQUIERDA ================= */}

        <div style={styles.leftSection}>

          {/* ================= MENU MOBILE ================= */}

          <button
            style={styles.menuBtn}
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >

            <FaBars />

          </button>

          {/* ================= LOGO ================= */}

          <div
            style={styles.logoContainer}
            onClick={() =>
              navigate("/admin")
            }
          >

            <div style={styles.logoIcon}>

              <FaCrown />

            </div>

            <div>

              <h2 style={styles.logo}>
                ModaGest Pro
              </h2>

              <p style={styles.logoSub}>
                Panel Administrativo
              </p>

            </div>

          </div>

        </div>

        {/* ================= LINKS DESKTOP ================= */}

        <div style={styles.linksDesktop}>

          <Link
            to="/admin"
            style={linkStyle("/admin")}
          >

            <FaChartLine />
            Dashboard

          </Link>

          <Link
            to="/admin/usuarios"
            style={linkStyle("/admin/usuarios")}
          >

            <FaUsers />
            Usuarios

          </Link>

          <Link
            to="/admin/productos"
            style={linkStyle("/admin/productos")}
          >

            <FaBoxOpen />
            Productos

          </Link>

          <Link
            to="/admin/ventas"
            style={linkStyle("/admin/ventas")}
          >

            <FaShoppingBag />
            Ventas

          </Link>

        </div>

        {/* ================= DERECHA ================= */}

        <div style={styles.rightSection}>

          {/* ================= USER ================= */}

          <div style={styles.userBox}>

            <div style={styles.avatarGlow}>

              <div style={styles.avatar}>

                {nombre.charAt(0).toUpperCase()}

              </div>

            </div>

            <div>

              <p style={styles.userLabel}>
                Administrador
              </p>

              <h4 style={styles.userName}>
                {nombre}
              </h4>

            </div>

          </div>

          {/* ================= BOTON ================= */}

          <button
            onClick={cerrarSesion}
            style={styles.logoutBtn}
          >

            <FaSignOutAlt />

            Salir

          </button>

        </div>

      </nav>

      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (

        <div style={styles.mobileMenu}>

          <Link
            to="/admin"
            style={styles.mobileLink}
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <FaChartLine />
            Dashboard

          </Link>

          <Link
            to="/admin/usuarios"
            style={styles.mobileLink}
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <FaUsers />
            Usuarios

          </Link>

          <Link
            to="/admin/productos"
            style={styles.mobileLink}
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <FaBoxOpen />
            Productos

          </Link>

          <Link
            to="/admin/ventas"
            style={styles.mobileLink}
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <FaShoppingBag />
            Ventas

          </Link>

        </div>

      )}

    </>

  );

}

/* ===================================================== */
/* ======================= ESTILOS ===================== */
/* ===================================================== */

const styles = {

  nav: {

    position: "sticky",

    top: 0,

    zIndex: 999,

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    padding: "18px 30px",

    background:
      "rgba(15,23,42,0.72)",

    backdropFilter: "blur(18px)",

    WebkitBackdropFilter:
      "blur(18px)",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)",

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.25)",

    flexWrap: "wrap",

    gap: "20px"

  },

  leftSection: {

    display: "flex",

    alignItems: "center",

    gap: "18px"

  },

  /* ================= MENU BTN ================= */

  menuBtn: {

    width: "45px",

    height: "45px",

    borderRadius: "12px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.06)",

    color: "#fff",

    display: "none",

    alignItems: "center",

    justifyContent: "center",

    cursor: "pointer",

    fontSize: "16px"

  },

  /* ================= LOGO ================= */

  logoContainer: {

    display: "flex",

    alignItems: "center",

    gap: "14px",

    cursor: "pointer"

  },

  logoIcon: {

    width: "56px",

    height: "56px",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg, #7c3aed, #2563eb)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#fff",

    fontSize: "22px",

    boxShadow:
      "0 10px 30px rgba(124,58,237,0.35)"

  },

  logo: {

    margin: 0,

    color: "#fff",

    fontSize: "22px",

    fontWeight: "800",

    letterSpacing: "0.5px"

  },

  logoSub: {

    margin: 0,

    color: "#94a3b8",

    fontSize: "13px"

  },

  /* ================= LINKS ================= */

  linksDesktop: {

    display: "flex",

    alignItems: "center",

    gap: "14px",

    flexWrap: "wrap"

  },

  link: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    padding: "12px 18px",

    borderRadius: "16px",

    textDecoration: "none",

    fontWeight: "600",

    transition: "all 0.3s ease",

    fontSize: "15px"

  },

  /* ================= DERECHA ================= */

  rightSection: {

    display: "flex",

    alignItems: "center",

    gap: "18px",

    flexWrap: "wrap"

  },

  userBox: {

    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding:
      "10px 14px",

    borderRadius: "18px",

    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(10px)"

  },

  avatarGlow: {

    padding: "2px",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg, #7c3aed, #2563eb)"

  },

  avatar: {

    width: "42px",

    height: "42px",

    borderRadius: "50%",

    background: "#111827",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#fff",

    fontWeight: "700",

    fontSize: "16px"

  },

  userLabel: {

    margin: 0,

    color: "#94a3b8",

    fontSize: "12px"

  },

  userName: {

    margin: 0,

    color: "#fff",

    fontSize: "14px",

    fontWeight: "700"

  },

  /* ================= BOTON ================= */

  logoutBtn: {

    border: "none",

    display: "flex",

    alignItems: "center",

    gap: "8px",

    padding: "12px 18px",

    borderRadius: "16px",

    cursor: "pointer",

    fontWeight: "700",

    color: "#fff",

    background:
      "linear-gradient(135deg, #ef4444, #dc2626)",

    boxShadow:
      "0 10px 25px rgba(239,68,68,0.25)",

    transition: "all 0.3s ease"

  },

  /* ================= MOBILE ================= */

  mobileMenu: {

    display: "none"

  },

  mobileLink: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    padding: "14px",

    color: "#fff",

    textDecoration: "none",

    borderRadius: "14px",

    background:
      "rgba(255,255,255,0.05)"

  }

};