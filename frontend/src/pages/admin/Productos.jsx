import { useEffect, useState } from "react";
import api from "../../services/api";

function Productos() {

  const [productos, setProductos] = useState([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔥 EDITAR
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

  /* ================= CREAR ================= */

  const crearProducto = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio);
      formData.append("stock", stock || 0);

      if (imagen) {
        formData.append("imagen", imagen);
      }

      await api.post("/productos", formData);

      alert("Producto creado");

      setNombre("");
      setDescripcion("");
      setPrecio("");
      setStock("");
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

    await api.delete(`/productos/${id}`);
    obtenerProductos();
  };

  /* ================= EDITAR ================= */

  const abrirModal = (producto) => {
    setProductoEditando(producto);
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

      {/* CREAR */}
      <form onSubmit={crearProducto} className="card p-3 mb-4">

        <div className="row g-2">

          <input className="form-control col" placeholder="Nombre"
            value={nombre} onChange={e => setNombre(e.target.value)} />

          <input className="form-control col" placeholder="Descripción"
            value={descripcion} onChange={e => setDescripcion(e.target.value)} />

          <input className="form-control col" type="number" placeholder="Precio"
            value={precio} onChange={e => setPrecio(e.target.value)} />

          <input className="form-control col" type="number" placeholder="Stock"
            value={stock} onChange={e => setStock(e.target.value)} />

          <input type="file" className="form-control col"
            onChange={handleImagen} />

        </div>

        {preview && <img src={preview} width="100" className="mt-2" />}

        <button className="btn btn-success mt-3">Crear Producto</button>

      </form>

      {/* TABLA */}
      <table className="table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>

              <td>
                {p.imagen && <img src={p.imagen} width="50" />}
              </td>

              <td>{p.nombre}</td>
              <td>${p.precio}</td>

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

      {/* 🔥 MODAL */}
      {productoEditando && (
        <div className="modal show d-block" style={{ background: "#00000099" }}>

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

              {previewEdit && <img src={previewEdit} width="100" className="mt-2" />}

              <button className="btn btn-primary mt-3" onClick={actualizarProducto}>
                Guardar cambios
              </button>

              <button className="btn btn-secondary mt-2"
                onClick={() => setProductoEditando(null)}>
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