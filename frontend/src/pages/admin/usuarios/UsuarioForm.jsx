import { useState } from "react";
import styles from "./usuariosStyles";

export default function UsuarioForm({ visible, onClose, onGuardar }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("cliente");
  const [error, setError] = useState("");

  if (!visible) {
    return null;
  }

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setPassword("");
    setRol("cliente");
    setError("");
  };

  const cerrarFormulario = () => {
    limpiarFormulario();
    onClose();
  };

  const enviar = (event) => {
    event.preventDefault();

    setError("");

    if (nombre.trim().length < 3) {
      setError("El nombre debe tener mínimo 3 caracteres.");
      return;
    }

    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!expresionCorreo.test(email.trim())) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    const expresionPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!expresionPassword.test(password)) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.",
      );
      return;
    }

    onGuardar({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password,
      rol,
    });

    limpiarFormulario();
  };

  return (
    <div style={styles.modalOverlay}>
      <div
        style={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-nuevo-usuario"
      >
        <h2 id="titulo-nuevo-usuario" style={styles.modalTitle}>
          Crear usuario
        </h2>

        {error && (
          <div style={styles.errorBox} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={enviar}>
          <input
            type="text"
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            autoComplete="name"
            minLength={3}
            required
          />

          <input
            style={styles.input}
            placeholder="Correo"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <input
            style={styles.input}
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <select
            style={styles.input}
            value={rol}
            onChange={(event) => setRol(event.target.value)}
            aria-label="Rol del usuario"
            required
          >
            <option value="cliente">Cliente</option>
            <option value="empleado">Empleado</option>
            <option value="administrador">Administrador</option>
          </select>

          <div style={styles.modalButtons}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={cerrarFormulario}
            >
              Cancelar
            </button>

            <button type="submit" style={styles.saveButton}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
