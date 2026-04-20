import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const [viewPassword, setViewPassword] = useState(false);
  const [view, setView] = useState("login");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* =========================
      LOGIN
  ========================= */
  const handleLogin = async (e) => {

    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim()
      });

      const { token, usuario } = response.data;

      if (!token || !usuario) {
        throw new Error("Respuesta inválida del servidor");
      }

      // limpiar storage
      localStorage.clear();

      const rolNormalizado = usuario.rol.toLowerCase().trim();

      // guardar datos correctamente
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rolNormalizado);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      console.log("Login exitoso:", usuario);

      /* ===== REDIRECCIÓN SEGURA ===== */

      if (rolNormalizado === "administrador") {
        navigate("/admin");
      } else if (rolNormalizado === "empleado") {
        navigate("/empleado");
      } else if (rolNormalizado === "cliente") {
        navigate("/cliente");
      } else {
        setErrorMessage("Rol desconocido");
      }

    } catch (error) {

      console.error("Error login:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Credenciales incorrectas ❌"
      );
    }
  };

  /* =========================
      REGISTER
  ========================= */
  const handleRegister = async (e) => {

    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {

      await api.post("/auth/register", {
        nombre: nombre.trim(),
        email: email.trim(),
        password: password.trim()
      });

      setSuccessMessage("Usuario registrado correctamente ✅");

      // limpiar campos
      setNombre("");
      setEmail("");
      setPassword("");

      // volver a login
      setView("login");

    } catch (error) {

      console.error("Error register:", error);

      setErrorMessage(
        error.response?.data?.message ||
        "Error al registrar usuario ❌"
      );
    }
  };

  /* =========================
      UI
  ========================= */
  return (

    <div
      style={{
        maxWidth: "420px",
        margin: "80px auto",
        padding: "35px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
      }}
    >

      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
        ModaGest Pro
      </h2>

      {/* ================= LOGIN ================= */}

      {view === "login" && (

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          />

          <input
            type={viewPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
          />

          <button
            type="button"
            onClick={() => setViewPassword(!viewPassword)}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              marginBottom: "15px"
            }}
          >
            {viewPassword ? "Ocultar contraseña" : "Ver contraseña"}
          </button>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Ingresar
          </button>

          <div style={{ marginTop: "18px", textAlign: "center" }}>
            <span
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() => {
                setView("register");
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              Crear cuenta
            </span>
          </div>

        </form>

      )}

      {/* ================= REGISTER ================= */}

      {view === "register" && (

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          />

          <input
            type={viewPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "12px", marginBottom: "15px" }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Registrarse
          </button>

          <div style={{ marginTop: "18px", textAlign: "center" }}>
            <span
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() => {
                setView("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              Volver al login
            </span>
          </div>

        </form>

      )}

      {/* MENSAJES */}

      {errorMessage && (
        <p style={{ color: "red", marginTop: "15px" }}>
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p style={{ color: "green", marginTop: "15px" }}>
          {successMessage}
        </p>
      )}

    </div>
  );
}

export default Login;