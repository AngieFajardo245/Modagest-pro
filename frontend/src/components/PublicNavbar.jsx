import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
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

const obtenerCantidadCarrito = (clave) => {
  return obtenerCarrito(clave).reduce((total, producto) => {
    const cantidad = Number(producto?.cantidad || 0);

    return total + (cantidad > 0 ? cantidad : 0);
  }, 0);
};

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

  const claveCarrito = obtenerClaveCarrito(sesion);

  return {
    sesion,
    cantidad: obtenerCantidadCarrito(claveCarrito),
  };
};

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [estadoInicial] = useState(obtenerEstadoInicial);
  const [sesion, setSesion] = useState(estadoInicial.sesion);
  const [cantidad, setCantidad] = useState(estadoInicial.cantidad);

  const { token, rol, usuario } = sesion;
  const nombre = usuario?.nombre || "";

  useEffect(() => {
    const actualizarSesion = () => {
      const nuevaSesion = leerSesion();
      const nuevoClienteId = obtenerClienteId(nuevaSesion);

      if (nuevaSesion.rol === "cliente" && nuevoClienteId) {
        migrarCarritoPublico(nuevoClienteId);
      }

      const nuevaClave = obtenerClaveCarrito(nuevaSesion);

      setSesion(nuevaSesion);
      setCantidad(obtenerCantidadCarrito(nuevaClave));
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
      if (
        event.key === "token" ||
        event.key === "rol" ||
        event.key === "usuario"
      ) {
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

  const irAProductos = (event) => {
    if (rol || location.pathname !== "/") {
      return;
    }

    const seccionProductos = document.getElementById("productos");

    if (!seccionProductos) {
      return;
    }

    event.preventDefault();
    window.history.replaceState(null, "", "#productos");
    seccionProductos.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("redirectAfterLogin");

    const nuevaSesion = leerSesion();

    setSesion(nuevaSesion);
    setCantidad(obtenerCantidadCarrito("carrito_publico"));

    window.dispatchEvent(new CustomEvent("usuarioActualizado"));
    window.dispatchEvent(new CustomEvent("authActualizado"));

    navigate("/", { replace: true });
  };

  const irAlCarrito = () => {
    navigate("/cliente/carrito");
  };

  const linkStyle = (ruta) => ({
    color: location.pathname === ruta ? "#a855f7" : "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    transition: "0.3s",
  });

  return (
    <nav style={styles.nav}>
      <button
        type="button"
        style={styles.logoContainer}
        onClick={() => navigate(rutaInicio())}
        aria-label="Ir al inicio"
      >
        <img src={logo} alt="ModaGest Pro" style={styles.logoImage} />
        <h2 style={styles.logoText}>ModaGest Pro</h2>
      </button>

      <div style={styles.menu}>
        <Link to={rutaInicio()} style={linkStyle(rutaInicio())}>
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

      <div style={styles.right}>
        <button
          type="button"
          style={styles.cart}
          onClick={irAlCarrito}
          aria-label="Ver carrito"
        >
          <FaShoppingCart size={20} />

          {cantidad > 0 && (
            <span style={styles.badge}>{cantidad > 99 ? "99+" : cantidad}</span>
          )}
        </button>

        {token && (
          <div style={styles.userBox}>
            <FaUser />
            <span>{nombre}</span>
          </div>
        )}

        {!token ? (
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={styles.loginBtn}
          >
            Iniciar sesión
          </button>
        ) : (
          <button type="button" onClick={cerrarSesion} style={styles.logoutBtn}>
            Cerrar sesión
          </button>
        )}
      </div>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    background: "rgba(5,5,15,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
  },
  logoImage: {
    width: "78px",
    height: "78px",
    objectFit: "cover",
    borderRadius: "18px",
    background: "transparent",
    transform: "scale(1.35)",
    filter: "drop-shadow(0 0 12px rgba(168,85,247,0.55))",
  },
  logoText: {
    margin: 0,
    color: "#fff",
    fontSize: "36px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  menu: {
    display: "flex",
    gap: "30px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  cart: {
    position: "relative",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    minWidth: "20px",
    height: "20px",
    padding: "0 4px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "bold",
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600",
  },
  loginBtn: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(168,85,247,0.3)",
  },
  logoutBtn: {
    padding: "12px 18px",
    border: "1px solid rgba(239,68,68,0.4)",
    borderRadius: "12px",
    background: "rgba(239,68,68,0.15)",
    color: "#ef4444",
    fontWeight: "600",
    cursor: "pointer",
  },
};
