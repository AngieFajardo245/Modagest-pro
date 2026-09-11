import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminLayout from "./components/Layout/AdminLayout";
import ClienteLayout from "./components/Layout/ClienteLayout";
import EmpleadoLayout from "./components/Layout/EmpleadoLayout";

import Dashboard from "./pages/admin/Dashboard/Dashboard";
import Productos from "./pages/admin/productos/Productos";
import Usuarios from "./pages/admin/usuarios/Usuarios";
import AdminVentas from "./pages/admin/ventas/Ventas";
import Categorias from "./pages/admin/categorias/Categorias";

import DashboardCliente from "./pages/cliente/DashboardCliente";
import ProductosCliente from "./pages/cliente/ProductosCliente";
import ComprasCliente from "./pages/cliente/ComprasCliente";
import DireccionesCliente from "./pages/cliente/DireccionesCliente";
import Carrito from "./pages/Carrito";

import DashboardEmpleado from "./pages/empleado/DashboardEmpleado";
import ProductosEmpleado from "./pages/empleado/ProductosEmpleado";
import HistorialVentasEmpleado from "./pages/empleado/HistorialVentasEmpleado";
import RegistrarVentaEmpleado from "./pages/empleado/RegistrarVentaEmpleado";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<Login />} />

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
        <Route path="direcciones" element={<DireccionesCliente />} />
        <Route path="carrito" element={<Carrito />} />
      </Route>

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
        <Route path="ventas" element={<HistorialVentasEmpleado />} />
        <Route path="registrar-venta" element={<RegistrarVentaEmpleado />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
