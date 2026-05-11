import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Layout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>

      <Navbar />

      <div className="container py-4">
        {children}
      </div>

      <footer
        style={{
          textAlign: "center",
          padding: "15px",
          background: "#111",
          color: "#fff",
          marginTop: "40px"
        }}
      >
        © 2026 ModaGest Pro
      </footer>

    </div>
  );
}

export default Layout;