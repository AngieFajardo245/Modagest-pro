import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBoxOpen,
  FaCashRegister,
  FaChartLine,
  FaClipboardList,
  FaSignOutAlt,
  FaTimes,
  FaUserTie,
} from "react-icons/fa";

const enlaces = [
  {
    ruta: "/empleado",
    texto: "Dashboard",
    icono: <FaChartLine />,
  },
  {
    ruta: "/empleado/productos",
    texto: "Productos",
    icono: <FaBoxOpen />,
  },
  {
    ruta: "/empleado/registrar-venta",
    texto: "Registrar venta",
    icono: <FaCashRegister />,
  },
  {
    ruta: "/empleado/ventas",
    texto: "Historial",
    icono: <FaClipboardList />,
  },
];

export default function EmpleadoNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [esMovil, setEsMovil] = useState(() => window.innerWidth <= 1050);
  const [menuAbierto, setMenuAbierto] = useState(false);

  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    usuario = null;
  }

  const nombre = usuario?.nombre || "Empleado";

  useEffect(() => {
    const manejarTamano = () => {
      const movil = window.innerWidth <= 1050;

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

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("redirectAfterLogin");

    navigate("/login", {
      replace: true,
    });
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  const linkStyle = (ruta) => {
    const activo = location.pathname === ruta;

    return {
      ...styles.link,
      ...(esMovil ? styles.linkMovil : {}),
      background: activo
        ? "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(37,99,235,0.95))"
        : "transparent",
      border: activo
        ? "1px solid rgba(255,255,255,0.15)"
        : "1px solid transparent",
      color: activo ? "#ffffff" : "#cbd5e1",
      boxShadow: activo ? "0 8px 20px rgba(124,58,237,0.3)" : "none",
    };
  };

  return (
    <nav
      style={{
        ...styles.nav,
        ...(esMovil ? styles.navMovil : {}),
      }}
    >
      <div style={styles.mainBar}>
        <Link to="/empleado" style={styles.logoContainer} onClick={cerrarMenu}>
          <div style={styles.logoIcon}>👨‍💼</div>

          <div>
            <h2 style={styles.logo}>ModaGest Pro</h2>
            <p style={styles.logoSub}>Panel Empleado</p>
          </div>
        </Link>

        {!esMovil && (
          <>
            <div style={styles.linksContainer}>
              {enlaces.map((enlace) => (
                <Link
                  key={enlace.ruta}
                  to={enlace.ruta}
                  style={linkStyle(enlace.ruta)}
                >
                  {enlace.icono}
                  <span>{enlace.texto}</span>
                </Link>
              ))}
            </div>

            <div style={styles.rightSection}>
              <div style={styles.userBox}>
                <FaUserTie />
                <span>{nombre}</span>
              </div>

              <button
                type="button"
                onClick={cerrarSesion}
                style={styles.logoutBtn}
              >
                <FaSignOutAlt />
                <span>Salir</span>
              </button>
            </div>
          </>
        )}

        {esMovil && (
          <button
            type="button"
            style={styles.menuButton}
            onClick={() => setMenuAbierto((estadoActual) => !estadoActual)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {esMovil && menuAbierto && (
        <div style={styles.mobileMenu}>
          <div style={styles.mobileUser}>
            <div style={styles.mobileAvatar}>
              <FaUserTie />
            </div>

            <div>
              <span style={styles.userLabel}>Empleado</span>
              <strong style={styles.userName}>{nombre}</strong>
            </div>
          </div>

          {enlaces.map((enlace) => (
            <Link
              key={enlace.ruta}
              to={enlace.ruta}
              style={linkStyle(enlace.ruta)}
              onClick={cerrarMenu}
            >
              {enlace.icono}
              <span>{enlace.texto}</span>
            </Link>
          ))}

          <button
            type="button"
            onClick={cerrarSesion}
            style={{
              ...styles.logoutBtn,
              ...styles.mobileLogout,
            }}
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
    padding: "14px 30px",
    background: "rgba(15,23,42,0.95)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
  },
  navMovil: {
    padding: "11px 16px",
  },
  mainBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    flexShrink: 0,
    textDecoration: "none",
  },
  logoIcon: {
    width: "50px",
    height: "50px",
    display: "grid",
    placeItems: "center",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    boxShadow: "0 6px 20px rgba(124,58,237,0.45)",
    fontSize: "24px",
  },
  logo: {
    margin: 0,
    color: "#ffffff",
    fontSize: "21px",
    fontWeight: "800",
  },
  logoSub: {
    margin: "2px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },
  linksContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 13px",
    borderRadius: "13px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "700",
    transition: "all 0.25s ease",
  },
  linkMovil: {
    width: "100%",
    boxSizing: "border-box",
    justifyContent: "flex-start",
    padding: "13px 15px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "11px 14px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.06)",
    color: "#e2e8f0",
    fontSize: "13px",
    fontWeight: "600",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 14px",
    border: "none",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    boxShadow: "0 6px 18px rgba(239,68,68,0.35)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  menuButton: {
    width: "44px",
    height: "44px",
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "13px",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    fontSize: "18px",
    cursor: "pointer",
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: "12px",
    padding: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    background: "rgba(17,24,39,0.98)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
  },
  mobileUser: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    marginBottom: "4px",
    padding: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.05)",
  },
  mobileAvatar: {
    width: "40px",
    height: "40px",
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    color: "#ffffff",
  },
  userLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "11px",
  },
  userName: {
    display: "block",
    marginTop: "2px",
    color: "#ffffff",
    fontSize: "14px",
  },
  mobileLogout: {
    width: "100%",
    marginTop: "4px",
    padding: "13px",
  },
};
