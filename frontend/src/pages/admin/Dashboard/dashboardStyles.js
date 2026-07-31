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

  boxShadow:
    "0 20px 45px rgba(0,0,0,0.35)",

  flexWrap: "wrap",

  gap: "20px"

},

activityCard: {

 background:
 "rgba(255,255,255,0.05)",

 border:
 "1px solid rgba(255,255,255,0.08)",

 borderRadius:"24px",

 padding:"28px",

 backdropFilter:"blur(14px)"

},


summaryCard: {

 background:
 "rgba(255,255,255,0.05)",

 border:
 "1px solid rgba(255,255,255,0.08)",

 borderRadius:"24px",

 padding:"28px",

 backdropFilter:"blur(14px)"

},


sectionHeader: {

 display:"flex",

 justifyContent:"space-between",

 alignItems:"center",

 marginBottom:"25px"

},


sectionTitle: {

 margin:0,

 fontSize:"22px",

 fontWeight:"700"

},


sectionBadge: {

 background:
 "rgba(16,185,129,0.18)",

 color:"#10b981",

 padding:"8px 14px",

 borderRadius:"999px",

 fontSize:"13px",

 fontWeight:"700"

},


activityList: {

 display:"flex",

 flexDirection:"column",

 gap:"18px"

},


activityItem: {

 display:"flex",

 alignItems:"center",

 gap:"16px",

 padding:"14px",

 borderRadius:"18px",

 background:
 "rgba(255,255,255,0.04)"

},


activityIcon: {

 width:"50px",

 height:"50px",

 borderRadius:"14px",

 background:
 "rgba(124,58,237,0.18)",

 display:"flex",

 alignItems:"center",

 justifyContent:"center",

 fontSize:"22px"

},


activityText: {

 margin:0,

 color:"#fff",

 fontWeight:"600"

},


activityTime: {

 color:"#94a3b8",

 fontSize:"13px"

},


summaryList: {

 display:"flex",

 flexDirection:"column",

 gap:"16px"

},


summaryRow: {

 display:"flex",

 justifyContent:"space-between",

 paddingBottom:"12px",

 borderBottom:
 "1px solid rgba(255,255,255,0.08)"

},


summaryLabel: {

 color:"#94a3b8"

},


summaryValue: {

 fontWeight:"700",

 color:"#fff"

},


heroLabel: {

  margin:0,

  color:"#e5e7eb",

  fontSize:"18px"

},


heroValue: {

  marginTop:"10px",

  fontSize:"42px",

  fontWeight:"800"

},


heroDescription: {

  marginTop:"10px",

  color:"#e5e7eb",

  maxWidth:"500px",

  lineHeight:"1.6"

},


heroIcon: {

  fontSize:"80px"

},

  loadingContainer: {
    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    flexDirection: "column",

    color: "#fff",
  },

  loadingText: {
    marginTop: "18px",

    color: "#d1d5db",
  },

  loader: {
    width: "60px",

    height: "60px",

    border: "6px solid rgba(255,255,255,0.1)",

    borderTop: "6px solid #8b5cf6",

    borderRadius: "50%",
  },

  error: {
    color: "#ef4444",

    fontWeight: "700",

    fontSize: "18px",
  },

  bottomGrid: {
    grid: {

  display:"grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(250px,1fr))",

  gap:"25px",

  marginBottom:"35px"

},


card: {

 background:
 "rgba(255,255,255,0.05)",

 borderRadius:"24px",

 padding:"28px",

 backdropFilter:
 "blur(14px)",

 border:
 "1px solid rgba(255,255,255,0.08)",

 boxShadow:
 "0 10px 35px rgba(0,0,0,0.25)"

},


iconBox: {

 width:"65px",

 height:"65px",

 borderRadius:"18px",

 display:"flex",

 alignItems:"center",

 justifyContent:"center",

 marginBottom:"20px",

 background:
 "rgba(124,58,237,0.18)"

},


icon: {

 fontSize:"30px"

},


cardTitle: {

 color:"#94a3b8",

 fontSize:"15px",

 marginBottom:"10px"

},


cardValue: {

 fontSize:"34px",

 margin:0,

 fontWeight:"800",

 color:"#fff"

},


cardDescription: {

 marginTop:"10px",

 color:"#94a3b8",

 fontSize:"14px"

},
  },
};

export default styles;
