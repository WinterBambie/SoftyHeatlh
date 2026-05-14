import { memo } from "react";

/**
 * PasswordTab
 * Formulario de cambio de contraseña.
 * Idéntico en DoctorProfile y PatientProfile — extraído como componente compartido.
 *
 * Props:
 *   pwdForm       — { current_password, new_password, confirm_password }
 *   onChangePwd   — handler del input
 *   onSubmit      — async () => void
 *   loading       — boolean
 *   inputStyle    — object de estilos CSS
 *   labelStyle    — object de estilos CSS
 *   cardStyle     — object de estilos CSS
 *   textColor     — string
 *   mutedColor    — string
 *   primaryBtn    — (loading) => object de estilos CSS
 */
const PasswordTab = memo(function PasswordTab({
  pwdForm,
  onChangePwd,
  onSubmit,
  loading,
  inputStyle,
  labelStyle,
  cardStyle,
  textColor  = "var(--textcolor)",
  mutedColor = "#666",
  primaryBtn,
}) {
  const mismatch =
    pwdForm.confirm_password && pwdForm.new_password !== pwdForm.confirm_password;

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: textColor }}>
        Cambiar contraseña
      </h3>
      <p style={{ margin: "0 0 1.25rem", fontSize: "13px", color: mutedColor }}>
        Usa una contraseña segura de al menos 6 caracteres.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <div>
          <label style={labelStyle}>Contraseña actual *</label>
          <input
            name="current_password"
            type="password"
            value={pwdForm.current_password}
            onChange={onChangePwd}
            style={inputStyle}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label style={labelStyle}>Nueva contraseña *</label>
          <input
            name="new_password"
            type="password"
            value={pwdForm.new_password}
            onChange={onChangePwd}
            style={inputStyle}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label style={labelStyle}>Confirmar nueva contraseña *</label>
          <input
            name="confirm_password"
            type="password"
            value={pwdForm.confirm_password}
            onChange={onChangePwd}
            style={inputStyle}
            placeholder="••••••••"
          />
          {mismatch && (
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#C62828" }}>
              Las contraseñas no coinciden
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem" }}>
        <button onClick={onSubmit} disabled={loading} style={primaryBtn(loading)}>
          {loading ? "Actualizando..." : "Cambiar contraseña"}
        </button>
      </div>
    </div>
  );
});

export default PasswordTab;