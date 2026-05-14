import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePatient, deletePatient } from "../../services/patientService";
import { inputStyle, labelStyle, COLORS } from "../../styles/COLORS";
import { patientCard, dangerCard, primaryBtn, deleteBtn } from "./patientStyles";
import { Person, Lock, DeleteForever } from "@mui/icons-material";

// ── Componentes compartidos ───────────────────────────────────────────────────
import Alert          from "../../components/ui/Alert";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import PasswordTab    from "../../components/profile/PasswordTab";
import ConfirmDanger  from "../../components/profile/ConfirmDanger";
import { useProfileForm } from "../../Hook/useProfileForm";

const TABS = [
  { key: "info",     label: "Información",    icon: <Person        fontSize="small" /> },
  { key: "password", label: "Contraseña",     icon: <Lock          fontSize="small" /> },
  { key: "danger",   label: "Eliminar cuenta",icon: <DeleteForever fontSize="small" /> },
];

function PatientProfile({ user, onUpdated }) {
  const navigate = useNavigate();

  const {
    tab, changeTab,
    loading, setLoading,
    error, success,
    showSuccess, showError,
    pwdForm, handlePwd, resetPwdForm, validatePwd,
  } = useProfileForm("info");

  const pid = user?.pid ?? user?.patient_id ?? user?.id;

  const [form, setForm] = useState({
    pname:    user?.name    ?? "",
    pemail:   user?.email   ?? "",
    pphone:   user?.phone   ?? "",
    paddress: user?.address ?? "",
  });
  const [showDelete, setShowDelete] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    if (!form.pname || !form.pemail) { showError("Nombre y correo son obligatorios."); return; }
    setLoading(true);
    try {
      const res = await updatePatientProfile(pid, form);
      if (res?.status === "success") {
        showSuccess("✓ Datos actualizados correctamente.");
        localStorage.setItem("user", JSON.stringify({ ...user, name: form.pname, email: form.pemail }));
        setTimeout(() => onUpdated(), 1500);
      } else showError(res?.message || "Error al actualizar.");
    } catch { showError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  const handlePasswordChange = async () => {
    const err = validatePwd();
    if (err) { showError(err); return; }
    setLoading(true);
    try {
      const res = await updatePatientProfile(pid, {
        ...form,
        current_password: pwdForm.current_password,
        new_password:     pwdForm.new_password,
      });
      if (res?.status === "success") {
        showSuccess("✓ Contraseña actualizada correctamente.");
        resetPwdForm();
      } else showError(res?.message || "Error al cambiar contraseña.");
    } catch { showError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deletePatientAccount(pid);
      if (res?.status === "success") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
      } else showError(res?.message || "Error al eliminar cuenta.");
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

        <ProfileSidebar
          name={user?.name}
          subtitle={user?.email}
          tabs={TABS}
          activeTab={tab}
          onTabChange={changeTab}
          cardStyle={patientCard}
          avatarBg="#E8F0FE"
          avatarContent={<Person style={{ color: COLORS.primary, fontSize: "28px" }} />}
          primaryColor={COLORS.primary}
          textColor={COLORS.text}
          mutedColor={COLORS.muted}
        />

        <div>
          <Alert type="error"   msg={error} />
          <Alert type="success" msg={success} />

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
            <PasswordTab
              pwdForm={pwdForm}
              onChangePwd={handlePwd}
              onSubmit={handlePasswordChange}
              loading={loading}
              inputStyle={inputStyle}
              labelStyle={labelStyle}
              cardStyle={patientCard}
              textColor={COLORS.text}
              mutedColor={COLORS.muted}
              primaryBtn={primaryBtn}
            />
          )}

          {tab === "danger" && (
            !showDelete ? (
              <div style={dangerCard}>
                <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: "#C62828" }}>
                  Eliminar cuenta
                </h3>
                <p style={{ margin: "0 0 1.25rem", fontSize: "13px", color: COLORS.muted }}>
                  Esta acción es <strong>permanente e irreversible</strong>. Se eliminarán
                  todos tus datos, historial de citas y acceso al sistema.
                </p>
                <button onClick={() => setShowDelete(true)} style={{
                  backgroundColor: "#FFEBEE", color: "#C62828",
                  border: "1px solid #FFCDD2", borderRadius: "8px",
                  padding: "0.5rem 1rem", cursor: "pointer", fontSize: "13px",
                }}>
                  Quiero eliminar mi cuenta
                </button>
              </div>
            ) : (
              <ConfirmDanger
                description={
                  <>Esta acción es <strong>permanente e irreversible</strong>. Se eliminarán todos tus datos, historial de citas y acceso al sistema.</>
                }
                onConfirm={handleDelete}
                onCancel={() => setShowDelete(false)}
                loading={loading}
                cardStyle={dangerCard}
                deleteBtn={deleteBtn}
                textColor={COLORS.text}
                mutedColor={COLORS.muted}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;