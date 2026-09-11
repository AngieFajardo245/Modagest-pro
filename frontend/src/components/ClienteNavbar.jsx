import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBoxOpen,
  FaClipboardList,
  FaHome,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import logo from "../assets/Logo.png";

const leerUsuario = () => {
  try {
    const datos = JSON.parse(localStorage.getItem("usuario") || "null");

    return datos && typeof datos === "object" ? datos : null;
  } catch (error) {
    console.error("Error leyendo usuario:", error);
    return null;
  }
};

const obtenerClienteId = (usuarioActual = null) => {
  const datos = usuarioActual || leerUsuario();

  const idUsuario =
    datos?.id ||
    datos?.usuarioId ||
    datos?.clienteId ||
    datos?.usuario?.id ||
    datos?.data?.id;

  if (Number.isInteger(Number(idUsuario)) && Number(idUsuario) > 0) {
    return Number(idUsuario);
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const partes = token.split(".");

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
    console.error("Error obteniendo cliente desde token:", error);
  }

  return null;
};

const obtenerClaveCarrito = (usuarioActual = null) => {
  const clienteId = obtenerClienteId(usuarioActual);

  return clienteId ? `carrito_cliente_${clienteId}` : null;
};

const obtenerCantidadCarrito = (usuarioActual = null) => {
  try {
    const clave = obtenerClaveCarrito(usuarioActual);

    if (!clave) {
      return 0;
    }

    const carrito = JSON.parse(localStorage.getItem(clave) || "[]");

    if (!Array.isArray(carrito)) {
      return 0;
    }

    return carrito.reduce((acumulado, producto) => {
      const unidades = Number(producto?.cantidad || 0);

      return acumulado + (unidades > 0 ? unidades : 0);
    }, 0);
  } catch (error) {
    console.error("Error actualizando contador del carrito:", error);
    return 0;
  }
};

const enlaces = [
  {
    ruta: "/cliente",
    nombre: "Inicio",
    icono: <FaHome />,
  },
  {
    ruta: "/cliente/productos",
    nombre: "Productos",
    icono: <FaBoxOpen />,
  },
  {
    ruta: "/cliente/compras",
    nombre: "Compras",
    icono: <FaClipboardList />,
  },
  {
    ruta: "/cliente/direcciones",
    nombre: "Direcciones",
    icono: <FaMapMarkerAlt />,
  },
];

