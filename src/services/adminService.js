/** En desarrollo, ruta relativa usa el proxy de Vite y evita CORS con Apache en :80. */
const API =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "/HealthApi/router/api.php"
    : "http://localhost/HealthApi/router/api.php");

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

/** Evita que respuestas no-JSON (error PHP, HTML, vacío) rompan con res.json() y parezcan "error de conexión". */
async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text?.trim()) {
    return {
      status: "error",
      message: `El servidor respondió vacío (HTTP ${res.status}). Revisa los logs de PHP.`,
    };
  }
  try {
    return JSON.parse(text);
  } catch {
    const preview = text.slice(0, 120).replace(/\s+/g, " ");
    return {
      status: "error",
      message: `La respuesta no es JSON (HTTP ${res.status}). ${preview}`,
    };
  }
}

const post = async (action, formData) => {
  try {
    const res = await fetch(`${API}?action=${encodeURIComponent(action)}`, {
      method: "POST",
      headers: authHeader(),
      body: formData,
    });
    const data = await parseJsonResponse(res);
    if (!res.ok && data.status !== "success") {
      return {
        ...data,
        status: data.status || "error",
        message:
          data.message ||
          `Error del servidor (HTTP ${res.status}).`,
      };
    }
    return data;
  } catch (e) {
    return {
      status: "error",
      message:
        e?.message ||
        "No se pudo conectar con la API. Comprueba que Apache/XAMPP esté activo, la URL en VITE_API_URL y CORS.",
    };
  }
};

const get = async (action, params = "") => {
  try {
    const url = `${API}?action=${action}${params}`;
    const res = await fetch(url, {
      headers: authHeader(),
    });
    const data = await parseJsonResponse(res);
    if (!res.ok && data.status !== "success") {
      return {
        ...data,
        status: data.status || "error",
        message:
          data.message ||
          `Error del servidor (HTTP ${res.status}).`,
      };
    }
    return data;
  } catch (e) {
    return {
      status: "error",
      message:
        e?.message ||
        "No se pudo conectar con la API. Comprueba que Apache/XAMPP esté activo y la URL en VITE_API_URL.",
    };
  }
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
export const getAvailableSlots = (scheduleid, date) =>
  get(
    `availableSlots&scheduleid=${encodeURIComponent(scheduleid)}&date=${encodeURIComponent(date)}`
  );

// ── Stats ─────────────────────────────────────────────────────────────────────

export const getAdminStats = () => get("adminStats");
