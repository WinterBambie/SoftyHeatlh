import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "/HealthApi/router/api.php"
    : "http://localhost/HealthApi/router/api.php");

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
  "Content-Type": "application/json",
});

const get = (action, params = "") =>
  axios.get(`${API_URL}?action=${action}${params}`, { headers: authHeader() })
    .then(r => r.data)
    .catch(err => ({ status: "error", message: err?.response?.data?.message || "Error de conexión." }));
    
const post = (action, data) =>
  axios.post(`${API_URL}?action=${action}`, data, { headers: authHeader() })
    .then(r => r.data)
    .catch(err => ({ status: "error", message: err?.response?.data?.message || "Error de conexión." }));

// Pacientes del doctor con estado de HC
export const getPacientesHC = (docid) =>
  get("hcPacientes", `&doctor_id=${docid}`);


export const getHistoriaClinica = (pid, docid) =>
  get("hcGet", `&pid=${pid}&doctor_id=${docid}`);

// Crear registro — envía JSON con todos los campos del formulario
export const crearRegistroClinico = (data) =>
  post("hcCrearRegistro", data);

// Anular registro — no elimina, solo marca como anulado (Art. 18 Res. 1995/1999)
export const anularRegistro = (registro_id, docid, motivo) =>
  post("hcAnularRegistro", { registro_id, doctor_id: docid, motivo });

export default { getPacientesHC, getHistoriaClinica, crearRegistroClinico, anularRegistro };