export default function ClienteNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(leerUsuario);
  const [cantidad, setCantidad] = useState(() =>
    obtenerCantidadCarrito(leerUsuario()),
  );
  const [esMovil, setEsMovil] = useState(() => window.innerWidth <= 900);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const manejarTamano = () => {
      const movil = window.innerWidth <= 900;

      setEsMovil(movil);

      if (!movil) {
        setMenuAbierto(false);
      }
    };

    window.addEventListener("resize", manejarTamano);

    return () => {
      window.removeEventListener("resize", manejarTamano);
    };
  }, []);

  useEffect(() => {
    const actualizarDatos = (event) => {
      const usuarioActual = leerUsuario();
      const claveActual = obtenerClaveCarrito(usuarioActual);

      if (event?.type === "carritoActualizado") {
        const claveEvento =
          event?.detail?.clave || event?.detail?.claveCarrito || null;

        if (claveEvento && claveActual && claveEvento !== claveActual) {
          return;
        }
      }

      setUsuario(usuarioActual);
      setCantidad(obtenerCantidadCarrito(usuarioActual));
    };

    const manejarStorage = (event) => {
      const usuarioActual = leerUsuario();
      const claveActual = obtenerClaveCarrito(usuarioActual);

      if (
        event.key === claveActual ||
        event.key === "usuario" ||
        event.key === "token"
      ) {
        setUsuario(usuarioActual);
        setCantidad(obtenerCantidadCarrito(usuarioActual));
      }
    };

    window.addEventListener("carritoActualizado", actualizarDatos);
    window.addEventListener("storage", manejarStorage);

    return () => {
      window.removeEventListener("carritoActualizado", actualizarDatos);
      window.removeEventListener("storage", manejarStorage);
    };
  }, []);

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("redirectAfterLogin");

    setUsuario(null);
    setCantidad(0);
    setMenuAbierto(false);

    navigate("/", { replace: true });
  };

  const rutaActiva = (ruta) => {
    if (ruta === "/cliente") {
      return location.pathname === ruta;
    }

    return location.pathname.startsWith(ruta);
  };

  const estiloEnlace = (ruta) => ({
    ...styles.link,
    ...(esMovil ? styles.linkMovil : {}),
    color: rutaActiva(ruta) ? "#fff" : "#cbd5e1",
    background: rutaActiva(ruta)
      ? "linear-gradient(135deg, #7c3aed, #3b82f6)"
      : "transparent",
    boxShadow: rutaActiva(ruta) ? "0 8px 20px rgba(124,58,237,0.35)" : "none",
  });

  const carritoActivo = location.pathname.startsWith("/cliente/carrito");
  const nombre = usuario?.nombre || "Cliente";

  return (
    <nav style={{ ...styles.nav, ...(esMovil ? styles.navMovil : {}) }}>
      <div style={styles.barraPrincipal}>
        <Link to="/cliente" style={styles.logoContainer} onClick={cerrarMenu}>
          <img
            src={logo}
            alt="ModaGest Pro"
            style={{
              ...styles.logoImage,
              ...(esMovil ? styles.logoImageMovil : {}),
            }}
          />

          <div>
            <h2
              style={{
                ...styles.logo,
                ...(esMovil ? styles.logoMovil : {}),
              }}
            >
              ModaGest Pro
            </h2>
            <p style={styles.logoSub}>Panel Cliente</p>
          </div>
        </Link>

        {esMovil && (
          <div style={styles.controlesMoviles}>
            <Link
              to="/cliente/carrito"
              onClick={cerrarMenu}
              style={{
                ...styles.cart,
                ...(carritoActivo ? styles.cartActive : {}),
              }}
              aria-label="Carrito de compras"
            >
              <FaShoppingCart />

              {cantidad > 0 && (
                <span style={styles.badge}>
                  {cantidad > 99 ? "99+" : cantidad}
                </span>
              )}
            </Link>

            <button
              type="button"
              style={styles.botonMenu}
              onClick={() => setMenuAbierto((abierto) => !abierto)}
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuAbierto}
              aria-controls="menu-cliente-movil"
            >
              {menuAbierto ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        )}

        {!esMovil && (
          <div style={styles.links}>
            {enlaces.map((enlace) => (
              <Link
                key={enlace.ruta}
                to={enlace.ruta}
                style={estiloEnlace(enlace.ruta)}
              >
                {enlace.icono}
                <span>{enlace.nombre}</span>
              </Link>
            ))}

            <Link
              to="/cliente/carrito"
              style={{
                ...styles.cart,
                ...(carritoActivo ? styles.cartActive : {}),
              }}
              aria-label="Carrito de compras"
            >
              <FaShoppingCart />

              {cantidad > 0 && (
                <span style={styles.badge}>
                  {cantidad > 99 ? "99+" : cantidad}
                </span>
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
        )}
      </div>

      {esMovil && menuAbierto && (
        <div id="menu-cliente-movil" style={styles.menuMovil}>
          <div style={styles.usuarioMovil}>
            <div style={styles.avatar}>
              <FaUserCircle />
            </div>

            <div>
              <p style={styles.userLabel}>Bienvenido</p>
              <strong style={styles.userName}>{nombre}</strong>
            </div>
          </div>

          {enlaces.map((enlace) => (
            <Link
              key={enlace.ruta}
              to={enlace.ruta}
              onClick={cerrarMenu}
              style={estiloEnlace(enlace.ruta)}
            >
              {enlace.icono}
              <span>{enlace.nombre}</span>
            </Link>
          ))}

          <button
            type="button"
            onClick={cerrarSesion}
            style={{ ...styles.logoutBtn, ...styles.logoutMovil }}
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt />
            <span>Salir</span>
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    padding: "14px 32px",
    background: "rgba(15,23,42,0.95)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  navMovil: {
    padding: "10px 16px",
  },
  barraPrincipal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
    textDecoration: "none",
  },
  logoImage: {
    width: "62px",
    height: "62px",
    objectFit: "cover",
    borderRadius: "16px",
    transform: "scale(1.08)",
    filter: "drop-shadow(0 0 12px rgba(168,85,247,0.5))",
  },
  logoImageMovil: {
    width: "48px",
    height: "48px",
  },
  logo: {
    margin: 0,
    color: "#fff",
    fontSize: "22px",
    fontWeight: "700",
  },
  logoMovil: {
    fontSize: "17px",
  },
  logoSub: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
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
  linkMovil: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 15px",
  },
  controlesMoviles: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  botonMenu: {
    width: "44px",
    height: "44px",
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "13px",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
  cart: {
    position: "relative",
    width: "46px",
    height: "46px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "13px",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    textDecoration: "none",
  },
  cartActive: {
    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
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
    color: "#fff",
    fontSize: "11px",
    fontWeight: "700",
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
  usuarioMovil: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    marginBottom: "4px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  avatar: {
    width: "40px",
    height: "40px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
    color: "#fff",
    fontSize: "19px",
  },
  userLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "11px",
  },
  userName: {
    color: "#fff",
    fontSize: "14px",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 15px",
    border: "none",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 7px 18px rgba(239,68,68,0.28)",
  },
  logoutMovil: {
    width: "100%",
    justifyContent: "center",
    marginTop: "4px",
  },
  menuMovil: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: "12px",
    padding: "12px",
    borderRadius: "18px",
    background: "rgba(17,24,39,0.98)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
  },
};
