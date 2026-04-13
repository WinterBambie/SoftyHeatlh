import { useCallback, useEffect, useState } from "react";
import { cancelAppointment } from "../../services/patientService";
import { COLORS, statusColor } from "../../styles/COLORS";
import { patientCard, cancelBtn, tableHeader, tableCell } from "./patientStyles";
import SearchBar from "../../components/dashboard/Searchbar";

const canCancel = (date, time) => {
  if (!date || !time) return false;
  const apptDate  = new Date(`${date}T${time}`);
  const diffHours = (apptDate - new Date()) / (1000 * 60 * 60);
  return diffHours > 12;
};

function PatientHistory({ appointments, onRefresh }) {
  const [cancelling, setCancelling] = useState(null);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [filtered,   setFiltered]   = useState(appointments);

  const sameItems = (a = [], b = []) => {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if ((a[i]?.appoid ?? i) !== (b[i]?.appoid ?? i)) return false;
    }
    return true;
  };

  const applyFiltered = useCallback((next) => {
    setFiltered((prev) => (sameItems(prev, next) ? prev : next));
  }, []);

  const handleCancel = async (appoid, date, time) => {
    if (!canCancel(date, time)) {
      setError("No puedes cancelar una cita con menos de 12 horas de antelación."); return;
    }
    if (!window.confirm("¿Estás seguro de que quieres cancelar esta cita?")) return;
    setCancelling(appoid); setError(""); setSuccess("");
    try {
      const res = await cancelAppointment(appoid,);
      if (res.status === "success") { setSuccess("Cita cancelada."); onRefresh(); }
      else setError(res.message || "Error al cancelar.");
    } catch { setError("Error de conexión."); }
    finally  { setCancelling(null); }
  };

  // Mantener resultados de búsqueda sincronizados al recargar citas
  useEffect(() => {
    applyFiltered(appointments);
  }, [appointments, applyFiltered]);

  return (
 
    <div style={patientCard}>
      <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: COLORS.text }}>
        Mis citas ({appointments.length})
      </h3>
      <div style={{ marginBottom: "1rem" }}>
        <SearchBar
          data={appointments}
          keys={["doctor", "session", "appointment_date", "status"]}
          onResults={applyFiltered}
          placeholder="Buscar por doctor, sesión, fecha o estado..."
          renderItem={(a) => (
            <div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>
                {a.doctor || "Sin doctor"}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: COLORS.muted }}>
                {a.session || "Sin sesión"} · {a.appointment_date || "Sin fecha"} · {a.status || "Sin estado"}
              </p>
            </div>
          )}
        />
      </div>
      {error   && <p style={{ color: "#C62828", fontSize: "13px", marginBottom: "1rem" }}>{error}</p>}
      {success && <p style={{ color: "#2E7D32", fontSize: "13px", marginBottom: "1rem" }}>{success}</p>}

      {(filtered.length === 0)
        ? <p style={{ color: COLORS.muted, fontSize: "14px" }}>No tienes citas registradas.</p>
        : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: COLORS.btnBg }}>
                {["Doctor", "Sesión", "Fecha", "Hora", "Estado", "Acción"].map(h => (
                  <th key={h} style={tableHeader}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const s   = statusColor(a.status);
                const can = a.status === "reservada" && canCancel(a.appointment_date, a.appointment_time);
                return (
                  <tr key={a.appoid} style={{
                    borderBottom: `1px solid ${COLORS.border}`,
                    backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.gray,
                  }}>
                    <td style={tableCell}>{a.doctor}</td>
                    <td style={tableCell}>{a.session || "—"}</td>
                    <td style={tableCell}>{a.appointment_date}</td>
                    <td style={tableCell}>{a.appointment_time || "—"}</td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{
                        backgroundColor: s.bg, color: s.color,
                        padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                      }}>{a.status}</span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      {can ? (
                        <button onClick={() => handleCancel(a.appoid, a.appointment_date, a.appointment_time)}
                          disabled={cancelling === a.appoid}
                          style={{ ...cancelBtn, opacity: cancelling === a.appoid ? 0.7 : 1 }}>
                          {cancelling === a.appoid ? "..." : "Cancelar"}
                        </button>
                      ) : (
                        <span style={{ color: COLORS.muted, fontSize: "12px" }}>
                          {a.status === "reservada" ? "Menos de 12h" : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
    </div>
    
  );
}

export default PatientHistory;