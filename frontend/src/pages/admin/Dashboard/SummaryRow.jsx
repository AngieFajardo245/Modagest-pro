import styles from "./dashboardStyles";

export default function SummaryRow({ label, value }) {
  return (
    <div style={styles.summaryRow}>
      <span style={styles.summaryLabel}>{label}</span>

      <span style={styles.summaryValue}>{value}</span>
    </div>
  );
}
