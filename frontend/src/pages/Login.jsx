import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [view, setView] = useState("login");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  const [viewPassword, setViewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ================= REDIRECCIÓN PRO ================= */

  const redirigirDespuesLogin = (usuario) => {

    const redirect = localStorage.getItem("redirectAfterLogin");

    // Si venía del carrito u otra página
    if (redirect) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirect);
      return;
    }

    //  Si no, redirección normal por rol
    if (usuario.rol === "administrador") navigate("/admin");
    else if (usuario.rol === "empleado") navigate("/empleado");
    else navigate("/cliente");
  };

  /* ================= LOGIN ================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password.trim()
      });

      const { token, usuario } = res.data;

      localStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("rol", usuario.rol.toLowerCase());
      localStorage.setItem("usuario", JSON.stringify(usuario))
      
      redirigirDespuesLogin(usuario);

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "Credenciales incorrectas ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    if (!form.nombre || !form.email || !form.password) {
      setErrorMessage("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    try {

      await api.post("/auth/register", {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password.trim()
      });

      // LOGIN AUTOMÁTICO
      const res = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password.trim()
      });

      const { token, usuario } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("rol", usuario.rol.toLowerCase());
      localStorage.setItem("usuario", JSON.stringify(usuario));

      redirigirDespuesLogin(usuario);

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "No se pudo registrar ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.title}>ModaGest Pro</h2>

        {/* LOGIN */}
        {view === "login" && (
          <form onSubmit={handleLogin}>

            <input
              name="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <div style={styles.passwordContainer}>
              <input
                type={viewPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
                style={styles.passwordInput}
              />
              <span
                onClick={() => setViewPassword(!viewPassword)}
                style={styles.eye}
              >
                👁
              </span>
            </div>

            <button style={styles.primaryBtn} disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            <p style={styles.switch}>
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setView("register");
                }}
                style={styles.linkBtn}
              >
                Regístrate
              </button>
            </p>

          </form>
        )}

        {/* REGISTER */}
        {view === "register" && (
          <form onSubmit={handleRegister}>

            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              name="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <div style={styles.passwordContainer}>
              <input
                type={viewPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
                style={styles.passwordInput}
              />
              <span
                onClick={() => setViewPassword(!viewPassword)}
                style={styles.eye}
              >
                👁
              </span>
            </div>

            <button style={styles.successBtn} disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>

            <p style={styles.switch}>
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setView("login");
                }}
                style={styles.linkBtn}
              >
                Inicia sesión
              </button>
            </p>

          </form>
        )}

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      </div>
    </div>
  );
}

/* ================= ESTILOS ================= */

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #141e30, #243b55)"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "380px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  passwordContainer: {
    position: "relative",
    marginBottom: "10px"
  },
  passwordInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    paddingRight: "40px"
  },
  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer"
  },
  primaryBtn: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  successBtn: {
    width: "100%",
    padding: "10px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  switch: {
    textAlign: "center",
    marginTop: "15px"
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#007bff",
    fontWeight: "bold",
    cursor: "pointer",
    padding: 0
  },
  error: {
    color: "red",
    marginTop: "10px",
    textAlign: "center"
  }
};

export default Login;