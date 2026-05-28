export default function UsuarioStats({
  totalUsuarios,
  totalAdmins,
  totalClientes,
  totalEmpleados
}) {

  return (

    <div style={styles.statsGrid}>

      <StatCard
        title="Usuarios"
        value={totalUsuarios}
        icon="👤"
      />

      <StatCard
        title="Admins"
        value={totalAdmins}
        icon="🛡️"
      />

      <StatCard
        title="Clientes"
        value={totalClientes}
        icon="🛍️"
      />

      <StatCard
        title="Empleados"
        value={totalEmpleados}
        icon="💼"
      />

    </div>

  );

}

function StatCard({
  title,
  value,
  icon
}) {

  return (

    <div style={styles.statCard}>

      <div style={styles.statIcon}>
        {icon}
      </div>

      <h4 style={styles.statTitle}>
        {title}
      </h4>

      <p style={styles.statValue}>
        {value}
      </p>

    </div>

  );

}

const styles = {

  statsGrid: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",

    gap: "20px",

    marginBottom: "35px"

  },

  statCard: {

    background:
      "rgba(255,255,255,0.05)",

    padding: "25px",

    borderRadius: "24px",

    border:
      "1px solid rgba(139,92,246,0.15)",

    backdropFilter: "blur(12px)"

  },

  statIcon: {

    fontSize: "36px"

  },

  statTitle: {

    marginTop: "15px",

    color: "#cbd5e1"

  },

  statValue: {

    fontSize: "32px",

    fontWeight: "bold",

    marginTop: "10px",

    color: "#fff"

  }

};