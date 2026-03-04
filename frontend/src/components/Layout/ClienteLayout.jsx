import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import ClienteNavbar from "../ClienteNavbar";

export default function ClienteLayout() {
  const [autorizado, setAutorizado] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (token && rol === "cliente") {
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
      <ClienteNavbar />
      <Outlet />
    </>
  );
}