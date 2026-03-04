import { Link, useNavigate } from "react-router-dom";

export default function EmpleadoNavbar() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/login", { replace: true });
  };

  return (
    <nav style={estilos.nav}>
      <h3 style={estilos.titulo}>Panel Empleado</h3>

      <div style={estilos.linksContainer}>
        <Link to="/empleado" style={estilos.link}>
          Panel 
        </Link>

        <Link to="/empleado/productos" style={estilos.link}>
          Productos
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
    background: "#198754",
    color: "white",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titulo: {
    margin: 0,
  },
  linksContainer: {
    display: "flex",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    marginRight: "20px",
    fontWeight: "500",
  },
  boton: {
    background: "#dc3545",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};