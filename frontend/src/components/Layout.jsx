```jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";

function Layout({ children }) {

  const navigate = useNavigate();

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      navigate("/login");

    }

  }, [navigate]);

  return (

    <div style={styles.page}>

      {/* ================= EFECTOS FONDO ================= */}

      <div style={styles.backgroundGlow1}></div>

      <div style={styles.backgroundGlow2}></div>

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= CONTENIDO ================= */}

      <main style={styles.main}>

        {children}

      </main>

      {/* ================= FOOTER ================= */}

      <footer style={styles.footer}>

        <p style={styles.footerText}>
          © 2026 ModaGest Pro — Plataforma Inteligente de Gestión
        </p>

      </footer>

    </div>

  );

}

export default Layout;

/* ================= ESTILOS ================= */

const styles = {

  /* ================= PAGE ================= */

  page: {

    minHeight: "100vh",

    background:
      "linear-gradient(135deg, #050816, #0b1120, #140b2d)",

    position: "relative",

    overflowX: "hidden"

  },

  /* ================= GLOW EFFECTS ================= */

  backgroundGlow1: {

    position: "fixed",

    width: "350px",

    height: "350px",

    borderRadius: "50%",

    background:
      "rgba(168,85,247,0.18)",

    filter: "blur(120px)",

    top: "-100px",

    left: "-100px",

    zIndex: 0

  },

  backgroundGlow2: {

    position: "fixed",

    width: "400px",

    height: "400px",

    borderRadius: "50%",

    background:
      "rgba(59,130,246,0.12)",

    filter: "blur(140px)",

    bottom: "-150px",

    right: "-100px",

    zIndex: 0

  },

  /* ================= MAIN ================= */

  main: {

    position: "relative",

    zIndex: 2,

    padding: "30px"

  },

  /* ================= FOOTER ================= */

  footer: {

    position: "relative",

    zIndex: 2,

    marginTop: "20px",

    padding: "22px",

    borderTop:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(5,5,15,0.75)",

    backdropFilter: "blur(10px)",

    textAlign: "center"

  },

  footerText: {

    color: "#cbd5e1",

    fontSize: "14px",

    letterSpacing: "0.5px",

    margin: 0

  }

};
```
