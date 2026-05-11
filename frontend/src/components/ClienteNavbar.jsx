import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

export default function ClienteNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [cantidad, setCantidad] = useState(0);

  // Manejo seguro
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
  } catch {
    usuario = null;
  }

  const nombre = usuario?.nombre || "Cliente";

  /* ================= CARRITO ================= */

  const actualizarCarrito = () => {
    try {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
      setCantidad(total);
    } catch {
      setCantidad(0);
    }
  };

  useEffect(() => {
    actualizarCarrito();

    // que vuelva a la misma pestaña 
    const interval = setInterval(actualizarCarrito, 500);

    return () => clearInterval(interval);
  }, []);

  /* ================= LOGOUT ================= */

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  /* ================= ESTILO LINKS ================= */

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#ffd700" : "#fff",
    textDecoration: "none",
    fontWeight: "500",
    cursor: "pointer"
  });

  return (

    <nav style={styles.nav}>

      {/* LOGO → AHORA VA A HOME REAL */}
      <h2 style={styles.logo} onClick={() => navigate("/")}>
        🛍 ModaGest Pro
      </h2>

      <div style={styles.links}>

        {/* VOLVER A TIENDA */}
        <Link to="/" style={linkStyle("/")}>
          Inicio
        </Link>

        <Link to="/cliente" style={linkStyle("/cliente")}>
          Dashboard
        </Link>

        <Link to="/cliente/productos" style={linkStyle("/cliente/productos")}>
          Productos
        </Link>

        <Link to="/cliente/compras" style={linkStyle("/cliente/compras")}>
          Mis Compras
        </Link>

        {/* 🛒 CARRITO */}
        <div
          style={styles.cart}
          onClick={() => navigate("/carrito")}
        >
          <FaShoppingCart size={20} />

          {cantidad > 0 && (
            <span style={styles.badge}>
              {cantidad}
            </span>
          )}
        </div>

        {/* 👤 USUARIO */}
        <div style={styles.user}>
          <FaUserCircle size={20} />
          <span>{nombre}</span>
        </div>

        {/* 🔴 LOGOUT */}
        <button onClick={cerrarSesion} style={styles.logoutBtn}>
          Salir
        </button>

      </div>

    </nav>
  );
}

/* ================= ESTILOS ================= */

const styles = {

  nav: {
    background: "linear-gradient(90deg, #0d6efd, #0b5ed7)",
    color: "white",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  },

  logo: {
    margin: 0,
    cursor: "pointer"
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },

  cart: {
    position: "relative",
    cursor: "pointer"
  },

  badge: {
    position: "absolute",
    top: "-8px",
    right: "-10px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    fontSize: "12px",
    padding: "2px 6px"
  },

  user: {
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },

  logoutBtn: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};