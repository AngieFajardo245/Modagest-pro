import { Navigate, Outlet } from "react-router-dom";
import AdminNavbar from "../AdminNavbar";

export default function AdminLayout() {

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token || rol !== "administrador") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <AdminNavbar />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}