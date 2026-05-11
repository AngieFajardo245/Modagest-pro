import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

export default function PublicNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [cantidad, setCantidad] = useState(0);

  const token = localStorage.getItem("token");

  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
  } catch {
    usuario = null;
  }

  const nombre = usuario?.nombre || "";

  /* ================= ACTUALIZAR CARRITO ================= */

  const actualizarCarrito = () => {
    try {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const total = carrito.reduce((acc, p) => acc + (p.cantidad || 0), 0);
      setCantidad(total);
    } catch {
      setCantidad(0);
    }
  };

  useEffect(() => {

    actualizarCarrito();

    // 🔥 escucha cambios entre pestañas
    window.addEventListener("storage", actualizarCarrito);

    // 🔥 escucha cambios en la misma pestaña
    window.addEventListener("carritoActualizado", actualizarCarrito);

    return () => {
      window.removeEventListener("storage", actualizarCarrito);
      window.removeEventListener("carritoActualizado", actualizarCarrito);
    };

  }, []);

  /* ================= LOGOUT ================= */

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  /* ================= ESTILO LINKS ================= */

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#d4af37" : "#fff",
    textDecoration: "none",
    fontWeight: "500",
    cursor: "pointer"
  });

  return (

    <nav style={styles.nav}>

      {/* LOGO */}
      <h2
        style={styles.logo}
        onClick={() => navigate("/")}
      >
        🛍 ModaGest Pro
      </h2>

      <div style={styles.links}>

        <Link to="/" style={linkStyle("/")}>
          Inicio
        </Link>

        {/* 🔥 CARRITO */}
        <div
          style={styles.cart}
          onClick={() => navigate("/carrito")}
        >
          <FaShoppingCart size={22} />

          {cantidad > 0 && (
            <span style={styles.badge}>
              {cantidad}
            </span>
          )}
        </div>

        {token && (
          <span style={styles.saludo}>
            Hola, {nombre}
          </span>
        )}

        {!token ? (

          <button
            onClick={() => navigate("/login")}
            style={styles.loginBtn}
          >
            Iniciar sesión
          </button>

        ) : (

          <button
            onClick={cerrarSesion}
            style={styles.logoutBtn}
          >
            Cerrar sesión
          </button>

        )}

      </div>

    </nav>
  );
}

/* ================= ESTILOS ================= */

const styles = {

  nav: {
    background: "linear-gradient(90deg, #111, #1c1c1c)",
    color: "white",
    padding: "15px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },

  logo: {
    margin: 0,
    cursor: "pointer",
    letterSpacing: "1px"
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },

  cart: {
    position: "relative",
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },

  badge: {
    position: "absolute",
    top: "-8px",
    right: "-12px",
    background: "#ff3b3b",
    color: "white",
    borderRadius: "50%",
    fontSize: "11px",
    fontWeight: "bold",
    padding: "3px 7px",
    boxShadow: "0 0 5px rgba(0,0,0,0.3)"
  },

  saludo: {
    fontWeight: "500"
  },

  loginBtn: {
    background: "#0d6efd",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  logoutBtn: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  }

};