import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/Logo.png";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cantidad, setCantidad] = useState(0);
  const [sesionActualizada, setSesionActualizada] = useState(0);

  const token = localStorage.getItem("token");
  const rol = (localStorage.getItem("rol") || "").toLowerCase().trim();

  let usuario = null;

  try {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
      usuario = JSON.parse(usuarioGuardado);
    }
  } catch {
    usuario = null;
  }

  const nombre = usuario?.nombre || "";

  const obtenerClienteId = () => {
    if (rol !== "cliente") {
      return null;
    }

    const idUsuario =
      usuario?.id ||
      usuario?.usuarioId ||
      usuario?.clienteId ||
      usuario?.usuario?.id ||
      usuario?.data?.id ||
      null;

    if (idUsuario) {
      const id = Number(idUsuario);

      if (Number.isInteger(id) && id > 0) {
        return id;
      }
    }

    if (!token) {
      return null;
    }

    try {
      const partes = token.split(".");

      if (partes.length < 2) {
        return null;
      }

      const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");

      const padding = base64.length % 4;
      const base64Completo =
        padding === 0 ? base64 : base64 + "=".repeat(4 - padding);

      const payload = JSON.parse(atob(base64Completo));

      const id =
        payload.id ||
        payload.usuarioId ||
        payload.clienteId ||
        payload.userId ||
        payload.sub ||
        null;

      const clienteId = Number(id);

      if (Number.isInteger(clienteId) && clienteId > 0) {
        return clienteId;
      }
    } catch {
      return null;
    }

    return null;
  };

  const clienteId = obtenerClienteId();

  const claveCarrito =
    rol === "cliente" && clienteId
      ? `carrito_cliente_${clienteId}`
      : "carrito_publico";

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

  const obtenerCarrito = (clave) => {
    try {
      const carrito = JSON.parse(localStorage.getItem(clave) || "[]");

      return Array.isArray(carrito) ? carrito : [];
    } catch {
      return [];
    }
  };

  const obtenerCantidadCarrito = (clave) => {
    const carrito = obtenerCarrito(clave);

    return carrito.reduce(
      (total, producto) => total + Number(producto.cantidad || 0),
      0,
    );
  };

  const actualizarCantidad = () => {
    if (!claveCarrito) {
      setCantidad(0);
      return;
    }

    setCantidad(obtenerCantidadCarrito(claveCarrito));
  };

  const migrarCarritoPublico = (idCliente) => {
    if (!idCliente) {
      return;
    }

    const carritoPublico = obtenerCarrito("carrito_publico");

    if (carritoPublico.length === 0) {
      return;
    }

    const claveCliente = `carrito_cliente_${idCliente}`;
    const carritoCliente = obtenerCarrito(claveCliente);

    const carritoFinal = [...carritoCliente];

    carritoPublico.forEach((productoPublico) => {
      const productoExistente = carritoFinal.find(
        (producto) => Number(producto.id) === Number(productoPublico.id),
      );

      if (productoExistente) {
        productoExistente.cantidad =
          Number(productoExistente.cantidad || 0) +
          Number(productoPublico.cantidad || 0);
      } else {
        carritoFinal.push(productoPublico);
      }
    });

    localStorage.setItem(claveCliente, JSON.stringify(carritoFinal));
    localStorage.removeItem("carrito_publico");

    window.dispatchEvent(
      new CustomEvent("carritoActualizado", {
        detail: {
          clave: claveCliente,
          carrito: carritoFinal,
        },
      }),
    );
  };

  useEffect(() => {
    if (rol === "cliente" && clienteId) {
      migrarCarritoPublico(clienteId);
    }

    actualizarCantidad();
  }, [clienteId, rol, sesionActualizada]);

  useEffect(() => {
    const manejarCarritoActualizado = (event) => {
      const claveEvento = event?.detail?.clave;

      if (claveEvento === claveCarrito) {
        const carritoEvento = event?.detail?.carrito;

        if (Array.isArray(carritoEvento)) {
          const total = carritoEvento.reduce(
            (acumulado, producto) => acumulado + Number(producto.cantidad || 0),
            0,
          );

          setCantidad(total);
          return;
        }

        actualizarCantidad();
        return;
      }

      if (claveEvento === "carrito_publico" && rol === "cliente" && clienteId) {
        return;
      }

      if (!claveEvento) {
        actualizarCantidad();
      }
    };

    const manejarStorage = (event) => {
      if (event.key === claveCarrito) {
        actualizarCantidad();
      }

      if (event.key === "carrito_publico" && rol !== "cliente") {
        actualizarCantidad();
      }
    };

    window.addEventListener("carritoActualizado", manejarCarritoActualizado);

    window.addEventListener("storage", manejarStorage);

    return () => {
      window.removeEventListener(
        "carritoActualizado",
        manejarCarritoActualizado,
      );

      window.removeEventListener("storage", manejarStorage);
    };
  }, [claveCarrito, clienteId, rol]);

  useEffect(() => {
    const manejarCambioSesion = () => {
      setSesionActualizada((prev) => prev + 1);
    };

    window.addEventListener("usuarioActualizado", manejarCambioSesion);
    window.addEventListener("storage", manejarCambioSesion);

    return () => {
      window.removeEventListener("usuarioActualizado", manejarCambioSesion);
      window.removeEventListener("storage", manejarCambioSesion);
    };
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");

    const cantidadPublica = obtenerCantidadCarrito("carrito_publico");

    setCantidad(cantidadPublica);

    window.dispatchEvent(new CustomEvent("usuarioActualizado"));

    navigate("/", {
      replace: true,
    });
  };

  const irAlCarrito = () => {
    navigate("/cliente/carrito");
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#a855f7" : "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    transition: "0.3s",
  });

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer} onClick={() => navigate(rutaInicio())}>
        <img src={logo} alt="ModaGest Pro" style={styles.logoImage} />

        <h2 style={styles.logoText}>ModaGest Pro</h2>
      </div>

      <div style={styles.menu}>
        <Link to={rutaInicio()} style={linkStyle(rutaInicio())}>
          Inicio
        </Link>

        <Link to={rutaProductos()} style={linkStyle(rutaProductos())}>
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

          {cantidad > 0 && <span style={styles.badge}>{cantidad}</span>}
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
    background: "rgba(5, 5, 15, 0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
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
    color: "#fff",
    margin: 0,
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
    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
    color: "#fff",
    borderRadius: "50%",
    minWidth: "20px",
    height: "20px",
    padding: "0 4px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "bold",
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#fff",
    background: "rgba(255,255,255,0.06)",
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "600",
  },

  loginBtn: {
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(168,85,247,0.3)",
  },

  logoutBtn: {
    background: "rgba(239,68,68,0.15)",
    color: "#ef4444",
    border: "1px solid rgba(239,68,68,0.4)",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
