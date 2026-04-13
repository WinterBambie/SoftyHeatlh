import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost/HealthApi/router/api.php";

function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState(null); // { type: "success"|"error", text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setMsg({ type: "error", text: "Ingresa tu correo." }); return; }
    setLoading(true); setMsg(null);
    try {
      const res = await axios.post(`${API}?action=forgotPassword`, { email });
      setMsg({ type: "success", text: res.data.message });
    } catch {
      setMsg({ type: "error", text: "Error de conexión." });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f7fa" }}>
      <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "2.5rem 2rem", width: "100%", maxWidth: "400px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#0A76D8" }}>SoftyHealth</h1>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#666" }}>Recuperar contraseña</p>
        </div>

        {msg && (
          <div style={{
            backgroundColor: msg.type === "success" ? "#E8F5E9" : "#FFEBEE",
            border: `1px solid ${msg.type === "success" ? "#A5D6A7" : "#FFCDD2"}`,
            borderRadius: "8px", padding: "0.75rem 1rem",
            marginBottom: "1rem", fontSize: "13px",
            color: msg.type === "success" ? "#2E7D32" : "#C62828",
          }}>{msg.text}</div>
        )}

        {!msg?.type === "success" && (
          <>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "1.5rem" }}>
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Correo electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e9ecef", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{
              width: "100%", padding: "0.75rem", backgroundColor: "#0A76D8",
              color: "#fff", border: "none", borderRadius: "8px",
              fontSize: "14px", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}>
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

export default ForgotPassword;