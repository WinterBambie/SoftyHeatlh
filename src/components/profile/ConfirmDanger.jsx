import { memo } from "react";

/**
 * ConfirmDanger
 * Bloque de confirmación de acción destructiva.
 * Usado en PatientProfile para eliminar cuenta.
 * Reutilizable para cualquier acción irreversible.
 *
 * Props:
 *   title         — string
 *   description   — ReactNode
 *   confirmLabel  — string — texto del botón de confirmar
 *   cancelLabel   — string
 *   onConfirm     — () => void
 *   loading       — boolean
 *   cardStyle     — object
 *   deleteBtn     — object — estilos del botón de eliminar
 *   textColor     — string
 *   mutedColor    — string
 */
const ConfirmDanger = memo(function ConfirmDanger({
  title        = "Eliminar cuenta",
  description,
  confirmLabel = "Sí, eliminar mi cuenta",
  cancelLabel  = "Cancelar",
  onConfirm,
  onCancel,
  loading      = false,
  cardStyle,
  deleteBtn,
  textColor    = "var(--textcolor)",
  mutedColor   = "#666",
}) {
  return (
    <div style={cardStyle}>
      <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: "#C62828" }}>
        {title}
      </h3>
      <p style={{ margin: "0 0 1.25rem", fontSize: "13px", color: mutedColor }}>
        {description}
      </p>

      <div style={{
        backgroundColor: "#FFF3E0",
        borderRadius: "8px",
        padding: "1rem",
        border: "1px solid #FFCC02",
      }}>
        <p style={{ margin: "0 0 1rem", fontSize: "13px", color: "#E65100", fontWeight: 500 }}>
          ¿Estás completamente seguro? No podrás recuperar tu cuenta.
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ ...deleteBtn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Eliminando..." : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: "#fff",
              color: textColor,
              border: "1px solid var(--bordercolor)",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ConfirmDanger;