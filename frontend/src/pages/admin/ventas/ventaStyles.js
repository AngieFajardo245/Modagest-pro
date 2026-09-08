const styles = {
  container: {
    width: "100%",
    boxSizing: "border-box",
  },

  header: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },

  headerButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  excelBtn: {
    background: "linear-gradient(135deg,#16a34a,#22c55e)",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: ".3s",
    whiteSpace: "nowrap",
  },

  pdfBtn: {
    background: "linear-gradient(135deg,#dc2626,#ef4444)",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: ".3s",
    whiteSpace: "nowrap",
  },

  refreshBtn: {
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: ".3s",
    whiteSpace: "nowrap",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "700",
    color: "#ffffff",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#cbd5e1",
    fontSize: "15px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  statCard: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "24px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 25px rgba(0,0,0,.25)",
    transition: ".3s",
    minWidth: 0,
  },

  statIcon: {
    fontSize: "34px",
    marginBottom: "8px",
  },

  statTitle: {
    marginTop: "14px",
    marginBottom: 0,
    color: "#e2e8f0",
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },

  statValue: {
    fontSize: "30px",
    fontWeight: "800",
    marginTop: "10px",
    marginBottom: 0,
    color: "#ffffff",
    overflowWrap: "anywhere",
  },

  statDescription: {
    marginTop: "8px",
    marginBottom: 0,
    color: "rgba(255,255,255,0.72)",
    fontSize: "13px",
    lineHeight: "18px",
    opacity: 0.85,
  },

  filters: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    alignItems: "flex-end",
    marginBottom: "25px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "20px",
    backdropFilter: "blur(12px)",
  },

  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: "180px",
    flex: "1 1 180px",
  },

  filterLabel: {
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },

  filterButtons: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    flex: "0 0 auto",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,.15)",
    background: "rgba(255,255,255,.08)",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
  },

  dateInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,.15)",
    background: "rgba(255,255,255,.08)",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
  },

  filterBtn: {
    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
    color: "#fff",
    border: "none",
    padding: "14px 22px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  resetBtn: {
    background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
    color: "#fff",
    border: "none",
    padding: "14px 22px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  paginationControls: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "15px",
  },

  paginationLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "600",
  },

  paginationSelect: {
    background: "#1e293b",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,.15)",
    borderRadius: "10px",
    padding: "8px 12px",
    outline: "none",
    cursor: "pointer",
    fontWeight: "600",
  },

  tableContainer: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "24px",
    overflowX: "auto",
    overflowY: "hidden",
    border: "1px solid rgba(255,255,255,.08)",
    backdropFilter: "blur(14px)",
    WebkitOverflowScrolling: "touch",
  },

  table: {
    width: "100%",
    minWidth: "1050px",
    borderCollapse: "collapse",
    borderSpacing: 0,
  },

  thead: {
    background: "rgba(15,23,42,.95)",
  },

  th: {
    background: "rgba(15,23,42,.95)",
    color: "#ffffff",
    padding: "16px 18px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "13px",
    whiteSpace: "nowrap",
    borderBottom: "1px solid rgba(255,255,255,.10)",
  },

  tr: {
    transition: ".25s",
    cursor: "pointer",
  },

  td: {
    padding: "16px 18px",
    borderBottom: "1px solid rgba(255,255,255,.08)",
    color: "#e2e8f0",
    verticalAlign: "top",
    fontSize: "14px",
  },

  total: {
    padding: "16px 18px",
    borderBottom: "1px solid rgba(255,255,255,.08)",
    color: "#22c55e",
    fontWeight: "800",
    fontSize: "15px",
    whiteSpace: "nowrap",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "190px",
  },

  avatar: {
    width: "44px",
    height: "44px",
    minWidth: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
    fontSize: "16px",
  },

  email: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: "16px",
  },

  badge: {
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
  },

  productsBox: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    minWidth: "210px",
    maxWidth: "280px",
  },

  productItem: {
    background: "rgba(255,255,255,.06)",
    padding: "9px 11px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },

  saleId: {
    fontWeight: "700",
    color: "#a78bfa",
    whiteSpace: "nowrap",
  },

  empty: {
    textAlign: "center",
    padding: "50px 30px",
    color: "#cbd5e1",
  },

  center: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    color: "#fff",
  },

  loader: {
    width: "45px",
    height: "45px",
    border: "5px solid rgba(255,255,255,.2)",
    borderTop: "5px solid #8b5cf6",
    borderRadius: "50%",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "18px",
    padding: "20px",
    borderTop: "1px solid rgba(255,255,255,.08)",
    flexWrap: "wrap",
  },

  paginationBtn: {
    background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: ".25s",
  },

  paginationInfo: {
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  rankingCard: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "22px",
    padding: "25px",
    marginBottom: "25px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 25px rgba(0,0,0,.20)",
    boxSizing: "border-box",
    width: "100%",
  },

  rankingChartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },

  rankingTitle: {
    color: "#ffffff",
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
  },

  rankingSubtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "20px",
  },

  rankingBadge: {
    background: "rgba(139,92,246,.18)",
    border: "1px solid rgba(139,92,246,.35)",
    color: "#c4b5fd",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  rankingChartContainer: {
    width: "100%",
    height: "320px",
    marginTop: "15px",
    minWidth: 0,
  },

  rankingFooter: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "18px",
  },

  rankingItem: {
    marginBottom: "22px",
  },

  rankingInfo: {
    width: "100%",
  },

  rankingHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    gap: "10px",
  },

  rankingName: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "15px",
  },

  rankingValue: {
    color: "#22c55e",
    fontSize: "16px",
    fontWeight: "700",
  },

  progressBar: {
    width: "100%",
    height: "12px",
    background: "rgba(255,255,255,.08)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg,#7c3aed,#22c55e)",
    transition: "width .5s ease",
  },

  rankingPercent: {
    display: "block",
    marginTop: "6px",
    color: "#94a3b8",
    fontSize: "12px",
  },

  rankingEmpty: {
    color: "#cbd5e1",
    margin: 0,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,.72)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 999,
    backdropFilter: "blur(4px)",
  },

  modal: {
    width: "90%",
    maxWidth: "560px",
    background:
      "linear-gradient(145deg, rgba(30,41,59,.98), rgba(15,23,42,.98))",
    border: "1px solid rgba(255,255,255,.10)",
    borderRadius: "22px",
    padding: "26px",
    color: "#fff",
    maxHeight: "90vh",
    overflow: "hidden auto",
    boxShadow: "0 25px 60px rgba(0,0,0,.55)",
    boxSizing: "border-box",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
    color: "#ffffff",
  },

  modalSubtitle: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },

  viewBtn: {
    background: "linear-gradient(135deg,#7c3aed,#8b5cf6)",
    color: "#fff",
    border: "none",
    padding: "9px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: ".25s",
    whiteSpace: "nowrap",
  },

  closeBtn: {
    flexShrink: 0,
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.10)",
    color: "#fff",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: ".2s",
  },

  modalCard: {
    background: "rgba(255,255,255,.045)",
    border: "1px solid rgba(255,255,255,.075)",
    borderRadius: "16px",
    padding: "18px",
    marginTop: "18px",
    boxSizing: "border-box",
  },

  modalEmpty: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },

  modalProduct: {
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.06)",
    padding: "14px",
    borderRadius: "13px",
    marginTop: "10px",
  },

  productHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },

  productQuantity: {
    background: "#7c3aed",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    flexShrink: 0,
  },

  productInfo: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
    color: "#cbd5e1",
    fontSize: "14px",
    marginTop: "6px",
  },

  modalTotal: {
    marginTop: "22px",
    padding: "18px 4px 4px",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: "17px",
  },

  estadoBadge: {
    display: "inline-block",
    padding: "7px 14px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px",
    marginBottom: "8px",
    whiteSpace: "nowrap",
  },

  estadoAprobado: {
    background: "#16a34a",
    color: "#fff",
  },

  estadoPendiente: {
    background: "#f59e0b",
    color: "#fff",
  },

  estadoRechazado: {
    background: "#dc2626",
    color: "#fff",
  },

  estadoDefault: {
    background: "#64748b",
    color: "#fff",
  },

  metodoPago: {
    marginTop: "6px",
    color: "#cbd5e1",
    fontSize: "13px",
  },

  productName: {
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: "18px",
  },

  productQty: {
    marginLeft: "8px",
    color: "#94a3b8",
    fontSize: "13px",
  },

  fecha: {
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  hora: {
    color: "#94a3b8",
    fontSize: "13px",
    marginTop: "4px",
  },
};

export default styles;
