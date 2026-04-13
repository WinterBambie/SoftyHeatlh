import { useState, useEffect } from "react";
import { updateAppointmentStatus } from "../../services/doctorService";
import { DOCTOR_COLORS, doctorCard, statusBadge } from "./doctorStyles";
import SearchBar from "../../components/dashboard/Searchbar";

const FILTERS = ["todas", "reservada", "completada", "cancelada"];

function DoctorHistory({ appointments, doctorId, onRefresh }) {
  const [filter,   setFilter]   = useState("todas");
  const [filtered, setFiltered] = useState(appointments);
  const [updating, setUpdating] = useState(null);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  // Base filtrada por estado — es lo que el SearchBar recibe como data
  const baseData = filter === "todas"
    ? appointments
    : appointments.filter(a => a.status === filter);

  // Cuando cambia el filtro de estado o los datos, resetear los resultados
  useEffect(() => {
    setFiltered(baseData);
  }, [filter, appointments]);

  const counts = {
    todas:      appointments.length,
    reservada:  appointments.filter(a => a.status === "reservada").length,
    completada: appointments.filter(a => a.status === "completada").length,
    cancelada:  appointments.filter(a => a.status === "cancelada").length,
  };

  const handleStatus = async (appoid, status) => {
    setUpdating(appoid); setError(""); setSuccess("");
    try {
      const res = await updateAppointmentStatus(appoid, status, doctorId);
      if (res.status === "success") { setSuccess("Estado actualizado."); onRefresh(); }
      else setError(res.message || "Error.");
    } catch { setError("Error de conexión."); }
    finally  { setUpdating(null); }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", color: DOCTOR_COLORS.text }}>Historial de citas</h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: DOCTOR_COLORS.muted }}>
          Todas las consultas registradas
        </p>
      </div>

      {error   && <div style={{ backgroundColor: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#C62828" }}>{error}</div>}
      {success && <div style={{ backgroundColor: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#2E7D32" }}>{success}</div>}

      {/* Filtros por estado */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 14px", borderRadius: "20px", cursor: "pointer",
            border: `1px solid ${filter === f ? DOCTOR_COLORS.primary : "var(--bordercolor)"}`,
            backgroundColor: filter === f ? DOCTOR_COLORS.primary : "#fff",
            color: filter === f ? "#fff" : DOCTOR_COLORS.text,
            fontSize: "13px", transition: "all 0.15s",
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* SearchBar — filtra sobre baseData (ya filtrado por estado) */}
      <div style={{ marginBottom: "1.25rem" }}>
        <SearchBar
          data={baseData}
          keys={["patient", "session", "appointment_date"]}
          onResults={setFiltered}
          placeholder="Buscar por paciente, sesión o fecha..."
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...doctorCard, textAlign: "center", padding: "3rem" }}>
          <p style={{ color: DOCTOR_COLORS.muted, fontSize: "14px" }}>No hay citas que coincidan.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map(a => (
            <div key={a.appoid} style={{
              ...doctorCard, padding: "1rem 1.25rem",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: "1rem", flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{
                  backgroundColor: "#E8F0FE", borderRadius: "10px",
                  padding: "0.5rem 0.6rem", textAlign: "center", minWidth: "48px",
                }}>
                  <p style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: DOCTOR_COLORS.primary, lineHeight: 1 }}>
                    {a.appointment_date?.split("-")[2] ?? "—"}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "10px", color: DOCTOR_COLORS.muted, textTransform: "uppercase" }}>
                    {a.appointment_date
                      ? new Date(a.appointment_date + "T00:00:00").toLocaleDateString("es-CO", { month: "short" })
                      : ""}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: DOCTOR_COLORS.text }}>{a.patient}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: DOCTOR_COLORS.muted }}>
                    {a.session || "Sin sesión"} · {a.appointment_time || "—"}
                  </p>
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
                        padding: "4px 10px", cursor: "pointer", fontSize: "12px",
                        opacity: updating === a.appoid ? 0.7 : 1,
                      }}>Completada</button>
                    <button onClick={() => handleStatus(a.appoid, "cancelada")}
                      disabled={updating === a.appoid} style={{
                        backgroundColor: "#FFEBEE", color: "#C62828",
                        border: "1px solid #FFCDD2", borderRadius: "6px",
                        padding: "4px 10px", cursor: "pointer", fontSize: "12px",
                        opacity: updating === a.appoid ? 0.7 : 1,
                      }}>Cancelar</button>
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

export default DoctorHistory;