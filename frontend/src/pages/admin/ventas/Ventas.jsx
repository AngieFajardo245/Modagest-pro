import { useEffect, useMemo, useState } from "react";

import api from "../../../services/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import VentaStats from "./VentaStats";
import VentaRanking from "./VentaRanking";
import VentaTable from "./VentaTable";
import VentaFilters from "./VentaFilters";
import VentaModal from "./VentaModal";
import VentaGrafica from "./VentaGrafica";
import styles from "./ventaStyles";

export default function AdminVentas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [busqueda, setBusqueda] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const [ventasPorPagina, setVentasPorPagina] = useState(10);

  const formatoMoneda = (valor) => {
    return Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };

  const obtenerNombreCliente = (venta) => {
    if (venta.clienteId === null || venta.clienteId === undefined) {
      return "Cliente General";
    }

    if (venta.Cliente?.nombre) {
      return venta.Cliente.nombre;
    }

    return "Cliente eliminado";
  };

  const obtenerEmailCliente = (venta) => {
    if (venta.clienteId === null || venta.clienteId === undefined) {
      return "cliente@modagest.com";
    }

    if (venta.Cliente?.email) {
      return venta.Cliente.email;
    }

    return "Sin correo";
  };

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

  const filtrarVentas = async () => {
    try {
      if (!desde || !hasta) {
        alert("Selecciona ambas fechas");
        return;
      }

      if (desde > hasta) {
        alert("La fecha inicial no puede ser mayor que la fecha final.");
        return;
      }

      setLoading(true);

      const res = await api.get(`/admin/ventas?desde=${desde}&hasta=${hasta}`);

      setVentas(Array.isArray(res.data) ? res.data : []);
      setPaginaActual(1);
    } catch (error) {
      console.error(error);
      alert("Error filtrando ventas");
    } finally {
      setLoading(false);
    }
  };

  const ventasFiltradas = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();

    if (!textoBusqueda) {
      return ventas;
    }

    return ventas.filter((venta) => {
      const cliente = obtenerNombreCliente(venta).toLowerCase();

      const email = obtenerEmailCliente(venta).toLowerCase();

      const productos =
        venta.Detalles?.map((detalle) => detalle.Producto?.nombre || "")
          .join(" ")
          .toLowerCase() || "";

      const metodoPago = venta.Pago?.metodoPago?.toLowerCase() || "";

      return (
        cliente.includes(textoBusqueda) ||
        email.includes(textoBusqueda) ||
        productos.includes(textoBusqueda) ||
        metodoPago.includes(textoBusqueda)
      );
    });
  }, [ventas, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(ventasFiltradas.length / ventasPorPagina),
  );

  const indiceInicio = (paginaActual - 1) * ventasPorPagina;
  const indiceFin = indiceInicio + ventasPorPagina;

  const ventasPaginadas = ventasFiltradas.slice(indiceInicio, indiceFin);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, ventasPorPagina]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const ingresosTotales = ventasFiltradas.reduce(
    (acc, venta) => acc + Number(venta.total || 0),
    0,
  );

  const totalVentas = ventasFiltradas.length;

  const productosVendidos = ventasFiltradas.reduce(
    (acc, venta) =>
      acc +
      (venta.Detalles?.reduce(
        (sum, detalle) => sum + Number(detalle.cantidad || 0),
        0,
      ) || 0),
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

  const exportarExcel = () => {
    if (ventasFiltradas.length === 0) {
      alert("No hay ventas para exportar.");
      return;
    }

    const datos = ventasFiltradas.map((venta) => ({
      Venta: venta.id,
      Cliente: obtenerNombreCliente(venta),
      Email: obtenerEmailCliente(venta),
      Productos:
        venta.Detalles?.map((detalle) => detalle.Producto?.nombre || "").join(
          ", ",
        ) || "",
      Cantidad:
        venta.Detalles?.reduce(
          (acc, detalle) => acc + Number(detalle.cantidad || 0),
          0,
        ) || 0,
      "Método de Pago": venta.Pago?.metodoPago || "Sin pago",
      Estado: venta.Pago?.estado || "Sin estado",
      Total: Number(venta.total || 0),
      Fecha: new Date(venta.createdAt).toLocaleString("es-CO"),
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hoja, "Ventas");

    const fecha = new Date();

    const nombreArchivo = `Ventas_ModaGest_${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1,
    ).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}.xlsx`;

    XLSX.writeFile(libro, nombreArchivo);
  };

  const exportarPDF = () => {
    if (ventasFiltradas.length === 0) {
      alert("No hay ventas para exportar.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text("ModaGest Pro", 14, 20);

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Reporte de Ventas", 14, 32);

    doc.setFontSize(10);
    doc.setTextColor(100);

    doc.text(
      `Fecha de generación: ${new Date().toLocaleString("es-CO")}`,
      14,
      40,
    );

    autoTable(doc, {
      startY: 48,
      head: [["Venta", "Cliente", "Método", "Estado", "Total"]],
      body: ventasFiltradas.map((venta) => [
        venta.id,
        obtenerNombreCliente(venta),
        venta.Pago?.metodoPago || "Sin pago",
        venta.Pago?.estado || "Sin estado",
        formatoMoneda(venta.total),
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
      },
    });

    const finalY = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(12);
    doc.setTextColor(40);

    doc.text(`Total ventas: ${totalVentas}`, 14, finalY);
    doc.text(`Productos vendidos: ${productosVendidos}`, 14, finalY + 8);
    doc.text(`Ingresos: ${formatoMoneda(ingresosTotales)}`, 14, finalY + 16);

    doc.setFontSize(9);
    doc.setTextColor(120);

    doc.text("Generado automáticamente por ModaGest Pro", 14, finalY + 35);

    doc.save("Reporte_Ventas_ModaGest.pdf");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Gestión de Ventas</h1>
          <p style={styles.subtitle}>Historial completo de ventas realizadas</p>
        </div>

        <div style={styles.headerButtons}>
          <button style={styles.excelBtn} onClick={exportarExcel}>
            📊 Exportar Excel
          </button>

          <button style={styles.pdfBtn} onClick={exportarPDF}>
            📄 Exportar PDF
          </button>

          <button style={styles.refreshBtn} onClick={obtenerVentas}>
            🔄 Actualizar
          </button>
        </div>
      </div>

      <VentaStats
        ingresosTotales={ingresosTotales}
        totalVentas={totalVentas}
        productosVendidos={productosVendidos}
        ventaPromedio={ventaPromedio}
        formatoMoneda={formatoMoneda}
        styles={styles}
      />

      <VentaRanking rankingProductos={rankingProductos} styles={styles} />

      <VentaGrafica
        ventas={ventasFiltradas}
        formatoMoneda={formatoMoneda}
        styles={styles}
      />

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

      <div style={styles.paginationControls}>
        <label style={styles.paginationLabel}>
          Mostrar:
          <select
            value={ventasPorPagina}
            onChange={(e) => {
              setVentasPorPagina(Number(e.target.value));
              setPaginaActual(1);
            }}
            style={styles.paginationSelect}
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          ventas por página
        </label>
      </div>

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
            ventasFiltradas={ventasPaginadas}
            formatoMoneda={formatoMoneda}
            styles={styles}
            abrirModal={setVentaSeleccionada}
            obtenerNombreCliente={obtenerNombreCliente}
            obtenerEmailCliente={obtenerEmailCliente}
          />
        )}
      </div>

      {ventasFiltradas.length > 0 && (
        <div style={styles.pagination}>
          <button
            type="button"
            style={styles.paginationBtn}
            onClick={() => setPaginaActual((pagina) => Math.max(pagina - 1, 1))}
            disabled={paginaActual === 1}
          >
            ← Anterior
          </button>

          <span style={styles.paginationInfo}>
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            type="button"
            style={styles.paginationBtn}
            onClick={() =>
              setPaginaActual((pagina) => Math.min(pagina + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
          >
            Siguiente →
          </button>
        </div>
      )}

      <VentaModal
        ventaSeleccionada={ventaSeleccionada}
        cerrarModal={() => setVentaSeleccionada(null)}
        formatoMoneda={formatoMoneda}
        styles={styles}
      />
    </div>
  );
}
