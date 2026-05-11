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

import Dashboard from "./pages/admin/Dashboard";
import Productos from "./pages/admin/Productos";
import Usuarios from "./pages/admin/Usuarios";
import AdminVentas from "./pages/admin/Ventas";

/* ================= CLIENTE ================= */

import DashboardCliente from "./pages/cliente/DashboardCliente";
import ProductosCliente from "./pages/cliente/ProductosCliente";
import ComprasCliente from "./pages/cliente/ComprasCliente";

/* ================= EMPLEADO ================= */

import DashboardEmpleado from "./pages/empleado/DashboardEmpleado";
import ProductosEmpleado from "./pages/empleado/ProductosEmpleado";

function App() {

  return (

    <Routes>

      {/* ================= PUBLICO ================= */}

      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />

      {/* 🔥 CARRITO (PUBLICO PERO REQUIERE LOGIN PARA COMPRAR) */}
      <Route path="/carrito" element={<Carrito />} />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="administrador">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<Productos />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="ventas" element={<AdminVentas />} />
      </Route>

      {/* ================= CLIENTE ================= */}

      <Route
        path="/cliente"
        element={
          <ProtectedRoute role="cliente">
            <ClienteLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardCliente />} />
        <Route path="productos" element={<ProductosCliente />} />
        <Route path="compras" element={<ComprasCliente />} />
      </Route>

      {/* ================= EMPLEADO ================= */}

      <Route
        path="/empleado"
        element={
          <ProtectedRoute role="empleado">
            <EmpleadoLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardEmpleado />} />
        <Route path="productos" element={<ProductosEmpleado />} />
      </Route>

      {/* ================= 404 ================= */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>

  );

}

export default App;