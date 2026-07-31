import styles from "./dashboardStyles";
import ActivityItem from "./ActivityItem";

export default function DashboardActivity() {

  return (

    <div style={styles.activityCard}>

      <div style={styles.sectionHeader}>

        <h3 style={styles.sectionTitle}>
          Actividad Reciente
        </h3>

        <span style={styles.sectionBadge}>
          En vivo
        </span>

      </div>


      <div style={styles.activityList}>


        <ActivityItem
          icon="🛒"
          text="Nueva venta registrada"
          time="Hace unos minutos"
        />


        <ActivityItem
          icon="👤"
          text="Nuevo usuario registrado"
          time="Hoy"
        />


        <ActivityItem
          icon="📦"
          text="Inventario actualizado"
          time="Hoy"
        />


        <ActivityItem
          icon="💳"
          text="Pago aprobado"
          time="Hace 1 hora"
        />


      </div>


    </div>

  );

}