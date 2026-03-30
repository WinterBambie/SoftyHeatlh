const API = "http://localhost/HealthApi/router/api.php";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

const post = async (action, formData) => {
  const res = await fetch(`${API}?action=${action}`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  });
  return res.json();
};

const get = async (action, params = "") => {
  const res = await fetch(`${API}?action=${action}${params}`, {
    headers: authHeader(),
  });
  return res.json();
};

// ── Doctores ──────────────────────────────────────────────────────────────────

export const getAdminDoctors = () => get("adminDoctors");

export const createDoctor = (formData) => post("createDoctor", formData);

// ── Pacientes ─────────────────────────────────────────────────────────────────

export const getAdminPatients = () => get("adminPatients");

// ── Tipos de documento ────────────────────────────────────────────────────────

export const getDocumentTypes = () => get("documentTypes");

// ── Especialidades ────────────────────────────────────────────────────────────

export const getSpecialties = () => get("adminSpecialties");

// ── Horarios ──────────────────────────────────────────────────────────────────

export const getSchedules = () => get("adminSchedules");

export const createSchedule = (formData) => post("createSchedule", formData);

// ── Citas ─────────────────────────────────────────────────────────────────────

export const createAppointment = (formData) => post("createAppointment", formData);

export const updateAppointmentStatus = (appoid, status) => {
  const formData = new FormData();
  formData.append("appoid", appoid);
  formData.append("status", status);
  return post("updateAppointmentStatus", formData);
};
export const getSessions = () => get("getSessions");

// ── Stats ─────────────────────────────────────────────────────────────────────

export const getAdminStats = () => get("adminStats");