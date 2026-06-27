const styles = {
  container: {
    minHeight: "100vh",
    padding: "35px",
    background:
      "radial-gradient(circle at top left, #312e81 0%, #0f172a 35%, #020617 100%)",
    color: "#fff",
  },

  header: {
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(76,29,149,0.18))",

    border: "1px solid rgba(139,92,246,0.2)",

    borderRadius: "28px",

    padding: "35px",

    marginBottom: "35px",

    backdropFilter: "blur(14px)",
  },

  filters: {
    display: "flex",

    gap: "15px",

    marginBottom: "25px",

    flexWrap: "wrap",

    background: "rgba(255,255,255,0.05)",

    padding: "20px",

    borderRadius: "20px",

    border: "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(12px)",
  },

  searchInput: {
    flex: 1,

    minWidth: "260px",

    padding: "15px",

    borderRadius: "14px",

    border: "none",

    outline: "none",

    background: "rgba(255,255,255,0.08)",

    color: "#fff",
  },

  select: {
    padding: "15px",

    borderRadius: "14px",

    border: "none",

    outline: "none",

    background: "rgba(255,255,255,0.08)",

    color: "#fff",

    minWidth: "220px",

    cursor: "pointer",
  },
  badgeTop: {
    color: "#c084fc",
    fontWeight: "600",
    marginBottom: "10px",
  },

  title: {
    margin: 0,
    fontSize: "38px",
    fontWeight: "800",
  },

  subtitle: {
    marginTop: "10px",
    color: "#cbd5e1",
  },

  /* ================= TABLA ================= */

  tableContainer: {
    background: "rgba(255,255,255,0.06)",

    border: "1px solid rgba(255,255,255,0.1)",

    borderRadius: "25px",

    overflowX: "auto",

    backdropFilter: "blur(14px)",
  },

  table: {
    width: "100%",

    borderCollapse: "collapse",

    color: "#fff",
  },

  th: {
    padding: "18px",

    textAlign: "left",

    background: "rgba(15,23,42,0.9)",

    fontWeight: "700",
  },

  td: {
    padding: "18px",

    borderBottom: "1px solid rgba(255,255,255,0.08)",

    color: "#e2e8f0",
  },

  tr: {
    transition: "0.3s",
  },

  userInfo: {
    display: "flex",

    alignItems: "center",

    gap: "15px",
  },

  avatar: {
    width: "50px",

    height: "50px",

    borderRadius: "50%",

    background: "linear-gradient(135deg,#7c3aed,#9333ea)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontWeight: "bold",

    fontSize: "20px",
  },

  idText: {
    margin: 0,

    fontSize: "13px",

    color: "#94a3b8",
  },

  roleSelect: {
    padding: "10px",

    borderRadius: "12px",

    border: "none",

    cursor: "pointer",

    fontWeight: "600",
  },

  deleteBtn: {
    background: "linear-gradient(135deg,#ef4444,#dc2626)",

    color: "#fff",

    border: "none",

    padding: "12px 18px",

    borderRadius: "12px",

    cursor: "pointer",

    fontWeight: "700",
  },

  empty: {
    textAlign: "center",

    padding: "40px",

    color: "#cbd5e1",
  },

  /* ================= LOAD ================= */

  center: {
    minHeight: "100vh",

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    alignItems: "center",

    gap: "20px",

    background: "#050816",
  },

  error: {
    color: "#ef4444",

    fontWeight: "bold",
  },

  loadingText: {
    color: "#fff",
  },

  loader: {
    width: "55px",

    height: "55px",

    border: "5px solid rgba(255,255,255,0.15)",

    borderTop: "5px solid #9333ea",

    borderRadius: "50%",
  },

  statsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: "20px",

    marginBottom: "35px",
  },

  statCard: {
    background:
      "rgba(255,255,255,0.06)",

    padding: "25px",

    borderRadius: "24px",

    border:
      "1px solid rgba(139,92,246,0.15)",

    backdropFilter: "blur(12px)",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.25)",
  },

  statIcon: {
    fontSize: "36px",
  },

  statTitle: {
    marginTop: "15px",

    color: "#cbd5e1",
  },

  statValue: {
    fontSize: "32px",

    fontWeight: "bold",

    marginTop: "10px",

    color: "#fff",
  },
};

export default styles;
