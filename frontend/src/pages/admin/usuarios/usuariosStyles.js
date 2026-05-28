const styles = {

  container: {
    minHeight: "100vh",
    padding: "35px",
    background:
      "radial-gradient(circle at top left, #312e81 0%, #0f172a 35%, #020617 100%)",
    color: "#fff"
  },

  header: {
    background:
      "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(76,29,149,0.18))",
    border:
      "1px solid rgba(139,92,246,0.2)",
    borderRadius: "28px",
    padding: "35px",
    marginBottom: "35px",
    backdropFilter: "blur(14px)"
  },

  badgeTop: {
    color: "#c084fc",
    fontWeight: "600",
    marginBottom: "10px"
  },

  title: {
    margin: 0,
    fontSize: "38px",
    fontWeight: "800"
  },

  subtitle: {
    marginTop: "10px",
    color: "#cbd5e1"
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    background: "#050816"
  },

  error: {
    color: "#ef4444",
    fontWeight: "bold"
  },

  loadingText: {
    color: "#fff"
  },

  loader: {
    width: "55px",
    height: "55px",
    border:
      "5px solid rgba(255,255,255,0.15)",
    borderTop:
      "5px solid #9333ea",
    borderRadius: "50%"
  }

};

export default styles;