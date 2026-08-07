import { useEffect, useState } from "react";
import api from "../../../services/api";

import styles from "./dashboardStyles";
import ActivityItem from "./ActivityItem";

export default function DashboardActivity() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerActividad = async () => {
      try {
        setLoading(true);

        const res = await api.get("/admin/actividad");

        setActividades(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error obteniendo actividad:", error);

        setActividades([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerActividad();
  }, []);

  /* ================= TIEMPO RELATIVO ================= */

  const obtenerTiempo = (fecha) => {
    if (!fecha) {
      return "";
    }

    const ahora = new Date();
    const fechaActividad = new Date(fecha);

    const diferencia = ahora.getTime() - fechaActividad.getTime();

    const segundos = Math.floor(diferencia / 1000);

    if (segundos < 60) {
      return "Hace unos segundos";
    }

    const minutos = Math.floor(segundos / 60);

    if (minutos < 60) {
      return minutos === 1 ? "Hace 1 minuto" : `Hace ${minutos} minutos`;
    }

    const horas = Math.floor(minutos / 60);

    if (horas < 24) {
      return horas === 1 ? "Hace 1 hora" : `Hace ${horas} horas`;
    }

    const dias = Math.floor(horas / 24);

    if (dias === 1) {
      return "Ayer";
    }

    if (dias < 7) {
      return `Hace ${dias} días`;
    }

    return fechaActividad.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={styles.activityCard}>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>Actividad Reciente</h3>

        <span style={styles.sectionBadge}>Reciente</span>
      </div>

      <div style={styles.activityList}>
        {loading ? (
          <p style={styles.activityTime}>Cargando actividad...</p>
        ) : actividades.length === 0 ? (
          <p style={styles.activityTime}>No hay actividad reciente.</p>
        ) : (
          actividades.map((actividad, index) => (
            <ActivityItem
              key={`${actividad.tipo}-${actividad.fecha}-${index}`}
              icon={actividad.icon}
              text={actividad.text}
              time={obtenerTiempo(actividad.fecha)}
            />
          ))
        )}
      </div>
    </div>
  );
}
