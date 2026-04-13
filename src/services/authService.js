import axios from "axios";

const API = "http://localhost/HealthApi/router/api.php";

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API}?action=login`,
      { email, password },
      { timeout: 5000, headers: { "Content-Type": "application/json" } }
    );
    const data = response.data;

    if (data.status === "success") {
      // ✅ Normalizar id según el rol para que siempre exista user.id
      const raw = data.user ?? {};
      const user = {
        ...raw,
        role: data.type,
        // paciente → pid, doctor → docid, admin → adminid/id
        id: raw.id ?? raw.pid ?? raw.docid ?? raw.adminid ?? null,
      };
      localStorage.setItem("token", data.token ?? "");
      localStorage.setItem("user", JSON.stringify(user));
      return { status: "success", user };
    }

    return { status: "error", message: data.message || "Credenciales incorrectas" };
  } catch (error) {
    if (!error.response) {
      return { status: "server_error", message: "No se pudo conectar al servidor" };
    }
    return { status: "error", message: "Error del servidor" };
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
  } catch {
    return { status: "error", message: "Error al registrarse" };
  }
};

export const getDocumentTypes = async () => {
  try {
    const response = await axios.get(`${API}?action=documentTypes`);
    return response.data;
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