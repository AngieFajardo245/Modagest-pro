import { Link, useNavigate, useLocation } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#d4af37" : "#fff",
    marginRight: "20px",
    textDecoration: "none",
    fontWeight: "500"
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 40px", backgroundColor: "#111", color: "#fff" }}>
        <h2 style={{ margin: 0 }}>ModaGest Pro</h2>
        <div>
          <Link to="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>
          <Link to="/productos" style={linkStyle("/productos")}>Productos</Link>
          <button onClick={logout} style={{ padding: "8px 14px", backgroundColor: "#e63946", border: "none", color: "#fff", cursor: "pointer", borderRadius: "6px", fontWeight: "500" }}>Cerrar sesión</button>
        </div>
      </nav>
      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
