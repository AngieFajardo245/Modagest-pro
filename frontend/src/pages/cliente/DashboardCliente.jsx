import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

function DashboardCliente() {

  const [nombre, setNombre] = useState("");
  const [compras, setCompras] = useState([]);

  /* ================= CARGAR USUARIO ================= */

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");

    if (usuario) {
      const data = JSON.parse(usuario);
      setNombre(data.nombre);
    }

    obtenerCompras();
  }, []);

  /* ================= OBTENER COMPRAS ================= */

  const obtenerCompras = async () => {
    try {

      const res = await api.get("/cliente/compras");

      setCompras(Array.isArray(res.data) ? res.data : []);

    } catch (error) {
      console.error("Error cargando compras:", error);
    }
  };

  /* ================= CALCULOS ================= */

  const totalCompras = compras.length;

  const dineroGastado = compras.reduce((acc, c) => acc + c.total, 0);

  const hoy = new Date().toDateString();

  const comprasHoy = compras.filter(c =>
    new Date(c.createdAt).toDateString() === hoy
  ).length;

  /* ================= UI ================= */

  return (

    <div className="container mt-4">

      <h2 className="mb-2">👤 Panel del Cliente</h2>

      <p className="text-muted mb-4">
        Bienvenido {nombre} a <strong>ModaGest Pro</strong>
      </p>

      {/* ================= ESTADÍSTICAS ================= */}

      <div className="row mb-4">

        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <h5>🧾 Compras</h5>
            <h3>{totalCompras}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <h5>💰 Gastado</h5>
            <h3>${dineroGastado}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <h5>📅 Hoy</h5>
            <h3>{comprasHoy}</h3>
          </div>
        </div>

      </div>

      {/* ================= ACCIONES ================= */}

      <div className="row">

        {/* PRODUCTOS */}
        <div className="col-md-6 mb-3">
          <Link to="/cliente/productos" style={{ textDecoration: "none" }}>
            <div className="card p-4 shadow-sm text-center hover-card">
              <h4>🛍 Ver Productos</h4>
              <p>Explorar catálogo</p>
            </div>
          </Link>
        </div>

        {/* COMPRAS */}
        <div className="col-md-6 mb-3">
          <Link to="/cliente/compras" style={{ textDecoration: "none" }}>
            <div className="card p-4 shadow-sm text-center hover-card">
              <h4>📦 Mis Compras</h4>
              <p>Ver historial</p>
            </div>
          </Link>
        </div>

      </div>

    </div>

  );
}

export default DashboardCliente;