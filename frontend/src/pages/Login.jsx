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

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const { token, usuario } = response.data;

      // 🔥 Limpiar antes de guardar
      localStorage.clear();

      // 🔥 Normalizar rol (muy importante)
      const rolNormalizado = usuario.rol.toLowerCase().trim();

      localStorage.setItem("token", token);
      localStorage.setItem("rol", rolNormalizado);

      console.log("Rol guardado:", rolNormalizado);

      // 🔥 Redirección segura
      if (rolNormalizado === "administrador") {
        navigate("/admin", { replace: true });
      } else if (rolNormalizado === "empleado") {
        navigate("/empleado", { replace: true });
      } else if (rolNormalizado === "cliente") {
        navigate("/cliente", { replace: true });
      } else {
        setErrorMessage("Rol no reconocido ❌");
      }

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Credenciales incorrectas ❌"
      );
    }
  };

  // =========================
  // REGISTER
  // =========================
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.post("/auth/register", {
        nombre: nombre.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      setSuccessMessage("Usuario registrado correctamente ✅");
      setView("login");
      setNombre("");
      setEmail("");
      setPassword("");

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error al registrar usuario ❌"
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ marginBottom: "25px", textAlign: "center" }}>
        ModaGest Pro
      </h2>

      {view === "login" && (
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "12px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input
              type={viewPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "12px" }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Ingresar
          </button>

          <div style={{ marginTop: "10px" }}>
            <span
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() => {
                setView("register");
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              Registrarse
            </span>
          </div>
        </form>
      )}

      {view === "register" && (
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{ width: "100%", padding: "12px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "12px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input
              type={viewPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "12px" }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Registrarse
          </button>

          <div style={{ marginTop: "10px" }}>
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

      {errorMessage && (
        <p style={{ color: "red", marginTop: "15px" }}>{errorMessage}</p>
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