import { useEffect, useState } from "react";
import api from "../../../services/api";

import DashboardHero from "./DashboardHero";
import DashboardStats from "./DashboardStats";
import DashboardActivity from "./DashboardActivity";
import DashboardSummary from "./DashboardSummary";

import styles from "./dashboardStyles";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const formatoMoneda = (valor) => {
    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };

  useEffect(() => {
    const obtenerStats = async () => {
      try {
        setLoading(true);

        const res = await api.get("/admin/estadisticas");

        setStats(res.data);
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    obtenerStats();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>

        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <DashboardHero
        ingresos={stats?.ingresosTotales}
        formatoMoneda={formatoMoneda}
      />

      <DashboardStats stats={stats} formatoMoneda={formatoMoneda} />

      <div style={styles.bottomGrid}>
        <DashboardActivity />

        <DashboardSummary stats={stats} formatoMoneda={formatoMoneda} />
      </div>
    </div>
  );
}
