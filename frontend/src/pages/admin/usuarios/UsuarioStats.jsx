import styles from "./usuariosStyles";

export default function UsuarioStats({
  totalUsuarios,
  totalAdmins,
  totalClientes,
  totalEmpleados,
}) {
  return (
    <div style={styles.statsGrid}>
      <StatCard title="Usuarios" value={totalUsuarios} icon="👤" />

      <StatCard title="Administradores" value={totalAdmins} icon="🛡️" />

      <StatCard title="Clientes" value={totalClientes} icon="🛍️" />

      <StatCard title="Empleados" value={totalEmpleados} icon="💼" />
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div
      style={{
        ...styles.statCard,

        cursor: "default",
      }}
    >
      <div style={styles.statIcon}>{icon}</div>

      <h4 style={styles.statTitle}>{title}</h4>

      <p style={styles.statValue}>{value}</p>
    </div>
  );
}
