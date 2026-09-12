import styles from "./dashboardStyles";

export default function ActivityItem({ icon, text, time }) {
  return (
    <div style={styles.activityItem}>
      <div style={styles.activityIcon}>{icon}</div>

      <div>
        <p style={styles.activityText}>{text}</p>

        <span style={styles.activityTime}>{time}</span>
      </div>
    </div>
  );
}
