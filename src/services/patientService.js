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
  if (!text?.trim())
    return { status: "error", message: `Servidor respondió vacío (HTTP ${res.status}).` };
  try { return JSON.parse(text); }
  catch { return { status: "error", message: `Respuesta no es JSON: ${text.slice(0, 120)}` }; }
}

const get = async (action, params = "") => {
  try {
    const res = await fetch(`${API}?action=${action}${params}`, { headers: authHeader() });
    return await parseJsonResponse(res);
  } catch (e) {
    return { status: "error", message: e?.message || "No se pudo conectar con la API." };
  }
};

const post = async (action, formData) => {
  try {
    const res = await fetch(`${API}?action=${encodeURIComponent(action)}`, {
      method: "POST", headers: authHeader(), body: formData,
    });
    return await parseJsonResponse(res);
  } catch (e) {
    return { status: "error", message: e?.message || "No se pudo conectar con la API." };
  }
};

const toForm = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, String(v));
  });
  return fd;
};

// ── Horarios y sesiones ───────────────────────────────────────────────────────

export const getSchedules = () => get("adminSchedules");

export const getSessions = () => get("getSessions");

// ✅ Backend espera ?scheduleid=&date= — parámetros en query string GET
export const getAvailableSlots = (scheduleid, date) =>
  get("availableSlots", `&scheduleid=${encodeURIComponent(scheduleid)}&date=${encodeURIComponent(date)}`);

// ── Citas ─────────────────────────────────────────────────────────────────────

// ✅ Backend PatientController::getByPatient() lee $_GET['patient_id'] o $_GET['pid']
export const getPatientAppointments = (pid) =>
  get("getAppointmentsByPatient", `&patient_id=${pid}`);

// ✅ Backend PatientController::getStatsByPatient() lee $_GET['patient_id'] o $_GET['pid']
export const getPatientStats = (pid) =>
  get("patientStats", `&patient_id=${pid}`);

// ✅ Backend PatientController::create() lee $_POST['pid'], 'scheduleid', 'appointment_date', 'appointment_time'
export const createAppointment = (data) => {
  const fd = data instanceof FormData ? data : toForm(data);
  return post("createAppointment", fd);
};

// ✅ Backend PatientController::cancelByPatient() lee 'appointment_id' o 'appoid'
export const cancelAppointment = (appoid) =>
  post("cancelAppointment", toForm({ appointment_id: appoid, appoid }));

// ── Perfil ────────────────────────────────────────────────────────────────────

// ✅ Backend PatientController::updateProfile() lee 'pid'
export const updatePatient = (pid, data) =>
  post("updatePatient", toForm({ pid, ...data }));

// ✅ Backend PatientController::deleteAccount() lee 'pid'
export const deletePatient = (pid) =>
  post("deletePatient", toForm({ pid }));

export default {
  getSchedules, getSessions, getAvailableSlots,
  getPatientAppointments, getPatientStats,
  createAppointment, cancelAppointment,
  updatePatient, deletePatient,
};