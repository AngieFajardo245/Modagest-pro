// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#d4af37" : "#fff",
    marginRight: "20px",
    textDecoration: "none",
    fontWeight: "500",
  });

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        backgroundColor: "#111",
        color: "#fff",
      }}
    >
      <h2 style={{ margin: 0, cursor: "pointer" }} onClick={() => navigate("/")}>
        ModaGest Pro
      </h2>

      <div>
        {/* Siempre visible */}
        <Link to="/" style={linkStyle("/")}>
          Inicio
        </Link>

        {!token && (
          <Link to="/login" style={linkStyle("/login")}>
            Iniciar sesión
          </Link>
        )}

        {/* ADMIN */}
        {token && rol === "administrador" && (
          <>
            <Link to="/admin" style={linkStyle("/admin")}>
              Panel Admin
            </Link>

            <Link to="/admin/productos" style={linkStyle("/admin/productos")}>
              Productos
            </Link>

            <button
              onClick={logout}
              style={{
                marginLeft: "10px",
                padding: "6px 12px",
                backgroundColor: "#e63946",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </>
        )}

        {/* CLIENTE */}
        {token && rol === "cliente" && (
          <>
            <Link to="/cliente" style={linkStyle("/cliente")}>
              Mi Panel
            </Link>

            <button
              onClick={logout}
              style={{
                marginLeft: "10px",
                padding: "6px 12px",
                backgroundColor: "#e63946",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
