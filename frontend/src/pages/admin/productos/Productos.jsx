import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import ProductoStats from "./ProductoStats";
import ProductoForm from "./ProductoForm";
import ProductoTable from "./ProductoTable";
import ProductoModal from "./ProductoModal";

import { FaBoxOpen } from "react-icons/fa";

export default function Productos() {

  /* ===================================================== */
  /* ======================= STATES ====================== */
  /* ===================================================== */

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [editando, setEditando] = useState(null);

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [previewImagen, setPreviewImagen] =
    useState(null);

  const [formulario, setFormulario] =
    useState({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoriaId: "",
      imagen: null
    });

  const token = localStorage.getItem("token");

  /* ===================================================== */
  /* ================= OBTENER PRODUCTOS ================= */
  /* ===================================================== */

  const obtenerProductos = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/productos"
      );

      setProductos(res.data);

    } catch (error) {

      console.error(error);

    }

  };

  /* ===================================================== */
  /* ================= OBTENER CATEGORIAS ================ */
  /* ===================================================== */

  const obtenerCategorias = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/categorias"
      );

      setCategorias(res.data);

    } catch (error) {

      console.error(error);

    }

  };

  /* ===================================================== */
  /* ====================== USE EFFECT =================== */
  /* ===================================================== */

  useEffect(() => {

    obtenerProductos();
    obtenerCategorias();

  }, []);

  /* ===================================================== */
  /* ==================== FILTRAR ======================== */
  /* ===================================================== */

  const productosFiltrados = useMemo(() => {

    return productos.filter((producto) =>

      producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase())

    );

  }, [productos, busqueda]);

  /* ===================================================== */
  /* ==================== FORMULARIO ===================== */
  /* ===================================================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value
    });

  };

  /* ===================================================== */
  /* ===================== IMAGEN ======================== */
  /* ===================================================== */

  const handleImagen = (e) => {

    const file = e.target.files[0];

    setFormulario({
      ...formulario,
      imagen: file
    });

    if (file) {

      setPreviewImagen(
        URL.createObjectURL(file)
      );

    }

  };

  /* ===================================================== */
  /* ================= CREAR PRODUCTO ==================== */
  /* ===================================================== */

  const crearProducto = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append(
        "nombre",
        formulario.nombre
      );

      formData.append(
        "descripcion",
        formulario.descripcion
      );

      formData.append(
        "precio",
        formulario.precio
      );

      formData.append(
        "stock",
        formulario.stock
      );

      formData.append(
        "categoriaId",
        formulario.categoriaId
      );

      if (formulario.imagen) {

        formData.append(
          "imagen",
          formulario.imagen
        );

      }

      await axios.post(

        "http://localhost:5000/productos",

        formData,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data"
          }
        }

      );

      alert("✅ Producto creado");

      limpiarFormulario();

      obtenerProductos();

    } catch (error) {

      console.error(error);

      alert("❌ Error creando producto");

    }

  };

  /* ===================================================== */
  /* ================= EDITAR PRODUCTO =================== */
  /* ===================================================== */

  const editarProducto = (producto) => {

    setEditando(producto.id);

    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoriaId:
        producto.categoriaId || "",
      imagen: null
    });

    if (producto.imagen) {

      setPreviewImagen(

        producto.imagen.startsWith("http")

          ? producto.imagen

          : `http://localhost:5000/uploads/${producto.imagen}`

      );

    }

    setMostrarModal(true);

  };

  /* ===================================================== */
  /* ================= GUARDAR EDICION =================== */
  /* ===================================================== */

  const guardarEdicion = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append(
        "nombre",
        formulario.nombre
      );

      formData.append(
        "descripcion",
        formulario.descripcion
      );

      formData.append(
        "precio",
        formulario.precio
      );

      formData.append(
        "stock",
        formulario.stock
      );

      formData.append(
        "categoriaId",
        formulario.categoriaId
      );

      if (formulario.imagen) {

        formData.append(
          "imagen",
          formulario.imagen
        );

      }

      await axios.put(

        `http://localhost:5000/productos/${editando}`,

        formData,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data"
          }
        }

      );

      alert("✅ Producto actualizado");

      setEditando(null);

      setMostrarModal(false);

      limpiarFormulario();

      obtenerProductos();

    } catch (error) {

      console.error(error);

      alert("❌ Error actualizando");

    }

  };

  /* ===================================================== */
  /* ================= ELIMINAR PRODUCTO ================= */
  /* ===================================================== */

  const eliminarProducto = async (id) => {

    const confirmar =
      window.confirm(
        "¿Eliminar producto?"
      );

    if (!confirmar) return;

    try {

      await axios.delete(

        `http://localhost:5000/productos/${id}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      );

      alert("✅ Producto eliminado");

      obtenerProductos();

    } catch (error) {

      console.error(error);

      alert("❌ Error eliminando");

    }

  };

  /* ===================================================== */
  /* ================= LIMPIAR FORM ====================== */
  /* ===================================================== */

  const limpiarFormulario = () => {

    setFormulario({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoriaId: "",
      imagen: null
    });

    setPreviewImagen(null);

  };

  /* ===================================================== */
  /* ======================== RETURN ===================== */
  /* ===================================================== */

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

      <ProductoStats
        productos={productos}
        categorias={categorias}
      />

      {/* ================= FORM ================= */}

      <ProductoForm
        formulario={formulario}
        categorias={categorias}
        handleChange={handleChange}
        handleImagen={handleImagen}
        crearProducto={crearProducto}
      />

      {/* ================= BUSCADOR ================= */}

      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(e.target.value)
        }
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

/* ===================================================== */
/* ======================= ESTILOS ===================== */
/* ===================================================== */

const styles = {

  container: {

    minHeight: "100vh",

    padding: "40px",

    fontFamily: "Arial",

    background:
      "radial-gradient(circle at top left, #312e81 0%, #0f172a 35%, #020617 100%)"

  },

  header: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: "30px"

  },

  title: {

    color: "#fff",

    fontSize: "38px",

    fontWeight: "800",

    display: "flex",

    alignItems: "center",

    gap: "12px"

  },

  search: {

    width: "100%",

    padding: "16px",

    borderRadius: "18px",

    border: "none",

    marginBottom: "30px",

    fontSize: "15px",

    outline: "none"

  }

};
