import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaShoppingBag,
  FaClipboardList,
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa";

function Navbar() {

  const navigate = useNavigate();

  const location = useLocation();

  const token =
    localStorage.getItem("token");

  const rol =
    localStorage.getItem("rol");

  let usuario = null;

  try {

    usuario = JSON.parse(
      localStorage.getItem("usuario")
    );

  } catch {

    usuario = null;

  }

  const nombre =
    usuario?.nombre || "Usuario";

  /* ================= LOGOUT ================= */

  const logout = () => {

    localStorage.clear();

    navigate("/");

  };

  /* ================= ACTIVE STYLE ================= */

  const linkStyle = (path) => ({

    ...styles.link,

    background:
      location.pathname === path
        ? "rgba(124,58,237,0.25)"
        : "transparent",

    border:
      location.pathname === path
        ? "1px solid rgba(168,85,247,0.35)"
        : "1px solid transparent",

    color:
      location.pathname === path
        ? "#ffffff"
        : "#cbd5e1"

  });

  return (

    <nav style={styles.navbar}>

      {/* ================= LOGO ================= */}

      <div
        style={styles.logoContainer}
        onClick={() => navigate("/")}
      >

        <div style={styles.logoIcon}>
          M
        </div>

        <div>

          <h2 style={styles.logoText}>
            ModaGest Pro
          </h2>

          <p style={styles.logoSub}>
            Dashboard Premium
          </p>

        </div>

      </div>

      {/* ================= MENU ================= */}

      <div style={styles.menu}>

        {/* ================= PUBLICO ================= */}

        {!token && (

          <Link
            to="/login"
            style={linkStyle("/login")}
          >

            <FaUserCircle />

            Iniciar sesión

          </Link>

        )}

        {/* ================= ADMIN ================= */}

        {token &&
          rol === "administrador" && (

          <>

            <Link
              to="/admin"
              style={linkStyle("/admin")}
            >

              <FaHome />

              Dashboard

            </Link>

            <Link
              to="/admin/usuarios"
              style={linkStyle("/admin/usuarios")}
            >

              <FaUsers />

              Usuarios

            </Link>

            <Link
              to="/admin/productos"
              style={linkStyle("/admin/productos")}
            >

              <FaBoxOpen />

              Productos

            </Link>

            <Link
              to="/admin/ventas"
              style={linkStyle("/admin/ventas")}
            >

              <FaChartLine />

              Ventas

            </Link>

          </>

        )}

        {/* ================= CLIENTE ================= */}

        {token &&
          rol === "cliente" && (

          <>

            <Link
              to="/cliente"
              style={linkStyle("/cliente")}
            >

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

            <Link
              to="/cliente/compras"
              style={linkStyle("/cliente/compras")}
            >

              <FaClipboardList />

              Mis Compras

            </Link>

          </>

        )}

      </div>

      {/* ================= USER ================= */}

      {token && (

        <div style={styles.rightSection}>

          <div style={styles.userBox}>

            <FaUserCircle size={22} />

            <div>

              <p style={styles.userName}>
                {nombre}
              </p>

              <p style={styles.userRole}>
                {rol}
              </p>

            </div>

          </div>

          <button
            onClick={logout}
            style={styles.logoutBtn}
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

/* ================= ESTILOS ================= */

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

    background:
      "rgba(10,10,20,0.82)",

    backdropFilter: "blur(14px)",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)",

    boxSizing: "border-box"

  },

  /* ================= LOGO ================= */

  logoContainer: {

    display: "flex",

    alignItems: "center",

    gap: "14px",

    cursor: "pointer"

  },

  logoIcon: {

    width: "46px",

    height: "46px",

    borderRadius: "14px",

    background:
      "linear-gradient(135deg, #7c3aed, #2563eb)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#fff",

    fontWeight: "bold",

    fontSize: "24px",

    boxShadow:
      "0 0 25px rgba(124,58,237,0.5)"

  },

  logoText: {

    margin: 0,

    color: "#fff",

    fontSize: "24px",

    fontWeight: "700",

    letterSpacing: "0.5px"

  },

  logoSub: {

    margin: 0,

    color: "#94a3b8",

    fontSize: "12px",

    marginTop: "2px"

  },

  /* ================= MENU ================= */

  menu: {

    display: "flex",

    alignItems: "center",

    gap: "12px",

    flexWrap: "wrap"

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

    fontSize: "14px"

  },

  /* ================= USER ================= */

  rightSection: {

    display: "flex",

    alignItems: "center",

    gap: "16px"

  },

  userBox: {

    display: "flex",

    alignItems: "center",

    gap: "10px",

    background:
      "rgba(255,255,255,0.06)",

    padding: "10px 14px",

    borderRadius: "16px",

    color: "#fff",

    border:
      "1px solid rgba(255,255,255,0.08)"

  },

  userName: {

    margin: 0,

    fontSize: "14px",

    fontWeight: "600"

  },

  userRole: {

    margin: 0,

    fontSize: "12px",

    color: "#94a3b8",

    textTransform: "capitalize"

  },

  /* ================= LOGOUT ================= */

  logoutBtn: {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    padding: "12px 16px",

    borderRadius: "14px",

    border:
      "1px solid rgba(239,68,68,0.25)",

    background:
      "rgba(239,68,68,0.12)",

    color: "#f87171",

    cursor: "pointer",

    fontWeight: "600",

    transition: "0.3s"

  }

};