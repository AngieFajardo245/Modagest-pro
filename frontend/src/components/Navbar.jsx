import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartLine,
  FaClipboardList,
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";

const leerUsuario = () => {
  try {
    const datos = JSON.parse(localStorage.getItem("usuario") || "null");

    return datos && typeof datos === "object" ? datos : null;
  } catch (error) {
    console.error("Error leyendo el usuario:", error);
    return null;
  }
};

const obtenerClienteId = () => {
  const usuarioActual = leerUsuario();

  const idUsuario =
    usuarioActual?.id ||
    usuarioActual?.usuarioId ||
    usuarioActual?.clienteId ||
    usuarioActual?.usuario?.id;

  if (Number.isInteger(Number(idUsuario)) && Number(idUsuario) > 0) {
    return Number(idUsuario);
  }

  const tokenActual = localStorage.getItem("token");

  if (!tokenActual) {
    return null;
  }

  try {
    const partes = tokenActual.split(".");

    if (partes.length < 2) {
      return null;
    }

    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    const idToken =
      payload?.id ||
      payload?.usuarioId ||
      payload?.clienteId ||
      payload?.userId ||
      payload?.sub;

    if (Number.isInteger(Number(idToken)) && Number(idToken) > 0) {
      return Number(idToken);
    }
  } catch (error) {
    console.error("Error leyendo el token:", error);
  }

  return null;
};

const obtenerCantidadCarrito = () => {
  const tokenActual = localStorage.getItem("token");
  const rolActual = localStorage.getItem("rol")?.trim().toLowerCase();

  if (!tokenActual || rolActual !== "cliente") {
    return 0;
  }

  const clienteId = obtenerClienteId();

  if (!clienteId) {
    return 0;
  }

  try {
    const carrito = JSON.parse(
      localStorage.getItem(`carrito_cliente_${clienteId}`) || "[]",
    );

    if (!Array.isArray(carrito)) {
      return 0;
    }

    return carrito.reduce((total, producto) => {
      const cantidad = Number(producto?.cantidad || 0);

      return total + (cantidad > 0 ? cantidad : 0);
    }, 0);
  } catch (error) {
    console.error("Error cargando contador del carrito:", error);
    return 0;
  }
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [rol, setRol] = useState(() =>
    localStorage.getItem("rol")?.trim().toLowerCase(),
  );
  const [usuario, setUsuario] = useState(leerUsuario);
  const [cantidadCarrito, setCantidadCarrito] = useState(
    obtenerCantidadCarrito,
  );

  useEffect(() => {
    const actualizarSesion = () => {
      setToken(localStorage.getItem("token"));
      setRol(localStorage.getItem("rol")?.trim().toLowerCase());
      setUsuario(leerUsuario());
      setCantidadCarrito(obtenerCantidadCarrito());
    };

    const actualizarCarrito = () => {
      setCantidadCarrito(obtenerCantidadCarrito());
    };

    const manejarStorage = (event) => {
      if (
        event.key === "token" ||
        event.key === "rol" ||
        event.key === "usuario"
      ) {
        actualizarSesion();
        return;
      }

      const clienteId = obtenerClienteId();
      const claveCarrito = clienteId ? `carrito_cliente_${clienteId}` : null;

      if (event.key === claveCarrito) {
        actualizarCarrito();
      }
    };

    window.addEventListener("carritoActualizado", actualizarCarrito);
    window.addEventListener("authActualizado", actualizarSesion);
    window.addEventListener("storage", manejarStorage);

    return () => {
      window.removeEventListener("carritoActualizado", actualizarCarrito);
      window.removeEventListener("authActualizado", actualizarSesion);
      window.removeEventListener("storage", manejarStorage);
    };
  }, []);

  const nombre = usuario?.nombre || "Usuario";

  const cerrarSesion = () => {
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

    navigate("/", { replace: true });
  };

  const linkStyle = (ruta) => {
    const activo = location.pathname === ruta;

    return {
      ...styles.link,
      background: activo ? "rgba(124,58,237,0.25)" : "transparent",
      border: activo
        ? "1px solid rgba(168,85,247,0.35)"
        : "1px solid transparent",
      color: activo ? "#ffffff" : "#cbd5e1",
    };
  };

  return (
    <nav style={styles.navbar}>
      <button
        type="button"
        style={styles.logoContainer}
        onClick={() => navigate("/")}
        aria-label="Ir al inicio"
      >
        <div style={styles.logoIcon}>M</div>

        <div>
          <h2 style={styles.logoText}>ModaGest Pro</h2>
          <p style={styles.logoSub}>Dashboard Premium</p>
        </div>
      </button>

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
              Mis compras
            </Link>

            <button
              type="button"
              onClick={() => navigate("/cliente/carrito")}
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

          <button
            type="button"
            onClick={cerrarSesion}
            style={styles.logoutBtn}
            aria-label="Cerrar sesión"
          >
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
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
  },
  logoIcon: {
    width: "46px",
    height: "46px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
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
    margin: "2px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
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
    padding: "10px 14px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.06)",
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
    color: "#94a3b8",
    fontSize: "12px",
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
