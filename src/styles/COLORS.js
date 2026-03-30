export const inputStyle = {
  width: "100%",
  padding: ".375rem",
  border: "1px solid var(--bordercolor)",
  borderRadius: "4px",
  fontSize: "14px",
  color: "var(--textcolor)",
  backgroundColor: "#fff",
  outline: "none",
  transition: "0.2s",
  fontFamily: "'Inter', sans-serif",
};

export const labelStyle = {
  fontSize: "13px",
  color: "var(--textcolor)",
  marginBottom: "4px",
  display: "block",
  fontWeight: "300",
};

export const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "1.5rem",
  border: "1px solid var(--bordercolor)",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

export const COLORS = {
  primary:   "var(--primarycolor)",
  hover:     "var(--primarycolorhover)",
  btnBg:     "var(--btnice)",
  btnText:   "var(--btnnicetext)",
  border:    "var(--bordercolor)",
  text:      "var(--textcolor)",
  white:     "#ffffff",
  gray:      "#f5f7fa",
};

export const statusColor = (status) => {
  if (status === "reservada")  return { bg: "#D8EBFA", color: "#1b62b3" };
  if (status === "completada") return { bg: "#E8F5E9", color: "#2E7D32" };
  if (status === "cancelada")  return { bg: "#FFEBEE", color: "#C62828" };
  return { bg: "#f5f7fa", color: "#666" };
};
export const SESSIONS = [
  { id: 1, title: "Medicina General" },
  { id: 2, title: "Odontología" },
  { id: 3, title: "Pediatría" },
  { id: 4, title: "Dermatología" },
  { id: 5, title: "Cardiología" },
];