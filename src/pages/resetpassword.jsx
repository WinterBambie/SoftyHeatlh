import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/HealthApi/router/api.php" : "http://localhost/HealthApi/router/api.php");

export default function ResetPassword() {
  const [params]     = useSearchParams();
  const token        = params.get("token") ?? "";
  const navigate     = useNavigate();
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [msg,        setMsg]        = useState(null);

  useEffect(() => {
    if (!token) { setValidating(false); return; }
    axios.get(`${API}?action=validateResetToken&token=${token}`)
      .then(res => setTokenValid(res.data.status === "success"))
      .catch(() => setTokenValid(false))
      .finally(() => setValidating(false));
  }, [token]);

  const handleSubmit = async () => {
    if (!password || !confirm) { setMsg({ type: "error", text: "Completa todos los campos." }); return; }
    if (password !== confirm)  { setMsg({ type: "error", text: "Las contraseñas no coinciden." }); return; }
    if (password.length < 6)   { setMsg({ type: "error", text: "Mínimo 6 caracteres." }); return; }
    setLoading(true); setMsg(null);
    try {
      const res = await axios.post(`${API}?action=resetPassword`, { token, password });
      if (res.data.status === "success") {
        setMsg({ type: "success", text: "¡Contraseña actualizada! Redirigiendo al login..." });
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setMsg({ type: "error", text: res.data.message });
      }
    } catch { setMsg({ type: "error", text: "Error de conexión." }); }
    finally  { setLoading(false); }
  };

  const card  = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f7fa" };
  const box   = { backgroundColor: "#fff", borderRadius: "12px", padding: "2.5rem 2rem", width: "100%", maxWidth: "400px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" };
  const inp   = { width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e9ecef", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" };
  const lbl   = { fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" };
  const btn   = (dis) => ({ width: "100%", padding: "0.75rem", backgroundColor: "#0A76D8", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", cursor: dis ? "not-allowed" : "pointer", opacity: dis ? 0.7 : 1, marginTop: "1rem" });
  const alert = (type) => ({ backgroundColor: type === "success" ? "#E8F5E9" : "#FFEBEE", border: `1px solid ${type === "success" ? "#A5D6A7" : "#FFCDD2"}`, borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: type === "success" ? "#2E7D32" : "#C62828" });

  if (validating) return (
    <div style={card}><p style={{ color: "#666" }}>Validando enlace...</p></div>
  );

  return (
    <div style={card}>
      <div style={box}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#0A76D8" }}>SoftyHealth</h1>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#666" }}>Nueva contraseña</p>
        </div>

        {msg && <div style={alert(msg.type)}>{msg.text}</div>}

        {!tokenValid ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#C62828", fontSize: "14px" }}>Este enlace es inválido o ha expirado.</p>
            <Link to="/forgot-password" style={{ color: "#0A76D8", fontSize: "13px" }}>
              Solicitar nuevo enlace
            </Link>
          </div>
        ) : msg?.type !== "success" && (
          <>
            <div style={{ marginBottom: "1rem" }}>
              <label style={lbl}>Nueva contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                style={inp} placeholder="••••••••" />
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={lbl}>Confirmar contraseña</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                style={inp} placeholder="••••••••" />
              {confirm && password !== confirm && (
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#C62828" }}>
                  Las contraseñas no coinciden
                </p>
              )}
            </div>
            <button onClick={handleSubmit} disabled={loading} style={btn(loading)}>
              {loading ? "Actualizando..." : "Cambiar contraseña"}
            </button>
          </>
        )}

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "13px", color: "#666" }}>
          <Link to="/login" style={{ color: "#0A76D8", textDecoration: "none" }}>← Volver al login</Link>
        </p>
      </div>
    </div>
  );
}