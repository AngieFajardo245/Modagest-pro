const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const IMAGEN_PREDETERMINADA =
    "https://placehold.co/300x220/161a2f/ffffff?text=ModaGest+Pro";

export const obtenerUrlImagen = (
    imagen,
    predeterminada = IMAGEN_PREDETERMINADA,
) => {
    if (!imagen || typeof imagen !== "string") {
        return predeterminada;
    }

    const ruta = imagen.trim();

    if (/^https?:\/\//i.test(ruta)) {
        return ruta;
    }

    const rutaLimpia = ruta.replace(/^\/+/, "");

    if (rutaLimpia.startsWith("uploads/")) {
        return `${API_BASE_URL}/${rutaLimpia}`;
    }

    return `${API_BASE_URL}/uploads/${rutaLimpia}`;
};

export { API_BASE_URL };