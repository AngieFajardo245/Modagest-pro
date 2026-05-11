import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ProductosCliente() {

  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);

  const [cantidades, setCantidades] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= FILTROS ================= */

  const [busqueda, setBusqueda] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [soloStock, setSoloStock] = useState(false);
  const [orden, setOrden] = useState("");

  /* ================= FORMATO ================= */

  const formatear = (valor) => {
    return new Intl.NumberFormat("es-CO").format(valor);
  };

  /* ================= CARGAR ================= */

  const obtenerProductos = async () => {
    try {
      setLoading(true);

      const res = await api.get("/productos");
      const data = Array.isArray(res.data) ? res.data : [];

      setProductos(data);
      setFiltrados(data);

      const inicial = {};
      data.forEach(p => inicial[p.id] = 1);
      setCantidades(inicial);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  /* ================= FILTRAR ================= */

  useEffect(() => {

    let data = [...productos];

    if (busqueda) {
      data = data.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (precioMax) {
      data = data.filter(p => p.precio <= Number(precioMax));
    }

    if (soloStock) {
      data = data.filter(p => p.stock > 0);
    }

    if (orden === "precio-asc") {
      data.sort((a, b) => a.precio - b.precio);
    }

    if (orden === "precio-desc") {
      data.sort((a, b) => b.precio - a.precio);
    }

    setFiltrados(data);

  }, [busqueda, precioMax, soloStock, orden, productos]);

  /* ================= CANTIDAD ================= */

  const aumentar = (id, stock) => {
    if (cantidades[id] < stock) {
      setCantidades({
        ...cantidades,
        [id]: cantidades[id] + 1
      });
    }
  };

  const disminuir = (id) => {
    if (cantidades[id] > 1) {
      setCantidades({
        ...cantidades,
        [id]: cantidades[id] - 1
      });
    }
  };

  /* ================= CARRITO ================= */

  const agregarAlCarrito = (producto) => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión para comprar 🛍");
      navigate("/login");
      return;
    }

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existe = carrito.find(p => p.id === producto.id);

    if (existe) {
      existe.cantidad += cantidades[producto.id];
    } else {
      carrito.push({
        ...producto,
        cantidad: cantidades[producto.id]
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    // me permita refrescar navbar
    window.dispatchEvent(new Event("storage"));

    alert("Producto agregado al carrito 🛒");
  };

  /* ================= UI ================= */

  if (loading) {
    return <p style={{ padding: "30px" }}>Cargando productos...</p>;
  }

  return (

    <div className="container mt-4">

      <h2 className="mb-4 text-center">🛍️ Tienda</h2>

      {/* FILTROS */}

      <div className="row mb-4">

        <div className="col-md-3">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="form-control"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <input
            type="number"
            placeholder="Precio máximo"
            className="form-control"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="">Ordenar</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
          </select>
        </div>

        <div className="col-md-3 d-flex align-items-center">
          <input
            type="checkbox"
            checked={soloStock}
            onChange={(e) => setSoloStock(e.target.checked)}
          />
          <span className="ms-2">Solo disponibles</span>
        </div>

      </div>

      {/* PRODUCTOS */}

      <div className="row">

        {filtrados.length === 0 ? (
          <p className="text-center">No hay resultados</p>
        ) : (

          filtrados.map((p) => {

            const cantidad = cantidades[p.id] || 1;
            const total = p.precio * cantidad;

            return (

              <div className="col-md-4 mb-4" key={p.id}>

                <div className="card shadow-sm h-100 border-0">

                  <div style={styles.imageBox}>
                    <img
                      src={p.imagen || "https://via.placeholder.com/300x200"}
                      alt={p.nombre}
                      style={styles.image}
                    />
                  </div>

                  <div className="card-body text-center">

                    <h5>{p.nombre}</h5>

                    <p className="text-muted small">{p.descripcion}</p>

                    <h5 className="text-success">
                      ${formatear(p.precio)}
                    </h5>

                    <p className="small">Stock: {p.stock}</p>

                    {/* CONTADOR */}
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => disminuir(p.id)}
                      >-</button>

                      <span className="mx-3">{cantidad}</span>

                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => aumentar(p.id, p.stock)}
                      >+</button>
                    </div>

                    <p><strong>Total: ${formatear(total)}</strong></p>

                    {/* nuevo boton */}
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => agregarAlCarrito(p)}
                    >
                      🛒 Agregar al carrito
                    </button>

                  </div>

                </div>

              </div>

            );

          })

        )}

      </div>

    </div>
  );
}

export default ProductosCliente;

/* ================= ESTILOS ================= */

const styles = {

  imageBox: {
    height: "220px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    padding: "10px"
  },

  image: {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain"
  }

};