import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  FaShoppingCart,
  FaUserCircle,
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt
} from "react-icons/fa";

/* ================= LOGO ================= */
import logo from "../assets/Logo.png";

export default function ClienteNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [cantidad, setCantidad] = useState(0);

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
    usuario?.nombre || "Cliente";

  /* ================= CARRITO ================= */

  const actualizarCarrito = () => {

    try {

      const carrito =
        JSON.parse(
          localStorage.getItem("carrito")
        ) || [];

      const total = carrito.reduce(
        (acc, p) =>
          acc + p.cantidad,
        0
      );

      setCantidad(total);

    } catch {

      setCantidad(0);

    }

  };

  useEffect(() => {

    actualizarCarrito();

    const interval =
      setInterval(
        actualizarCarrito,
        500
      );

    return () =>
      clearInterval(interval);

  }, []);

  /* ================= LOGOUT ================= */

  const cerrarSesion = () => {

    localStorage.clear();

    navigate("/", {
      replace: true
    });

  };

  /* ================= LINK STYLE ================= */

  const linkStyle = (path) => ({

    ...styles.link,

    color:
      location.pathname === path
        ? "#ffffff"
        : "#cbd5e1",

    background:
      location.pathname === path
        ? "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(59,130,246,0.95))"
        : "transparent",

    boxShadow:
      location.pathname === path
        ? "0 8px 20px rgba(124,58,237,0.35)"
        : "none"

  });

  return (

    <nav style={styles.nav}>

      {/* ================= LOGO ================= */}

      <div
        style={styles.logoContainer}
        onClick={() => navigate("/cliente")}
      >

        <img
          src={logo}
          alt="ModaGest Pro"
          style={styles.logoImage}
        />

        <div>

          <h2 style={styles.logo}>
            ModaGest Pro
          </h2>

          <p style={styles.logoSub}>
            Cliente
          </p>

        </div>

      </div>

      {/* ================= LINKS ================= */}

      <div style={styles.links}>

        <Link
          to="/cliente"
          style={linkStyle("/cliente")}
        >
          <FaHome />
          Inicio
        </Link>

        <Link
          to="/cliente/productos"
          style={linkStyle("/cliente/productos")}
        >
          <FaBoxOpen />
          Productos
        </Link>

        <Link
          to="/cliente/compras"
          style={linkStyle("/cliente/compras")}
        >
          <FaClipboardList />
          Compras
        </Link>

        {/* ================= CARRITO ================= */}

        <div
          style={styles.cart}
          onClick={() =>
            navigate("/carrito")
          }
        >

          <FaShoppingCart size={18} />

          {cantidad > 0 && (

            <span style={styles.badge}>
              {cantidad}
            </span>

          )}

        </div>

        {/* ================= USER ================= */}

        <div style={styles.user}>

          <div style={styles.avatar}>
            <FaUserCircle />
          </div>

          <div>

            <p style={styles.userLabel}>
              Bienvenido
            </p>

            <strong style={styles.userName}>
              {nombre}
            </strong>

          </div>

        </div>

        {/* ================= LOGOUT ================= */}

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

    zIndex: 1000,

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    padding: "18px 35px",

    background:
      "rgba(15,23,42,0.78)",

    backdropFilter: "blur(18px)",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.35)"

  },

  /* ================= LOGO ================= */

  logoContainer: {

    display: "flex",

    alignItems: "center",

    gap: "16px",

    cursor: "pointer"

  },

  logoImage: {

    width: "70px",

    height: "70px",

    objectFit: "cover",

    borderRadius: "18px",

    background: "transparent",

    transform: "scale(1.2)",

    filter:
      "drop-shadow(0 0 12px rgba(168,85,247,0.55))"

  },

  logo: {

    margin: 0,

    color: "#fff",

    fontSize: "24px",

    fontWeight: "700"

  },

  logoSub: {

    margin: 0,

    color: "#94a3b8",

    fontSize: "13px",

    letterSpacing: "1px"

  },

  /* ================= LINKS ================= */

  links: {

    display: "flex",

    alignItems: "center",

    gap: "16px",

    flexWrap: "wrap"

  },

  link: {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    padding: "12px 18px",

    borderRadius: "14px",

    textDecoration: "none",

    fontWeight: "600",

    transition: "0.3s ease",

    fontSize: "15px"

  },

  /* ================= CART ================= */

  cart: {

    position: "relative",

    width: "50px",

    height: "50px",

    borderRadius: "14px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    cursor: "pointer",

    background:
      "rgba(255,255,255,0.06)",

    color: "#fff",

    border:
      "1px solid rgba(255,255,255,0.08)",

    transition: "0.3s"

  },

  badge: {

    position: "absolute",

    top: "-6px",

    right: "-5px",

    background:
      "linear-gradient(135deg, #ef4444, #dc2626)",

    color: "#fff",

    borderRadius: "50%",

    minWidth: "22px",

    height: "22px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "12px",

    fontWeight: "700",

    boxShadow:
      "0 4px 10px rgba(239,68,68,0.4)"

  },

  /* ================= USER ================= */

  user: {

    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding: "10px 16px",

    borderRadius: "16px",

    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)"

  },

  avatar: {

    width: "42px",

    height: "42px",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg, #7c3aed, #3b82f6)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#fff",

    fontSize: "20px"

  },

  userLabel: {

    margin: 0,

    color: "#94a3b8",

    fontSize: "12px"

  },

  userName: {

    color: "#fff",

    fontSize: "14px"

  },

  /* ================= LOGOUT ================= */

  logoutBtn: {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    border: "none",

    padding: "12px 18px",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg, #ef4444, #dc2626)",

    color: "#fff",

    fontWeight: "600",

    cursor: "pointer",

    transition: "0.3s",

    boxShadow:
      "0 8px 20px rgba(239,68,68,0.35)"

  }

};