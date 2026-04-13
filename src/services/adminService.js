const API =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "/HealthApi/router/api.php"
    : "http://localhost/HealthApi/router/api.php");

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text?.trim()) {
    return { status: "error", message: `Servidor respondió vacío (HTTP ${res.status}).` };
  }
  try {
    return JSON.parse(text);
  } catch {
    return { status: "error", message: `Respuesta no es JSON: ${text.slice(0, 100)}` };
  }
}

const post = async (action, formData) => {
  try {
    const res  = await fetch(`${API}?action=${encodeURIComponent(action)}`, {
      method: "POST", headers: authHeader(), body: formData,
    });
    return await parseJsonResponse(res);
  } catch (e) {
    return { status: "error", message: e?.message || "No se pudo conectar con la API." };
  }
};

const get = async (action, params = "") => {
  try {
    const res  = await fetch(`${API}?action=${action}${params}`, { headers: authHeader() });
    return await parseJsonResponse(res);
  } catch (e) {
    return { status: "error", message: e?.message || "No se pudo conectar con la API." };
  }
};

// ── Doctores ──────────────────────────────────────────────────────────────────
export const getAdminDoctors  = ()         => get("adminDoctors");
export const createDoctor     = (formData) => post("createDoctor", formData);
export const updateDoctor     = (formData) => post("updateDoctor", formData);
export const deleteDoctor     = (formData) => post("deleteDoctor", formData);

// ── Pacientes ─────────────────────────────────────────────────────────────────
export const getAdminPatients = ()         => get("adminPatients");

// ── Tipos de documento ────────────────────────────────────────────────────────
export const getDocumentTypes = ()         => get("documentTypes");

// ── Especialidades ────────────────────────────────────────────────────────────
export const getSpecialties   = ()         => get("adminSpecialties");

// ── Sesiones ──────────────────────────────────────────────────────────────────
export const getSessions      = ()         => get("getSessions");

// ── Horarios ──────────────────────────────────────────────────────────────────
export const getSchedules     = ()         => get("adminSchedules");
export const createSchedule   = (formData) => post("createSchedule", formData);
export const updateSchedule   = (formData) => post("updateSchedule", formData);
export const deleteSchedule   = (formData) => post("deleteSchedule", formData);
export const getAvailableSlots = (scheduleid, date) =>
  get("availableSlots", `&scheduleid=${encodeURIComponent(scheduleid)}&date=${encodeURIComponent(date)}`);

// ── Citas ─────────────────────────────────────────────────────────────────────
export const getAdminAppointments    = ()               => get("adminAppointments");
export const createAppointment       = (formData)       => post("createAppointment", formData);
export const updateAppointmentStatus = (appoid, status) => {
  const fd = new FormData();
  fd.append("appoid", appoid);
  fd.append("status", status);
  return post("updateAppointmentStatus", fd);
};
export const deleteAppointment = (appoid) => {
  const fd = new FormData();
  fd.append("appoid", appoid);
  return post("deleteAppointment", fd);
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export const getAdminStats = () => get("adminStats");