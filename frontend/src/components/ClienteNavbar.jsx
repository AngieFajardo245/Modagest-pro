import { Link, useNavigate } from "react-router-dom";

export default function ClienteNavbar() {

  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const nombre = usuario?.nombre || "Cliente";

  const cerrarSesion = () => {

    localStorage.clear();

    navigate("/login", { replace: true });

  };

  return (

    <nav style={estilos.nav}>

      <h3 style={estilos.titulo}>
        ModaGest Pro
      </h3>

      <div style={estilos.linksContainer}>

        <span style={estilos.saludo}>
          Hola, {nombre}
        </span>

        <Link to="/cliente" style={estilos.link}>
          Inicio
        </Link>

        <Link to="/cliente/productos" style={estilos.link}>
          Productos
        </Link>

        <Link to="/cliente/compras" style={estilos.link}>
          Mis Compras
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
    background: "#0d6efd",
    color: "white",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titulo: {
    margin: 0,
  },

  saludo: {
    marginRight: "20px",
    fontWeight: "500"
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