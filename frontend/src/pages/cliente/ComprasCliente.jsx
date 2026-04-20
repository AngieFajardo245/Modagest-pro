import { useEffect, useState } from "react";
import api from "../../services/api";

function ComprasCliente() {

  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= OBTENER COMPRAS ================= */

  const obtenerCompras = async () => {
    try {

      setLoading(true);

      const res = await api.get("/cliente/compras");

      setCompras(Array.isArray(res.data) ? res.data : []);

    } catch (error) {

      console.error("Error obteniendo compras:", error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    obtenerCompras();
  }, []);

  /* ================= FORMATO FECHA ================= */

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString();
  };

  /* ================= UI ================= */

  if (loading) {
    return <p style={{ padding: "30px" }}>Cargando compras...</p>;
  }

  return (

    <div className="container mt-4">

      <h2 className="mb-4">🧾 Historial de Compras</h2>

      {compras.length === 0 ? (

        <div className="alert alert-info">
          No has realizado compras todavía.
        </div>

      ) : (

        <div className="row">

          {compras.map((c) => (

            <div className="col-md-4 mb-4" key={c.id}>

              <div className="card shadow-sm h-100">

                {/* IMAGEN */}
                {c.Producto?.imagen && (
                  <img
                    src={c.Producto.imagen}
                    alt="producto"
                    style={{
                      height: "180px",
                      objectFit: "cover"
                    }}
                  />
                )}

                <div className="card-body">

                  <h5 className="card-title">
                    {c.Producto?.nombre || "Producto eliminado"}
                  </h5>

                  <p><strong>Cantidad:</strong> {c.cantidad}</p>

                  <p><strong>Total:</strong> ${c.total}</p>

                  <p className="text-muted" style={{ fontSize: "14px" }}>
                    {formatearFecha(c.createdAt)}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default ComprasCliente;