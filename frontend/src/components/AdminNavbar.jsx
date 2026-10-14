import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBoxOpen,
  FaChartLine,
  FaCrown,
  FaShoppingBag,
  FaSignOutAlt,
  FaTags,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

const enlaces = [
  { ruta: "/admin", texto: "Dashboard", icono: <FaChartLine /> },
  { ruta: "/admin/usuarios", texto: "Usuarios", icono: <FaUsers /> },
  { ruta: "/admin/productos", texto: "Productos", icono: <FaBoxOpen /> },
  { ruta: "/admin/categorias", texto: "Categorías", icono: <FaTags /> },
  { ruta: "/admin/ventas", texto: "Ventas", icono: <FaShoppingBag /> },
];

const obtenerUsuario = () => {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    return null;
  }
};

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [esMovil, setEsMovil] = useState(() => window.innerWidth <= 1100);
  const [menuOpen, setMenuOpen] = useState(false);

  const usuario = obtenerUsuario();
  const nombre = usuario?.nombre || "Administrador";

  useEffect(() => {
    const manejarTamano = () => {
      const vistaMovil = window.innerWidth <= 1100;

      setEsMovil(vistaMovil);

      if (!vistaMovil) {
        setMenuOpen(false);
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

    window.dispatchEvent(new CustomEvent("usuarioActualizado"));
    window.dispatchEvent(new CustomEvent("authActualizado"));

    navigate("/login", { replace: true });
  };

  const obtenerEstiloEnlace = (ruta, movil = false) => {
    const activo = location.pathname === ruta;

    return {
      ...(movil ? styles.mobileLink : styles.link),
      background: activo
        ? "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(37,99,235,0.35))"
        : movil
          ? "rgba(255,255,255,0.05)"
          : "transparent",
      border: activo
        ? "1px solid rgba(255,255,255,0.16)"
        : "1px solid transparent",
      color: activo ? "#ffffff" : "#cbd5e1",
      boxShadow: activo ? "0 10px 30px rgba(124,58,237,0.18)" : "none",
    };
  };

  const irAlPanel = () => {
    setMenuOpen(false);
    navigate("/admin");
  };

  return (
    <>
      <nav style={{ ...styles.nav, ...(esMovil ? styles.navMobile : {}) }}>
        <div style={styles.leftSection}>
          {esMovil && (
            <button
              type="button"
              style={styles.menuBtn}
              onClick={() => setMenuOpen((abierto) => !abierto)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}

          <button
            type="button"
            style={styles.logoContainer}
            onClick={irAlPanel}
            aria-label="Ir al panel administrativo"
          >
            <div style={styles.logoIcon}>
              <FaCrown />
            </div>

            <div style={styles.logoContent}>
              <h2
                style={{
                  ...styles.logo,
                  ...(esMovil ? styles.logoMobile : {}),
                }}
              >
                ModaGest Pro
              </h2>
              <p
                style={{
                  ...styles.logoSub,
                  ...(esMovil ? styles.logoSubMobile : {}),
                }}
              >
                Panel Administrativo
              </p>
            </div>
          </button>
        </div>

        {!esMovil && (
          <div style={styles.linksDesktop}>
            {enlaces.map((enlace) => (
              <Link
                key={enlace.ruta}
                to={enlace.ruta}
                style={obtenerEstiloEnlace(enlace.ruta)}
              >
                {enlace.icono}
                <span>{enlace.texto}</span>
              </Link>
            ))}
          </div>
        )}

        <div style={styles.rightSection}>
          {!esMovil && (
            <div style={styles.userBox}>
              <div style={styles.avatarGlow}>
                <div style={styles.avatar}>
                  {nombre.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <p style={styles.userLabel}>Administrador</p>
                <h4 style={styles.userName}>{nombre}</h4>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={cerrarSesion}
            style={{
              ...styles.logoutBtn,
              ...(esMovil ? styles.logoutBtnMobile : {}),
            }}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <FaSignOutAlt />
            {!esMovil && <span>Salir</span>}
          </button>
        </div>
      </nav>

      {esMovil && menuOpen && (
        <>
          <button
            type="button"
            style={styles.menuBackdrop}
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          />

          <div style={styles.mobileMenu}>
            <div style={styles.mobileUser}>
              <div style={styles.avatarGlow}>
                <div style={styles.avatar}>
                  {nombre.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <p style={styles.userLabel}>Administrador</p>
                <h4 style={styles.userName}>{nombre}</h4>
              </div>
            </div>

            <div style={styles.mobileLinks}>
              {enlaces.map((enlace) => (
                <Link
                  key={enlace.ruta}
                  to={enlace.ruta}
                  style={obtenerEstiloEnlace(enlace.ruta, true)}
                  onClick={() => setMenuOpen(false)}
                >
                  {enlace.icono}
                  <span>{enlace.texto}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    minHeight: "74px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    padding: "12px 30px",
    background: "rgba(15,23,42,0.92)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
  },
  navMobile: {
    minHeight: "70px",
    gap: "10px",
    padding: "10px 14px",
  },
  leftSection: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  menuBtn: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    padding: 0,
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.07)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "17px",
  },
  logoContainer: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
  },
  logoIcon: {
    width: "46px",
    height: "46px",
    flexShrink: 0,
    borderRadius: "14px",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "19px",
    boxShadow: "0 10px 30px rgba(124,58,237,0.35)",
  },
  logoContent: {
    minWidth: 0,
  },
  logo: {
    margin: 0,
    color: "#ffffff",
    fontSize: "21px",
    fontWeight: "800",
    letterSpacing: "0.3px",
    whiteSpace: "nowrap",
  },
  logoMobile: {
    fontSize: "15px",
  },
  logoSub: {
    margin: "2px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },
  logoSubMobile: {
    fontSize: "10px",
  },
  linksDesktop: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    padding: "10px 11px",
    borderRadius: "13px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "13px",
    whiteSpace: "nowrap",
    transition: "all 0.25s ease",
  },
  rightSection: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "7px 10px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    whiteSpace: "nowrap",
  },
  avatarGlow: {
    padding: "2px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "14px",
  },
  userLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "11px",
  },
  userName: {
    maxWidth: "180px",
    margin: 0,
    overflow: "hidden",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    padding: "10px 14px",
    border: "none",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#ffffff",
    boxShadow: "0 10px 25px rgba(239,68,68,0.25)",
    cursor: "pointer",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  logoutBtnMobile: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    padding: 0,
    borderRadius: "12px",
  },
  menuBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 998,
    padding: 0,
    border: "none",
    background: "rgba(2,6,23,0.65)",
    backdropFilter: "blur(3px)",
    cursor: "default",
  },
  mobileMenu: {
    position: "fixed",
    top: "70px",
    left: "12px",
    right: "12px",
    zIndex: 999,
    maxHeight: "calc(100vh - 84px)",
    boxSizing: "border-box",
    overflowY: "auto",
    padding: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "18px",
    background: "rgba(15,23,42,0.98)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
  },
  mobileUser: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
    padding: "12px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  mobileLinks: {
    display: "grid",
    gap: "8px",
  },
  mobileLink: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "13px 14px",
    borderRadius: "13px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "650",
  },
};
