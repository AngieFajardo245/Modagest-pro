import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaUserCircle,
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

import logo from "../assets/Logo.png";

export default function ClienteNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cantidad, setCantidad] = useState(0);
  const [usuario, setUsuario] = useState(null);

  const obtenerUsuario = () => {
    try {
      const usuarioStorage = localStorage.getItem("usuario");

      if (!usuarioStorage) {
        setUsuario(null);
        return null;
      }

      const usuarioParseado = JSON.parse(usuarioStorage);

      if (!usuarioParseado || typeof usuarioParseado !== "object") {
        setUsuario(null);
        return null;
      }

      setUsuario(usuarioParseado);

      return usuarioParseado;
    } catch (error) {
      console.error("Error leyendo usuario:", error);
      setUsuario(null);
      return null;
    }
  };

  const obtenerClienteId = (usuarioActual = null) => {
    try {
      const usuarioStorage =
        usuarioActual || JSON.parse(localStorage.getItem("usuario") || "null");

      if (usuarioStorage && typeof usuarioStorage === "object") {
        const id =
          usuarioStorage?.id ||
          usuarioStorage?.usuarioId ||
          usuarioStorage?.clienteId ||
          usuarioStorage?.usuario?.id ||
          usuarioStorage?.data?.id;

        if (id && Number.isInteger(Number(id)) && Number(id) > 0) {
          return Number(id);
        }
      }
    } catch (error) {
      console.error("Error obteniendo cliente:", error);
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const partes = token.split(".");

        if (partes.length >= 2) {
          const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");

          const payload = JSON.parse(atob(base64));

          const id =
            payload?.id ||
            payload?.usuarioId ||
            payload?.clienteId ||
            payload?.userId ||
            payload?.sub;

          if (id && Number.isInteger(Number(id)) && Number(id) > 0) {
            return Number(id);
          }
        }
      } catch (error) {
        console.error("Error obteniendo cliente desde token:", error);
      }
    }

    return null;
  };

  const obtenerClaveCarrito = () => {
    const clienteId = obtenerClienteId(usuario);

    if (clienteId && Number.isInteger(clienteId) && clienteId > 0) {
      return `carrito_cliente_${clienteId}`;
    }

    return null;
  };

  const actualizarCarrito = () => {
    try {
      const claveCarrito = obtenerClaveCarrito();

      if (!claveCarrito) {
        setCantidad(0);
        return;
      }

      const carritoStorage = localStorage.getItem(claveCarrito);

      if (!carritoStorage) {
        setCantidad(0);
        return;
      }

      const carrito = JSON.parse(carritoStorage);

      if (!Array.isArray(carrito)) {
        setCantidad(0);
        return;
      }

      const total = carrito.reduce((acc, producto) => {
        const cantidadProducto = Number(producto?.cantidad || 0);

        return (
          acc +
          (Number.isFinite(cantidadProducto) && cantidadProducto > 0
            ? cantidadProducto
            : 0)
        );
      }, 0);

      setCantidad(total);
    } catch (error) {
      console.error("Error actualizando contador del carrito:", error);
      setCantidad(0);
    }
  };

  useEffect(() => {
    const usuarioActual = obtenerUsuario();

    if (usuarioActual) {
      actualizarCarrito();
    } else {
      setCantidad(0);
    }

    const actualizarDatos = (event) => {
      const clienteIdActual = obtenerClienteId(usuario);

      const claveActual =
        clienteIdActual &&
        Number.isInteger(clienteIdActual) &&
        clienteIdActual > 0
          ? `carrito_cliente_${clienteIdActual}`
          : null;

      if (event?.type === "carritoActualizado") {
        const claveEvento =
          event?.detail?.clave || event?.detail?.claveCarrito || null;

        if (claveEvento && claveActual && claveEvento !== claveActual) {
          return;
        }

        if (claveEvento && !claveActual) {
          setCantidad(0);
          return;
        }
      }

      obtenerUsuario();
      actualizarCarrito();
    };

    const manejarStorage = (event) => {
      const claveActual = obtenerClaveCarrito();

      if (!claveActual) {
        setCantidad(0);
        return;
      }

      if (event.key !== claveActual) {
        return;
      }

      actualizarCarrito();
    };

    window.addEventListener("carritoActualizado", actualizarDatos);
    window.addEventListener("storage", manejarStorage);

    return () => {
      window.removeEventListener("carritoActualizado", actualizarDatos);
      window.removeEventListener("storage", manejarStorage);
    };
  }, [location.pathname]);

  useEffect(() => {
    actualizarCarrito();
  }, [usuario]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("redirectAfterLogin");

    setUsuario(null);
    setCantidad(0);

    navigate("/", { replace: true });
  };

  const nombre = usuario?.nombre || "Cliente";

  const rutaActiva = (path) => {
    if (path === "/cliente") {
      return location.pathname === "/cliente";
    }

    return location.pathname.startsWith(path);
  };

  const linkStyle = (path) => {
    const activo = rutaActiva(path);

    return {
      ...styles.link,
      color: activo ? "#ffffff" : "#cbd5e1",
      background: activo
        ? "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(59,130,246,0.95))"
        : "transparent",
      boxShadow: activo ? "0 8px 20px rgba(124,58,237,0.35)" : "none",
    };
  };

  const carritoActivo = location.pathname.startsWith("/cliente/carrito");

  return (
    <nav style={styles.nav}>
      <Link to="/cliente" style={styles.logoContainer}>
        <img src={logo} alt="ModaGest Pro" style={styles.logoImage} />

        <div>
          <h2 style={styles.logo}>ModaGest Pro</h2>
          <p style={styles.logoSub}>Panel Cliente</p>
        </div>
      </Link>

      <div style={styles.links}>
        <Link to="/cliente" style={linkStyle("/cliente")}>
          <FaHome />
          <span>Inicio</span>
        </Link>

        <Link to="/cliente/productos" style={linkStyle("/cliente/productos")}>
          <FaBoxOpen />
          <span>Productos</span>
        </Link>

        <Link to="/cliente/compras" style={linkStyle("/cliente/compras")}>
          <FaClipboardList />
          <span>Compras</span>
        </Link>

        <Link
          to="/cliente/carrito"
          style={{
            ...styles.cart,
            ...(carritoActivo ? styles.cartActive : {}),
          }}
          aria-label={`Carrito de compras${
            cantidad > 0 ? `, ${cantidad} productos` : ""
          }`}
        >
          <FaShoppingCart size={18} />

          {cantidad > 0 && (
            <span style={styles.badge}>{cantidad > 99 ? "99+" : cantidad}</span>
          )}
        </Link>

        <div style={styles.user}>
          <div style={styles.avatar}>
            <FaUserCircle />
          </div>

          <div>
            <p style={styles.userLabel}>Bienvenido</p>
            <strong style={styles.userName}>{nombre}</strong>
          </div>
        </div>

        <button
          type="button"
          onClick={cerrarSesion}
          style={styles.logoutBtn}
          aria-label="Cerrar sesión"
        >
          <FaSignOutAlt />
          <span>Salir</span>
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    padding: "14px 32px",
    background: "rgba(15,23,42,0.82)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    textDecoration: "none",
    flexShrink: 0,
  },

  logoImage: {
    width: "62px",
    height: "62px",
    objectFit: "cover",
    borderRadius: "16px",
    background: "transparent",
    transform: "scale(1.08)",
    filter: "drop-shadow(0 0 12px rgba(168,85,247,0.5))",
  },

  logo: {
    margin: 0,
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
  },

  logoSub: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
    letterSpacing: "0.8px",
  },

  links: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
    flexWrap: "wrap",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 15px",
    borderRadius: "13px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.25s ease",
  },

  cart: {
    position: "relative",
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.08)",
    textDecoration: "none",
    transition: "all 0.25s ease",
  },

  cartActive: {
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(59,130,246,0.95))",
    boxShadow: "0 8px 20px rgba(124,58,237,0.35)",
  },

  badge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    minWidth: "21px",
    height: "21px",
    padding: "0 5px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: "700",
    boxShadow: "0 4px 10px rgba(239,68,68,0.4)",
  },

  user: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 13px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "19px",
  },

  userLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "11px",
  },

  userName: {
    color: "#ffffff",
    fontSize: "14px",
  },

  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    padding: "11px 15px",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 7px 18px rgba(239,68,68,0.28)",
  },
};
