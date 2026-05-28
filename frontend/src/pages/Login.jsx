import { useState } from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

/* ================= LOGO ================= */
import logo from "../assets/Logo.png";

function Login() {

  const navigate = useNavigate();

  const [view, setView] =
    useState("login");

  const [form, setForm] = useState({

    nombre: "",
    email: "",
    password: ""

  });

  const [viewPassword,
    setViewPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [errorMessage,
    setErrorMessage] =
    useState("");

  /* ================= HANDLE INPUTS ================= */

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  };

  /* ================= VALIDAR EMAIL ================= */

  const validarEmail = (email) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  };

  /* ================= LIMPIAR ================= */

  const limpiarFormulario = () => {

    setForm({

      nombre: "",
      email: "",
      password: ""

    });

  };

  /* ================= REDIRECCION ================= */

  const redirigirDespuesLogin =
    (usuario) => {

      const redirect =
        localStorage.getItem(
          "redirectAfterLogin"
        );

      if (redirect) {

        localStorage.removeItem(
          "redirectAfterLogin"
        );

        navigate(redirect);

        return;

      }

      switch (
        usuario.rol?.toLowerCase()
      ) {

        case "administrador":

          navigate("/admin");
          break;

        case "empleado":

          navigate("/empleado");
          break;

        default:

          navigate("/cliente");
          break;

      }

    };

  /* ================= GUARDAR SESION ================= */

  const guardarSesion =
    (token, usuario) => {

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "rol",
        usuario?.rol?.toLowerCase?.() || "cliente"
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
      );

    };

  /* ================= LOGIN ================= */

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    setErrorMessage("");

    try {

      if (
        !form.email ||
        !form.password
      ) {

        setErrorMessage(
          "Todos los campos son obligatorios"
        );

        return;

      }

      if (
        !validarEmail(form.email)
      ) {

        setErrorMessage(
          "Correo electrónico inválido"
        );

        return;

      }

      const response =
        await api.post(
          "/auth/login",
          {
            email:
              form.email.trim(),

            password:
              form.password.trim()
          }
        );

      const {
        token,
        usuario
      } = response.data;

      guardarSesion(
        token,
        usuario
      );

      limpiarFormulario();

      redirigirDespuesLogin(
        usuario
      );

    } catch (error) {

      console.error(
        "Error login:",
        error
      );

      setErrorMessage(

        error.response?.data
          ?.message ||

        "Credenciales incorrectas ❌"

      );

    } finally {

      setLoading(false);

    }

  };

  /* ================= REGISTER ================= */

  const handleRegister =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      setErrorMessage("");

      try {

        if (
          !form.nombre ||
          !form.email ||
          !form.password
        ) {

          setErrorMessage(
            "Todos los campos son obligatorios"
          );

          return;

        }

        if (
          !validarEmail(
            form.email
          )
        ) {

          setErrorMessage(
            "Correo electrónico inválido"
          );

          return;

        }

        if (
          form.password.length < 6
        ) {

          setErrorMessage(
            "La contraseña debe tener mínimo 6 caracteres"
          );

          return;

        }

        await api.post(
          "/auth/register",
          {

            nombre:
              form.nombre.trim(),

            email:
              form.email.trim(),

            password:
              form.password.trim()

          }
        );

        const loginResponse =
          await api.post(
            "/auth/login",
            {
              email:
                form.email.trim(),

              password:
                form.password.trim()
            }
          );

        const {
          token,
          usuario
        } = loginResponse.data;

        guardarSesion(
          token,
          usuario
        );

        limpiarFormulario();

        redirigirDespuesLogin(
          usuario
        );

      } catch (error) {

        console.error(
          "Error register:",
          error
        );

        setErrorMessage(

          error.response?.data
            ?.message ||

          "No se pudo registrar ❌"

        );

      } finally {

        setLoading(false);

      }

    };

  /* ================= UI ================= */

  return (

    <div style={styles.container}>

      {/* ================= OVERLAY ================= */}

      <div style={styles.overlay} />

      {/* ================= CARD ================= */}

      <div style={styles.card}>

        <div style={styles.logoBox}>

          {/* ================= LOGO ================= */}

          <img
            src={logo}
            alt="ModaGest Pro"
            style={styles.logoImage}
          />

          <h1 style={styles.title}>
            ModaGest Pro
          </h1>

          <p style={styles.subtitle}>
            Plataforma inteligente de moda y gestión
          </p>

        </div>

        {/* ================= LOGIN ================= */}

        {view === "login" && (

          <form
            onSubmit={handleLogin}
          >

            {/* EMAIL */}

            <div style={styles.inputBox}>

              <FaEnvelope
                style={styles.icon}
              />

              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
                style={styles.input}
              />

            </div>

            {/* PASSWORD */}

            <div style={styles.inputBox}>

              <FaLock
                style={styles.icon}
              />

              <input
                type={
                  viewPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <span
                onClick={() =>
                  setViewPassword(
                    !viewPassword
                  )
                }
                style={styles.eye}
              >

                {viewPassword
                  ? <FaEyeSlash />
                  : <FaEye />}

              </span>

            </div>

            <button
              style={styles.primaryBtn}
              disabled={loading}
            >

              {loading
                ? "Ingresando..."
                : "Ingresar"}

            </button>

            <p style={styles.switch}>

              ¿No tienes cuenta?{" "}

              <button
                type="button"
                style={styles.linkBtn}
                onClick={() => {

                  setErrorMessage("");

                  limpiarFormulario();

                  setView(
                    "register"
                  );

                }}
              >

                Regístrate

              </button>

            </p>

          </form>

        )}

        {/* ================= REGISTER ================= */}

        {view === "register" && (

          <form
            onSubmit={handleRegister}
          >

            {/* NOMBRE */}

            <div style={styles.inputBox}>

              <FaUser
                style={styles.icon}
              />

              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={handleChange}
                required
                style={styles.input}
              />

            </div>

            {/* EMAIL */}

            <div style={styles.inputBox}>

              <FaEnvelope
                style={styles.icon}
              />

              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
                style={styles.input}
              />

            </div>

            {/* PASSWORD */}

            <div style={styles.inputBox}>

              <FaLock
                style={styles.icon}
              />

              <input
                type={
                  viewPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <span
                onClick={() =>
                  setViewPassword(
                    !viewPassword
                  )
                }
                style={styles.eye}
              >

                {viewPassword
                  ? <FaEyeSlash />
                  : <FaEye />}

              </span>

            </div>

            <button
              style={styles.primaryBtn}
              disabled={loading}
            >

              {loading
                ? "Registrando..."
                : "Crear cuenta"}

            </button>

            <p style={styles.switch}>

              ¿Ya tienes cuenta?{" "}

              <button
                type="button"
                style={styles.linkBtn}
                onClick={() => {

                  setErrorMessage("");

                  limpiarFormulario();

                  setView("login");

                }}
              >

                Inicia sesión

              </button>

            </p>

          </form>

        )}

        {/* ================= ERROR ================= */}

        {errorMessage && (

          <div style={styles.error}>

            {errorMessage}

          </div>

        )}

      </div>

    </div>

  );

}

export default Login;

/* ================= ESTILOS ================= */

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

    padding: "20px"

  },

  overlay: {

    position: "absolute",

    inset: 0,

    background:
      "linear-gradient(to right, rgba(15,23,42,0.9), rgba(88,28,135,0.8))",

    backdropFilter:
      "blur(4px)"

  },

  card: {

    position: "relative",

    zIndex: 10,

    width: "100%",

    maxWidth: "480px",

    padding: "55px 45px",

    borderRadius: "28px",

    background:
      "rgba(255,255,255,0.08)",

    border:
      "1px solid rgba(255,255,255,0.1)",

    backdropFilter:
      "blur(18px)",

    boxShadow:
      "0 20px 60px rgba(0,0,0,0.4)"

  },

  logoBox: {

    textAlign: "center",

    marginBottom: "30px"

  },

  /* ================= LOGO MEJORADO ================= */

  logoImage: {

    width: "220px",

    height: "220px",

    objectFit: "contain",

    margin: "-40px auto -10px",

    display: "block",

    transform: "scale(1.4)",

    filter:
      "drop-shadow(0 0 30px rgba(168,85,247,0.85))"

  },

  title: {

    color: "#fff",

    marginBottom: "12px",

    fontSize: "42px",

    fontWeight: "800",

    letterSpacing: "0.5px"

  },

  subtitle: {

    color: "#d1d5db",

    fontSize: "15px",

    lineHeight: "1.5"

  },

  inputBox: {

    display: "flex",

    alignItems: "center",

    gap: "12px",

    background:
      "rgba(255,255,255,0.08)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "16px",

    padding: "14px 18px",

    marginBottom: "18px"

  },

  icon: {

    color: "#c084fc",

    fontSize: "15px"

  },

  input: {

    flex: 1,

    background: "transparent",

    border: "none",

    outline: "none",

    color: "#fff",

    fontSize: "15px"

  },

  eye: {

    color: "#d1d5db",

    cursor: "pointer",

    display: "flex",

    alignItems: "center"

  },

  primaryBtn: {

    width: "100%",

    padding: "15px",

    border: "none",

    borderRadius: "16px",

    background:
      "linear-gradient(135deg, #7c3aed, #9333ea)",

    color: "#fff",

    fontWeight: "700",

    fontSize: "15px",

    cursor: "pointer",

    marginTop: "10px",

    transition: "0.3s",

    boxShadow:
      "0 0 30px rgba(168,85,247,0.4)"

  },

  switch: {

    textAlign: "center",

    marginTop: "22px",

    color: "#d1d5db",

    fontSize: "14px"

  },

  linkBtn: {

    background: "none",

    border: "none",

    color: "#c084fc",

    fontWeight: "bold",

    cursor: "pointer",

    fontSize: "14px"

  },

  error: {

    marginTop: "20px",

    background:
      "rgba(239,68,68,0.15)",

    border:
      "1px solid rgba(239,68,68,0.3)",

    color: "#fecaca",

    padding: "12px",

    borderRadius: "14px",

    textAlign: "center",

    fontSize: "14px"

  }

};