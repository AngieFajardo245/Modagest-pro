const styles = {


  container: {
    width: "100%"
  },


  header: {
    marginBottom: "30px"
  },


  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "700",
    color: "#ffffff"
  },


  subtitle: {
    marginTop: "8px",
    color: "#cbd5e1"
  },


  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  },


  statCard: {

    background:
      "rgba(255,255,255,0.06)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius: "20px",

    padding: "24px",

    backdropFilter: "blur(12px)",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.25)"

  },


  statIcon:{
    fontSize:"32px"
  },


  statTitle:{
    marginTop:"14px",
    color:"#cbd5e1"
  },


  statValue:{
    fontSize:"30px",
    fontWeight:"bold",
    marginTop:"10px",
    color:"#fff"
  },



  filters: {

    display:"flex",

    gap:"15px",

    marginBottom:"25px",

    flexWrap:"wrap",

    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    padding:"20px",

    borderRadius:"20px",

    backdropFilter:"blur(12px)"

  },



  searchInput:{

    flex:1,

    minWidth:"260px",

    padding:"14px",

    borderRadius:"14px",

    border:
      "1px solid rgba(255,255,255,0.15)",

    outline:"none",

    background:
      "rgba(255,255,255,0.08)",

    color:"#fff"

  },



  dateInput:{

    padding:"14px",

    borderRadius:"14px",

    border:
      "1px solid rgba(255,255,255,0.15)",

    background:
      "rgba(255,255,255,0.08)",

    color:"#fff",

    outline:"none"

  },



  filterBtn:{

    background:
      "linear-gradient(135deg,#7c3aed,#4f46e5)",

    color:"#fff",

    border:"none",

    padding:"14px 20px",

    borderRadius:"14px",

    cursor:"pointer",

    fontWeight:"600"

  },



  resetBtn:{

    background:
      "linear-gradient(135deg,#0ea5e9,#2563eb)",

    color:"#fff",

    border:"none",

    padding:"14px 20px",

    borderRadius:"14px",

    cursor:"pointer",

    fontWeight:"600"

  },



  tableContainer:{

    background:
      "rgba(255,255,255,0.05)",

    borderRadius:"24px",

    overflowX:"auto",

    border:
      "1px solid rgba(255,255,255,0.08)",

    backdropFilter:"blur(14px)"

  },



  table:{

    width:"100%",

    borderCollapse:"collapse"

  },



  th:{

    background:
      "rgba(15,23,42,0.9)",

    color:"#fff",

    padding:"18px",

    textAlign:"left",

    fontWeight:"600"

  },



  tr:{
    transition:"0.3s",
    cursor:"pointer"
  },



  td:{

    padding:"18px",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)",

    color:"#e2e8f0",

    verticalAlign:"top"

  },



  total:{

    padding:"18px",

    borderBottom:
      "1px solid rgba(255,255,255,0.08)",

    color:"#22c55e",

    fontWeight:"800"

  },



  userInfo:{

    display:"flex",

    alignItems:"center",

    gap:"14px"

  },



  avatar:{

    width:"48px",

    height:"48px",

    borderRadius:"50%",

    background:
      "linear-gradient(135deg,#8b5cf6,#7c3aed)",

    color:"#fff",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    fontWeight:"bold"

  },



  email:{

    margin:0,

    color:"#94a3b8",

    fontSize:"13px"

  },



  badge:{

    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",

    color:"#fff",

    padding:"8px 14px",

    borderRadius:"999px",

    fontSize:"13px",

    fontWeight:"600"

  },



  productsBox:{

    display:"flex",

    flexDirection:"column",

    gap:"10px"

  },


  productItem:{

    background:
      "rgba(255,255,255,0.06)",

    padding:"12px",

    borderRadius:"12px"

  },



  saleId:{

    fontWeight:"700",

    color:"#a78bfa"

  },



  empty:{

    textAlign:"center",

    padding:"40px",

    color:"#cbd5e1"

  },



  center:{

    minHeight:"300px",

    display:"flex",

    flexDirection:"column",

    justifyContent:"center",

    alignItems:"center",

    gap:"15px",

    color:"#fff"

  },



  loader:{

    width:"45px",

    height:"45px",

    border:
      "5px solid rgba(255,255,255,0.2)",

    borderTop:
      "5px solid #8b5cf6",

    borderRadius:"50%"

  },



  rankingCard:{

    background:
      "rgba(255,255,255,0.05)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    borderRadius:"20px",

    padding:"25px",

    marginBottom:"25px"

  },



  rankingTitle:{

    color:"#fff",

    marginBottom:"20px"

  },


  rankingItem:{

    display:"flex",

    justifyContent:"space-between",

    padding:"12px 0",

    color:"#e2e8f0"

  },


  rankingEmpty:{

    color:"#94a3b8"

  },



  modalOverlay:{

    position:"fixed",

    top:0,

    left:0,

    right:0,

    bottom:0,

    background:
      "rgba(0,0,0,0.6)",

    display:"flex",

    justifyContent:"center",

    alignItems:"center",

    zIndex:999

  },


  modal:{

    width:"90%",

    maxWidth:"500px",

    background:"#1e293b",

    borderRadius:"20px",

    padding:"25px",

    color:"#fff",

    maxHeight:"90vh",

    overflowY:"auto",

    boxShadow:
      "0 25px 50px rgba(0,0,0,0.45)"
  },


  modalHeader:{

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center"

  },


  closeBtn:{

    background:
      "rgba(255,255,255,0.1)",

    border:"none",

    color:"#fff",

    width:"35px",

    height:"35px",

    borderRadius:"50%",

    fontSize:"18px",

    cursor:"pointer"

},


  modalSection:{

    marginTop:"20px"

  },


  modalProduct:{

    background:
      "rgba(255,255,255,0.08)",

    padding:"12px",

    borderRadius:"12px",

    marginTop:"10px"

  },


  modalTotal:{

    marginTop:"20px",

    fontSize:"22px",

    color:"#22c55e",

    fontWeight:"bold"

  }

};


export default styles;