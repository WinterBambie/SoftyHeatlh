import { useState, useEffect } from "react";
import { Delete, CheckCircle, Cancel } from "@mui/icons-material";
import { getAdminAppointments, updateAppointmentStatus, deleteAppointment } from "../../../services/adminService";
import { COLORS, cardStyle, statusColor } from "../../../styles/COLORS";
import SearchBar from "../../../components/dashboard/Searchbar";

const iconBtn = (color, bg, border) => ({
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "32px", height: "32px", borderRadius: "8px",
  border: `1px solid ${border}`, backgroundColor: bg, color,
  cursor: "pointer",
});

const FILTERS = ["todas", "reservada", "completada", "cancelada"];

function AdminAppointments({ appointments = [], onRefresh }) {
  const [filter,   setFilter]   = useState("todas");
  const [filtered, setFiltered] = useState(appointments);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [updating, setUpdating] = useState(null);

  const base = filter === "todas" ? appointments : appointments.filter(a => a.status === filter);
  useEffect(() => { setFiltered(base); }, [filter, appointments]);

  const counts = {
    todas:      appointments.length,
    reservada:  appointments.filter(a => a.status === "reservada").length,
    completada: appointments.filter(a => a.status === "completada").length,
    cancelada:  appointments.filter(a => a.status === "cancelada").length,
  };

  const handleStatus = async (appoid, status) => {
    setUpdating(appoid); setError(""); setSuccess("");
    const res = await updateAppointmentStatus(appoid, status);
    if (res?.status === "success") { setSuccess("✓ Estado actualizado."); onRefresh(); }
    else setError(res?.message || "Error al actualizar.");
    setUpdating(null);
  };

  const handleDelete = async (appoid) => {
    if (!window.confirm("¿Eliminar esta cita?")) return;
    const res = await deleteAppointment(appoid);
    if (res?.status === "success") { setSuccess("✓ Cita eliminada."); onRefresh(); }
    else setError(res?.message || "Error al eliminar.");
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: COLORS.text }}>
        Citas ({appointments.length})
      </h3>

      {error   && <div style={{ backgroundColor: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#C62828" }}>{error}</div>}
      {success && <div style={{ backgroundColor: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#2E7D32" }}>{success}</div>}

      {/* Filtros */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "5px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "13px",
            border: `1px solid ${filter === f ? COLORS.primary : COLORS.border}`,
            backgroundColor: filter === f ? COLORS.primary : "#fff",
            color: filter === f ? "#fff" : COLORS.text,
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* SearchBar */}
      <div style={{ marginBottom: "1rem" }}>
        <SearchBar data={base} keys={["patient", "doctor", "session", "appointment_date"]}
          onResults={setFiltered} placeholder="Buscar por paciente, doctor, sesión o fecha..." />
      </div>

      {filtered.length === 0
        ? <p style={{ color: COLORS.muted, fontSize: "14px" }}>No hay citas que coincidan.</p>
        : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "800px" }}>
              <thead>
                <tr style={{ backgroundColor: COLORS.btnBg }}>
                  {["#","Paciente","Doctor","Sesión","Fecha","Hora","Estado","Acciones"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: COLORS.btnText, fontWeight: 500, fontSize: "13px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => {
                  const s = statusColor(a.status);
                  return (
                    <tr key={a.appoid} style={{ borderBottom: `1px solid ${COLORS.border}`, backgroundColor: i % 2 === 0 ? "#fff" : COLORS.gray }}>
                      <td style={{ padding: "0.75rem 1rem", color: COLORS.muted }}>{a.appoid}</td>
                      <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{a.patient}</td>
                      <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{a.doctor}</td>
                      <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{a.session || "—"}</td>
                      <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{a.appointment_date}</td>
                      <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{a.appointment_time || "—"}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span style={{ backgroundColor: s.bg, color: s.color, padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>
                          {a.status}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {a.status === "reservada" && (
                            <button onClick={() => handleStatus(a.appoid, "completada")} title="Marcar completada"
                              disabled={updating === a.appoid}
                              style={{ ...iconBtn("#2E7D32", "#E8F5E9", "#A5D6A7"), opacity: updating === a.appoid ? 0.5 : 1 }}>
                              <CheckCircle style={{ fontSize: "16px" }} />
                            </button>
                          )}
                          {a.status === "reservada" && (
                            <button onClick={() => handleStatus(a.appoid, "cancelada")} title="Cancelar cita"
                              disabled={updating === a.appoid}
                              style={{ ...iconBtn("#E65100", "#FFF3E0", "#FFCC80"), opacity: updating === a.appoid ? 0.5 : 1 }}>
                              <Cancel style={{ fontSize: "16px" }} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(a.appoid)} title="Eliminar"
                            style={iconBtn("#C62828", "#FFEBEE", "#FFCDD2")}>
                            <Delete style={{ fontSize: "16px" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}

export default AdminAppointments;