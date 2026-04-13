// Estilos compartidos del dashboard de paciente
// Usa las variables CSS del proyecto para consistencia con el admin

export const patientCard = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "1.5rem",
  border: "1px solid var(--bordercolor)",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

export const dangerCard = {
  ...patientCard,
  border: "1px solid #FFCDD2",
};

export const statCard = (color, bg) => ({
  ...patientCard,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const nextAppointmentBanner = {
  backgroundColor: "var(--btnice)",
  borderRadius: "12px",
  padding: "1.25rem 1.5rem",
  marginBottom: "2rem",
  border: "1px solid var(--btnnicetext)",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

export const quickAccessBtn = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  backgroundColor: "#fff",
  border: "1px solid var(--bordercolor)",
  borderRadius: "12px",
  padding: "1rem 1.5rem",
  cursor: "pointer",
  fontSize: "14px",
  color: "var(--textcolor)",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  transition: "box-shadow 0.2s",
};

export const cancelBtn = {
  backgroundColor: "#FFEBEE",
  color: "#C62828",
  border: "1px solid #FFCDD2",
  borderRadius: "6px",
  padding: "4px 12px",
  cursor: "pointer",
  fontSize: "12px",
};

export const deleteBtn = {
  backgroundColor: "#C62828",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.5rem 1rem",
  cursor: "pointer",
  fontSize: "13px",
};

export const primaryBtn = (loading = false) => ({
  backgroundColor: "var(--primarycolor)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.6rem 1.5rem",
  cursor: "pointer",
  fontSize: "14px",
  opacity: loading ? 0.7 : 1,
});

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
};