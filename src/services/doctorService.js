import axios from "axios";

const API = "http://localhost/HealthApi/router/api.php";

// ── Doctor ────────────────────────────────────────────────────────────────────

export const getDoctorAppointments = async (doctorId) => {
  const res = await axios.get(`${API}?action=getAppointmentsByDoctor&doctor_id=${doctorId}`);
  return res.data;
};

export const getDoctorProfile = async (doctorId) => {
  const res = await axios.get(`${API}?action=doctorProfile&docid=${doctorId}`);
  return res.data;
};

// ── Admin — doctores ──────────────────────────────────────────────────────────

export const getDoctors = async () => {
  const res = await axios.get(`${API}?action=adminDoctors`);
  return res.data;
};

export const createDoctor = async (formData) => {
  const res = await axios.post(`${API}?action=createDoctor`, formData);
  return res.data;
};

// ── Especialidades ────────────────────────────────────────────────────────────

export const getSpecialties = async () => {
  const res = await axios.get(`${API}?action=adminSpecialties`);
  return res.data;
};

// ── Tipos de documento ────────────────────────────────────────────────────────

export const getDocumentTypes = async () => {
  const res = await axios.get(`${API}?action=documentTypes`);
  return res.data;
};

export default { getDoctorAppointments, getDoctorProfile, getDoctors, createDoctor, getSpecialties, getDocumentTypes };