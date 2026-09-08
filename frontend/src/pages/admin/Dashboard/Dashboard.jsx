import { useEffect, useState } from "react";
import api from "../../../services/api";

import DashboardHero from "./DashboardHero";
import DashboardStats from "./DashboardStats";
import DashboardActivity from "./DashboardActivity";
import DashboardSummary from "./DashboardSummary";
import DashboardGrafica from "./DashboardGrafica";

import styles from "./dashboardStyles";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatoMoneda = (valor) =>
    Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  useEffect(() => {
    let activo = true;

    const obtenerStats = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/admin/estadisticas");

        if (!activo) {
          return;
        }

        setStats(res.data || {});
      } catch (error) {
        console.error("Error obteniendo estadísticas:", error);

        if (!activo) {
          return;
        }

        setStats(null);
        setError(
          error.response?.data?.message ||
            "No se pudieron cargar las estadísticas.",
        );
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    };

    obtenerStats();

    return () => {
      activo = false;
    };
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

  const datos = stats || {};

  return (
    <div style={styles.container}>
      <DashboardHero
        ingresos={datos.ingresosTotales || 0}
        formatoMoneda={formatoMoneda}
      />

      <DashboardStats stats={datos} formatoMoneda={formatoMoneda} />

      <DashboardGrafica
        ventas={Array.isArray(datos.ventasGrafica) ? datos.ventasGrafica : []}
        formatoMoneda={formatoMoneda}
      />

      <div style={styles.bottomGrid}>
        <DashboardActivity />

        <DashboardSummary stats={datos} formatoMoneda={formatoMoneda} />
      </div>
    </div>
  );
}
