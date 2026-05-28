import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import {
  FaShoppingCart,
  FaUser,
  FaSearch
} from "react-icons/fa";

/* ================= LOGO ================= */
import logo from "../assets/Logo.png";

export default function PublicNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [cantidad, setCantidad] = useState(0);

  const token = localStorage.getItem("token");

  let usuario = null;

  try {

    usuario = JSON.parse(
      localStorage.getItem("usuario")
    );

  } catch {

    usuario = null;

  }

  const nombre = usuario?.nombre || "";

  const rol = usuario?.rol?.toLowerCase() || "";

  /* ================= RUTAS SEGUN ROL ================= */

  const rutaInicio = () => {

    switch (rol) {

      case "administrador":
        return "/admin";

      case "empleado":
        return "/empleado";

      case "cliente":
        return "/cliente";

      default:
        return "/";

    }

  };

  const rutaProductos = () => {

    switch (rol) {

      case "administrador":
        return "/admin/productos";

      case "empleado":
        return "/empleado/productos";

      case "cliente":
        return "/cliente/productos";

      default:
        return "/#productos";

    }

  };

  /* ================= ACTUALIZAR CARRITO ================= */

  const actualizarCarrito = () => {

    try {

      const carrito =
        JSON.parse(
          localStorage.getItem("carrito")
        ) || [];

      const total = carrito.reduce(
        (acc, p) =>
          acc + (p.cantidad || 0),
        0
      );

      setCantidad(total);

    } catch {

      setCantidad(0);

    }

  };

  useEffect(() => {

    actualizarCarrito();

    window.addEventListener(
      "storage",
      actualizarCarrito
    );

    window.addEventListener(
      "carritoActualizado",
      actualizarCarrito
    );

    return () => {

      window.removeEventListener(
        "storage",
        actualizarCarrito
      );

      window.removeEventListener(
        "carritoActualizado",
        actualizarCarrito
      );

    };

  }, []);

  /* ================= LOGOUT ================= */

  const cerrarSesion = () => {

    localStorage.clear();

    navigate("/", {
      replace: true
    });

  };

  /* ================= LINKS ================= */

  const linkStyle = (path) => ({

    color:
      location.pathname === path
        ? "#a855f7"
        : "#ffffff",

    textDecoration: "none",

    fontWeight: "500",

    fontSize: "15px",

    transition: "0.3s"

  });

  return (

    <nav style={styles.nav}>

      {/* ================= LOGO ================= */}

      <div
        style={styles.logoContainer}
        onClick={() =>
          navigate(rutaInicio())
        }
      >

        {/* LOGO */}
        <img
          src={logo}
          alt="ModaGest Pro"
          style={styles.logoImage}
        />

        <h2 style={styles.logoText}>
          ModaGest Pro
        </h2>

      </div>

      {/* ================= MENU ================= */}

      <div style={styles.menu}>

        <Link
          to={rutaInicio()}
          style={linkStyle(rutaInicio())}
        >
          Inicio
        </Link>

        <Link
          to={rutaProductos()}
          style={styles.link}
        >
          Productos
        </Link>

      </div>

      {/* ================= DERECHA ================= */}

      <div style={styles.right}>

        {/* ================= SEARCH ================= */}

        <div style={styles.searchBox}>

          <FaSearch
            size={14}
            color="#9ca3af"
          />

          <input
            type="text"
            placeholder="Buscar..."
            style={styles.searchInput}
          />

        </div>

        {/* ================= CARRITO ================= */}

        <div
          style={styles.cart}
          onClick={() =>
            navigate("/carrito")
          }
        >

          <FaShoppingCart size={20} />

          {cantidad > 0 && (

            <span style={styles.badge}>
              {cantidad}
            </span>

          )}

        </div>

        {/* ================= USUARIO ================= */}

        {token && (

          <div style={styles.userBox}>

            <FaUser />

            <span>
              {nombre}
            </span>

          </div>

        )}

        {/* ================= LOGIN / LOGOUT ================= */}

        {!token ? (

          <button
            onClick={() =>
              navigate("/login")
            }
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

    position: "sticky",

    top: 0,

    zIndex: 999,

    width: "100%",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    padding: "16px 40px",

    background:
      "rgba(5, 5, 15, 0.92)",

    backdropFilter: "blur(12px)",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)"

  },

  /* ================= LOGO ================= */

  logoContainer: {

    display: "flex",

    alignItems: "center",

    gap: "16px",

    cursor: "pointer"

  },

  logoImage: {

    width: "78px",

    height: "78px",

    objectFit: "cover",

    borderRadius: "18px",

    background: "transparent",

    transform: "scale(1.35)",

    filter:
      "drop-shadow(0 0 12px rgba(168,85,247,0.55))"

  },

  logoText: {

    color: "#fff",

    margin: 0,

    fontSize: "36px",

    fontWeight: "700",

    letterSpacing: "0.5px"

  },

  /* ================= MENU ================= */

  menu: {

    display: "flex",

    gap: "30px"

  },

  link: {

    textDecoration: "none",

    color: "#e5e7eb",

    fontWeight: "500",

    transition: "0.3s"

  },

  /* ================= DERECHA ================= */

  right: {

    display: "flex",

    alignItems: "center",

    gap: "18px"

  },

  searchBox: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    background:
      "rgba(255,255,255,0.06)",

    padding: "10px 14px",

    borderRadius: "14px",

    border:
      "1px solid rgba(255,255,255,0.08)"

  },

  searchInput: {

    background: "transparent",

    border: "none",

    outline: "none",

    color: "#fff",

    width: "160px"

  },

  /* ================= CARRITO ================= */

  cart: {

    position: "relative",

    cursor: "pointer",

    color: "#fff",

    transition: "0.3s"

  },

  badge: {

    position: "absolute",

    top: "-10px",

    right: "-10px",

    background:
      "linear-gradient(135deg, #a855f7, #7c3aed)",

    color: "#fff",

    borderRadius: "50%",

    minWidth: "20px",

    height: "20px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "11px",

    fontWeight: "bold"

  },

  /* ================= USER ================= */

  userBox: {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    color: "#fff",

    background:
      "rgba(255,255,255,0.06)",

    padding: "10px 14px",

    borderRadius: "12px"

  },

  /* ================= BOTONES ================= */

  loginBtn: {

    background:
      "linear-gradient(135deg, #7c3aed, #9333ea)",

    color: "#fff",

    border: "none",

    padding: "12px 18px",

    borderRadius: "12px",

    fontWeight: "600",

    cursor: "pointer",

    transition: "0.3s",

    boxShadow:
      "0 0 20px rgba(168,85,247,0.3)"

  },

  logoutBtn: {

    background:
      "rgba(239,68,68,0.15)",

    color: "#ef4444",

    border:
      "1px solid rgba(239,68,68,0.4)",

    padding: "12px 18px",

    borderRadius: "12px",

    fontWeight: "600",

    cursor: "pointer"

  }

};