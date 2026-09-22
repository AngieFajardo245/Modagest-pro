import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import api from "../services/api";
import logo from "../assets/Logo.png";

function Login() {
  const navigate = useNavigate();

  const [view, setView] = useState("login");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [viewPassword, setViewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      email: "",
      password: "",
    });

    setViewPassword(false);
  };

  const guardarSesion = (token, usuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("rol", usuario?.rol?.toLowerCase?.() || "cliente");
    localStorage.setItem("usuario", JSON.stringify(usuario || {}));
  };

  const redirigirDespuesLogin = (usuario) => {
    const redirect = localStorage.getItem("redirectAfterLogin");

    if (redirect) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirect);
      return;
    }

    const rol = usuario?.rol?.toLowerCase?.();

    switch (rol) {
      case "administrador":
        navigate("/admin");
        break;

      case "empleado":
        navigate("/empleado");
        break;

      case "cliente":
      default:
        navigate("/cliente");
        break;
    }
  };

  const cambiarVista = (nuevaVista) => {
    setErrorMessage("");
    limpiarFormulario();
    setView(nuevaVista);
  };

  const validarFormularioLogin = () => {
    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setErrorMessage("Todos los campos son obligatorios.");
      return false;
    }

    if (!validarEmail(email)) {
      setErrorMessage("Ingresa un correo electrónico válido.");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener mínimo 6 caracteres.");
      return false;
    }

    return true;
  };

  const validarFormularioRegistro = () => {
    const nombre = form.nombre.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!nombre || !email || !password) {
      setErrorMessage("Todos los campos son obligatorios.");
      return false;
    }

    if (nombre.length < 2) {
      setErrorMessage("Ingresa un nombre válido.");
      return false;
    }

    if (!validarEmail(email)) {
      setErrorMessage("Ingresa un correo electrónico válido.");
      return false;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener mínimo 6 caracteres.");
      return false;
    }

    return true;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setErrorMessage("");

    if (!validarFormularioLogin()) {
      return;
    }

    setLoading(true);

    try {
      const email = form.email.trim().toLowerCase();

      const response = await api.post("/auth/login", {
        email,
        password: form.password,
      });

      const { token, usuario } = response.data || {};

      if (!token || !usuario) {
        setErrorMessage("La respuesta del servidor no es válida.");
        return;
      }

      guardarSesion(token, usuario);
      limpiarFormulario();
      redirigirDespuesLogin(usuario);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Credenciales incorrectas. Verifica tu correo y contraseña.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setErrorMessage("");

    if (!validarFormularioRegistro()) {
      return;
    }

    setLoading(true);

    try {
      const nombre = form.nombre.trim();
      const email = form.email.trim().toLowerCase();
      const password = form.password;

      await api.post("/auth/register", {
        nombre,
        email,
        password,
      });

      const loginResponse = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, usuario } = loginResponse.data || {};

      if (!token || !usuario) {
        setErrorMessage(
          "La cuenta fue creada, pero no fue posible iniciar sesión automáticamente.",
        );
        setView("login");
        return;
      }

      guardarSesion(token, usuario);
      limpiarFormulario();
      redirigirDespuesLogin(usuario);
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "No fue posible crear la cuenta. Intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          .login-input::selection {
            color: #ffffff;
            background: #7c3aed;
          }

          .login-input::-moz-selection {
            color: #ffffff;
            background: #7c3aed;
          }

          .login-input:-webkit-autofill,
          .login-input:-webkit-autofill:hover,
          .login-input:-webkit-autofill:focus,
          .login-input:-webkit-autofill:active {
            -webkit-text-fill-color: #ffffff !important;
            caret-color: #ffffff;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            box-shadow: 0 0 0 1000px transparent inset !important;
            -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
            transition: background-color 9999s ease-in-out 0s;
          }

          .login-input::placeholder {
            color: #9ca3af;
            opacity: 1;
          }
        `}
      </style>

      <div style={styles.overlay} />

      <div style={styles.card}>
        <div style={styles.logoBox}>
          <img src={logo} alt="Logo de ModaGest Pro" style={styles.logoImage} />

          <h1 style={styles.title}>ModaGest Pro</h1>

          <p style={styles.subtitle}>
            Plataforma inteligente de moda y gestión
          </p>
        </div>

        {view === "login" && (
          <form onSubmit={handleLogin} noValidate>
            <div style={styles.inputBox}>
              <FaEnvelope style={styles.icon} />

              <input
                className="login-input"
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
                style={styles.input}
              />
            </div>

            <div style={styles.inputBox}>
              <FaLock style={styles.icon} />

              <input
                className="login-input"
                type={viewPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
                style={styles.input}
              />

              <button
                type="button"
                onClick={() => setViewPassword((prev) => !prev)}
                style={styles.eye}
                aria-label={
                  viewPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                disabled={loading}
              >
                {viewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errorMessage && (
              <div style={styles.error} role="alert">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.primaryBtn,
                ...(loading ? styles.primaryBtnDisabled : {}),
              }}
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            <p style={styles.switch}>
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                style={styles.linkBtn}
                onClick={() => cambiarVista("register")}
                disabled={loading}
              >
                Regístrate
              </button>
            </p>
          </form>
        )}

        {view === "register" && (
          <form onSubmit={handleRegister} noValidate>
            <div style={styles.inputBox}>
              <FaUser style={styles.icon} />

              <input
                className="login-input"
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={handleChange}
                autoComplete="name"
                disabled={loading}
                style={styles.input}
              />
            </div>

            <div style={styles.inputBox}>
              <FaEnvelope style={styles.icon} />

              <input
                className="login-input"
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
                style={styles.input}
              />
            </div>

            <div style={styles.inputBox}>
              <FaLock style={styles.icon} />

              <input
                className="login-input"
                type={viewPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
                style={styles.input}
              />

              <button
                type="button"
                onClick={() => setViewPassword((prev) => !prev)}
                style={styles.eye}
                aria-label={
                  viewPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                disabled={loading}
              >
                {viewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errorMessage && (
              <div style={styles.error} role="alert">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.primaryBtn,
                ...(loading ? styles.primaryBtnDisabled : {}),
              }}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>

            <p style={styles.switch}>
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                style={styles.linkBtn}
                onClick={() => cambiarVista("login")}
                disabled={loading}
              >
                Inicia sesión
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=2070&auto=format&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(120deg, rgba(15,23,42,0.94), rgba(76,29,149,0.82))",
    backdropFilter: "blur(4px)",
  },

  card: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "480px",
    padding: "45px 40px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    boxSizing: "border-box",
  },

  logoBox: {
    textAlign: "center",
    marginBottom: "30px",
  },

  logoImage: {
    width: "190px",
    height: "190px",
    objectFit: "contain",
    margin: "-25px auto -5px",
    display: "block",
    filter: "drop-shadow(0 0 28px rgba(168,85,247,0.7))",
  },

  title: {
    color: "#ffffff",
    margin: "0 0 10px",
    fontSize: "40px",
    fontWeight: "800",
    letterSpacing: "0.3px",
  },

  subtitle: {
    color: "#d1d5db",
    fontSize: "15px",
    lineHeight: "1.5",
    margin: 0,
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "14px 16px",
    marginBottom: "16px",
    boxSizing: "border-box",
  },

  icon: {
    color: "#c084fc",
    fontSize: "15px",
    flexShrink: 0,
  },

  input: {
    flex: 1,
    minWidth: 0,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: "15px",
    caretColor: "#ffffff",
    colorScheme: "dark",
  },

  eye: {
    border: "none",
    background: "transparent",
    color: "#d1d5db",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3px",
    fontSize: "15px",
  },

  primaryBtn: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "8px",
    boxShadow: "0 0 30px rgba(168,85,247,0.35)",
  },

  primaryBtnDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },

  switch: {
    textAlign: "center",
    marginTop: "22px",
    marginBottom: 0,
    color: "#d1d5db",
    fontSize: "14px",
  },

  linkBtn: {
    background: "none",
    border: "none",
    color: "#c084fc",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
    padding: 0,
  },

  error: {
    marginBottom: "14px",
    background: "rgba(239,68,68,0.13)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#fecaca",
    padding: "12px",
    borderRadius: "14px",
    textAlign: "center",
    fontSize: "13px",
    lineHeight: "1.4",
  },
};
