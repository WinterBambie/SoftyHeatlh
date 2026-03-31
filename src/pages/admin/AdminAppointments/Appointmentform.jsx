import { useState, useEffect } from "react";
import { COLORS, inputStyle, labelStyle } from "../../../styles/COLORS";
import { getAdminDoctors, getSessions } from "../../../services/adminService";

const DAYS_MAP = { 0:"Lunes", 1:"Martes", 2:"Miércoles", 3:"Jueves", 4:"Viernes", 5:"Sábado", 6:"Domingo" };

// Retorna la próxima fecha que coincida con el day_of_week dado
const nextDateForDay = (dayOfWeek) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDay = today.getDay(); // 0=domingo JS
  // Convertir: PHP/nosotros 0=lunes, JS 0=domingo
  const targetDay = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
  let diff = targetDay - todayDay;
  if (diff <= 0) diff += 7;
  const next = new Date(today);
  next.setDate(today.getDate() + diff);
  return next.toISOString().split("T")[0];
};

// Verificar que una fecha coincida con el day_of_week
const dateMatchesDay = (dateStr, dayOfWeek) => {
  if (!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  const jsDay = d.getDay(); // 0=domingo
  const ourDay = jsDay === 0 ? 6 : jsDay - 1; // convertir a 0=lunes
  return ourDay === Number(dayOfWeek);
};

function AppointmentForm({ form, setForm, patients, schedules, sessions, slots, onDateChange, loading, onSubmit }) {
  const [sessionFilter, setSessionFilter] = useState("");
  const [doctorFilter,  setDoctorFilter]  = useState("");
  const today = new Date().toISOString().split("T")[0];

  // Filtrar horarios por sesión y doctor
  const filtered = schedules.filter(sc => {
    const matchSession = !sessionFilter || String(sc.sessionid) === String(sessionFilter);
    const matchDoctor  = !doctorFilter  || String(sc.docid)     === String(doctorFilter);
    return matchSession && matchDoctor;
  });

  // Al seleccionar horario, precargar la próxima fecha válida
  const handleScheduleChange = (e) => {
    const scheduleid = e.target.value;
    const sc = schedules.find(s => String(s.scheduleid) === String(scheduleid));
    const nextDate = sc ? nextDateForDay(sc.day_of_week) : "";
    setForm({ ...form, scheduleid, appointment_date: nextDate, appointment_time: "" });
    if (scheduleid && nextDate) onDateChange(scheduleid, nextDate);
  };

  // Al cambiar fecha validar que coincida con el día del horario
  const handleDateChange = (e) => {
    const date = e.target.value;
    const sc = schedules.find(s => String(s.scheduleid) === String(form.scheduleid));
    if (sc && !dateMatchesDay(date, sc.day_of_week)) {
      alert(`Este horario solo está disponible los ${DAYS_MAP[sc.day_of_week]}.`);
      return;
    }
    setForm({ ...form, appointment_date: date, appointment_time: "" });
    if (form.scheduleid && date) onDateChange(form.scheduleid, date);
  };

  const selectedSchedule = schedules.find(s => String(s.scheduleid) === String(form.scheduleid));

  return (
    <>
      <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", color: COLORS.text }}>
        Registrar cita
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        {/* Paciente */}
        <div>
          <label style={labelStyle}>Paciente *</label>
          <select value={form.pid}
            onChange={e => setForm({ ...form, pid: e.target.value })}
            style={inputStyle}>
            <option value="">Seleccionar...</option>
            {patients.map(p => <option key={p.pid} value={p.pid}>{p.pname}</option>)}
          </select>
        </div>

        {/* Filtro sesión */}
        <div>
          <label style={labelStyle}>Filtrar por sesión</label>
          <select value={sessionFilter}
            onChange={e => { setSessionFilter(e.target.value); setDoctorFilter(""); setForm({ ...form, scheduleid: "", appointment_date: "", appointment_time: "" }); }}
            style={inputStyle}>
            <option value="">Todas las sesiones</option>
            {sessions.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>

        {/* Horario del doctor */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Horario del doctor *</label>
          <select value={form.scheduleid} onChange={handleScheduleChange} style={inputStyle}>
            <option value="">Seleccionar...</option>
            {filtered.length === 0
              ? <option disabled>No hay horarios para esta sesión</option>
              : filtered.map(sc => (
                  <option key={sc.scheduleid} value={sc.scheduleid}>
                    {sc.doctor} — {sc.session || "Sin sesión"} — {DAYS_MAP[sc.day_of_week]} {sc.start_time} a {sc.end_time} (c/{sc.slot_duration_min} min)
                  </option>
                ))}
          </select>
        </div>

        {/* Fecha — solo si hay horario seleccionado */}
        {form.scheduleid && (
          <div>
            <label style={labelStyle}>
              Fecha * {selectedSchedule && <span style={{ color: COLORS.primary, fontSize: "12px" }}>
                (solo {DAYS_MAP[selectedSchedule.day_of_week]}s)
              </span>}
            </label>
            <input type="date" value={form.appointment_date}
              min={today} onChange={handleDateChange} style={inputStyle} />
          </div>
        )}

        {/* Slot de hora — solo si hay fecha */}
        {form.appointment_date && (
          <div>
            <label style={labelStyle}>Hora disponible *</label>
            <select value={form.appointment_time}
              onChange={e => setForm({ ...form, appointment_time: e.target.value })}
              style={inputStyle}>
              <option value="">Seleccionar...</option>
              {slots.length === 0
                ? <option disabled>No hay slots disponibles este día</option>
                : slots.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

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