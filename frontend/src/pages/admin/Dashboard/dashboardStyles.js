const styles = {
  container: {
    padding: "10px",
    minHeight: "100vh",
    color: "#fff",
  },

  heroCard: {
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(37,99,235,0.95))",
    borderRadius: "30px",
    padding: "40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
    boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
    flexWrap: "wrap",
    gap: "20px",
  },

  heroLabel: {
    margin: 0,
    color: "#e5e7eb",
    fontSize: "18px",
  },

  heroValue: {
    marginTop: "10px",
    fontSize: "42px",
    fontWeight: "800",
  },

  heroDescription: {
    marginTop: "10px",
    color: "#e5e7eb",
    maxWidth: "500px",
    lineHeight: "1.6",
  },

  heroIcon: {
    fontSize: "80px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px",
    marginBottom: "35px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "24px",
    padding: "28px",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
    transition: "transform .25s ease",
  },

  iconBox: {
    width: "65px",
    height: "65px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    background: "rgba(124,58,237,0.18)",
  },

  icon: {
    fontSize: "30px",
  },

  cardTitle: {
    color: "#94a3b8",
    fontSize: "15px",
    marginBottom: "10px",
  },

  cardValue: {
    fontSize: "34px",
    margin: 0,
    fontWeight: "800",
    color: "#fff",
  },

  cardDescription: {
    marginTop: "10px",
    color: "#94a3b8",
    fontSize: "14px",
  },

  periodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "18px",
    marginTop: "20px",
    marginBottom: "35px",
  },

  periodCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    backdropFilter: "blur(12px)",
  },

  periodIconBox: {
    width: "52px",
    height: "52px",
    minWidth: "52px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(124,58,237,0.16)",
  },

  periodIcon: {
    fontSize: "24px",
  },

  periodTitle: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
  },

  periodValue: {
    margin: "5px 0 0",
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "800",
  },

  periodDescription: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  chartCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "28px",
    marginBottom: "35px",
    backdropFilter: "blur(14px)",
    boxShadow: "0 10px 35px rgba(0,0,0,0.20)",
  },

  chartSubtitle: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: "14px",
  },

  chartEmpty: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },

  chartList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  chartItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  chartInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  chartDate: {
    color: "#94a3b8",
    fontSize: "14px",
  },

  chartValue: {
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
  },

  chartBarBackground: {
    width: "100%",
    height: "12px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  chartBar: {
    height: "100%",
    background: "linear-gradient(90deg, #7c3aed, #2563eb)",
    borderRadius: "999px",
    transition: "width 0.4s ease",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
    marginBottom: "35px",
  },

  activityCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "28px",
    backdropFilter: "blur(14px)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
  },

  sectionBadge: {
    background: "rgba(16,185,129,0.18)",
    color: "#10b981",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },

  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "14px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.04)",
  },

  activityIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "rgba(124,58,237,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  activityText: {
    margin: 0,
    color: "#fff",
    fontWeight: "600",
  },

  activityTime: {
    color: "#94a3b8",
    fontSize: "13px",
  },

  summaryCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "28px",
    backdropFilter: "blur(14px)",
  },

  summaryList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  summaryLabel: {
    color: "#94a3b8",
  },

  summaryValue: {
    fontWeight: "700",
    color: "#fff",
  },

  paymentSection: {
    marginTop: "28px",
    paddingTop: "22px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  paymentTitle: {
    margin: 0,
    marginBottom: "16px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
  },

  paymentList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  paymentRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    padding: "10px 12px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.04)",
  },

  paymentLabel: {
    color: "#cbd5e1",
    fontSize: "14px",
  },

  paymentValue: {
    color: "#10b981",
    fontSize: "14px",
    fontWeight: "700",
  },

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "#fff",
  },

  loader: {
    width: "60px",
    height: "60px",
    border: "6px solid rgba(255,255,255,0.1)",
    borderTop: "6px solid #8b5cf6",
    borderRadius: "50%",
    animation: "dashboardSpin 1s linear infinite",
  },

  error: {
    color: "#ef4444",
    fontWeight: "700",
    fontSize: "18px",
  },
};

export default styles;
