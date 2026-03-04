import { useEffect, useState } from "react";
import api from "../../services/api";

function ProductosEmpleado() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const response = await api.get("/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const manejarCantidad = (id, valor) => {
    setCantidades({
      ...cantidades,
      [id]: valor,
    });
  };

  const venderProducto = async (productoId) => {
    const cantidad = parseInt(cantidades[productoId]);

    if (!cantidad || cantidad <= 0) {
      alert("Ingresa una cantidad válida");
      return;
    }

    try {
      await api.post("/empleado/vender", {
        productoId,
        cantidad,
      });

      alert("Venta realizada correctamente ✅");
      setCantidades({ ...cantidades, [productoId]: "" });
      obtenerProductos();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "No se pudo registrar la venta"
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Venta</h2>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Cantidad</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>{producto.stock}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    style={{ width: "90px" }}
                    value={cantidades[producto.id] || ""}
                    onChange={(e) =>
                      manejarCantidad(producto.id, e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => venderProducto(producto.id)}
                  >
                    Vender
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay productos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductosEmpleado;