import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePatient, deletePatient } from "../../services/patientService";
import { COLORS, inputStyle, labelStyle } from "../../styles/COLORS";
import { patientCard, dangerCard, primaryBtn, deleteBtn } from "./patientStyles";
import { Person, Lock, DeleteForever } from "@mui/icons-material";

const SectionTab = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: "8px",
    padding: "0.65rem 1.25rem", borderRadius: "8px", cursor: "pointer",
    border: "none", fontSize: "14px", width: "100%", textAlign: "left",
    backgroundColor: active ? "#E8F0FE" : "transparent",
    color: active ? COLORS.primary : COLORS.text,
    fontWeight: active ? 500 : 400, transition: "all 0.15s",
  }}>
    {icon} {label}
  </button>
);

const Alert = ({ type, msg }) => {
  if (!msg) return null;
  const styles = {
    success: { bg: "#E8F5E9", border: "#A5D6A7", color: "#2E7D32" },
    error:   { bg: "#FFEBEE", border: "#FFCDD2", color: "#C62828" },
  };
  const s = styles[type];
  return (
    <div style={{
      backgroundColor: s.bg, border: `1px solid ${s.border}`,
      borderRadius: "8px", padding: "0.75rem 1rem",
      marginBottom: "1rem", fontSize: "13px", color: s.color,
    }}>
      {msg}
    </div>
  );
};

