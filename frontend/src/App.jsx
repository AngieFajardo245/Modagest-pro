import { Routes, Route, Navigate } from "react-router-dom";

/* ================= PAGINAS PUBLICAS ================= */

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Carrito from "./pages/Carrito";

/* ================= PROTECCION ================= */

import ProtectedRoute from "./routes/ProtectedRoute";

/* ================= LAYOUTS ================= */

import AdminLayout from "./components/Layout/AdminLayout";
import ClienteLayout from "./components/Layout/ClienteLayout";
import EmpleadoLayout from "./components/Layout/EmpleadoLayout";

/* ================= ADMIN ================= */

import Dashboard from "./pages/admin/Dashboard/Dashboard";
import Productos from "./pages/admin/productos/Productos";
import Usuarios from "./pages/admin/usuarios/Usuarios";
import AdminVentas from "./pages/admin/ventas/Ventas";
import Categorias from "./pages/admin/categorias/Categorias";

/* ================= CLIENTE ================= */

import DashboardCliente from "./pages/cliente/DashboardCliente";
import ProductosCliente from "./pages/cliente/ProductosCliente";
import ComprasCliente from "./pages/cliente/ComprasCliente";

/* ================= EMPLEADO ================= */

import DashboardEmpleado from "./pages/empleado/DashboardEmpleado";
import ProductosEmpleado from "./pages/empleado/ProductosEmpleado";
import HistorialVentasEmpleado from "./pages/empleado/HistorialVentasEmpleado";

function App() {
  return (
    <Routes>
      {/* ================= PUBLICAS ================= */}

      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<Login />} />

      {/* ================= CARRITO ================= */}

      <Route
        path="/carrito"
        element={
          <ProtectedRoute role="cliente">
            <Carrito />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="administrador">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="productos" element={<Productos />} />

        <Route path="categorias" element={<Categorias />} />

        <Route path="usuarios" element={<Usuarios />} />

        <Route path="ventas" element={<AdminVentas />} />
      </Route>

      {/* ================= CLIENTE ================= */}

      <Route
        path="/cliente/*"
        element={
          <ProtectedRoute role="cliente">
            <ClienteLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardCliente />} />

        <Route path="productos" element={<ProductosCliente />} />

        <Route path="compras" element={<ComprasCliente />} />

        {/* ================= CARRITO CLIENTE ================= */}

        <Route path="carrito" element={<Carrito />} />
      </Route>

      {/* ================= EMPLEADO ================= */}

      <Route
        path="/empleado/*"
        element={
          <ProtectedRoute role="empleado">
            <EmpleadoLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardEmpleado />} />

        <Route path="productos" element={<ProductosEmpleado />} />

        {/* ================= HISTORIAL DE VENTAS ================= */}

        <Route path="ventas" element={<HistorialVentasEmpleado />} />
      </Route>

      {/* ================= 404 ================= */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
