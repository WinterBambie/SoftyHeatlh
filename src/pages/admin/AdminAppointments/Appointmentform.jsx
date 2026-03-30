import { useState } from "react";
import { COLORS, inputStyle, labelStyle } from "./../../../styles/COLORS";

function AppointmentForm({ form, setForm, patients, schedules, sessions, loading, onSubmit }) {
  const [sessionFilter, setSessionFilter] = useState("");
  const today = new Date().toISOString().split("T")[0];

  // Paso 1 — solo horarios con cupo disponible
  const available = schedules.filter(sc => Number(sc.reserved) < Number(sc.max_patients));

  // Paso 2 — filtrar por sesión seleccionada
  const filtered = sessionFilter
    ? available.filter(sc => String(sc.sessionid) === String(sessionFilter))
    : available;

  const handleSessionChange = (e) => {
    setSessionFilter(e.target.value);
    setForm({ ...form, scheduleid: "" }); // reset horario al cambiar sesión
  };

  return (
    <>
      <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", color: COLORS.text }}>Registrar cita</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        <div>
          <label style={labelStyle}>Paciente *</label>
          <select value={form.pid}
            onChange={e => setForm({ ...form, pid: e.target.value })}
            style={inputStyle}>
            <option value="">Seleccionar...</option>
            {patients.map(p => <option key={p.pid} value={p.pid}>{p.pname}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Sesión *</label>
          <select value={sessionFilter} onChange={handleSessionChange} style={inputStyle}>
            <option value="">Todas las sesiones</option>
            {sessions.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Horario disponible *</label>
          <select value={form.scheduleid}
            onChange={e => setForm({ ...form, scheduleid: e.target.value })}
            style={inputStyle}>
            <option value="">Seleccionar...</option>
            {filtered.length === 0
              ? <option disabled>No hay horarios disponibles para esta sesión</option>
              : filtered.map(sc => (
                  <option key={sc.scheduleid} value={sc.scheduleid}>
                    {sc.doctor} — {sc.session} — {sc.scheduledate} {sc.scheduletime} ({sc.reserved}/{sc.max_patients} cupos)
                  </option>
                ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Fecha de la cita *</label>
          <input type="date" value={form.appointment_date} min={today}
            onChange={e => setForm({ ...form, appointment_date: e.target.value })}
            style={inputStyle} />
        </div>

      </div>
      <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onSubmit} disabled={loading} style={{
          backgroundColor: COLORS.primary, color: COLORS.white,
          border: "none", borderRadius: "8px",
          padding: "0.6rem 1.5rem", cursor: "pointer", fontSize: "14px",
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Guardando..." : "Registrar cita"}
        </button>
      </div>
    </>
  );
}

export default AppointmentForm;