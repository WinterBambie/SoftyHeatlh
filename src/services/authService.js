import axios from "axios";
const API =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "/HealthApi/router/api.php"
    : "http://localhost/HealthApi/router/api.php");

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API}?action=login`,
      { email, password },
      { timeout: 8000, headers: { "Content-Type": "application/json" } }
    );
    const data = response.data;

    if (data.status === "success") {
      // El backend nuevo mete token y user dentro de data.data
      // El backend original los tiene en data.token / data.user
      const payload = data.data ?? data;
      const raw     = payload.user ?? data.user ?? {};
      const token   = payload.token ?? data.token ?? "";

      const user = {
        ...raw,
        role: payload.type ?? data.type,
        id:   raw.id ?? raw.pid ?? raw.docid ?? null,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { status: "success", user };
    }

    return { status: "error", message: data.message || "Credenciales incorrectas." };
  } catch (error) {
    if (!error.response) {
      return { status: "server_error", message: "No se pudo conectar al servidor." };
    }
    return {
      status: "error",
      message: error.response?.data?.message || "Error del servidor.",
    };
  }
};

export const register = async (personalData, accountData) => {
  try {
    const formData = new FormData();
    formData.append("tipo_documento_id", personalData.tipo_documento_id);
    formData.append("fname",    personalData.fname);
    formData.append("lname",    personalData.lname);
    formData.append("nic",      personalData.nic);
    formData.append("address",  personalData.address);
    formData.append("dob",      personalData.dob);
    formData.append("phone",    personalData.phone || "");
    formData.append("email",    accountData.email);
    formData.append("password", accountData.password);

    const response = await axios.post(`${API}?action=register`, formData);
    return response.data;
  } catch (error) {
    return {
      status: "error",
      message: error.response?.data?.message || "Error al registrarse.",
    };
  }
};

export const getDocumentTypes = async () => {
  try {
    const response = await axios.get(`${API}?action=documentTypes`);
    // Soporta tanto respuesta directa (array) como envuelta en {data: [...]}
    const res = response.data;
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    return [];
  } catch {
    return [];
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser         = () => { const u = localStorage.getItem("user"); return u ? JSON.parse(u) : null; };
export const getRole         = () => getUser()?.role ?? null;
export const isAuthenticated = () => !!localStorage.getItem("user");

export default { login, register, getDocumentTypes, logout, getUser, getRole, isAuthenticated };