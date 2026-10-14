import { useEffect, useMemo, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../../services/api";
import ProductoForm from "./ProductoForm";
import ProductoModal from "./ProductoModal";
import ProductoStats from "./ProductoStats";
import ProductoTable from "./ProductoTable";

const formularioInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoriaId: "",
  imagen: null,
};

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const obtenerProductos = async () => {
    try {
      const respuesta = await api.get("/productos");
      setProductos(Array.isArray(respuesta.data) ? respuesta.data : []);
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      toast.error("No se pudieron cargar los productos");
    }
  };

  useEffect(() => {
    let componenteActivo = true;

    const cargarDatosIniciales = async () => {
      try {
        const [respuestaProductos, respuestaCategorias] = await Promise.all([
          api.get("/productos"),
          api.get("/categorias"),
        ]);

        if (!componenteActivo) return;

        setProductos(
          Array.isArray(respuestaProductos.data) ? respuestaProductos.data : [],
        );
        setCategorias(
          Array.isArray(respuestaCategorias.data)
            ? respuestaCategorias.data
            : [],
        );
      } catch (error) {
        console.error("Error cargando productos y categorías:", error);

        if (componenteActivo) {
          toast.error("No se pudieron cargar los productos y las categorías");
        }
      }
    };

    cargarDatosIniciales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return productos;

    return productos.filter((producto) => {
      const nombre = String(producto?.nombre || "").toLowerCase();
      const descripcion = String(producto?.descripcion || "").toLowerCase();
      const categoria = String(producto?.Categoria?.nombre || "").toLowerCase();

      return (
        nombre.includes(texto) ||
        descripcion.includes(texto) ||
        categoria.includes(texto)
      );
    });
  }, [productos, busqueda]);

  const liberarVistaPrevia = () => {
    if (previewImagen?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImagen);
    }
  };

  const limpiarFormulario = () => {
    liberarVistaPrevia();
    setFormulario(formularioInicial);
    setPreviewImagen(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  const handleImagen = (event) => {
    const archivo = event.target.files?.[0] || null;

    liberarVistaPrevia();
    setFormulario((actual) => ({ ...actual, imagen: archivo }));
    setPreviewImagen(archivo ? URL.createObjectURL(archivo) : null);
  };

  const crearFormData = () => {
    const datos = new FormData();

    datos.append("nombre", formulario.nombre.trim());
    datos.append("descripcion", formulario.descripcion.trim());
    datos.append("precio", formulario.precio);
    datos.append("stock", formulario.stock);
    datos.append("categoriaId", formulario.categoriaId);

    if (formulario.imagen) datos.append("imagen", formulario.imagen);

    return datos;
  };

  const crearProducto = async (event) => {
    event.preventDefault();

    try {
      await api.post("/productos", crearFormData());
      toast.success("Producto creado correctamente");
      limpiarFormulario();
      await obtenerProductos();
    } catch (error) {
      console.error("Error creando producto:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "No se pudo crear el producto",
      );
    }
  };

  const editarProducto = (producto) => {
    liberarVistaPrevia();
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
      setPreviewImagen(
        producto.imagen.startsWith("http")
          ? producto.imagen
          : `${API_BASE_URL}/uploads/${producto.imagen}`,
      );
    } else {
      setPreviewImagen(null);
    }

    setMostrarModal(true);
  };

  const guardarEdicion = async (event) => {
    event.preventDefault();

    if (!editando) {
      toast.error("No se encontró el producto que deseas editar");
      return;
    }

    try {
      await api.put(`/productos/${editando}`, crearFormData());
      toast.success("Producto actualizado correctamente");
      setEditando(null);
      setMostrarModal(false);
      limpiarFormulario();
      await obtenerProductos();
    } catch (error) {
      console.error("Error actualizando producto:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "No se pudo actualizar el producto",
      );
    }
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?",
    );

    if (!confirmar) return;

    try {
      await api.delete(`/productos/${id}`);
      toast.success("Producto eliminado correctamente");
      await obtenerProductos();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error al eliminar el producto",
      );
    }
  };

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>
          <FaBoxOpen />
          <span>Gestión de Productos</span>
        </h1>
      </header>

      <ProductoStats productos={productos} categorias={categorias} />

      <ProductoForm
        formulario={formulario}
        categorias={categorias}
        handleChange={handleChange}
        handleImagen={handleImagen}
        crearProducto={crearProducto}
        previewImagen={previewImagen}
      />

      <input
        type="search"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
        style={styles.search}
        aria-label="Buscar producto"
      />

      <ProductoTable
        productos={productosFiltrados}
        editarProducto={editarProducto}
        eliminarProducto={eliminarProducto}
      />

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
    </main>
  );
}

const styles = {
  container: {
    width: "100%",
    minWidth: 0,
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "clamp(16px, 4vw, 40px)",
    overflowX: "hidden",
    fontFamily: "Arial, sans-serif",
    background:
      "radial-gradient(circle at top left, #312e81 0%, #0f172a 35%, #020617 100%)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "clamp(22px, 4vw, 30px)",
  },
  title: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "clamp(9px, 2vw, 12px)",
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(26px, 7vw, 38px)",
    fontWeight: "800",
    lineHeight: 1.15,
  },
  search: {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "clamp(22px, 4vw, 30px)",
    padding: "clamp(13px, 3vw, 16px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "clamp(14px, 3vw, 18px)",
    outline: "none",
    fontSize: "15px",
  },
};
