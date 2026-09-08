import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const METODOS = [
  { value: "Tarjeta", icon: "💳", title: "Tarjeta", text: "Débito o crédito" },
  { value: "PSE", icon: "🏦", title: "PSE", text: "Pago desde tu banco" },
  { value: "Nequi", icon: "📱", title: "Nequi", text: "Pago con tu celular" },
  {
    value: "Contra Entrega",
    icon: "📦",
    title: "Contra Entrega",
    text: "Paga al recibir",
  },
];

const DATOS_INICIALES = {
  titular: "",
  numeroTarjeta: "",
  vencimiento: "",
  cvv: "",
  banco: "",
  tipoPersona: "natural",
  correoPse: "",
  celularNequi: "",
};

function Carrito() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [datosPago, setDatosPago] = useState(DATOS_INICIALES);
  const [erroresPago, setErroresPago] = useState({});
  const [procesando, setProcesando] = useState(false);

  const token = localStorage.getItem("token");
  const rol = (localStorage.getItem("rol") || "").toLowerCase().trim();

  const obtenerClienteId = () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
      const id =
        usuario?.id ||
        usuario?.usuarioId ||
        usuario?.clienteId ||
        usuario?.usuario?.id ||
        usuario?.data?.id;
      if (Number.isInteger(Number(id)) && Number(id) > 0) {
        return Number(id);
      }
    } catch (err) {
      console.error("Error leyendo usuario:", err);
    }

    try {
      const payload = token
        ? JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
          )
        : null;
      const id =
        payload?.id ||
        payload?.usuarioId ||
        payload?.clienteId ||
        payload?.userId ||
        payload?.sub;
      if (Number.isInteger(Number(id)) && Number(id) > 0) {
        return Number(id);
      }
    } catch (err) {
      console.error("Error leyendo token:", err);
    }

    return null;
  };

  const clienteId = obtenerClienteId();
  const claveCarrito = clienteId ? `carrito_cliente_${clienteId}` : "carrito";

  const formatoMoneda = (valor) =>
    Number(valor || 0).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const obtenerCarritoGuardado = () => {
    try {
      const guardado = JSON.parse(localStorage.getItem(claveCarrito) || "[]");
      return Array.isArray(guardado) ? guardado : [];
    } catch {
      return [];
    }
  };

  const notificarCarrito = (nuevoCarrito) => {
    window.dispatchEvent(
      new CustomEvent("carritoActualizado", {
        detail: {
          clave: claveCarrito,
          claveCarrito,
          clienteId,
          carrito: nuevoCarrito,
        },
      }),
    );
  };

  const guardarCarrito = (nuevoCarrito) => {
    localStorage.setItem(claveCarrito, JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);
    notificarCarrito(nuevoCarrito);
  };

  const cargarCarrito = async () => {
    try {
      setCargando(true);
      setError("");
      const guardado = obtenerCarritoGuardado();

      if (!guardado.length) {
        setCarrito([]);
        return;
      }

      const response = await api.get("/productos");
      const productos = Array.isArray(response.data) ? response.data : [];
      const actualizado = guardado
        .map((producto) => {
          const actual = productos.find(
            (item) => Number(item.id) === Number(producto.id),
          );
          if (!actual) {
            return null;
          }
          const stock = Number(actual.stock || 0);
          const guardada = Number(producto.cantidad);
          const cantidadValida =
            Number.isInteger(guardada) && guardada > 0 ? guardada : 1;

          return {
            ...producto,
            id: actual.id,
            nombre: actual.nombre,
            descripcion: actual.descripcion || "",
            imagen: actual.imagen || "",
            precio: Number(actual.precio || 0),
            stock,
            cantidad: stock > 0 ? Math.min(cantidadValida, stock) : 0,
          };
        })
        .filter(Boolean);

      guardarCarrito(actualizado);
    } catch (err) {
      console.error("Error cargando carrito:", err);
      setError("No fue posible cargar el carrito. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCarrito();

    const actualizar = (event) => {
      const claveEvento = event?.detail?.claveCarrito || event?.detail?.clave;
      if (claveEvento && claveEvento !== claveCarrito) {
        return;
      }
      setCarrito(obtenerCarritoGuardado());
    };

    const manejarStorage = (event) => {
      if (event.key === claveCarrito) {
        actualizar();
      }
    };

    window.addEventListener("carritoActualizado", actualizar);
    window.addEventListener("storage", manejarStorage);

    return () => {
      window.removeEventListener("carritoActualizado", actualizar);
      window.removeEventListener("storage", manejarStorage);
    };
  }, [claveCarrito]);

  const total = useMemo(
    () =>
      carrito.reduce(
        (suma, producto) =>
          suma + Number(producto.precio || 0) * Number(producto.cantidad || 0),
        0,
      ),
    [carrito],
  );

  const totalUnidades = useMemo(
    () =>
      carrito.reduce(
        (suma, producto) => suma + Number(producto.cantidad || 0),
        0,
      ),
    [carrito],
  );

  const hayProblemasStock = carrito.some((producto) => {
    const stock = Number(producto.stock || 0);
    const cantidad = Number(producto.cantidad || 0);
    return stock <= 0 || cantidad < 1 || cantidad > stock;
  });

  const cambiarCantidad = (id, cantidad) => {
    const producto = carrito.find((item) => Number(item.id) === Number(id));
    if (
      procesando ||
      !producto ||
      cantidad < 1 ||
      cantidad > Number(producto.stock)
    ) {
      return;
    }
    guardarCarrito(
      carrito.map((item) =>
        Number(item.id) === Number(id) ? { ...item, cantidad } : item,
      ),
    );
  };

  const eliminar = (id) => {
    if (!procesando) {
      guardarCarrito(carrito.filter((item) => Number(item.id) !== Number(id)));
    }
  };

  const irATienda = () => {
    switch (rol) {
      case "cliente":
        navigate("/cliente/productos");
        break;
      case "administrador":
        navigate("/admin/productos");
        break;
      case "empleado":
        navigate("/empleado/productos");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const abrirPago = () => {
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/cliente/carrito");
      alert("Debes iniciar sesión para realizar una compra.");
      navigate("/login");
      return;
    }

    if (!clienteId) {
      alert("No fue posible identificar al cliente. Inicia sesión nuevamente.");
      return;
    }

    if (!carrito.length) {
      alert("El carrito está vacío.");
      return;
    }

    if (hayProblemasStock) {
      alert("Hay productos sin stock suficiente. Revisa tu carrito.");
      return;
    }

    setMetodoPago("");
    setDatosPago(DATOS_INICIALES);
    setErroresPago({});
    setMostrarPago(true);
  };

  const cerrarPago = () => {
    if (procesando) {
      return;
    }
    setMostrarPago(false);
    setMetodoPago("");
    setErroresPago({});
  };

  const actualizarDatoPago = (campo, valor) => {
    let nuevoValor = valor;
    if (campo === "numeroTarjeta") {
      nuevoValor = valor.replace(/\D/g, "").slice(0, 16);
    }

    if (campo === "cvv") {
      nuevoValor = valor.replace(/\D/g, "").slice(0, 4);
    }

    if (campo === "celularNequi") {
      nuevoValor = valor.replace(/\D/g, "").slice(0, 10);
    }

    if (campo === "vencimiento") {
      const numeros = valor.replace(/\D/g, "").slice(0, 4);
      nuevoValor =
        numeros.length > 2
          ? `${numeros.slice(0, 2)}/${numeros.slice(2)}`
          : numeros;
    }
    setDatosPago((actual) => ({ ...actual, [campo]: nuevoValor }));
    setErroresPago((actual) => ({ ...actual, [campo]: "" }));
  };

  const validarPago = () => {
    const errores = {};

    if (!metodoPago) {
      errores.metodoPago = "Selecciona un método de pago.";
    }

    if (metodoPago === "Tarjeta") {
      if (datosPago.titular.trim().length < 3)
        errores.titular = "Ingresa el nombre del titular.";
      if (!/^\d{16}$/.test(datosPago.numeroTarjeta))
        errores.numeroTarjeta = "La tarjeta debe tener 16 dígitos.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(datosPago.vencimiento))
        errores.vencimiento = "Usa el formato MM/AA.";
      if (!/^\d{3,4}$/.test(datosPago.cvv))
        errores.cvv = "Ingresa un CVV válido.";
    }

    if (metodoPago === "PSE") {
      if (!datosPago.banco) errores.banco = "Selecciona tu banco.";
      if (!/^\S+@\S+\.\S+$/.test(datosPago.correoPse))
        errores.correoPse = "Ingresa un correo válido.";
    }

    if (metodoPago === "Nequi" && !/^3\d{9}$/.test(datosPago.celularNequi)) {
      errores.celularNequi = "Ingresa un celular colombiano válido.";
    }

    setErroresPago(errores);
    return Object.keys(errores).length === 0;
  };

  const confirmarPago = async () => {
    if (procesando || !validarPago()) {
      return;
    }

    try {
      setProcesando(true);
      await api.post(
        "/cliente/comprar",
        {
          productos: carrito.map((producto) => ({
            productoId: producto.id,
            cantidad: Number(producto.cantidad),
          })),
          metodoPago,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      localStorage.removeItem(claveCarrito);
      setCarrito([]);
      notificarCarrito([]);
      setMostrarPago(false);
      alert(`Compra realizada correctamente con ${metodoPago} ✅`);
      navigate("/cliente/compras");
    } catch (err) {
      console.error("Error procesando compra:", err);
      if ([401, 403].includes(err.response?.status)) {
        ["token", "rol", "usuario", claveCarrito].forEach((clave) =>
          localStorage.removeItem(clave),
        );
        localStorage.setItem("redirectAfterLogin", "/cliente/carrito");
        alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
        navigate("/login");
        return;
      }
      if (err.response?.status === 400) await cargarCarrito();
      alert(
        err.response?.data?.message ||
          "No fue posible procesar la compra. Intenta nuevamente.",
      );
    } finally {
      setProcesando(false);
    }
  };

  const obtenerImagen = (imagen) => {
    const predeterminada =
      "https://placehold.co/180x180/111827/e5e7eb?text=ModaGest";
    if (!imagen || typeof imagen !== "string") {
      return predeterminada;
    }
    const limpia = imagen.trim();
    return /^https?:\/\//i.test(limpia)
      ? limpia
      : `http://localhost:5000/uploads/${limpia}`;
  };

  if (cargando) {
    return (
      <div style={styles.center}>
        <div style={styles.messageCard}>
          <div className="loader" />
          <h2>Cargando tu carrito</h2>
          <p>Estamos verificando tus productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.messageCard}>
          <h2>No pudimos cargar tu carrito</h2>
          <p>{error}</p>
          <button style={styles.primaryButton} onClick={cargarCarrito}>
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <main className="carrito-page" style={styles.container}>
        <header style={styles.header}>
          <div>
            <span style={styles.badge}>🛒 Tu selección</span>
            <h1>Carrito de compras</h1>
            <p>Revisa tus productos antes de completar tu compra.</p>
          </div>
          {!!carrito.length && (
            <span style={styles.units}>
              {totalUnidades} {totalUnidades === 1 ? "unidad" : "unidades"}
            </span>
          )}
        </header>

        {!carrito.length ? (
          <section style={styles.empty}>
            <div style={styles.emptyIcon}>🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>Explora nuestro catálogo y encuentra productos que te gusten.</p>
            <button style={styles.primaryButton} onClick={irATienda}>
              🛍️ Explorar productos
            </button>
          </section>
        ) : (
          <div className="cart-layout" style={styles.layout}>
            <section>
              {hayProblemasStock && (
                <div style={styles.warning}>
                  ⚠️ Algunos productos no tienen stock suficiente.
                </div>
              )}
              {carrito.map((producto) => {
                const stock = Number(producto.stock || 0);
                const cantidad = Number(producto.cantidad || 0);
                return (
                  <article
                    className="product-card"
                    style={styles.productCard}
                    key={producto.id}
                  >
                    <div className="image-wrap" style={styles.imageWrap}>
                      <img
                        src={obtenerImagen(producto.imagen)}
                        alt={producto.nombre}
                        style={styles.image}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/180x180/111827/e5e7eb?text=ModaGest";
                        }}
                      />
                    </div>
                    <div style={styles.productInfo}>
                      <div style={styles.productTop}>
                        <div>
                          <h2>{producto.nombre}</h2>
                          <p>
                            {producto.descripcion || "Producto de ModaGest Pro"}
                          </p>
                        </div>
                        <button
                          style={styles.deleteButton}
                          onClick={() => eliminar(producto.id)}
                          disabled={procesando}
                        >
                          🗑️
                        </button>
                      </div>
                      <div
                        className="product-bottom"
                        style={styles.productBottom}
                      >
                        <div>
                          <small>PRECIO UNITARIO</small>
                          <strong style={styles.purple}>
                            {formatoMoneda(producto.precio)}
                          </strong>
                        </div>
                        <div>
                          <small>CANTIDAD</small>
                          <div style={styles.controls}>
                            <button
                              onClick={() =>
                                cambiarCantidad(producto.id, cantidad - 1)
                              }
                              disabled={cantidad <= 1 || procesando}
                            >
                              −
                            </button>
                            <b>{cantidad}</b>
                            <button
                              onClick={() =>
                                cambiarCantidad(producto.id, cantidad + 1)
                              }
                              disabled={cantidad >= stock || procesando}
                            >
                              +
                            </button>
                          </div>
                          <em>{stock} disponibles</em>
                        </div>
                        <div className="subtotal">
                          <small>SUBTOTAL</small>
                          <strong style={styles.green}>
                            {formatoMoneda(Number(producto.precio) * cantidad)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="summary" style={styles.summary}>
              <span style={styles.badge}>RESUMEN</span>
              <h2>Resumen de compra</h2>
              <div style={styles.rows}>
                <p>
                  <span>Productos</span>
                  <b>{carrito.length}</b>
                </p>
                <p>
                  <span>Unidades</span>
                  <b>{totalUnidades}</b>
                </p>
                <p>
                  <span>Subtotal</span>
                  <b>{formatoMoneda(total)}</b>
                </p>
                <p>
                  <span>Envío</span>
                  <b style={styles.green}>Gratis</b>
                </p>
              </div>
              <div style={styles.total}>
                <span>Total</span>
                <strong>{formatoMoneda(total)}</strong>
              </div>
              <button
                style={styles.buyButton}
                onClick={abrirPago}
                disabled={procesando || hayProblemasStock}
              >
                💳 Finalizar compra
              </button>
              <button style={styles.secondaryButton} onClick={irATienda}>
                ← Seguir comprando
              </button>
              <small style={styles.security}>
                🔐 Tus datos están protegidos durante el proceso.
              </small>
            </aside>
          </div>
        )}
      </main>

      {mostrarPago && (
        <div
          style={styles.overlay}
          onMouseDown={(e) => e.target === e.currentTarget && cerrarPago()}
        >
          <section
            className="payment-modal"
            style={styles.modal}
            role="dialog"
            aria-modal="true"
          >
            <header style={styles.modalHeader}>
              <div>
                <span style={styles.badge}>PAGO SEGURO</span>
                <h2>Elige tu método de pago</h2>
              </div>
              <button
                style={styles.closeButton}
                onClick={cerrarPago}
                disabled={procesando}
              >
                ✕
              </button>
            </header>
            <div style={styles.totalBox}>
              <span>Total a pagar</span>
              <strong>{formatoMoneda(total)}</strong>
            </div>

            <div style={styles.methods}>
              {METODOS.map((metodo) => (
                <label
                  key={metodo.value}
                  style={{
                    ...styles.method,
                    ...(metodoPago === metodo.value ? styles.methodActive : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value={metodo.value}
                    checked={metodoPago === metodo.value}
                    onChange={(e) => {
                      setMetodoPago(e.target.value);
                      setErroresPago({});
                    }}
                    disabled={procesando}
                  />
                  <span style={styles.methodIcon}>{metodo.icon}</span>
                  <span style={styles.methodInfo}>
                    <strong>{metodo.title}</strong>
                    <small>{metodo.text}</small>
                  </span>
                  <b>{metodoPago === metodo.value ? "✓" : ""}</b>
                </label>
              ))}
            </div>
            {erroresPago.metodoPago && (
              <p style={styles.fieldError}>{erroresPago.metodoPago}</p>
            )}

            {metodoPago === "Tarjeta" && (
              <div style={styles.formBox}>
                <h3>Datos de la tarjeta</h3>
                <Campo
                  label="Nombre del titular"
                  value={datosPago.titular}
                  onChange={(v) => actualizarDatoPago("titular", v)}
                  error={erroresPago.titular}
                  placeholder="Como aparece en la tarjeta"
                />
                <Campo
                  label="Número de tarjeta"
                  value={datosPago.numeroTarjeta}
                  onChange={(v) => actualizarDatoPago("numeroTarjeta", v)}
                  error={erroresPago.numeroTarjeta}
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                />
                <div style={styles.twoColumns}>
                  <Campo
                    label="Vencimiento"
                    value={datosPago.vencimiento}
                    onChange={(v) => actualizarDatoPago("vencimiento", v)}
                    error={erroresPago.vencimiento}
                    placeholder="MM/AA"
                    inputMode="numeric"
                  />
                  <Campo
                    label="CVV"
                    value={datosPago.cvv}
                    onChange={(v) => actualizarDatoPago("cvv", v)}
                    error={erroresPago.cvv}
                    placeholder="123"
                    inputMode="numeric"
                    type="password"
                  />
                </div>
              </div>
            )}

            {metodoPago === "PSE" && (
              <div style={styles.formBox}>
                <h3>Datos para PSE</h3>
                <label style={styles.field}>
                  <span>Banco</span>
                  <select
                    value={datosPago.banco}
                    onChange={(e) =>
                      actualizarDatoPago("banco", e.target.value)
                    }
                  >
                    <option value="">Selecciona tu banco</option>
                    <option>Bancolombia</option>
                    <option>Banco de Bogotá</option>
                    <option>Davivienda</option>
                    <option>BBVA Colombia</option>
                    <option>Banco de Occidente</option>
                    <option>Nequi</option>
                  </select>
                  {erroresPago.banco && <small>{erroresPago.banco}</small>}
                </label>
                <Campo
                  label="Correo electrónico"
                  value={datosPago.correoPse}
                  onChange={(v) => actualizarDatoPago("correoPse", v)}
                  error={erroresPago.correoPse}
                  placeholder="correo@ejemplo.com"
                  type="email"
                />
              </div>
            )}

            {metodoPago === "Nequi" && (
              <div style={styles.formBox}>
                <h3>Pago con Nequi</h3>
                <Campo
                  label="Número de celular"
                  value={datosPago.celularNequi}
                  onChange={(v) => actualizarDatoPago("celularNequi", v)}
                  error={erroresPago.celularNequi}
                  placeholder="3001234567"
                  inputMode="numeric"
                />
                <p style={styles.help}>
                  Recibirás una solicitud simulada de aprobación.
                </p>
              </div>
            )}
            {metodoPago === "Contra Entrega" && (
              <div style={styles.formBox}>
                <h3>Pago contra entrega</h3>
                <p style={styles.help}>
                  Pagarás cuando recibas tu pedido. Verifica tus datos de
                  entrega antes de continuar.
                </p>
              </div>
            )}

            <div style={styles.note}>
              ℹ️ Esta es una simulación. No se realizará ningún cobro real.
            </div>
            <div className="modal-actions" style={styles.actions}>
              <button
                style={styles.secondaryButton}
                onClick={cerrarPago}
                disabled={procesando}
              >
                Cancelar
              </button>
              <button
                style={styles.confirmButton}
                onClick={confirmarPago}
                disabled={procesando}
              >
                {procesando ? "Procesando..." : "Confirmar pago"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Campo({ label, value, onChange, error, ...props }) {
  return (
    <label style={styles.field}>
      <span>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {error && <small>{error}</small>}
    </label>
  );
}

export default Carrito;

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#050816,#0f172a 48%,#17102f)",
    color: "#fff",
    padding: "40px 24px 70px",
  },
  container: { maxWidth: 1250, margin: "0 auto" },
  center: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#050816",
    color: "#fff",
    padding: 20,
  },
  messageCard: {
    textAlign: "center",
    padding: 36,
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.09)",
    borderRadius: 24,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 32,
  },
  badge: {
    display: "inline-block",
    color: "#c084fc",
    background: "rgba(124,58,237,.13)",
    border: "1px solid rgba(168,85,247,.22)",
    borderRadius: 999,
    padding: "7px 13px",
    fontSize: 12,
    fontWeight: 800,
  },
  units: {
    background: "rgba(255,255,255,.06)",
    padding: "10px 16px",
    borderRadius: 999,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) 350px",
    gap: 28,
    alignItems: "start",
  },
  warning: {
    padding: 16,
    marginBottom: 18,
    color: "#fcd34d",
    background: "rgba(245,158,11,.09)",
    border: "1px solid rgba(245,158,11,.2)",
    borderRadius: 16,
  },
  productCard: {
    display: "flex",
    gap: 22,
    padding: 20,
    marginBottom: 18,
    background: "rgba(255,255,255,.045)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 24,
  },
  imageWrap: {
    width: 170,
    height: 170,
    flexShrink: 0,
    borderRadius: 19,
    overflow: "hidden",
    background: "rgba(255,255,255,.05)",
  },
  image: { width: "100%", height: "100%", objectFit: "contain", padding: 8 },
  productInfo: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  productTop: { display: "flex", justifyContent: "space-between", gap: 15 },
  deleteButton: {
    width: 40,
    height: 40,
    border: "1px solid rgba(239,68,68,.2)",
    borderRadius: 12,
    background: "rgba(239,68,68,.08)",
    cursor: "pointer",
  },
  productBottom: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "end",
    gap: 20,
    marginTop: 24,
  },
  controls: { display: "flex", alignItems: "center", gap: 10, margin: "7px 0" },
  purple: { display: "block", color: "#c084fc", fontSize: 19 },
  green: { display: "block", color: "#4ade80", fontSize: 19 },
  summary: {
    position: "sticky",
    top: 25,
    padding: 25,
    background:
      "linear-gradient(145deg,rgba(124,58,237,.14),rgba(255,255,255,.045))",
    border: "1px solid rgba(168,85,247,.2)",
    borderRadius: 26,
  },
  rows: { color: "#94a3b8" },
  total: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 0",
    borderTop: "1px solid rgba(255,255,255,.08)",
    fontSize: 18,
  },
  primaryButton: {
    border: 0,
    borderRadius: 14,
    padding: "14px 22px",
    background: "linear-gradient(135deg,#7c3aed,#9333ea)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  buyButton: {
    width: "100%",
    border: 0,
    borderRadius: 15,
    padding: 16,
    background: "linear-gradient(135deg,#7c3aed,#9333ea)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    marginTop: 12,
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 14,
    padding: 13,
    background: "rgba(255,255,255,.04)",
    color: "#cbd5e1",
    fontWeight: 700,
    cursor: "pointer",
  },
  security: {
    display: "block",
    textAlign: "center",
    color: "#64748b",
    marginTop: 17,
  },
  empty: {
    maxWidth: 650,
    margin: "50px auto",
    textAlign: "center",
    padding: "70px 30px",
    background: "rgba(255,255,255,.045)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 28,
  },
  emptyIcon: { fontSize: 42 },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 999,
    display: "grid",
    placeItems: "center",
    padding: 20,
    background: "rgba(2,6,23,.8)",
    backdropFilter: "blur(8px)",
  },
  modal: {
    width: "100%",
    maxWidth: 570,
    maxHeight: "92vh",
    overflowY: "auto",
    padding: 27,
    background: "#0b1120",
    border: "1px solid rgba(168,85,247,.25)",
    borderRadius: 26,
    boxShadow: "0 25px 80px rgba(0,0,0,.55)",
  },
  modalHeader: { display: "flex", justifyContent: "space-between", gap: 15 },
  closeButton: {
    width: 38,
    height: 38,
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 12,
    background: "rgba(255,255,255,.04)",
    color: "#fff",
    cursor: "pointer",
  },
  totalBox: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 0",
    padding: 17,
    background: "rgba(124,58,237,.1)",
    borderRadius: 16,
  },
  methods: { display: "grid", gap: 10 },
  method: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    padding: 14,
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 15,
    background: "rgba(255,255,255,.025)",
    cursor: "pointer",
  },
  methodActive: {
    borderColor: "rgba(168,85,247,.65)",
    background: "rgba(124,58,237,.13)",
  },
  methodIcon: {
    display: "grid",
    placeItems: "center",
    width: 38,
    height: 38,
    borderRadius: 11,
    background: "rgba(255,255,255,.06)",
  },
  methodInfo: { display: "flex", flexDirection: "column", gap: 3, flex: 1 },
  formBox: {
    marginTop: 16,
    padding: 17,
    border: "1px solid rgba(168,85,247,.18)",
    borderRadius: 16,
    background: "rgba(124,58,237,.06)",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    marginTop: 13,
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: 700,
  },
  twoColumns: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  fieldError: { color: "#f87171", fontSize: 12, margin: "7px 0 0" },
  help: { color: "#94a3b8", fontSize: 13, lineHeight: 1.5 },
  note: {
    marginTop: 18,
    padding: 13,
    color: "#93c5fd",
    background: "rgba(59,130,246,.08)",
    borderRadius: 14,
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: 12,
    marginTop: 20,
  },
  confirmButton: {
    marginTop: 12,
    border: 0,
    borderRadius: 14,
    padding: 14,
    background: "linear-gradient(135deg,#10b981,#059669)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
};

const css = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
  }

  h1 {
    margin: 12px 0 8px;
    font-size: 42px;
  }

  h2 {
    margin: 10px 0;
  }

  p {
    color: #94a3b8;
    line-height: 1.5;
  }

  small {
    color: #64748b;
  }

  em {
    display: block;
    color: #64748b;
    font-size: 11px;
    font-style: normal;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed !important;
  }

  .product-bottom button {
    border: 1px solid rgba(168, 85, 247, 0.2);
    border-radius: 10px;
    background: rgba(124, 58, 237, 0.18);
    color: white;
    font-size: 18px;
  }

  .summary p {
    display: flex;
    justify-content: space-between;
  }

  .payment-modal input:not([type="radio"]),
  .payment-modal select {
    width: 100%;
    padding: 13px 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 11px;
    outline: none;
    background: #111827;
    color: #fff;
    font: inherit;
  }

  .payment-modal input:focus,
  .payment-modal select:focus {
    border-color: #a855f7;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.12);
  }

  .payment-modal label small {
    color: #f87171;
  }

  @media (max-width: 900px) {
    .cart-layout {
      grid-template-columns: 1fr !important;
    }

    .summary {
      position: static !important;
    }
  }

  @media (max-width: 650px) {
    .carrito-page {
      padding: 10px 0 !important;
    }

    h1 {
      font-size: 32px;
    }

    .product-card {
      flex-direction: column;
    }

    .image-wrap {
      width: 100% !important;
      height: 230px !important;
    }

    .product-bottom {
      grid-template-columns: 1fr 1fr !important;
    }

    .subtotal {
      text-align: left !important;
    }
  }

  @media (max-width: 430px) {
    .product-bottom,
    .modal-actions,
    .payment-modal div[style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
    }

    .payment-modal {
      padding: 20px !important;
    }
  }
`;
