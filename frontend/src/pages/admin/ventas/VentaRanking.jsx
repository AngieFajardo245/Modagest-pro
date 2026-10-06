import { FaTrophy } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function VentaRanking({ rankingProductos = [], styles }) {
  const datosGrafica = rankingProductos
    .slice(0, 8)
    .map(([nombre, cantidad]) => {
      const nombreProducto = String(nombre || "Producto");

      return {
        nombre:
          nombreProducto.length > 18
            ? `${nombreProducto.substring(0, 18)}...`
            : nombreProducto,
        nombreCompleto: nombreProducto,
        cantidad: Number(cantidad || 0),
      };
    });

  if (datosGrafica.length === 0) {
    return (
      <div style={styles.rankingCard}>
        <h3 style={styles.rankingTitle}>
          <FaTrophy style={{ marginRight: "8px", verticalAlign: "middle" }} />
          Productos más vendidos
        </h3>

        <p style={styles.rankingEmpty}>No hay productos vendidos todavía.</p>
      </div>
    );
  }

  return (
    <div style={styles.rankingCard}>
      <div style={styles.rankingChartHeader}>
        <div>
          <h3 style={styles.rankingTitle}>
            <FaTrophy style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Productos más vendidos
          </h3>

          <p style={styles.rankingSubtitle}>
            Comparación de productos por unidades vendidas
          </p>
        </div>

        <span style={styles.rankingBadge}>Top {datosGrafica.length}</span>
      </div>

      <div style={styles.rankingChartContainer}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={datosGrafica}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
            />

            <XAxis
              dataKey="nombre"
              stroke="#94a3b8"
              tick={{
                fill: "#cbd5e1",
                fontSize: 12,
              }}
              axisLine={{
                stroke: "rgba(255,255,255,0.1)",
              }}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              stroke="#94a3b8"
              tick={{
                fill: "#cbd5e1",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: "rgba(255,255,255,0.04)",
              }}
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                color: "#ffffff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
              labelStyle={{
                color: "#ffffff",
                fontWeight: "600",
                marginBottom: "4px",
              }}
              formatter={(value) => [
                `${value} ${Number(value) === 1 ? "unidad" : "unidades"}`,
                "Vendidos",
              ]}
              labelFormatter={(_, payload) => {
                return payload?.[0]?.payload?.nombreCompleto || "";
              }}
            />

            <Bar
              dataKey="cantidad"
              name="Productos vendidos"
              fill="#8b5cf6"
              radius={[8, 8, 0, 0]}
              maxBarSize={55}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p style={styles.rankingFooter}>
        Se muestran los productos con mayor cantidad de unidades vendidas.
      </p>
    </div>
  );
}
