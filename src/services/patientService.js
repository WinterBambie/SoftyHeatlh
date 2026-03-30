import axios from "axios";

const API_URL = "http://localhost/HealthApi/router/api.php";

// Obtener horarios disponibles
export const getSchedules = async () => {
  const res = await axios.get(
    `${API_URL}?action=getSchedules`
  );
  return res.data;
};

// Crear cita
export const createAppointment = async (data) => {
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });

  const res = await axios.post(
    `${API_URL}?action=createAppointment`,
    formData
  );

  return res.data;
};

// Ver citas del paciente
export const getPatientAppointments = async (pid) => {
  const res = await axios.get(
    `${API_URL}?action=patientAppointments&pid=${pid}`
  );
  return res.data;
};

export default {
  getSchedules,
  createAppointment,
  getPatientAppointments
};