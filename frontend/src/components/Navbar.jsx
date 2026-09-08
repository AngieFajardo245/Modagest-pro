import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaShoppingBag,
  FaClipboardList,
  FaSignOutAlt,
  FaUserCircle,
  FaShoppingCart,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [rol, setRol] = useState(() => localStorage.getItem("rol"));

  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario") || "null");
    } catch {
      return null;
    }
  });

  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  const nombre = usuario?.nombre || "Usuario";

  const obtenerClienteId = () => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (usuarioGuardado) {
        const usuarioActual = JSON.parse(usuarioGuardado);

        const id =
          usuarioActual?.id ||
          usuarioActual?.usuarioId ||
          usuarioActual?.clienteId ||
          usuarioActual?.usuario?.id;

        if (id) {
          return Number(id);
        }
      }
    } catch (error) {
      console.error("Error obteniendo el usuario:", error);
    }

    const tokenActual = localStorage.getItem("token");

    if (tokenActual) {
      try {
        const partes = tokenActual.split(".");

        if (partes.length >= 2) {
          const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");

          const payload = JSON.parse(atob(base64));

          const id =
            payload?.id ||
            payload?.usuarioId ||
            payload?.clienteId ||
            payload?.userId;

          if (id) {
            return Number(id);
          }
        }
      } catch (error) {
        console.error("Error leyendo el token:", error);
      }
    }

    return null;
  };

  const cargarCantidadCarrito = () => {
    const tokenActual = localStorage.getItem("token");
    const rolActual = localStorage.getItem("rol");

    if (!tokenActual || rolActual?.toLowerCase() !== "cliente") {
      setCantidadCarrito(0);
      return;
    }

    const clienteId = obtenerClienteId();

    if (!clienteId) {
      setCantidadCarrito(0);
      return;
    }

    const claveCarrito = `carrito_cliente_${clienteId}`;

    try {
      const carritoGuardado = JSON.parse(
        localStorage.getItem(claveCarrito) || "[]",
      );

      if (!Array.isArray(carritoGuardado)) {
        setCantidadCarrito(0);
        return;
      }

      const totalUnidades = carritoGuardado.reduce(
        (total, producto) => total + Number(producto?.cantidad || 0),
        0,
      );

      setCantidadCarrito(totalUnidades);
    } catch (error) {
      console.error("Error cargando contador del carrito:", error);
      setCantidadCarrito(0);
    }
  };

  useEffect(() => {
    const actualizarUsuario = () => {
      const tokenActual = localStorage.getItem("token");
      const rolActual = localStorage.getItem("rol");

      let usuarioActual = null;

      try {
        usuarioActual = JSON.parse(localStorage.getItem("usuario") || "null");
      } catch {
        usuarioActual = null;
      }

      setToken(tokenActual);
      setRol(rolActual);
      setUsuario(usuarioActual);

      cargarCantidadCarrito();
    };

    cargarCantidadCarrito();

    window.addEventListener("carritoActualizado", cargarCantidadCarrito);

    window.addEventListener("storage", actualizarUsuario);

    return () => {
      window.removeEventListener("carritoActualizado", cargarCantidadCarrito);

      window.removeEventListener("storage", actualizarUsuario);
    };
  }, [location.pathname]);

  useEffect(() => {
    cargarCantidadCarrito();
  }, [token, rol, usuario]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("usuario");
    localStorage.removeItem("redirectAfterLogin");

    setToken(null);
    setRol(null);
    setUsuario(null);
    setCantidadCarrito(0);

    window.dispatchEvent(new Event("carritoActualizado"));
    window.dispatchEvent(new Event("authActualizado"));

    navigate("/");
  };

  const linkStyle = (path) => ({
    ...styles.link,
    background:
      location.pathname === path ? "rgba(124,58,237,0.25)" : "transparent",
    border:
      location.pathname === path
        ? "1px solid rgba(168,85,247,0.35)"
        : "1px solid transparent",
    color: location.pathname === path ? "#ffffff" : "#cbd5e1",
  });

  const irAlCarrito = () => {
    navigate("/cliente/carrito");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer} onClick={() => navigate("/")}>
        <div style={styles.logoIcon}>M</div>

        <div>
          <h2 style={styles.logoText}>ModaGest Pro</h2>

          <p style={styles.logoSub}>Dashboard Premium</p>
        </div>
      </div>

      <div style={styles.menu}>
        {!token && (
          <Link to="/login" style={linkStyle("/login")}>
            <FaUserCircle />
            Iniciar sesión
          </Link>
        )}

        {token && rol === "administrador" && (
          <>
            <Link to="/admin" style={linkStyle("/admin")}>
              <FaHome />
              Dashboard
            </Link>

            <Link to="/admin/usuarios" style={linkStyle("/admin/usuarios")}>
              <FaUsers />
              Usuarios
            </Link>

            <Link to="/admin/productos" style={linkStyle("/admin/productos")}>
              <FaBoxOpen />
              Productos
            </Link>

            <Link to="/admin/ventas" style={linkStyle("/admin/ventas")}>
              <FaChartLine />
              Ventas
            </Link>
          </>
        )}

        {token && rol === "cliente" && (
          <>
            <Link to="/cliente" style={linkStyle("/cliente")}>
              <FaHome />
              Panel
            </Link>

            <Link
              to="/cliente/productos"
              style={linkStyle("/cliente/productos")}
            >
              <FaShoppingBag />
              Productos
            </Link>

            <Link to="/cliente/compras" style={linkStyle("/cliente/compras")}>
              <FaClipboardList />
              Mis Compras
            </Link>

            <button
              type="button"
              onClick={irAlCarrito}
              style={{
                ...styles.cartBtn,
                ...(location.pathname === "/cliente/carrito"
                  ? styles.cartBtnActive
                  : {}),
              }}
              aria-label="Ir al carrito"
            >
              <FaShoppingCart />

              {cantidadCarrito > 0 && (
                <span style={styles.cartBadge}>
                  {cantidadCarrito > 99 ? "99+" : cantidadCarrito}
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {token && (
        <div style={styles.rightSection}>
          <div style={styles.userBox}>
            <FaUserCircle size={22} />

            <div>
              <p style={styles.userName}>{nombre}</p>

              <p style={styles.userRole}>{rol}</p>
            </div>
          </div>

          <button type="button" onClick={logout} style={styles.logoutBtn}>
            <FaSignOutAlt />
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 35px",
    background: "rgba(10,10,20,0.82)",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxSizing: "border-box",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
  },

  logoIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "24px",
    boxShadow: "0 0 25px rgba(124,58,237,0.5)",
  },

  logoText: {
    margin: 0,
    color: "#fff",
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  logoSub: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "2px",
  },

  menu: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: "500",
    transition: "0.3s",
    fontSize: "14px",
  },

  cartBtn: {
    position: "relative",
    width: "46px",
    height: "46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.09)",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    cursor: "pointer",
    fontSize: "17px",
    transition: "0.3s",
  },

  cartBtnActive: {
    background: "rgba(124,58,237,0.25)",
    border: "1px solid rgba(168,85,247,0.35)",
    color: "#fff",
  },

  cartBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    minWidth: "20px",
    height: "20px",
    padding: "0 5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    background: "#ef4444",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "800",
    border: "2px solid #0a0a14",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,255,255,0.06)",
    padding: "10px 14px",
    borderRadius: "16px",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  userName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
  },

  userRole: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "capitalize",
  },

  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(239,68,68,0.25)",
    background: "rgba(239,68,68,0.12)",
    color: "#f87171",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },
};
