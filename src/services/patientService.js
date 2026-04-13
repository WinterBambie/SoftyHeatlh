import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "/HealthApi/router/api.php"
    : "http://localhost/HealthApi/router/api.php");

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

function getStoredPatientId() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    return u.patient_id ?? u.pid ?? u.id ?? "";
  } catch { return ""; }
}

// ── helpers internos ──────────────────────────────────────────────────────────

const get = async (action, params = "") => {
  const res = await axios.get(`${API_URL}?action=${action}${params}`, {
    headers: authHeader(),
  });
  return res.data;
};

const post = async (action, formData) => {
  const res = await axios.post(`${API_URL}?action=${action}`, formData, {
    headers: authHeader(),
  });
  return res.data;
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

export const getAvailableSlots = (scheduleid, date) =>
  get("availableSlots", `&scheduleid=${scheduleid}&date=${date}`);

// ── Citas ─────────────────────────────────────────────────────────────────────

export const getPatientAppointments = async (pid) => {
  try {
    return await get("getAppointmentsByPatient", `&patient_id=${pid}`);
  } catch (error) {
    return {
      status: "error",
      message: error?.response?.data?.message || "No se pudieron cargar las citas.",
    };
  }
};

export const getPatientStats = async (pid) => {
  try {
    return await get("patientStats", `&patient_id=${pid}`);
  } catch {
    return { status: "error", message: "No se pudieron cargar las estadísticas." };
  }
};

export const createAppointment = async (data) => {
  // ✅ acepta FormData o un objeto plano
  const fd = data instanceof FormData ? data : toForm(data);
  try {
    return await post("createAppointment", fd);
  } catch (error) {
    return {
      status: "error",
      message: error?.response?.data?.message || "No se pudo crear la cita.",
    };
  }
};

export const cancelAppointment = async (appoid, patientId) => {
  try {
    const pidVal = patientId ?? getStoredPatientId();
    const fd = toForm({
      appointment_id: appoid,  // ✅ nombre que espera el backend
      appoid,                  // por si acaso
      ...(pidVal ? { patient_id: pidVal, pid: pidVal } : {}),
    });
    return await post("cancelAppointment", fd);
  } catch (error) {
    const data = error?.response?.data;
    return {
      status: data?.status || "error",
      message: data?.message || error?.message || "No se pudo cancelar la cita.",
    };
  }
};

// ── Perfil ────────────────────────────────────────────────────────────────────

export const updatePatient = async (pid, data) => {
  try {
    return await post("updatePatient", toForm({ pid, ...data }));
  } catch (error) {
    return {
      status: "error",
      message: error?.response?.data?.message || "No se pudo actualizar el perfil.",
    };
  }
};

export const searchAppointments = async (pid, query) => {
  try {
    return await get("searchAppointments", `&patient_id=${pid}&query=${encodeURIComponent(query)}`);
  } catch (error) {
    return {
      status: "error",
      message: error?.response?.data?.message || "No se pudieron cargar las citas.",
    };
  }
};

export const deletePatient = async (pid) => {
  try {
    return await post("deletePatient", toForm({ pid }));
  } catch (error) {
    return {
      status: "error",
      message: error?.response?.data?.message || "No se pudo eliminar la cuenta.",
    };
  }
};

export default {
  getSchedules, getSessions, getAvailableSlots,
  getPatientAppointments, getPatientStats,
  createAppointment, cancelAppointment,
  updatePatient, deletePatient,
};