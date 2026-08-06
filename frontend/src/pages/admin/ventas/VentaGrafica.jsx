import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function VentaGrafica({
  ventas = [],
  formatoMoneda,
  styles,
}) {
 
  /* ================ PREPARAR DATOS ===================== */ 

  const datosGrafica = useMemo(() => {
    const ventasPorFecha = {};

    ventas.forEach((venta) => {
      if (!venta.createdAt) {
        return;
      }

      const fecha = new Date(venta.createdAt);

      if (Number.isNaN(fecha.getTime())) {
        return;
      }

      const claveFecha = fecha.toLocaleDateString("en-CA");

      if (!ventasPorFecha[claveFecha]) {
        ventasPorFecha[claveFecha] = {
          fecha: claveFecha,
          ventas: 0,
          ingresos: 0,
        };
      }

      ventasPorFecha[claveFecha].ventas += 1;

      ventasPorFecha[claveFecha].ingresos += Number(
        venta.total || 0
      );
    });

    return Object.values(ventasPorFecha)
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .map((item) => {
        const fecha = new Date(`${item.fecha}T00:00:00`);

        return {
          ...item,

          nombreFecha: fecha.toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "short",
          }),
        };
      });
  }, [ventas]);


  /* ================ SIN DATOS ========================== */

  if (datosGrafica.length === 0) {
    return (
      <div style={styles.rankingCard}>
        <h3 style={styles.rankingTitle}>
          📈 Evolución de ventas
        </h3>

        <p style={styles.rankingEmpty}>
          No hay datos suficientes para mostrar la evolución
          de ventas.
        </p>
      </div>
    );
  }

  
  /* ================= TOOLTIP =========================== */

  const formatearTooltip = (valor) => {
    return formatoMoneda
      ? formatoMoneda(valor)
      : `$${Number(valor).toLocaleString("es-CO")}`;
  };


  /* ======================= UI ========================== */

  return (
    <div style={styles.rankingCard}>
      {/* ================= HEADER ================= */}

      <div style={styles.rankingChartHeader}>
        <div>
          <h3 style={styles.rankingTitle}>
            📈 Evolución de ventas
          </h3>

          <p style={styles.rankingSubtitle}>
            Ingresos y cantidad de ventas por fecha
          </p>
        </div>

        <span style={styles.rankingBadge}>
          {datosGrafica.length}{" "}
          {datosGrafica.length === 1 ? "día" : "días"}
        </span>
      </div>

      {/* ================= GRAFICA ================= */}

      <div style={styles.rankingChartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={datosGrafica}
            margin={{
              top: 15,
              right: 20,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.10)"
            />

            {/* ================= EJE X ================= */}

            <XAxis
              dataKey="nombreFecha"
              stroke="#cbd5e1"
              tick={{
                fill: "#cbd5e1",
                fontSize: 12,
              }}
            />

            {/* ================= EJE INGRESOS ================= */}

            <YAxis
              yAxisId="ingresos"
              orientation="left"
              stroke="#8b5cf6"
              tick={{
                fill: "#cbd5e1",
                fontSize: 12,
              }}
              tickFormatter={(valor) =>
                `$${Number(valor).toLocaleString("es-CO")}`
              }
            />

            {/* ================= EJE VENTAS ================= */}

            <YAxis
              yAxisId="ventas"
              orientation="right"
              allowDecimals={false}
              stroke="#22c55e"
              tick={{
                fill: "#cbd5e1",
                fontSize: 12,
              }}
            />

            {/* ================= TOOLTIP ================= */}

            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
                fontWeight: "700",
                marginBottom: "6px",
              }}
              formatter={(valor, nombre) => {
                if (nombre === "Ingresos") {
                  return [
                    formatearTooltip(valor),
                    "💰 Ingresos",
                  ];
                }

                if (nombre === "Ventas") {
                  return [
                    `${valor} ${
                      Number(valor) === 1
                        ? "venta"
                        : "ventas"
                    }`,
                    "🛒 Ventas",
                  ];
                }

                return [valor, nombre];
              }}
            />

            {/* ================= LEYENDA ================= */}

            <Legend
              wrapperStyle={{
                paddingTop: "12px",
                color: "#e2e8f0",
              }}
            />

            {/* ================= LINEA INGRESOS ================= */}

            <Line
              yAxisId="ingresos"
              type="monotone"
              dataKey="ingresos"
              name="Ingresos"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#8b5cf6",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
              }}
            />

            {/* ================= LINEA VENTAS ================= */}

            <Line
              yAxisId="ventas"
              type="monotone"
              dataKey="ventas"
              name="Ventas"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#22c55e",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= PIE ================= */}

      <p style={styles.rankingFooter}>
        La gráfica compara los ingresos generados con la
        cantidad de transacciones realizadas en cada fecha.
      </p>
    </div>
  );
}