import { useState } from "react";
import { updateAppointmentStatus } from "../../services/doctorService";
import { DOCTOR_COLORS, doctorCard, statusBadge } from "./doctorStyles";

const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

function DoctorAgenda({ agenda, doctorId, onRefresh }) {
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

  // Agrupar por fecha
  const grouped = agenda.reduce((acc, a) => {
    const key = a.appointment_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", color: DOCTOR_COLORS.text }}>Agenda semanal</h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: DOCTOR_COLORS.muted }}>
          Próximos 7 días
        </p>
      </div>

      {error   && <div style={{ backgroundColor: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#C62828" }}>{error}</div>}
      {success && <div style={{ backgroundColor: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#2E7D32" }}>{success}</div>}

      {Object.keys(grouped).length === 0 ? (
        <div style={{ ...doctorCard, textAlign: "center", padding: "3rem" }}>
          <p style={{ color: DOCTOR_COLORS.muted, fontSize: "14px" }}>No tienes citas en los próximos 7 días.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, appts]) => {
          const dateObj = new Date(date + "T00:00:00");
          const isToday = date === today;
          const dayLabel = DAYS[(dateObj.getDay() + 6) % 7];
          return (
            <div key={date} style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
                <div style={{
                  backgroundColor: isToday ? DOCTOR_COLORS.primary : "#E8F0FE",
                  color: isToday ? "#fff" : DOCTOR_COLORS.primary,
                  borderRadius: "8px", padding: "4px 12px", fontSize: "13px", fontWeight: 600,
                }}>
                  {isToday ? "Hoy" : dayLabel}
                </div>
                <span style={{ fontSize: "13px", color: DOCTOR_COLORS.muted }}>
                  {dateObj.toLocaleDateString("es-CO", { day: "numeric", month: "long" })}
                </span>
                <span style={{
                  backgroundColor: "#f5f7fa", borderRadius: "20px",
                  padding: "2px 10px", fontSize: "12px", color: DOCTOR_COLORS.muted,
                }}>
                  {appts.length} cita{appts.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {appts.map(a => (
                  <div key={a.appoid} style={{
                    ...doctorCard, padding: "1rem 1.25rem",
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", gap: "1rem", flexWrap: "wrap",
                  }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: DOCTOR_COLORS.primary, minWidth: "50px" }}>
                        {a.appointment_time}
                      </p>
                      <div>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: DOCTOR_COLORS.text }}>{a.patient}</p>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: DOCTOR_COLORS.muted }}>{a.session || "Sin sesión"}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={statusBadge(a.status)}>{a.status}</span>
                      {a.status === "reservada" && (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => handleStatus(a.appoid, "completada")}
                            disabled={updating === a.appoid} style={{
                              backgroundColor: "#E8F5E9", color: "#2E7D32",
                              border: "1px solid #A5D6A7", borderRadius: "6px",
                              padding: "3px 8px", cursor: "pointer", fontSize: "12px",
                            }}>✓</button>
                          <button onClick={() => handleStatus(a.appoid, "cancelada")}
                            disabled={updating === a.appoid} style={{
                              backgroundColor: "#FFEBEE", color: "#C62828",
                              border: "1px solid #FFCDD2", borderRadius: "6px",
                              padding: "3px 8px", cursor: "pointer", fontSize: "12px",
                            }}>✕</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default DoctorAgenda;