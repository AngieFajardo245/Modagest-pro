import { Link, useNavigate } from "react-router-dom";

export default function PublicNavbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/", { replace: true });
  };

  return (
    <nav
      style={{
        background: "#111",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0 }}>ModaGest Pro</h2>

      <div>
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            marginRight: "20px",
          }}
        >
          Inicio
        </Link>

        {!token ? (
          <Link
            to="/login"
            style={{
              background: "#007bff",
              color: "white",
              padding: "8px 14px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            Iniciar sesión
          </Link>
        ) : (
          <button
            onClick={cerrarSesion}
            style={{
              background: "#dc3545",
              border: "none",
              color: "white",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}