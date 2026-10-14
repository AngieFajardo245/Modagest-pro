const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    padding: "clamp(16px, 4vw, 35px)",
    overflowX: "hidden",
    background:
      "radial-gradient(circle at top left, #312e81 0%, #0f172a 35%, #020617 100%)",
    color: "#fff",
  },

  header: {
    width: "100%",
    boxSizing: "border-box",
    padding: "clamp(22px, 5vw, 35px)",
    marginBottom: "24px",
    overflow: "hidden",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: "clamp(20px, 5vw, 28px)",
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(76,29,149,0.18))",
    backdropFilter: "blur(14px)",
  },

  badgeTop: {
    margin: "0 0 10px",
    color: "#c084fc",
    fontSize: "clamp(13px, 3.5vw, 16px)",
    fontWeight: "600",
  },

  title: {
    margin: 0,
    maxWidth: "100%",
    color: "#fff",
    fontSize: "clamp(28px, 8vw, 38px)",
    lineHeight: 1.15,
    fontWeight: "800",
    overflowWrap: "break-word",
  },

  subtitle: {
    margin: "12px 0 0",
    maxWidth: "600px",
    color: "#cbd5e1",
    fontSize: "clamp(14px, 3.8vw, 16px)",
    lineHeight: 1.6,
  },

  addButton: {
    width: "fit-content",
    maxWidth: "100%",
    marginBottom: "24px",
    padding: "14px 24px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
    boxShadow: "0 10px 25px rgba(0,0,0,.25)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.3s",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
    gap: "clamp(12px, 3vw, 20px)",
    marginBottom: "28px",
  },

  statCard: {
    minWidth: 0,
    minHeight: "150px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "clamp(18px, 4vw, 25px)",
    border: "1px solid rgba(139,92,246,0.15)",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  },

  statIcon: {
    display: "flex",
    alignItems: "center",
    minHeight: "32px",
    color: "#fff",
    fontSize: "clamp(27px, 7vw, 36px)",
  },

  statTitle: {
    margin: "12px 0 0",
    color: "#cbd5e1",
    fontSize: "clamp(14px, 4vw, 18px)",
    lineHeight: 1.3,
    overflowWrap: "break-word",
  },

  statValue: {
    margin: "8px 0 0",
    color: "#fff",
    fontSize: "clamp(26px, 7vw, 32px)",
    fontWeight: "700",
  },

  filters: {
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    marginBottom: "24px",
    padding: "clamp(15px, 4vw, 20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
  },

  searchInput: {
    flex: "1 1 240px",
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    outline: "none",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "15px",
  },

  select: {
    flex: "1 1 200px",
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    outline: "none",
    background: "#1e293b",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
  },

  filterBtn: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  tableContainer: {
    width: "100%",
    boxSizing: "border-box",
    overflowX: "auto",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(14px)",
    WebkitOverflowScrolling: "touch",
  },

  table: {
    width: "100%",
    minWidth: "760px",
    borderCollapse: "collapse",
    color: "#fff",
  },

  th: {
    padding: "16px",
    textAlign: "left",
    whiteSpace: "nowrap",
    background: "rgba(15,23,42,0.9)",
    fontWeight: "700",
  },

  td: {
    padding: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#e2e8f0",
    verticalAlign: "middle",
  },

  tr: {
    transition: "0.3s",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  avatar: {
    width: "44px",
    height: "44px",
    flexShrink: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#7c3aed,#9333ea)",
    fontSize: "18px",
    fontWeight: "700",
  },

  idText: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
  },

  roleSelect: {
    padding: "10px",
    border: "none",
    borderRadius: "12px",
    background: "#e2e8f0",
    color: "#111827",
    fontWeight: "600",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "11px 16px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#ef4444,#dc2626)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  empty: {
    padding: "35px 18px",
    textAlign: "center",
    color: "#cbd5e1",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
    boxSizing: "border-box",
    background: "#050816",
    textAlign: "center",
  },

  error: {
    color: "#ef4444",
    fontWeight: "700",
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

  errorBox: {
    marginBottom: "20px",
    padding: "12px",
    border: "1px solid rgba(239,68,68,.45)",
    borderRadius: "12px",
    background: "rgba(239,68,68,.15)",
    color: "#fecaca",
    fontWeight: "600",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    boxSizing: "border-box",
    overflowY: "auto",
    background: "rgba(0,0,0,.65)",
  },

  modal: {
    width: "min(500px, 100%)",
    maxHeight: "calc(100vh - 32px)",
    boxSizing: "border-box",
    overflowY: "auto",
    padding: "clamp(20px, 5vw, 30px)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "20px",
    background: "#111827",
    boxShadow: "0 25px 60px rgba(0,0,0,.45)",
  },

  modalTitle: {
    margin: "0 0 25px",
    color: "#fff",
    fontSize: "clamp(21px, 6vw, 24px)",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "18px",
    padding: "14px",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "12px",
    outline: "none",
    background: "#1f2937",
    color: "#fff",
    fontSize: "15px",
  },

  modalButtons: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "15px",
  },

  cancelButton: {
    flex: "1 1 120px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "12px",
    background: "#374151",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  saveButton: {
    flex: "1 1 120px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#7c3aed,#2563eb)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default styles;