import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import logo from "../assets/Logo.png";

const leerUsuario = () => {
  try {
    const datos = JSON.parse(localStorage.getItem("usuario") || "null");
    return datos && typeof datos === "object" ? datos : null;
  } catch {
    return null;
  }
};

const leerSesion = () => ({
  token: localStorage.getItem("token"),
  rol: (localStorage.getItem("rol") || "").trim().toLowerCase(),
  usuario: leerUsuario(),
});

const obtenerClienteId = (sesion) => {
  if (sesion.rol !== "cliente") {
    return null;
  }

  const idUsuario =
    sesion.usuario?.id ||
    sesion.usuario?.usuarioId ||
    sesion.usuario?.clienteId ||
    sesion.usuario?.usuario?.id ||
    sesion.usuario?.data?.id;

  if (Number.isInteger(Number(idUsuario)) && Number(idUsuario) > 0) {
    return Number(idUsuario);
  }

  if (!sesion.token) {
    return null;
  }

  try {
    const partes = sesion.token.split(".");

    if (partes.length < 2) {
      return null;
    }

    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4;
    const base64Completo =
      padding === 0 ? base64 : base64 + "=".repeat(4 - padding);
    const payload = JSON.parse(atob(base64Completo));
    const idToken =
      payload?.id ||
      payload?.usuarioId ||
      payload?.clienteId ||
      payload?.userId ||
      payload?.sub;

    if (Number.isInteger(Number(idToken)) && Number(idToken) > 0) {
      return Number(idToken);
    }
  } catch {
    return null;
  }

  return null;
};

const obtenerClaveCarrito = (sesion) => {
  const clienteId = obtenerClienteId(sesion);

  return sesion.rol === "cliente" && clienteId
    ? `carrito_cliente_${clienteId}`
    : "carrito_publico";
};

const obtenerCarrito = (clave) => {
  try {
    const carrito = JSON.parse(localStorage.getItem(clave) || "[]");
    return Array.isArray(carrito) ? carrito : [];
  } catch {
    return [];
  }
};

const obtenerCantidadCarrito = (clave) =>
  obtenerCarrito(clave).reduce((total, producto) => {
    const cantidad = Number(producto?.cantidad || 0);
    return total + (cantidad > 0 ? cantidad : 0);
  }, 0);

const migrarCarritoPublico = (clienteId) => {
  if (!clienteId) {
    return;
  }

  const carritoPublico = obtenerCarrito("carrito_publico");

  if (carritoPublico.length === 0) {
    return;
  }

  const claveCliente = `carrito_cliente_${clienteId}`;
  const carritoCliente = obtenerCarrito(claveCliente);
  const carritoFinal = carritoCliente.map((producto) => ({ ...producto }));

  carritoPublico.forEach((productoPublico) => {
    const indice = carritoFinal.findIndex(
      (producto) => Number(producto.id) === Number(productoPublico.id),
    );

    if (indice >= 0) {
      carritoFinal[indice] = {
        ...carritoFinal[indice],
        cantidad:
          Number(carritoFinal[indice].cantidad || 0) +
          Number(productoPublico.cantidad || 0),
      };
    } else {
      carritoFinal.push({ ...productoPublico });
    }
  });

  localStorage.setItem(claveCliente, JSON.stringify(carritoFinal));
  localStorage.removeItem("carrito_publico");

  window.dispatchEvent(
    new CustomEvent("carritoActualizado", {
      detail: {
        clave: claveCliente,
        claveCarrito: claveCliente,
        clienteId,
        carrito: carritoFinal,
      },
    }),
  );
};

