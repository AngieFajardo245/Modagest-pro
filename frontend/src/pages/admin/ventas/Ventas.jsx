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

  const formatoMoneda = (valor) =>
    Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const obtenerNombreCliente = (venta) => {
    if (venta?.Cliente?.nombre) {
      return venta.Cliente.nombre;
    }

    if (venta?.clienteId === null || venta?.clienteId === undefined) {
      return "Cliente General";
    }

    return "Cliente eliminado";
  };

  const obtenerEmailCliente = (venta) => {
    if (venta?.Cliente?.email) {
      return venta.Cliente.email;
    }

    if (venta?.clienteId === null || venta?.clienteId === undefined) {
      return "cliente@modagest.com";
    }

    return "Sin correo";
  };

  const obtenerVentas = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/ventas");

      setVentas(Array.isArray(res.data) ? res.data : []);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error obteniendo ventas:", error);
      setVentas([]);
      alert("No se pudieron cargar las ventas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerVentas();
  }, []);

  const filtrarVentas = async () => {
    if (!desde && !hasta) {
      setPaginaActual(1);
      return;
    }

    if (!desde || !hasta) {
      alert("Selecciona la fecha inicial y la fecha final.");
      return;
    }

    if (desde > hasta) {
      alert("La fecha inicial no puede ser mayor que la fecha final.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get("/admin/ventas", {
        params: {
          desde,
          hasta,
        },
      });

      setVentas(Array.isArray(res.data) ? res.data : []);
      setPaginaActual(1);
    } catch (error) {
      console.error("Error filtrando ventas:", error);
      alert("No se pudieron filtrar las ventas.");
    } finally {
      setLoading(false);
    }
  };

  const ventasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return ventas;
    }

    return ventas.filter((venta) => {
      const cliente = obtenerNombreCliente(venta).toLowerCase();
      const email = obtenerEmailCliente(venta).toLowerCase();

      const productos = Array.isArray(venta?.Detalles)
        ? venta.Detalles.map((detalle) => detalle?.Producto?.nombre || "")
            .join(" ")
            .toLowerCase()
        : "";

      const metodoPago = String(venta?.Pago?.metodoPago || "").toLowerCase();

      const estadoPago = String(venta?.Pago?.estado || "").toLowerCase();

      const idVenta = String(venta?.id || "").toLowerCase();

      return (
        cliente.includes(texto) ||
        email.includes(texto) ||
        productos.includes(texto) ||
        metodoPago.includes(texto) ||
        estadoPago.includes(texto) ||
        idVenta.includes(texto)
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

  const ingresosTotales = useMemo(
    () =>
      ventasFiltradas.reduce(
        (total, venta) => total + Number(venta?.total || 0),
        0,
      ),
    [ventasFiltradas],
  );

  const totalVentas = ventasFiltradas.length;

  const productosVendidos = useMemo(
    () =>
      ventasFiltradas.reduce((total, venta) => {
        if (!Array.isArray(venta?.Detalles)) {
          return total;
        }

        return (
          total +
          venta.Detalles.reduce(
            (subtotal, detalle) => subtotal + Number(detalle?.cantidad || 0),
            0,
          )
        );
      }, 0),
    [ventasFiltradas],
  );

  const ventaPromedio = totalVentas > 0 ? ingresosTotales / totalVentas : 0;

  const rankingProductos = useMemo(() => {
    const productos = {};

    ventasFiltradas.forEach((venta) => {
      if (!Array.isArray(venta?.Detalles)) {
        return;
      }

      venta.Detalles.forEach((detalle) => {
        const nombre = detalle?.Producto?.nombre || "Producto eliminado";

        const cantidad = Number(detalle?.cantidad || 0);

        productos[nombre] = (productos[nombre] || 0) + cantidad;
      });
    });

    return Object.entries(productos).sort((a, b) => b[1] - a[1]);
  }, [ventasFiltradas]);

  const exportarExcel = () => {
    if (ventasFiltradas.length === 0) {
      alert("No hay ventas para exportar.");
      return;
    }

    const datos = ventasFiltradas.map((venta) => {
      const detalles = Array.isArray(venta?.Detalles) ? venta.Detalles : [];

      return {
        Venta: `#${String(venta?.id || 0).padStart(5, "0")}`,
        Cliente: obtenerNombreCliente(venta),
        Email: obtenerEmailCliente(venta),
        "Dirección de entrega":
          venta?.direccionEntrega || "Sin dirección registrada",
        Ciudad: venta?.ciudadEntrega || "Sin registrar",
        Teléfono: venta?.telefonoEntrega || "Sin registrar",
        Productos:
          detalles
            .map((detalle) => detalle?.Producto?.nombre || "Producto eliminado")
            .join(", ") || "Sin productos",
        Cantidad: detalles.reduce(
          (total, detalle) => total + Number(detalle?.cantidad || 0),
          0,
        ),
        "Método de Pago": venta?.Pago?.metodoPago || "Sin pago",
        Estado: venta?.Pago?.estado || "Sin estado",
        Total: Number(venta?.total || 0),
        Fecha: venta?.createdAt ? new Date(venta.createdAt) : null,
      };
    });

    const hojaVentas = XLSX.utils.json_to_sheet(datos);

    hojaVentas["!cols"] = [
      { wch: 12 },
      { wch: 24 },
      { wch: 32 },
      { wch: 42 },
      { wch: 20 },
      { wch: 18 },
      { wch: 42 },
      { wch: 12 },
      { wch: 20 },
      { wch: 16 },
      { wch: 18 },
      { wch: 24 },
    ];

    hojaVentas["!autofilter"] = {
      ref: `A1:L${datos.length + 1}`,
    };

    for (let fila = 2; fila <= datos.length + 1; fila++) {
      const celdaTotal = hojaVentas[`K${fila}`];

      if (celdaTotal) {
        celdaTotal.t = "n";
        celdaTotal.z = '"$"#,##0';
      }

      const celdaFecha = hojaVentas[`L${fila}`];

      if (
        celdaFecha &&
        celdaFecha.v instanceof Date &&
        !Number.isNaN(celdaFecha.v.getTime())
      ) {
        celdaFecha.t = "d";
        celdaFecha.z = "dd/mm/yyyy hh:mm AM/PM";
      }
    }

    const resumen = [
      ["ModaGest Pro"],
      ["Reporte de ventas"],
      [],
      ["Total de ventas", totalVentas],
      ["Productos vendidos", productosVendidos],
      ["Ingresos totales", ingresosTotales],
      ["Venta promedio", ventaPromedio],
      [],
      ["Fecha de generación", new Date()],
    ];

    const hojaResumen = XLSX.utils.aoa_to_sheet(resumen);

    hojaResumen["!cols"] = [{ wch: 28 }, { wch: 25 }];

    if (hojaResumen["B6"]) {
      hojaResumen["B6"].t = "n";
      hojaResumen["B6"].z = '"$"#,##0';
    }

    if (hojaResumen["B7"]) {
      hojaResumen["B7"].t = "n";
      hojaResumen["B7"].z = '"$"#,##0';
    }

    if (hojaResumen["B9"] && hojaResumen["B9"].v instanceof Date) {
      hojaResumen["B9"].t = "d";
      hojaResumen["B9"].z = "dd/mm/yyyy hh:mm AM/PM";
    }

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(libro, hojaVentas, "Ventas");

    XLSX.utils.book_append_sheet(libro, hojaResumen, "Resumen");

    const fecha = new Date();

    const nombreArchivo =
      `Ventas_ModaGest_${fecha.getFullYear()}-` +
      `${String(fecha.getMonth() + 1).padStart(2, "0")}-` +
      `${String(fecha.getDate()).padStart(2, "0")}.xlsx`;

    XLSX.writeFile(libro, nombreArchivo);
  };

  const exportarPDF = () => {
    if (ventasFiltradas.length === 0) {
      alert("No hay ventas para exportar.");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const fechaGeneracion = new Date().toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const formatearFecha = (valor) => {
      if (!valor) {
        return "Sin fecha";
      }

      const fecha = new Date(valor);

      if (Number.isNaN(fecha.getTime())) {
        return "Sin fecha";
      }

      return fecha.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const dibujarEncabezado = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229);
      doc.text("ModaGest Pro", 14, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.setTextColor(30, 30, 30);
      doc.text("Reporte de Ventas", 14, 28);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha de generación: ${fechaGeneracion}`, 14, 36);
    };

    const dibujarPiePagina = () => {
      const pagina = doc.internal.getNumberOfPages();
      const ancho = doc.internal.pageSize.getWidth();
      const alto = doc.internal.pageSize.getHeight();

      doc.setDrawColor(220, 220, 220);
      doc.line(14, alto - 14, ancho - 14, alto - 14);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);

      doc.text("Generado automáticamente por ModaGest Pro", 14, alto - 8);

      doc.text(`Página ${pagina}`, ancho - 14, alto - 8, {
        align: "right",
      });
    };

    autoTable(doc, {
      startY: 45,
      margin: {
        top: 45,
        right: 14,
        bottom: 20,
        left: 14,
      },
      head: [
        [
          "Venta",
          "Cliente",
          "Dirección de entrega",
          "Ciudad",
          "Teléfono",
          "Método de pago",
          "Estado",
          "Total",
          "Fecha",
        ],
      ],

      body: ventasFiltradas.map((venta) => [
        `#${String(venta?.id || 0).padStart(5, "0")}`,
        obtenerNombreCliente(venta),
        venta?.direccionEntrega || "Sin registrar",
        venta?.ciudadEntrega || "Sin registrar",
        venta?.telefonoEntrega || "Sin registrar",
        venta?.Pago?.metodoPago || "Sin pago",
        venta?.Pago?.estado || "Sin estado",
        formatoMoneda(venta?.total),
        formatearFecha(venta?.createdAt),
      ]),

      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 3,
        textColor: [30, 30, 30],
        lineColor: [210, 210, 210],
        lineWidth: 0.2,
        valign: "middle",
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
        halign: "center",
        valign: "middle",
      },
      alternateRowStyles: {
        fillColor: [248, 248, 252],
      },
      columnStyles: {
        0: { cellWidth: 16, halign: "center" },
        1: { cellWidth: 34 },
        2: { cellWidth: 52 },
        3: { cellWidth: 25 },
        4: { cellWidth: 28 },
        5: { cellWidth: 30, halign: "center" },
        6: { cellWidth: 23, halign: "center" },
        7: { cellWidth: 25, halign: "right" },
        8: { cellWidth: 32, halign: "center" },
      },
      willDrawPage: () => {
        dibujarEncabezado();
      },
      didDrawPage: () => {
        dibujarPiePagina();
      },
    });

    let finalY = (doc.lastAutoTable?.finalY || 45) + 15;

    const altoPagina = doc.internal.pageSize.getHeight();

    if (finalY > altoPagina - 60) {
      doc.addPage();
      dibujarEncabezado();
      finalY = 50;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text("Resumen del reporte", 14, finalY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(`Total de ventas: ${totalVentas}`, 14, finalY + 10);

    doc.text(`Productos vendidos: ${productosVendidos}`, 14, finalY + 18);

    doc.text(
      `Ingresos totales: ${formatoMoneda(ingresosTotales)}`,
      14,
      finalY + 26,
    );

    doc.text(
      `Venta promedio: ${formatoMoneda(ventaPromedio)}`,
      14,
      finalY + 34,
    );

    dibujarPiePagina();

    const fecha = new Date();

    const nombreArchivo =
      `Reporte_Ventas_ModaGest_${fecha.getFullYear()}-` +
      `${String(fecha.getMonth() + 1).padStart(2, "0")}-` +
      `${String(fecha.getDate()).padStart(2, "0")}.pdf`;

    doc.save(nombreArchivo);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 Gestión de Ventas</h1>

          <p style={styles.subtitle}>Historial completo de ventas realizadas</p>
        </div>

        <div style={styles.headerButtons}>
          <button type="button" style={styles.excelBtn} onClick={exportarExcel}>
            📊 Exportar Excel
          </button>

          <button type="button" style={styles.pdfBtn} onClick={exportarPDF}>
            📄 Exportar PDF
          </button>

          <button
            type="button"
            style={styles.refreshBtn}
            onClick={obtenerVentas}
            disabled={loading}
          >
            🔄 {loading ? "Cargando..." : "Actualizar"}
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
          <div style={styles.empty}>No hay ventas registradas.</div>
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
            style={{
              ...styles.paginationBtn,
              opacity: paginaActual === 1 ? 0.5 : 1,
              cursor: paginaActual === 1 ? "not-allowed" : "pointer",
            }}
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
            style={{
              ...styles.paginationBtn,
              opacity: paginaActual === totalPaginas ? 0.5 : 1,
              cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer",
            }}
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
