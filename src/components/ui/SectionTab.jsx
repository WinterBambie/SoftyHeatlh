import { memo } from "react";

/**
 * SectionTab
 * Botón de navegación lateral de perfil.
 * Compartido entre DoctorProfile y PatientProfile.
 *
 * Props:
 *   icon      — ReactNode (ej: <Person fontSize="small" />)
 *   label     — string
 *   active    — boolean
 *   onClick   — () => void
 *   primaryColor — string (hex o CSS var) — color activo
 *   textColor    — string — color texto inactivo
 */
const SectionTab = memo(function SectionTab({
  icon,
  label,
  active,
  onClick,
  primaryColor = "#0A76D8",
  textColor    = "var(--textcolor)",
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "0.65rem 1.25rem",
        borderRadius: "8px",
        cursor: "pointer",
        border: "none",
        fontSize: "14px",
        width: "100%",
        textAlign: "left",
        backgroundColor: active ? "#E8F0FE" : "transparent",
        color: active ? primaryColor : textColor,
        fontWeight: active ? 500 : 400,
        transition: "all 0.15s",
      }}
    >
      {icon} {label}
    </button>
  );
});

export default SectionTab;