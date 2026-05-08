import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#d4af37" : "#fff",
    marginRight: "18px",
    textDecoration: "none",
    fontWeight: "500"
  });

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        backgroundColor: "#111",
        color: "#fff"
      }}
    >
      <h2 style={{ margin: 0, cursor: "pointer" }} onClick={() => navigate("/")}>
        ModaGest Pro
      </h2>

      <div>

        {/* PÚBLICO */}
        {!token && (
          <Link to="/login" style={linkStyle("/login")}>
            Iniciar sesión
          </Link>
        )}

        {/* ADMIN */}
        {token && rol === "administrador" && (
          <>
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
          </>
        )}

        {/* CLIENTE */}
        {token && rol === "cliente" && (
          <>
            <Link to="/cliente" style={linkStyle("/cliente")}>
              Panel
            </Link>

            <Link to="/cliente/productos" style={linkStyle("/cliente/productos")}>
              Productos
            </Link>

            <Link to="/cliente/compras" style={linkStyle("/cliente/compras")}>
              Mis Compras
            </Link>
          </>
        )}

        {/* LOGOUT */}
        {token && (
          <button
            onClick={logout}
            style={{
              marginLeft: "10px",
              padding: "6px 12px",
              backgroundColor: "#e63946",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Cerrar sesión
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;