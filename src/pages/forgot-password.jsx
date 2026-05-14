import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/HealthApi/router/api.php" : "http://localhost/HealthApi/router/api.php");

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setMsg({ type: "error", text: "Ingresa tu correo." }); return; }
    setLoading(true); setMsg(null);
    try {
      const res = await axios.post(`${API}?action=forgotPassword`, { email });
      setMsg({ type: res.data.status === "success" ? "success" : "error", text: res.data.message });
    } catch {
      setMsg({ type: "error", text: "Error de conexión." });
    } finally { setLoading(false); }
  };

  const card = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f7fa" };
  const box  = { backgroundColor: "#fff", borderRadius: "12px", padding: "2.5rem 2rem", width: "100%", maxWidth: "400px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" };
  const inp  = { width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e9ecef", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" };
  const btn  = (dis) => ({ width: "100%", padding: "0.75rem", backgroundColor: "#0A76D8", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", cursor: dis ? "not-allowed" : "pointer", opacity: dis ? 0.7 : 1, marginTop: "1rem" });
  const alert = (type) => ({ backgroundColor: type === "success" ? "#E8F5E9" : "#FFEBEE", border: `1px solid ${type === "success" ? "#A5D6A7" : "#FFCDD2"}`, borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: type === "success" ? "#2E7D32" : "#C62828" });

  return (
    <div style={card}>
      <div style={box}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#0A76D8" }}>SoftyHealth</h1>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#666" }}>Recuperar contraseña</p>
        </div>

        {msg && <div style={alert(msg.type)}>{msg.text}</div>}

        {msg?.type !== "success" && (
          <>
            <p style={{ fontSize: "14px", color: "#666", margin: "0 0 1.5rem" }}>
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>
              Correo electrónico
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com" style={inp} />
            <button onClick={handleSubmit} disabled={loading} style={btn(loading)}>
              {loading ? "Enviando..." : "Enviar enlace"}
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