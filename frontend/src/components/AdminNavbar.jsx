import { Link, useNavigate, useLocation } from "react-router-dom";

export default function AdminNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#00d4ff" : "#fff",
    textDecoration: "none",
    marginRight: "20px",
    fontWeight: "500",
    transition: "0.3s"
  });

  return (

    <nav style={estilos.nav}>

      {/* LOGO */}
      <h3
        style={estilos.logo}
        onClick={() => navigate("/admin")}
      >
        ⚙️ Admin Panel
      </h3>

      {/* LINKS */}
      <div style={estilos.linksContainer}>

        <Link to="/admin" style={linkStyle("/admin")}>
          Dashboard
        </Link>

        <Link to="/admin/usuarios" style={linkStyle("/admin/usuarios")}>
          Usuarios
        </Link>

        <Link to="/admin/productos" style={linkStyle("/admin/productos")}>
          Productos
        </Link>

        <Link to="/admin/ventas" style={linkStyle("/admin/ventas")}>
          Ventas
        </Link>

        <button onClick={cerrarSesion} style={estilos.boton}>
          Cerrar sesión
        </button>

      </div>

    </nav>

  );
}

const estilos = {

  nav: {
    background: "linear-gradient(90deg, #111, #1f1f1f)",
    color: "white",
    padding: "15px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },

  logo: {
    margin: 0,
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "1px"
  },

  linksContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap"
  },

  boton: {
    background: "#dc3545",
    border: "none",
    color: "white",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "0.3s"
  }

};