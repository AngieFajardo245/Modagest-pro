import { Navigate, Outlet } from "react-router-dom";
import EmpleadoNavbar from "../EmpleadoNavbar";

export default function EmpleadoLayout() {

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token || rol !== "empleado") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <EmpleadoNavbar />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}