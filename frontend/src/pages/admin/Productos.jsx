import { useEffect, useState } from "react";
import api from "../../services/api";

function Productos() {

  const [productos, setProductos] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: ""
  });

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  const [productoEditando, setProductoEditando] = useState(null);
  const [previewEdit, setPreviewEdit] = useState(null);

  const [loading, setLoading] = useState(false);

  /* ================= OBTENER ================= */

  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/productos");
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      alert("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  /* ================= MANEJO INPUT ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ================= IMAGEN ================= */

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImagenEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductoEditando({
        ...productoEditando,
        imagenFile: file
      });
      setPreviewEdit(URL.createObjectURL(file));
    }
  };

  /* ================= VALIDACIÓN ================= */

  const validar = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio";
    if (!form.precio || form.precio <= 0) return "Precio inválido";
    return null;
  };

  /* ================= CREAR ================= */

  const crearProducto = async (e) => {
    e.preventDefault();

    const error = validar();
    if (error) return alert(error);

    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      if (imagen) {
        formData.append("imagen", imagen);
      }

      await api.post("/productos", formData);

      alert("Producto creado correctamente");

      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: ""
      });

      setImagen(null);
      setPreview(null);

      obtenerProductos();

    } catch (error) {
      console.error(error);
      alert("Error al crear producto");
    }
  };

  /* ================= ELIMINAR ================= */

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;

    try {
      await api.delete(`/productos/${id}`);
      obtenerProductos();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  /* ================= EDITAR ================= */

  const abrirModal = (producto) => {
    setProductoEditando({ ...producto });
    setPreviewEdit(producto.imagen);
  };

  const actualizarProducto = async () => {
    try {

      const formData = new FormData();

      formData.append("nombre", productoEditando.nombre);
      formData.append("descripcion", productoEditando.descripcion);
      formData.append("precio", productoEditando.precio);
      formData.append("stock", productoEditando.stock);

      if (productoEditando.imagenFile) {
        formData.append("imagen", productoEditando.imagenFile);
      }

      await api.put(`/productos/${productoEditando.id}`, formData);

      alert("Producto actualizado");

      setProductoEditando(null);
      setPreviewEdit(null);

      obtenerProductos();

    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="container mt-4">

      <h2 className="mb-4">🛒 Gestión de Productos</h2>

      {/* FORMULARIO */}
      <form onSubmit={crearProducto} className="card p-4 shadow-sm mb-4">

        <div className="row g-3">

          <div className="col-md-3">
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              name="descripcion"
              className="form-control"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              name="precio"
              className="form-control"
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              name="stock"
              className="form-control"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-2">
            <input
              type="file"
              className="form-control"
              onChange={handleImagen}
            />
          </div>

        </div>

        {preview && (
          <div className="mt-3 text-center">
            <img src={preview} width="100" className="rounded" />
          </div>
        )}

        <button className="btn btn-success mt-3 w-100">
          ➕ Crear Producto
        </button>

      </form>

      {/* TABLA */}
      <div className="card shadow-sm">
        <table className="table table-hover mb-0">

          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {productos.map(p => (
              <tr key={p.id}>

                <td>{p.id}</td>

                <td>
                  {p.imagen
                    ? <img src={p.imagen} width="50" className="rounded" />
                    : "Sin imagen"}
                </td>

                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>{p.stock}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => abrirModal(p)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarProducto(p.id)}
                  >
                    Eliminar
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {productoEditando && (
        <div className="modal show d-block" style={{ background: "#00000088" }}>

          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h4>Editar Producto</h4>

              <input className="form-control mb-2"
                value={productoEditando.nombre}
                onChange={(e) =>
                  setProductoEditando({
                    ...productoEditando,
                    nombre: e.target.value
                  })
                }
              />

              <input className="form-control mb-2"
                value={productoEditando.descripcion}
                onChange={(e) =>
                  setProductoEditando({
                    ...productoEditando,
                    descripcion: e.target.value
                  })
                }
              />

              <input className="form-control mb-2" type="number"
                value={productoEditando.precio}
                onChange={(e) =>
                  setProductoEditando({
                    ...productoEditando,
                    precio: e.target.value
                  })
                }
              />

              <input className="form-control mb-2" type="number"
                value={productoEditando.stock}
                onChange={(e) =>
                  setProductoEditando({
                    ...productoEditando,
                    stock: e.target.value
                  })
                }
              />

              <input type="file" onChange={handleImagenEdit} />

              {previewEdit && (
                <img src={previewEdit} width="100" className="mt-2 rounded" />
              )}

              <button className="btn btn-primary mt-3 w-100" onClick={actualizarProducto}>
                Guardar cambios
              </button>

              <button
                className="btn btn-secondary mt-2 w-100"
                onClick={() => setProductoEditando(null)}
              >
                Cancelar
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default Productos;