// src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import {
  FaShippingFast,
  FaTshirt,
  FaHeadset,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

// Productos destacados
const productosEjemplo = [
  {
    id: 1,
    nombre: "Camisa Casual",
    descripcion: "Camisa cómoda y elegante para cualquier ocasión.",
    precio: 45,
    stock: 10,
    imagen: "/img/camisa.jpg",
  },
  {
    id: 2,
    nombre: "Chaqueta de Cuero",
    descripcion: "Chaqueta elegante y resistente.",
    precio: 120,
    stock: 5,
    imagen: "/img/chaqueta.jpg",
  },
  {
    id: 3,
    nombre: "Pantalón Jeans",
    descripcion: "Jeans cómodos y modernos.",
    precio: 60,
    stock: 15,
    imagen: "/img/jeans.jpg",
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <PublicNavbar />

      {/* HERO */}
      <section
        className="text-white text-center py-5"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1350&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "80px 20px",
          }}
        >
          <h1 className="display-4 fw-bold">Bienvenido a ModaGest Pro</h1>
          <p className="lead mb-4">
            Tu tienda integral de moda, accesorios y más.
          </p>

          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="container py-5">
        <h2 className="mb-5 text-center">Productos Destacados</h2>

        <div className="row">
          {productosEjemplo.map((p) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={p.id}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={p.imagen}
                  className="card-img-top"
                  alt={p.nombre}
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <div className="card-body text-center">
                  <h5 className="card-title">{p.nombre}</h5>
                  <p className="card-text">{p.descripcion}</p>
                  <p className="fw-bold">${p.precio}</p>

                  <button
                    className="btn btn-outline-primary mt-2"
                    onClick={() => navigate("/login")}
                  >
                    Ver Producto
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="mb-5 text-center">Nuestros Beneficios</h2>

          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#0d6efd",
                  borderRadius: "50%",
                }}
              >
                <FaShippingFast size={35} className="text-white" />
              </div>
              <h5>Envíos rápidos</h5>
              <p>Recibe tus pedidos en tiempo récord.</p>
            </div>

            <div className="col-md-4 mb-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#0d6efd",
                  borderRadius: "50%",
                }}
              >
                <FaTshirt size={35} className="text-white" />
              </div>
              <h5>Variedad de ropa</h5>
              <p>Moda para todos los estilos.</p>
            </div>

            <div className="col-md-4 mb-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#0d6efd",
                  borderRadius: "50%",
                }}
              >
                <FaHeadset size={35} className="text-white" />
              </div>
              <h5>Soporte 24/7</h5>
              <p>Siempre disponibles para ayudarte.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white pt-4 pb-3">
        <div className="container text-center text-md-start">
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5>ModaGest Pro</h5>
              <p>Tu tienda integral de moda y accesorios.</p>
            </div>

            <div className="col-md-3 mb-3">
              <h6>Enlaces</h6>
              <ul className="list-unstyled">
                <li
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/")}
                >
                  Inicio
                </li>
                <li
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </li>
              </ul>
            </div>

            <div className="col-md-3 mb-3">
              <h6>Síguenos</h6>
              <div className="d-flex gap-3">
                <FaFacebook size={24} />
                <FaInstagram size={24} />
                <FaTwitter size={24} />
              </div>
            </div>
          </div>

          <hr className="bg-white" />
          <p className="text-center mb-0">
            © 2026 ModaGest Pro. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}

export default HomePage;