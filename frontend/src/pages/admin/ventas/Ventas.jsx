import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

import VentaStats from "./VentaStats";
import VentaRanking from "./VentaRanking";
import VentaTable from "./VentaTable";
import VentaFilters from "./VentaFilters";
import VentaModal from "./VentaModal";
import styles from "./ventaStyles";

export default function AdminVentas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [busqueda, setBusqueda] = useState("");

  /* ===================================================== */
  /* ================= FORMATO MONEDA ==================== */
  /* ===================================================== */

  const formatoMoneda = (valor) => {
    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };

  /* ===================================================== */
  /* ================= OBTENER VENTAS ==================== */
  /* ===================================================== */

  const obtenerVentas = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/ventas");

      setVentas(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);

      alert("No se pudieron cargar las ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  /* ===================================================== */
  /* ================= FILTRO FECHAS ===================== */
  /* ===================================================== */

  const filtrarVentas = async () => {
    try {
      if (!desde || !hasta) {
        alert("Selecciona ambas fechas");

        return;
      }

      setLoading(true);

      const res = await api.get(`/admin/ventas?desde=${desde}&hasta=${hasta}`);

      setVentas(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);

      alert("Error filtrando ventas");
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================== */
  /* ================= BUSQUEDA ========================== */
  /* ===================================================== */
  const ventasFiltradas = useMemo(() => {
    const textoBusqueda = busqueda.toLowerCase();

    return ventas.filter((venta) => {
      const cliente = venta.Cliente?.nombre?.toLowerCase() || "";

      const productos = venta.Detalles?.map((d) => d.Producto?.nombre || "")
        .join(" ")
        .toLowerCase();

      return (
        cliente.includes(textoBusqueda) || productos.includes(textoBusqueda)
      );
    });
  }, [ventas, busqueda]);

  /* ===================================================== */
  /* ================= ESTADISTICAS ====================== */
  /* ===================================================== */

  const ingresosTotales = ventasFiltradas.reduce(
    (acc, venta) => acc + Number(venta.total || 0),
    0,
  );

  const totalVentas = ventasFiltradas.length;

  const productosVendidos = ventasFiltradas.reduce(
    (acc, venta) =>
      acc +
      (venta.Detalles?.reduce((sum, d) => sum + Number(d.cantidad || 0), 0) ||
        0),
    0,
  );

  const ventaPromedio = totalVentas > 0 ? ingresosTotales / totalVentas : 0;

  const rankingProductos = Object.entries(
    ventasFiltradas.reduce((acc, venta) => {
      venta.Detalles?.forEach((detalle) => {
        const nombre = detalle.Producto?.nombre || "Producto eliminado";

        acc[nombre] = (acc[nombre] || 0) + Number(detalle.cantidad || 0);
      });

      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  /* ===================================================== */
  /* ======================= UI ========================== */
  /* ===================================================== */

  return (
    <div style={styles.container}>
      {/* ================= HEADER ================= */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Gestión de Ventas</h1>

          <p style={styles.subtitle}>Historial completo de ventas realizadas</p>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <VentaStats
        ingresosTotales={ingresosTotales}
        totalVentas={totalVentas}
        productosVendidos={productosVendidos}
        ventaPromedio={ventaPromedio}
        formatoMoneda={formatoMoneda}
        styles={styles}
      />

      <VentaRanking rankingProductos={rankingProductos} styles={styles} />

      {/* ================= FILTROS ================= */}

      <VentaFilters
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        desde={desde}
        setDesde={setDesde}
        hasta={hasta}
        setHasta={setHasta}
        filtrarVentas={filtrarVentas}
        obtenerVentas={obtenerVentas}
        styles={styles}
      />

      {/* ================= TABLA ================= */}

      <div style={styles.tableContainer}>
        {loading ? (
          <div style={styles.center}>
            <div style={styles.loader}></div>
            <p>Cargando ventas...</p>
          </div>
        ) : ventasFiltradas.length === 0 ? (
          <div style={styles.empty}>No hay ventas registradas</div>
        ) : (
          <VentaTable
            ventasFiltradas={ventasFiltradas}
            formatoMoneda={formatoMoneda}
            styles={styles}
            abrirModal={setVentaSeleccionada}
          />
        )}
      </div>

      <VentaModal
        ventaSeleccionada={ventaSeleccionada}
        cerrarModal={() => setVentaSeleccionada(null)}
        formatoMoneda={formatoMoneda}
        styles={styles}
      />
    </div>
  );
}
