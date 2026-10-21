Object.assign(styles, {
  container: {
    ...styles.container,
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: "clamp(8px, 2vw, 20px)",
  },

  heroCard: {
    ...styles.heroCard,
    padding: "clamp(18px, 3vw, 32px)",
    borderRadius: "22px",
    marginBottom: "20px",
    gap: "12px",
    flexWrap: "nowrap",
    minWidth: 0,
  },

  heroContent: {
    flex: "1 1 0",
    minWidth: 0,
  },

  heroLabel: {
    margin: 0,
    color: "#ede9fe",
    fontSize: "clamp(14px, 2vw, 18px)",
  },

  heroValue: {
    margin: "8px 0",
    fontSize: "clamp(26px, 5vw, 42px)",
    fontWeight: 800,
    lineHeight: 1.15,
    overflowWrap: "anywhere",
  },

  heroDescription: {
    margin: 0,
    color: "#ede9fe",
    fontSize: "clamp(12px, 1.8vw, 15px)",
    maxWidth: "500px",
    lineHeight: 1.5,
  },

  heroIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "clamp(28px, 6vw, 64px)",
  },

  grid: {
    ...styles.grid,
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 155px), 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },

  card: {
    ...styles.card,
    minWidth: 0,
    padding: "clamp(16px, 2.5vw, 26px)",
    borderRadius: "20px",
  },

  iconBox: {
    ...styles.iconBox,
    width: "44px",
    height: "44px",
    borderRadius: "13px",
    marginBottom: "12px",
  },

  icon: {
    fontSize: "23px",
  },

  cardTitle: {
    ...styles.cardTitle,
    fontSize: "13px",
    margin: "0 0 8px",
  },

  cardValue: {
    ...styles.cardValue,
    fontSize: "clamp(22px, 3vw, 32px)",
    lineHeight: 1.2,
    overflowWrap: "anywhere",
  },

  cardDescription: {
    ...styles.cardDescription,
    fontSize: "12px",
    marginTop: "8px",
    lineHeight: 1.4,
  },

  periodGrid: {
    ...styles.periodGrid,
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
    gap: "12px",
    marginTop: "14px",
    marginBottom: "20px",
  },

  periodCard: {
    ...styles.periodCard,
    minWidth: 0,
    padding: "16px",
    gap: "12px",
    flexWrap: "wrap",
  },

  periodValue: {
    ...styles.periodValue,
    fontSize: "clamp(20px, 3vw, 24px)",
    overflowWrap: "anywhere",
  },

  chartCard: {
    ...styles.chartCard,
    minWidth: 0,
    padding: "clamp(16px, 2.5vw, 28px)",
    marginBottom: "20px",
  },

  bottomGrid: {
    ...styles.bottomGrid,
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  activityCard: {
    ...styles.activityCard,
    minWidth: 0,
    padding: "clamp(16px, 2.5vw, 28px)",
  },

  summaryCard: {
    ...styles.summaryCard,
    minWidth: 0,
    padding: "clamp(16px, 2.5vw, 28px)",
  },

  sectionHeader: {
    ...styles.sectionHeader,
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "18px",
  },

  sectionTitle: {
    ...styles.sectionTitle,
    fontSize: "clamp(18px, 2.5vw, 22px)",
  },

  summaryRow: {
    ...styles.summaryRow,
    flexWrap: "wrap",
    gap: "8px",
  },

  summaryValue: {
    ...styles.summaryValue,
    overflowWrap: "anywhere",
  },

  paymentRow: {
    ...styles.paymentRow,
    flexWrap: "wrap",
    gap: "8px",
  },

  activityText: {
    ...styles.activityText,
    overflowWrap: "anywhere",
  },
});