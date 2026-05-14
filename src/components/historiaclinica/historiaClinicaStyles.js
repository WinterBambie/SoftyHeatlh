// src/pages/doctor/historiaClinica/historiaClinicaStyles.js

export const hcColors = {
  primary:  "#0A76D8",
  sidebar:  "#1a3a5c",
  text:     "var(--textcolor)",
  muted:    "#666",
  border:   "var(--bordercolor)",
  white:    "#ffffff",
  gray:     "#f5f7fa",
};

export const card = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "1.5rem",
  border: "1px solid var(--bordercolor)",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

export const cardBlue = {
  ...card,
  backgroundColor: "#E8F0FE",
  border: "1px solid #BBDEFB",
};

export const pill = (bg, color) => ({
  backgroundColor: bg,
  color,
  padding: "3px 10px",
  borderRadius: "20px",
  fontSize: "12px",
});

export const iconBtn = (bg, color, border) => ({
  display: "flex", alignItems: "center", gap: "4px",
  backgroundColor: bg, color,
  border: `1px solid ${border}`,
  borderRadius: "6px",
  padding: "4px 12px",
  cursor: "pointer",
  fontSize: "12px",
});

export const primaryBtn = (loading = false) => ({
  backgroundColor: "var(--primarycolor)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.6rem 1.5rem",
  cursor: loading ? "not-allowed" : "pointer",
  fontSize: "14px",
  opacity: loading ? 0.7 : 1,
});

export const alert = (type) => ({
  backgroundColor: type === "success" ? "#E8F5E9" : "#FFEBEE",
  border: `1px solid ${type === "success" ? "#A5D6A7" : "#FFCDD2"}`,
  borderRadius: "8px",
  padding: "0.75rem 1rem",
  marginBottom: "1rem",
  fontSize: "13px",
  color: type === "success" ? "#2E7D32" : "#C62828",
});

export const sectionTitle = {
  margin: "1.25rem 0 0.75rem",
  fontWeight: 600,
  fontSize: "12px",
  color: "var(--primarycolor)",
  borderBottom: "1px solid var(--bordercolor)",
  paddingBottom: "4px",
};