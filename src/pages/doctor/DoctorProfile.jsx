import { useState } from "react";
import { updateDoctorProfile, requestScheduleChange } from "../../services/doctorService";
import { COLORS, inputStyle, labelStyle } from "../../styles/COLORS";
import { DOCTOR_COLORS, doctorCard, primaryBtn } from "./doctorStyles";
import { Person, Lock, Schedule } from "@mui/icons-material";

const DAYS_MAP = { 0:"Lunes", 1:"Martes", 2:"Miércoles", 3:"Jueves", 4:"Viernes", 5:"Sábado", 6:"Domingo" };

const SectionTab = ({ icon, label, active, onClick }) => (   
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: "8px",
    padding: "0.65rem 1.25rem", borderRadius: "8px", cursor: "pointer",
    border: "none", fontSize: "14px", width: "100%", textAlign: "left",
    backgroundColor: active ? "#E8F0FE" : "transparent",
    color: active ? DOCTOR_COLORS.primary : DOCTOR_COLORS.text,
    fontWeight: active ? 500 : 400, transition: "all 0.15s",
  }}>
    {icon} {label}
  </button>
);

function DoctorProfile({ user, schedules, onUpdated }) {
  const [tab,     setTab]     = useState("info");
  const [form,    setForm]    = useState({
    dname:  user?.name  ?? "",
    demail: user?.email ?? "",
    dphone: user?.phone ?? "",
  });
  const [pwdForm, setPwdForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [requestMsg, setRequestMsg] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const handle    = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwd = e => setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  const clearMsgs = () => { setError(""); setSuccess(""); };

  const handleUpdate = async () => {
    if (!form.dname || !form.demail) { setError("Nombre y correo son obligatorios."); return; }
    clearMsgs(); setLoading(true);
    // ✅ Solo enviar campos de perfil, nunca los de contraseña
    const profileData = { dname: form.dname, demail: form.demail, dphone: form.dphone };
    try {
      const res = await updateDoctorProfile(user.id, profileData);
      if (res.status === "success") {
        setSuccess("Perfil actualizado correctamente.");
        localStorage.setItem("user", JSON.stringify({ ...user, name: form.dname, email: form.demail }));
        onUpdated();
      } else setError(res.message || "Error al actualizar.");
    } catch { setError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  const handlePasswordChange = async () => {
    if (!pwdForm.current_password || !pwdForm.new_password || !pwdForm.confirm_password) {
      setError("Completa todos los campos."); return;
    }
    if (pwdForm.new_password !== pwdForm.confirm_password) {
      setError("Las contraseñas nuevas no coinciden."); return;
    }
    if (pwdForm.new_password.length < 6) {
      setError("Mínimo 6 caracteres."); return;
    }
    clearMsgs(); setLoading(true);
    try {
      const res = await updateDoctorProfile(user.id, {
        ...form,
        current_password: pwdForm.current_password,
        new_password:     pwdForm.new_password,
      });
      if (res.status === "success") {
        setSuccess("Contraseña actualizada correctamente.");
        setPwdForm({ current_password: "", new_password: "", confirm_password: "" });
      } else setError(res.message || "Error al cambiar contraseña.");
    } catch { setError("Error de conexión."); }
    finally  { setLoading(false); }
  
  };

  const handleScheduleRequest = async () => {
    if (!requestMsg.trim()) { setError("Escribe un mensaje para el administrador."); return; }
    clearMsgs(); setLoading(true);
    try {
      const res = await requestScheduleChange(user.id, requestMsg);
      if (res.status === "success") {
        setSuccess("Solicitud enviada al administrador.");
        setRequestMsg("");
      } else setError(res.message || "Error al enviar.");
    } catch { setError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", color: DOCTOR_COLORS.text }}>Mi perfil</h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: DOCTOR_COLORS.muted }}>
          Gestiona tu información y horarios
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* Menú lateral */}
        <div style={{ ...doctorCard, padding: "0.75rem" }}>
          <div style={{ textAlign: "center", padding: "1rem 0.5rem 1.25rem", borderBottom: "1px solid var(--bordercolor)", marginBottom: "0.5rem" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              backgroundColor: DOCTOR_COLORS.primary,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 0.5rem", fontSize: "22px", fontWeight: 700, color: "#fff",
            }}>
              {user?.name?.charAt(0)?.toUpperCase() ?? "D"}
            </div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: "13px", color: DOCTOR_COLORS.text }}>{user?.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: DOCTOR_COLORS.muted }}>Médico</p>
          </div>
          <SectionTab icon={<Person fontSize="small" />}   label="Información"      active={tab === "info"}     onClick={() => { setTab("info");     clearMsgs(); }} />
          <SectionTab icon={<Lock fontSize="small" />}     label="Contraseña"       active={tab === "password"} onClick={() => { setTab("password"); clearMsgs(); }} />
          <SectionTab icon={<Schedule fontSize="small" />} label="Mis horarios"     active={tab === "schedule"} onClick={() => { setTab("schedule"); clearMsgs(); }} />
        </div>

        {/* Contenido */}
        <div>
          {error   && <div style={{ backgroundColor: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#C62828" }}>{error}</div>}
          {success && <div style={{ backgroundColor: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#2E7D32" }}>{success}</div>}

          {tab === "info" && (
            <div style={doctorCard}>
              <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", color: DOCTOR_COLORS.text }}>Información personal</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Nombre completo *</label>
                  <input name="dname" value={form.dname} onChange={handle} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Correo electrónico *</label>
                  <input name="demail" type="email" value={form.demail} onChange={handle} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input name="dphone" value={form.dphone} onChange={handle} style={inputStyle} placeholder="Ej: 3001234567" />
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
            <div style={doctorCard}>
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: DOCTOR_COLORS.text }}>Cambiar contraseña</h3>
              <p style={{ margin: "0 0 1.25rem", fontSize: "13px", color: DOCTOR_COLORS.muted }}>Mínimo 6 caracteres.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
                <div>
                  <label style={labelStyle}>Contraseña actual *</label>
                  <input name="current_password" type="password" value={pwdForm.current_password} onChange={handlePwd} style={inputStyle} placeholder="••••••••" />
                </div>
                <div>
                  <label style={labelStyle}>Nueva contraseña *</label>
                  <input name="new_password" type="password" value={pwdForm.new_password} onChange={handlePwd} style={inputStyle} placeholder="••••••••" />
                </div>
                <div>
                  <label style={labelStyle}>Confirmar nueva contraseña *</label>
                  <input name="confirm_password" type="password" value={pwdForm.confirm_password} onChange={handlePwd} style={inputStyle} placeholder="••••••••" />
                  {pwdForm.confirm_password && pwdForm.new_password !== pwdForm.confirm_password && (
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#C62828" }}>Las contraseñas no coinciden</p>
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

          {tab === "schedule" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={doctorCard}>
                <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: DOCTOR_COLORS.text }}>Mis horarios activos</h3>
                {schedules.length === 0
                  ? <p style={{ color: DOCTOR_COLORS.muted, fontSize: "14px" }}>No tienes horarios asignados.</p>
                  : schedules.map(sc => (
                    <div key={sc.scheduleid} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "0.75rem 0", borderBottom: "1px solid var(--bordercolor)",
                    }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: "14px", color: DOCTOR_COLORS.text }}>
                          {DAYS_MAP[sc.day_of_week]}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: DOCTOR_COLORS.muted }}>
                          {sc.session} · {sc.start_time} – {sc.end_time} · c/{sc.slot_duration_min} min
                        </p>
                      </div>
                      <span style={{
                        backgroundColor: sc.is_active ? "#E8F5E9" : "#FFEBEE",
                        color: sc.is_active ? "#2E7D32" : "#C62828",
                        padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                      }}>
                        {sc.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  ))}
              </div>

              <div style={doctorCard}>
                <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: DOCTOR_COLORS.text }}>Solicitar cambio de horario</h3>
                <p style={{ margin: "0 0 1rem", fontSize: "13px", color: DOCTOR_COLORS.muted }}>
                  El administrador recibirá tu solicitud y realizará los cambios.
                </p>
                <textarea
                  value={requestMsg}
                  onChange={e => setRequestMsg(e.target.value)}
                  placeholder="Describe el cambio que necesitas. Ej: Necesito modificar el horario del martes de 14:00 a 18:00..."
                  style={{
                    width: "100%", minHeight: "100px", padding: "0.75rem",
                    border: "1px solid var(--bordercolor)", borderRadius: "8px",
                    fontSize: "14px", color: DOCTOR_COLORS.text, resize: "vertical",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                  <button onClick={handleScheduleRequest} disabled={loading || !requestMsg.trim()} style={primaryBtn(loading)}>
                    {loading ? "Enviando..." : "Enviar solicitud"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;