const obtenerEstadoInicial = () => {
  const sesion = leerSesion();
  const clienteId = obtenerClienteId(sesion);

  if (sesion.rol === "cliente" && clienteId) {
    migrarCarritoPublico(clienteId);
  }

  return {
    sesion,
    cantidad: obtenerCantidadCarrito(obtenerClaveCarrito(sesion)),
  };
};

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [estadoInicial] = useState(obtenerEstadoInicial);
  const [sesion, setSesion] = useState(estadoInicial.sesion);
  const [cantidad, setCantidad] = useState(estadoInicial.cantidad);
  const [esMovil, setEsMovil] = useState(() => window.innerWidth <= 820);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const { token, rol, usuario } = sesion;
  const nombre = usuario?.nombre || "Usuario";

  useEffect(() => {
    const manejarTamano = () => {
      const vistaMovil = window.innerWidth <= 820;
      setEsMovil(vistaMovil);

      if (!vistaMovil) {
        setMenuAbierto(false);
      }
    };

    window.addEventListener("resize", manejarTamano);
    return () => window.removeEventListener("resize", manejarTamano);
  }, []);

  useEffect(() => {
    const actualizarSesion = () => {
      const nuevaSesion = leerSesion();
      const nuevoClienteId = obtenerClienteId(nuevaSesion);

      if (nuevaSesion.rol === "cliente" && nuevoClienteId) {
        migrarCarritoPublico(nuevoClienteId);
      }

      setSesion(nuevaSesion);
      setCantidad(obtenerCantidadCarrito(obtenerClaveCarrito(nuevaSesion)));
    };

    const manejarCarritoActualizado = (event) => {
      const sesionActual = leerSesion();
      const claveActual = obtenerClaveCarrito(sesionActual);
      const claveEvento =
        event?.detail?.clave || event?.detail?.claveCarrito || null;

      if (claveEvento && claveEvento !== claveActual) {
        return;
      }

      const carritoEvento = event?.detail?.carrito;

      if (Array.isArray(carritoEvento)) {
        const total = carritoEvento.reduce((acumulado, producto) => {
          const unidades = Number(producto?.cantidad || 0);
          return acumulado + (unidades > 0 ? unidades : 0);
        }, 0);

        setCantidad(total);
        return;
      }

      setCantidad(obtenerCantidadCarrito(claveActual));
    };

    const manejarStorage = (event) => {
      if (["token", "rol", "usuario"].includes(event.key)) {
        actualizarSesion();
        return;
      }

      const sesionActual = leerSesion();
      const claveActual = obtenerClaveCarrito(sesionActual);

      if (event.key === claveActual || event.key === "carrito_publico") {
        setCantidad(obtenerCantidadCarrito(claveActual));
      }
    };

    window.addEventListener("usuarioActualizado", actualizarSesion);
    window.addEventListener("authActualizado", actualizarSesion);
    window.addEventListener("carritoActualizado", manejarCarritoActualizado);
    window.addEventListener("storage", manejarStorage);

    return () => {
      window.removeEventListener("usuarioActualizado", actualizarSesion);
      window.removeEventListener("authActualizado", actualizarSesion);
      window.removeEventListener(
        "carritoActualizado",
        manejarCarritoActualizado,
      );
      window.removeEventListener("storage", manejarStorage);
    };
  }, []);

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

  const volverAlInicioPublico = () => {
    navigate("/");
    setMenuAbierto(false);

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const irAInicio = (event) => {
    setMenuAbierto(false);

    if (rol) {
      return;
    }

    event.preventDefault();
    volverAlInicioPublico();
  };

  const irAProductos = (event) => {
    setMenuAbierto(false);

    if (rol || location.pathname !== "/") {
      return;
    }

    const seccionProductos = document.getElementById("productos");

    if (!seccionProductos) {
      return;
    }

    event.preventDefault();
    window.history.replaceState(null, "", "#productos");
    seccionProductos.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("redirectAfterLogin");

    const nuevaSesion = leerSesion();
    setSesion(nuevaSesion);
    setCantidad(obtenerCantidadCarrito("carrito_publico"));
    setMenuAbierto(false);

    window.dispatchEvent(new CustomEvent("usuarioActualizado"));
    window.dispatchEvent(new CustomEvent("authActualizado"));
    navigate("/", { replace: true });
  };

  const irAlCarrito = () => {
    setMenuAbierto(false);
    navigate("/cliente/carrito");
  };

  const linkStyle = (ruta, movil = false) => ({
    ...(movil ? styles.mobileLink : styles.link),
    color: location.pathname === ruta ? "#c084fc" : "#ffffff",
  });

  return (
    <nav style={{ ...styles.nav, ...(esMovil ? styles.navMovil : {}) }}>
      <div style={styles.mainRow}>
        <button
          type="button"
          style={styles.logoContainer}
          onClick={() => {
            setMenuAbierto(false);

            if (rol) {
              navigate(rutaInicio());
              return;
            }

            volverAlInicioPublico();
          }}
          aria-label="Ir al inicio"
        >
          <img
            src={logo}
            alt="ModaGest Pro"
            style={{ ...styles.logoImage, ...(esMovil ? styles.logoImageMovil : {}) }}
          />
          <h2
            style={{ ...styles.logoText, ...(esMovil ? styles.logoTextMovil : {}) }}
          >
            ModaGest Pro
          </h2>
        </button>

        {!esMovil && (
          <div style={styles.menu}>
            <Link
              to={rutaInicio()}
              style={linkStyle(rutaInicio())}
              onClick={irAInicio}
            >
              Inicio
            </Link>
            <Link
              to={rutaProductos()}
              style={linkStyle(rutaProductos())}
              onClick={irAProductos}
            >
              Productos
            </Link>
          </div>
        )}

        <div style={{ ...styles.right, ...(esMovil ? styles.rightMovil : {}) }}>
          <button
            type="button"
            style={styles.cart}
            onClick={irAlCarrito}
            aria-label="Ver carrito"
          >
            <FaShoppingCart size={esMovil ? 18 : 20} />
            {cantidad > 0 && (
              <span style={styles.badge}>
                {cantidad > 99 ? "99+" : cantidad}
              </span>
            )}
          </button>

          {!esMovil && token && (
            <div style={styles.userBox}>
              <FaUser />
              <span>{nombre}</span>
            </div>
          )}

          {!token ? (
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                ...styles.loginBtn,
                ...(esMovil ? styles.sessionBtnMovil : {}),
              }}
              aria-label="Iniciar sesión"
            >
              {esMovil && <FaSignInAlt />}
              <span>{esMovil ? "Entrar" : "Iniciar sesión"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={cerrarSesion}
              style={{
                ...styles.logoutBtn,
                ...(esMovil ? styles.sessionBtnMovil : {}),
              }}
              aria-label="Cerrar sesión"
            >
              {esMovil && <FaSignOutAlt />}
              <span>{esMovil ? "Salir" : "Cerrar sesión"}</span>
            </button>
          )}

          {esMovil && (
            <button
              type="button"
              style={styles.menuBtn}
              onClick={() => setMenuAbierto((abierto) => !abierto)}
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuAbierto}
            >
              {menuAbierto ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>
      </div>

      {esMovil && menuAbierto && (
        <div style={styles.mobileMenu}>
          {token && (
            <div style={styles.mobileUser}>
              <FaUser />
              <span>{nombre}</span>
            </div>
          )}
          <Link
            to={rutaInicio()}
            style={linkStyle(rutaInicio(), true)}
            onClick={irAInicio}
          >
            Inicio
          </Link>
          <Link
            to={rutaProductos()}
            style={linkStyle(rutaProductos(), true)}
            onClick={irAProductos}
          >
            Productos
          </Link>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 32px",
    background: "rgba(5,5,15,0.94)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 8px 28px rgba(0,0,0,0.22)",
  },
  navMovil: {
    padding: "9px 12px",
  },
  mainRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
  },
  logoContainer: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
  },
  logoImage: {
    width: "62px",
    height: "62px",
    flexShrink: 0,
    objectFit: "cover",
    borderRadius: "16px",
    filter: "drop-shadow(0 0 10px rgba(168,85,247,0.5))",
  },
  logoImageMovil: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
  },
  logoText: {
    margin: 0,
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    whiteSpace: "nowrap",
  },
  logoTextMovil: {
    maxWidth: "82px",
    fontSize: "16px",
    lineHeight: 1.1,
    whiteSpace: "normal",
  },
  menu: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },
  link: {
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    transition: "color 0.25s ease",
  },
  right: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "14px",
  },
  rightMovil: {
    gap: "6px",
  },
  cart: {
    position: "relative",
    width: "38px",
    height: "38px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#ffffff",
    cursor: "pointer",
  },
  badge: {
    position: "absolute",
    top: "-3px",
    right: "-3px",
    minWidth: "18px",
    height: "18px",
    padding: "0 4px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: "700",
  },
  userBox: {
    maxWidth: "180px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  loginBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "11px 16px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(168,85,247,0.3)",
    whiteSpace: "nowrap",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "11px 16px",
    border: "1px solid rgba(239,68,68,0.4)",
    borderRadius: "12px",
    background: "rgba(239,68,68,0.15)",
    color: "#f87171",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  sessionBtnMovil: {
    minWidth: "auto",
    padding: "9px 10px",
    borderRadius: "10px",
    fontSize: "12px",
  },
  menuBtn: {
    width: "38px",
    height: "38px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    fontSize: "17px",
    cursor: "pointer",
  },
  mobileMenu: {
    display: "grid",
    gap: "8px",
    marginTop: "9px",
    paddingTop: "9px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  mobileUser: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.06)",
    color: "#d8b4fe",
    fontSize: "13px",
    fontWeight: "600",
  },
  mobileLink: {
    display: "flex",
    alignItems: "center",
    minHeight: "42px",
    padding: "0 13px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
};
