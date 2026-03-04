import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import EmpleadoNavbar from "../EmpleadoNavbar";

export default function EmpleadoLayout() {
  const [autorizado, setAutorizado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (token && rol === "empleado") {
      setAutorizado(true);
    } else {
      setAutorizado(false);
    }
  }, []);

  if (autorizado === null) {
    return <div>Cargando...</div>;
  }

  if (!autorizado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <EmpleadoNavbar />
      <Outlet />
    </>
  );
}