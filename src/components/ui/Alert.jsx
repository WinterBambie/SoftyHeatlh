import { memo } from "react";

/**
 * Muestra mensajes de éxito o error.
 * Usado en DoctorProfile, PatientProfile y cualquier formulario del proyecto.
 * Props:
 *   type  — "success" | "error"
 *   msg   — string | "" (si vacío no renderiza nada)
 */
const STYLES = {
  success: { bg: "#E8F5E9", border: "#A5D6A7", color: "#2E7D32" },
  error:   { bg: "#FFEBEE", border: "#FFCDD2", color: "#C62828" },
};

const Alert = memo(function Alert({ type, msg }) {
  if (!msg) return null;
  const s = STYLES[type] ?? STYLES.error;
  return (
    <div style={{
      backgroundColor: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: "8px",
      padding: "0.75rem 1rem",
      marginBottom: "1rem",
      fontSize: "13px",
      color: s.color,
    }}>
      {msg}
    </div>
  );
});

export default Alert;