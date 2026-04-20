import { useEffect, useState } from "react";
import api from "../../services/api";

function ProductosCliente() {

  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(true);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [metodoPago, setMetodoPago] = useState("");

  /* ================= CARGAR PRODUCTOS ================= */

  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/productos");

      const data = Array.isArray(res.data) ? res.data : [];
      setProductos(data);

      // Inicializar cantidades en 1
      const inicial = {};
      data.forEach(p => inicial[p.id] = 1);
      setCantidades(inicial);

    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  /* ================= CONTROL CANTIDAD ================= */

  const aumentar = (id) => {
    setCantidades({
      ...cantidades,
      [id]: cantidades[id] + 1
    });
  };

  const disminuir = (id) => {
    if (cantidades[id] > 1) {
      setCantidades({
        ...cantidades,
        [id]: cantidades[id] - 1
      });
    }
  };

  /* ================= ABRIR MODAL ================= */

  const abrirCompra = (producto) => {
    setProductoSeleccionado(producto);
    setMetodoPago("");
  };

  /* ================= CONFIRMAR COMPRA ================= */

  const confirmarCompra = async () => {

    if (!metodoPago) {
      alert("Selecciona un método de pago");
      return;
    }

    try {

      await api.post("/cliente/comprar", {
        productoId: productoSeleccionado.id,
        cantidad: cantidades[productoSeleccionado.id]
      });

      alert("Compra realizada con éxito 🛍");

      setProductoSeleccionado(null);

      obtenerProductos();

    } catch (error) {
      console.error(error);
      alert("Error al realizar la compra");
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <p style={{ padding: "30px" }}>Cargando productos...</p>;
  }

  return (

    <div className="container mt-4">

      <h2 className="mb-4">🛍️ Tienda de Productos</h2>

      <div className="row">

        {productos.map((p) => {

          const cantidad = cantidades[p.id] || 1;
          const total = p.precio * cantidad;

          return (

            <div className="col-md-4 mb-4" key={p.id}>

              <div className="card shadow-sm h-100">

                {/* IMAGEN */}
                {p.imagen && (
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    style={{
                      height: "200px",
                      objectFit: "cover"
                    }}
                  />
                )}

                <div className="card-body">

                  <h5>{p.nombre}</h5>

                  <p className="text-muted">{p.descripcion}</p>

                  <p><strong>${p.precio}</strong></p>

                  <p>Stock: {p.stock}</p>

                  {/* CONTADOR */}
                  <div className="d-flex align-items-center mb-2">

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => disminuir(p.id)}
                    >
                      -
                    </button>

                    <span className="mx-3">{cantidad}</span>

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => aumentar(p.id)}
                    >
                      +
                    </button>

                  </div>

                  {/* TOTAL */}
                  <p><strong>Total: ${total}</strong></p>

                  {/* BOTÓN */}
                  <button
                    className="btn btn-success w-100"
                    disabled={p.stock <= 0}
                    onClick={() => abrirCompra(p)}
                  >
                    Comprar
                  </button>

                </div>

              </div>

            </div>

          );

        })}

      </div>

      {/* ================= MODAL ================= */}

      {productoSeleccionado && (

        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>

          <div className="modal-dialog">

            <div className="modal-content p-3">

              <h4>Confirmar Compra</h4>

              <p><strong>{productoSeleccionado.nombre}</strong></p>

              <p>Cantidad: {cantidades[productoSeleccionado.id]}</p>

              <p>
                Total: $
                {productoSeleccionado.precio *
                  cantidades[productoSeleccionado.id]}
              </p>

              <select
                className="form-control mb-3"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="">Seleccione método de pago</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="nequi">Nequi</option>
              </select>

              <button
                className="btn btn-primary mb-2"
                onClick={confirmarCompra}
              >
                Confirmar Compra
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setProductoSeleccionado(null)}
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

export default ProductosCliente;