import { useState } from "react";
import { updateAppointmentStatus } from "../../services/doctorService";
import { DOCTOR_COLORS, doctorCard, statusBadge, tableHeader, tableCell } from "./doctorStyles";

function DoctorToday({ appointments, doctorId, onRefresh }) {
  const [updating, setUpdating] = useState(null);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const handleStatus = async (appoid, status) => {
    setUpdating(appoid); setError(""); setSuccess("");
    try {
      const res = await updateAppointmentStatus(appoid, status, doctorId);
      if (res.status === "success") { setSuccess("Estado actualizado."); onRefresh(); }
      else setError(res.message || "Error al actualizar.");
    } catch { setError("Error de conexión."); }
    finally  { setUpdating(null); }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", color: DOCTOR_COLORS.text }}>Citas de hoy</h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: DOCTOR_COLORS.muted }}>
          {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {error   && <div style={{ backgroundColor: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#C62828" }}>{error}</div>}
      {success && <div style={{ backgroundColor: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#2E7D32" }}>{success}</div>}

      {appointments.length === 0
        ? (
          <div style={{ ...doctorCard, textAlign: "center", padding: "3rem" }}>
            <p style={{ color: DOCTOR_COLORS.muted, fontSize: "14px" }}>No tienes citas programadas para hoy.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {appointments.map((a, i) => (
              <div key={a.appoid} style={{
                ...doctorCard, display: "flex",
                justifyContent: "space-between", alignItems: "center",
                gap: "1rem", flexWrap: "wrap",
                borderLeft: `4px solid ${a.status === "completada" ? "#2E7D32" : DOCTOR_COLORS.primary}`,
              }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{
                    backgroundColor: "#E8F0FE", borderRadius: "10px",
                    padding: "0.5rem 0.75rem", textAlign: "center", minWidth: "52px",
                  }}>
                    <p style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: DOCTOR_COLORS.primary }}>{i + 1}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: DOCTOR_COLORS.muted }}>turno</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "14px", color: DOCTOR_COLORS.text }}>{a.patient}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: DOCTOR_COLORS.muted }}>
                      {a.session || "Sin sesión"} · {a.patient_phone || "Sin teléfono"}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: DOCTOR_COLORS.primary }}>{a.appointment_time}</p>
                    <span style={statusBadge(a.status)}>{a.status}</span>
                  </div>
                  {a.status === "reservada" && (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => handleStatus(a.appoid, "completada")}
                        disabled={updating === a.appoid} style={{
                          backgroundColor: "#E8F5E9", color: "#2E7D32",
                          border: "1px solid #A5D6A7", borderRadius: "6px",
                          padding: "4px 10px", cursor: "pointer", fontSize: "12px",
                          opacity: updating === a.appoid ? 0.7 : 1,
                        }}>
                        Completada
                      </button>
                      <button onClick={() => handleStatus(a.appoid, "cancelada")}
                        disabled={updating === a.appoid} style={{
                          backgroundColor: "#FFEBEE", color: "#C62828",
                          border: "1px solid #FFCDD2", borderRadius: "6px",
                          padding: "4px 10px", cursor: "pointer", fontSize: "12px",
                          opacity: updating === a.appoid ? 0.7 : 1,
                        }}>
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default DoctorToday;