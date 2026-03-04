import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";

import AdminLayout from "./components/Layout/AdminLayout";
import ClienteLayout from "./components/Layout/ClienteLayout";
import EmpleadoLayout from "./components/Layout/EmpleadoLayout";

import Dashboard from "./pages/admin/Dashboard";
import Productos from "./pages/admin/Productos";
import Usuarios from "./pages/admin/Usuarios";
import AdminVentas from "./pages/admin/Ventas";

import DashboardCliente from "./pages/cliente/DashboardCliente";
import DashboardEmpleado from "./pages/empleado/DashboardEmpleado";
import ProductosEmpleado from "./pages/empleado/ProductosEmpleado";

function App() {
  return (
    <Routes>

      {/* PÁGINA PRINCIPAL PÚBLICA */}
      <Route path="/" element={<HomePage />} />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<Productos />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="ventas" element={<AdminVentas />} />
      </Route>

      {/* CLIENTE */}
      <Route path="/cliente" element={<ClienteLayout />}>
        <Route index element={<DashboardCliente />} />
      </Route>

      {/* EMPLEADO */}
      <Route path="/empleado" element={<EmpleadoLayout />}>
        <Route index element={<DashboardEmpleado />} />
        <Route path="productos" element={<ProductosEmpleado/>} /> 
      </Route>

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;