import { useState } from "react";
import { updateDoctorProfile, requestScheduleChange } from "../../services/doctorService";
import { inputStyle, labelStyle } from "../../styles/COLORS";
import { DOCTOR_COLORS, doctorCard, primaryBtn } from "./doctorStyles";
import { Person, Lock, Schedule } from "@mui/icons-material";
import Alert          from "../../components/ui/Alert";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import PasswordTab    from "../../components/profile/PasswordTab";
import { useProfileForm } from "../../Hook/useProfileForm";

const DAYS_MAP = {
  0: "Lunes", 1: "Martes", 2: "Miércoles", 3: "Jueves",
  4: "Viernes", 5: "Sábado", 6: "Domingo",
};

const TABS = [
  { key: "info",     label: "Información",  icon: <Person   fontSize="small" /> },
  { key: "password", label: "Contraseña",   icon: <Lock     fontSize="small" /> },
  { key: "schedule", label: "Mis horarios", icon: <Schedule fontSize="small" /> },
];

function DoctorProfile({ user, schedules, onUpdated }) {
  const {
    tab, changeTab,
    loading, setLoading,
    error, success,
    showSuccess, showError,
    pwdForm, handlePwd, resetPwdForm, validatePwd,
  } = useProfileForm("info");

  const [form, setForm] = useState({
    dname:  user?.name  ?? "",
    demail: user?.email ?? "",
    dphone: user?.phone ?? "",
  });
  const [requestMsg, setRequestMsg] = useState("");

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    if (!form.dname || !form.demail) { showError("Nombre y correo son obligatorios."); return; }
    setLoading(true);
    try {
      const res = await updateDoctorProfile(user.id, {
        dname: form.dname, demail: form.demail, dphone: form.dphone,
      });
      if (res.status === "success") {
        showSuccess("✓ Perfil actualizado correctamente.");
        localStorage.setItem("user", JSON.stringify({ ...user, name: form.dname, email: form.demail }));
        setTimeout(() => onUpdated(), 1500);
      } else showError(res.message || "Error al actualizar.");
    } catch { showError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  const handlePasswordChange = async () => {
    const err = validatePwd();
    if (err) { showError(err); return; }
    setLoading(true);
    try {
      const res = await updateDoctorProfile(user.id, {
        ...form,
        current_password: pwdForm.current_password,
        new_password:     pwdForm.new_password,
      });
      if (res.status === "success") {
        showSuccess("✓ Contraseña actualizada correctamente.");
        resetPwdForm();
      } else showError(res.message || "Error al cambiar contraseña.");
    } catch { showError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  const handleScheduleRequest = async () => {
    if (!requestMsg.trim()) { showError("Escribe un mensaje para el administrador."); return; }
    setLoading(true);
    try {
      const res = await requestScheduleChange(user.id, requestMsg);
      if (res.status === "success") {
        showSuccess("✓ Solicitud enviada al administrador.");
        setRequestMsg("");
      } else showError(res.message || "Error al enviar.");
    } catch { showError("Error de conexión."); }
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

        <ProfileSidebar
          name={user?.name}
          subtitle="Médico"
          tabs={TABS}
          activeTab={tab}
          onTabChange={changeTab}
          cardStyle={doctorCard}
          avatarBg={DOCTOR_COLORS.primary}
          avatarContent={
            <span style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>
              {user?.name?.charAt(0)?.toUpperCase() ?? "D"}
            </span>
          }
          primaryColor={DOCTOR_COLORS.primary}
          textColor={DOCTOR_COLORS.text}
          mutedColor={DOCTOR_COLORS.muted}
        />

        <div>
          <Alert type="error"   msg={error} />
          <Alert type="success" msg={success} />

          {tab === "info" && (
            <div style={doctorCard}>
              <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", color: DOCTOR_COLORS.text }}>
                Información personal
              </h3>
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
            <PasswordTab
              pwdForm={pwdForm}
              onChangePwd={handlePwd}
              onSubmit={handlePasswordChange}
              loading={loading}
              inputStyle={inputStyle}
              labelStyle={labelStyle}
              cardStyle={doctorCard}
              textColor={DOCTOR_COLORS.text}
              mutedColor={DOCTOR_COLORS.muted}
              primaryBtn={primaryBtn}
            />
          )}

          {tab === "schedule" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={doctorCard}>
                <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: DOCTOR_COLORS.text }}>
                  Mis horarios activos
                </h3>
                {schedules.length === 0 ? (
                  <p style={{ color: DOCTOR_COLORS.muted, fontSize: "14px" }}>No tienes horarios asignados.</p>
                ) : (
                  schedules.map((sc) => (
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
                        color:           sc.is_active ? "#2E7D32" : "#C62828",
                        padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                      }}>
                        {sc.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div style={doctorCard}>
                <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: DOCTOR_COLORS.text }}>
                  Solicitar cambio de horario
                </h3>
                <p style={{ margin: "0 0 1rem", fontSize: "13px", color: DOCTOR_COLORS.muted }}>
                  El administrador recibirá tu solicitud y realizará los cambios.
                </p>
                <textarea
                  value={requestMsg}
                  onChange={(e) => setRequestMsg(e.target.value)}
                  placeholder="Describe el cambio que necesitas. Ej: Necesito modificar el horario del martes de 14:00 a 18:00..."
                  style={{
                    width: "100%", minHeight: "100px", padding: "0.75rem",
                    border: "1px solid var(--bordercolor)", borderRadius: "8px",
                    fontSize: "14px", color: DOCTOR_COLORS.text, resize: "vertical",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                  <button
                    onClick={handleScheduleRequest}
                    disabled={loading || !requestMsg.trim()}
                    style={primaryBtn(loading)}
                  >
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