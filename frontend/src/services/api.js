import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 15000 // un poco más tolerante
});

/* ===============================
REQUEST INTERCEPTOR
================================= */

api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (
      token &&
      config.url &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register")
    ) {

      // limpiar token si ya viene con Bearer
      const cleanToken = token.replace("Bearer ", "");

      config.headers.Authorization = `Bearer ${cleanToken}`;
    }

    // 🔥 IMPORTANTE: dejar que Axios maneje multipart automáticamente
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;

  },

  (error) => {
    console.error("Error en request:", error);
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

      if (status === 401) {

        console.warn("Sesión expirada o token inválido");

        localStorage.removeItem("token");

        // evitar bucle infinito
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

      }

      console.error(
        "Error API:",
        status,
        error.response.data
      );

    } else if (error.request) {

      console.error(
        "No hubo respuesta del servidor",
        error.request
      );

    } else {

      console.error(
        "Error configurando petición",
        error.message
      );

    }

    return Promise.reject(error);

  }

);

export default api;