function PatientProfile({ user, onUpdated }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("info");

  const [form, setForm] = useState({
    pname:    user?.name    ?? "",
    pemail:   user?.email   ?? "",
    pphone:   user?.phone   ?? "",
    paddress: user?.address ?? "",
  });

  const [pwdForm, setPwdForm] = useState({
    current_password: "", new_password: "", confirm_password: "",
  });

  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const handle    = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePwd = e => setPwdForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const clearMsgs = () => { setError(""); setSuccess(""); };

  const showSuccess = (msg) => { setSuccess(msg); setError(""); };
  const showError   = (msg) => { setError(msg);   setSuccess(""); };

  const handleUpdate = async () => {
    if (!form.pname || !form.pemail) { showError("Nombre y correo son obligatorios."); return; }
    clearMsgs(); setLoading(true);
    try {
      const res = await updatePatient(user.id, form);
      if (res?.status === "success") {
        showSuccess("✓ Datos actualizados correctamente.");
        const updated = { ...user, name: form.pname, email: form.pemail };
        localStorage.setItem("user", JSON.stringify(updated));
        onUpdated();
      } else {
        showError(res?.message || "Error al actualizar.");
      }
    } catch { showError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  const handlePasswordChange = async () => {
    if (!pwdForm.current_password || !pwdForm.new_password || !pwdForm.confirm_password) {
      showError("Completa todos los campos."); return;
    }
    if (pwdForm.new_password !== pwdForm.confirm_password) {
      showError("Las contraseñas nuevas no coinciden."); return;
    }
    if (pwdForm.new_password.length < 6) {
      showError("La contraseña debe tener al menos 6 caracteres."); return;
    }
    clearMsgs(); setLoading(true);
    try {
      const res = await updatePatient(user.id, {
        ...form,
        current_password: pwdForm.current_password,
        new_password:     pwdForm.new_password,
      });
      if (res?.status === "success") {
        showSuccess("✓ Contraseña actualizada correctamente.");
        setPwdForm({ current_password: "", new_password: "", confirm_password: "" });
      } else {
        showError(res?.message || "Error al cambiar contraseña.");
      }
    } catch { showError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro? Esta acción es irreversible.")) return;
    setLoading(true);
    try {
      const res = await deletePatient(user.id);
      if (res?.status === "success") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
      } else {
        showError(res?.message || "Error al eliminar cuenta.");
      }
    } catch { showError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", color: COLORS.text }}>Mi perfil</h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: COLORS.muted }}>
          Gestiona tu información personal y seguridad
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* Menú lateral */}
        <div style={{ ...patientCard, padding: "0.75rem" }}>
          <div style={{
            textAlign: "center", padding: "1rem 0.5rem 1.25rem",
            borderBottom: "1px solid var(--bordercolor)", marginBottom: "0.5rem",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              backgroundColor: "#E8F0FE", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 0.5rem",
            }}>
              <Person style={{ color: COLORS.primary, fontSize: "28px" }} />
            </div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: "13px", color: COLORS.text }}>
              {user?.name}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: COLORS.muted }}>
              {user?.email}
            </p>
          </div>
          <SectionTab icon={<Person fontSize="small" />}
            label="Información" active={tab === "info"}
            onClick={() => { setTab("info"); clearMsgs(); }} />
          <SectionTab icon={<Lock fontSize="small" />}
            label="Contraseña" active={tab === "password"}
            onClick={() => { setTab("password"); clearMsgs(); }} />
          <SectionTab icon={<DeleteForever fontSize="small" />}
            label="Eliminar cuenta" active={tab === "danger"}
            onClick={() => { setTab("danger"); clearMsgs(); }} />
        </div>

        {/* Contenido */}
        <div>
          <Alert type="success" msg={success} />
          <Alert type="error"   msg={error} />

          {tab === "info" && (
            <div style={patientCard}>
              <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", color: COLORS.text }}>
                Información personal
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Nombre completo *</label>
                  <input name="pname" value={form.pname} onChange={handle} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Correo electrónico *</label>
                  <input name="pemail" type="email" value={form.pemail} onChange={handle} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input name="pphone" value={form.pphone} onChange={handle} style={inputStyle} placeholder="Ej: 3001234567" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Dirección</label>
                  <input name="paddress" value={form.paddress} onChange={handle} style={inputStyle} placeholder="Ej: Calle 45 # 12-34" />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem" }}>
                <button onClick={handleUpdate} disabled={loading} style={primaryBtn(loading)}>
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          )}

          {tab === "password" && (
            <div style={patientCard}>
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: COLORS.text }}>
                Cambiar contraseña
              </h3>
              <p style={{ margin: "0 0 1.25rem", fontSize: "13px", color: COLORS.muted }}>
                Usa una contraseña segura de al menos 6 caracteres.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
                <div>
                  <label style={labelStyle}>Contraseña actual *</label>
                  <input name="current_password" type="password"
                    value={pwdForm.current_password} onChange={handlePwd}
                    style={inputStyle} placeholder="••••••••" />
                </div>
                <div>
                  <label style={labelStyle}>Nueva contraseña *</label>
                  <input name="new_password" type="password"
                    value={pwdForm.new_password} onChange={handlePwd}
                    style={inputStyle} placeholder="••••••••" />
                </div>
                <div>
                  <label style={labelStyle}>Confirmar nueva contraseña *</label>
                  <input name="confirm_password" type="password"
                    value={pwdForm.confirm_password} onChange={handlePwd}
                    style={inputStyle} placeholder="••••••••" />
                  {pwdForm.confirm_password && pwdForm.new_password !== pwdForm.confirm_password && (
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#C62828" }}>
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem" }}>
                <button onClick={handlePasswordChange} disabled={loading} style={primaryBtn(loading)}>
                  {loading ? "Actualizando..." : "Cambiar contraseña"}
                </button>
              </div>
            </div>
          )}

          {tab === "danger" && (
            <div style={dangerCard}>
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: "#C62828" }}>
                Eliminar cuenta
              </h3>
              <p style={{ margin: "0 0 1.25rem", fontSize: "13px", color: COLORS.muted }}>
                Esta acción es <strong>permanente e irreversible</strong>. Se eliminarán
                todos tus datos, historial de citas y acceso al sistema.
              </p>
              {!showDelete ? (
                <button onClick={() => setShowDelete(true)} style={{
                  backgroundColor: "#FFEBEE", color: "#C62828",
                  border: "1px solid #FFCDD2", borderRadius: "8px",
                  padding: "0.5rem 1rem", cursor: "pointer", fontSize: "13px",
                }}>
                  Quiero eliminar mi cuenta
                </button>
              ) : (
                <div style={{
                  backgroundColor: "#FFF3E0", borderRadius: "8px",
                  padding: "1rem", border: "1px solid #FFCC02",
                }}>
                  <p style={{ margin: "0 0 1rem", fontSize: "13px", color: "#E65100", fontWeight: 500 }}>
                    ¿Estás completamente seguro? No podrás recuperar tu cuenta.
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={handleDelete} disabled={loading}
                      style={{ ...deleteBtn, opacity: loading ? 0.7 : 1 }}>
                      {loading ? "Eliminando..." : "Sí, eliminar mi cuenta"}
                    </button>
                    <button onClick={() => setShowDelete(false)} style={{
                      backgroundColor: "#fff", color: COLORS.text,
                      border: "1px solid var(--bordercolor)", borderRadius: "8px",
                      padding: "0.5rem 1rem", cursor: "pointer", fontSize: "13px",
                    }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;