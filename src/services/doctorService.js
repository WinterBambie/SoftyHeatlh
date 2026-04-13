import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "/HealthApi/router/api.php"
    : "http://localhost/HealthApi/router/api.php");

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

const get = (action, params = "") =>
  axios.get(`${API_URL}?action=${action}${params}`, { headers: authHeader() })
    .then(r => r.data)
    .catch(err => ({
      status: "error",
      message: err?.response?.data?.message || "Error de conexión.",
    }));

const post = (action, data) =>
  axios.post(`${API_URL}?action=${action}`, data, { headers: authHeader() })
    .then(r => r.data)
    .catch(err => ({
      status: "error",
      message: err?.response?.data?.message || "Error de conexión.",
    }));

const toForm = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => { if (v != null) fd.append(k, String(v)); });
  return fd;
};

// ── Citas ─────────────────────────────────────────────────────────────────────
export const getDoctorAppointments   = (docid) => get("doctorAppointments", `&doctor_id=${docid}`);
export const getTodayAppointments    = (docid) => get("doctorToday",        `&doctor_id=${docid}`);
export const getWeeklyAgenda         = (docid) => get("doctorWeeklyAgenda", `&doctor_id=${docid}`);
export const getDoctorStats          = (docid) => get("doctorStats",        `&doctor_id=${docid}`);
export const getDoctorSchedules      = (docid) => get("doctorSchedules",    `&doctor_id=${docid}`);

export const updateAppointmentStatus = (appoid, status, docid) =>
  post("doctorUpdateAppointment", toForm({ appoid, status, doctor_id: docid }));

// ── Horario ───────────────────────────────────────────────────────────────────
export const requestScheduleChange = (docid, message) =>
  post("doctorRequestSchedule", toForm({ doctor_id: docid, message }));

// ── Perfil ────────────────────────────────────────────────────────────────────
// ✅ nombre correcto — coincide con api.php case 'doctorUpdateProfile'
// ✅ exportado como updateDoctorProfile — coincide con DoctorProfile.jsx
export const updateDoctorProfile = (docid, data) =>
  post("doctorUpdateProfile", toForm({ docid, ...data }));

// ── Admin reutilizados ────────────────────────────────────────────────────────
export const getDoctorProfile  = (docid) => get("doctorProfile",   `&docid=${docid}`);
export const getDoctors        = ()       => get("adminDoctors");
export const createDoctor      = (fd)     => post("createDoctor",   fd);
export const getSpecialties    = ()       => get("adminSpecialties");
export const getDocumentTypes  = ()       => get("documentTypes");

export default {
  getDoctorAppointments, getTodayAppointments, getWeeklyAgenda,
  getDoctorStats, getDoctorSchedules, updateAppointmentStatus,
  requestScheduleChange, updateDoctorProfile,
  getDoctorProfile, getDoctors, createDoctor, getSpecialties, getDocumentTypes,
};