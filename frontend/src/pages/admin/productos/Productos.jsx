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

        if (!componenteActivo) {
          return;
        }

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

    if (!texto) {
      return productos;
    }

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

    setFormulario((actual) => ({
      ...actual,
      imagen: archivo,
    }));

    setPreviewImagen(archivo ? URL.createObjectURL(archivo) : null);
  };

  const crearFormData = () => {
    const datos = new FormData();

    datos.append("nombre", formulario.nombre.trim());
    datos.append("descripcion", formulario.descripcion.trim());
    datos.append("precio", formulario.precio);
    datos.append("stock", formulario.stock);
    datos.append("categoriaId", formulario.categoriaId);

    if (formulario.imagen) {
      datos.append("imagen", formulario.imagen);
    }

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
      const imagenUrl = producto.imagen.startsWith("http")
        ? producto.imagen
        : `${API_BASE_URL}/uploads/${producto.imagen}`;

      setPreviewImagen(imagenUrl);
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

    if (!confirmar) {
      return;
    }

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
          Gestión de Productos
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
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Arial",
    background:
      "radial-gradient(circle at top left, #312e81 0%, #0f172a 35%, #020617 100%)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: 0,
    color: "#ffffff",
    fontSize: "38px",
    fontWeight: "800",
  },
  search: {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "30px",
    padding: "16px",
    border: "none",
    borderRadius: "18px",
    outline: "none",
    fontSize: "15px",
  },
};
