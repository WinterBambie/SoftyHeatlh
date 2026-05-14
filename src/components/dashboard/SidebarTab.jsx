import React from "react";
import { COLORS } from "../../styles/COLORS";

const SectionTab = React.memo(({ icon, label, active, onClick }) => (
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
      color: active ? COLORS.primary : COLORS.text,
      fontWeight: active ? 500 : 400,
      transition: "all 0.15s",
    }}
  >
    {icon} {label}
  </button>
));

export default SectionTab;