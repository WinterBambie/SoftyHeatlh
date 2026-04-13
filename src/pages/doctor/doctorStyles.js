export const DOCTOR_COLORS = {
  primary:  "#0A76D8",
  sidebar:  "#1a3a5c",
  hover:    "#243f6b",
  white:    "#ffffff",
  text:     "var(--textcolor)",
  muted:    "#666",
  border:   "var(--bordercolor)",
};

export const doctorCard = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "1.5rem",
  border: "1px solid var(--bordercolor)",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

export const statCard = {
  ...doctorCard,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

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

export const statusBadge = (status) => {
  const map = {
    reservada:  { bg: "#D8EBFA", color: "#1b62b3" },
    completada: { bg: "#E8F5E9", color: "#2E7D32" },
    cancelada:  { bg: "#FFEBEE", color: "#C62828" },
  };
  const s = map[status] || { bg: "#f5f7fa", color: "#666" };
  return {
    backgroundColor: s.bg, color: s.color,
    padding: "3px 10px", borderRadius: "20px",
    fontSize: "12px", fontWeight: 500,
  };
};

export const tableHeader = {
  padding: "0.75rem 1rem",
  textAlign: "left",
  color: "var(--btnnicetext)",
  fontWeight: 500,
  fontSize: "13px",
};

export const tableCell = {
  padding: "0.75rem 1rem",
  color: "var(--textcolor)",
  fontSize: "14px",
};