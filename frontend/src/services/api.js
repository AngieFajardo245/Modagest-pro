import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 15000
});

/* ===============================
REQUEST INTERCEPTOR
================================= */

api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    // AGREGAR TOKEN SI EXISTE
    if (
      token &&
      config.url &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register")
    ) {

      // limpiar "Bearer " si ya viene incluido
      const cleanToken = token.replace("Bearer ", "");

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${cleanToken}`
      };
    }

    // MANEJO CORRECTO DE HEADERS
    if (config.data instanceof FormData) {
      // Axios se encarga solo
      delete config.headers["Content-Type"];
    } else {
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json"
      };
    }

    return config;

  },

  (error) => {
    console.error("❌ Error en request:", error);
    return Promise.reject(error);
  }

);

/* ===============================
RESPONSE INTERCEPTOR
================================= */
api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response) {

      const status = error.response.status;

      const rutasPrivadas = [
        "/admin",
        "/cliente",
        "/empleado"
      ];

      const esRutaPrivada = rutasPrivadas.some(r =>
        window.location.pathname.startsWith(r)
      );

      if (status === 401 && esRutaPrivada) {

        console.warn("⚠️ Sesión expirada");

        localStorage.clear();
        window.location.replace("/login");
      }

      console.error("❌ Error API:", status, error.response.data);

    }

    return Promise.reject(error);

  }

);

export default api;