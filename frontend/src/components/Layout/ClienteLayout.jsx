import { Outlet } from "react-router-dom";
import ClienteNavbar from "../ClienteNavbar";

function ClienteLayout() {
  return (
    <div>

      <ClienteNavbar />

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>

    </div>
  );
}

export default ClienteLayout;