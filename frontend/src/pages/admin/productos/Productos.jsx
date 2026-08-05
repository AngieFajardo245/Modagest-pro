import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

import ProductoStats from "./ProductoStats";
import ProductoForm from "./ProductoForm";
import ProductoTable from "./ProductoTable";
import ProductoModal from "./ProductoModal";

import { FaBoxOpen } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Productos() {
  /* ===================================================== */
  /* ======================= STATES ====================== */
  /* ===================================================== */

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [editando, setEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [previewImagen, setPreviewImagen] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoriaId: "",
    imagen: null,
  });

  /* ================= CONFIGURACIÓN ===================== */

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ================= OBTENER PRODUCTOS ================= */

  const obtenerProductos = async () => {
    try {
      const res = await api.get("/productos");

      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error obteniendo productos:", error);

      toast.error("No se pudieron cargar los productos");
    }
  };

  /* ================= OBTENER CATEGORIAS ================ */

  const obtenerCategorias = async () => {
    try {
      const res = await api.get("/categorias");

      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error obteniendo categorías:", error);

      toast.error("No se pudieron cargar las categorías");
    }
  };

  /* ====================== USE EFFECT =================== */

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  /* ==================== FILTRAR ======================== */

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return productos;
    }

    return productos.filter((producto) =>
      String(producto.nombre || "")
        .toLowerCase()
        .includes(texto),
    );
  }, [productos, busqueda]);

  /* ==================== FORMULARIO ===================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===================== IMAGEN ======================== */

  const handleImagen = (e) => {
    const file = e.target.files?.[0];

    setFormulario((prev) => ({
      ...prev,
      imagen: file || null,
    }));

    if (previewImagen?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImagen);
    }

    if (file) {
      const nuevaPreview = URL.createObjectURL(file);

      setPreviewImagen(nuevaPreview);
    } else {
      setPreviewImagen(null);
    }
  };

  /* ================= CREAR PRODUCTO ==================== */

  const crearProducto = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("nombre", formulario.nombre.trim());

      formData.append("descripcion", formulario.descripcion.trim());

      formData.append("precio", formulario.precio);

      formData.append("stock", formulario.stock);

      formData.append("categoriaId", formulario.categoriaId);

      if (formulario.imagen) {
        formData.append("imagen", formulario.imagen);
      }

      await api.post("/productos", formData);

      toast.success("Producto creado correctamente");

      limpiarFormulario();

      await obtenerProductos();
    } catch (error) {
      console.error("Error creando producto:", error);

      const mensaje =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "No se pudo crear el producto";

      toast.error(mensaje);
    }
  };

  /* ================= EDITAR PRODUCTO =================== */
  const editarProducto = (producto) => {
    setEditando(producto.id);

    setFormulario({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio ?? "",
      stock: producto.stock ?? "",
      categoriaId: producto.categoriaId || "",
      imagen: null,
    });

    if (producto.imagen) {
      const imagenUrl = producto.imagen.startsWith("http")
        ? producto.imagen
        : `${API_BASE_URL}/uploads/${producto.imagen}`;

      setPreviewImagen(imagenUrl);
    } else {
      setPreviewImagen(null);
    }

    setMostrarModal(true);
  };

  /* ================= GUARDAR EDICION =================== */

  const guardarEdicion = async (e) => {
    e.preventDefault();

    if (!editando) {
      toast.error("No se encontró el producto que deseas editar");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("nombre", formulario.nombre.trim());

      formData.append("descripcion", formulario.descripcion.trim());

      formData.append("precio", formulario.precio);

      formData.append("stock", formulario.stock);

      formData.append("categoriaId", formulario.categoriaId);

      if (formulario.imagen) {
        formData.append("imagen", formulario.imagen);
      }

      await api.put(`/productos/${editando}`, formData);

      toast.success("Producto actualizado correctamente");

      setEditando(null);
      setMostrarModal(false);

      limpiarFormulario();

      await obtenerProductos();
    } catch (error) {
      console.error("Error actualizando producto:", error);

      const mensaje =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "No se pudo actualizar el producto";

      toast.error(mensaje);
    }
  };

  /* ================= ELIMINAR PRODUCTO ================= */

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?",
    );

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/productos/${id}`);

      toast.success("Producto eliminado correctamente");

      await obtenerProductos();
    } catch (error) {
      console.error("Error eliminando producto:", error);

      const mensaje =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al eliminar el producto";

      toast.error(mensaje);
    }
  };

  /* ================= LIMPIAR FORM ====================== */

  const limpiarFormulario = () => {
    if (previewImagen?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImagen);
    }

    setFormulario({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoriaId: "",
      imagen: null,
    });

    setPreviewImagen(null);
  };

  /* ======================== RETURN ===================== */

  return (
    <div style={styles.container}>
      {/* ================= HEADER ================= */}

      <div style={styles.header}>
        <h1 style={styles.title}>
          <FaBoxOpen />
          Gestión de Productos
        </h1>
      </div>

      {/* ================= STATS ================= */}

      <ProductoStats productos={productos} categorias={categorias} />

      {/* ================= FORM ================= */}

      <ProductoForm
        formulario={formulario}
        categorias={categorias}
        handleChange={handleChange}
        handleImagen={handleImagen}
        crearProducto={crearProducto}
        previewImagen={previewImagen}
      />

      {/* ================= BUSCADOR ================= */}

      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={styles.search}
      />

      {/* ================= TABLA ================= */}

      <ProductoTable
        productos={productosFiltrados}
        editarProducto={editarProducto}
        eliminarProducto={eliminarProducto}
      />

      {/* ================= MODAL ================= */}

      <ProductoModal
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        formulario={formulario}
        categorias={categorias}
        handleChange={handleChange}
        handleImagen={handleImagen}
        guardarEdicion={guardarEdicion}
        previewImagen={previewImagen}
        limpiarFormulario={limpiarFormulario}
      />
    </div>
  );
}

/* ======================= ESTILOS ===================== */

const styles = {
  container: {
    minHeight: "100vh",

    padding: "40px",

    fontFamily: "Arial",

    background:
      "radial-gradient(circle at top left, #312e81 0%, #0f172a 35%, #020617 100%)",
  },

  header: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "30px",
  },

  title: {
    color: "#fff",

    fontSize: "38px",

    fontWeight: "800",

    display: "flex",

    alignItems: "center",

    gap: "12px",

    margin: 0,
  },

  search: {
    width: "100%",

    padding: "16px",

    borderRadius: "18px",

    border: "none",

    marginBottom: "30px",

    fontSize: "15px",

    outline: "none",

    boxSizing: "border-box",
  },
};
