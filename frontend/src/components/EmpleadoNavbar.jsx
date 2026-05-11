import { Link, useNavigate, useLocation } from "react-router-dom";

export default function EmpleadoNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const nombre = usuario?.nombre || "Empleado";

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#d4af37" : "#fff",
    textDecoration: "none",
    marginRight: "20px",
    fontWeight: "500",
    transition: "0.2s"
  });

  return (

    <nav style={styles.nav}>

      {/* LOGO */}
      <h3
        style={styles.titulo}
        onClick={() => navigate("/empleado")}
      >
        👨‍💼 Panel Empleado
      </h3>

      <div style={styles.linksContainer}>

        {/* SALUDO */}
        <span style={styles.saludo}>
          Hola, {nombre}
        </span>

        {/* LINKS */}
        <Link to="/empleado" style={linkStyle("/empleado")}>
          Panel
        </Link>

        <Link to="/empleado/productos" style={linkStyle("/empleado/productos")}>
          Productos
        </Link>

        {/* LOGOUT */}
        <button
          onClick={cerrarSesion}
          style={styles.boton}
        >
          Cerrar sesión
        </button>

      </div>

    </nav>

  );
}

/* ================= ESTILOS ================= */

const styles = {

  nav: {
    background: "linear-gradient(90deg, #198754, #157347)",
    color: "white",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  titulo: {
    margin: 0,
    cursor: "pointer"
  },

  saludo: {
    marginRight: "20px",
    fontWeight: "500"
  },

  linksContainer: {
    display: "flex",
    alignItems: "center"
  },

  boton: {
    background: "#dc3545",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.2s"
  }

};