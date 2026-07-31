import { useState } from "react";
import styles from "./usuariosStyles";

export default function UsuarioForm({ visible, onClose, onGuardar }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("cliente");
  const [error, setError] = useState("");

  if (!visible) return null;

  const enviar = (e) => {
    e.preventDefault();

    setError("");

    // Validar nombre
    if (nombre.trim().length < 3) {
      setError("El nombre debe tener mínimo 3 caracteres.");
      return;
    }

    // Validar correo
    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!expresionCorreo.test(email.trim())) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    // Validar contraseña
    const expresionPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    console.log("Contraseña:", password);
    console.log("Longitud:", password.length);
    console.log("Resultado:", expresionPassword.test(password));

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

    setNombre("");
    setEmail("");
    setPassword("");
    setRol("cliente");
    setError("");
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>Crear Usuario</h2>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={enviar}>
          <input
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="Correo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            style={styles.input}
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="cliente">Cliente</option>
            <option value="empleado">Empleado</option>
            <option value="administrador">Administrador</option>
          </select>

          <div style={styles.modalButtons}>
            <button type="button" style={styles.cancelButton} onClick={onClose}>
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
