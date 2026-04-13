import { useState, useEffect } from "react";
import { getSchedules, getSessions, getAvailableSlots, createAppointment } from "../../services/patientService";
import { COLORS, inputStyle, labelStyle } from "../../styles/COLORS";
import { patientCard, primaryBtn } from "./patientStyles";

const DAYS_MAP = { 0:"Lunes", 1:"Martes", 2:"Miércoles", 3:"Jueves", 4:"Viernes", 5:"Sábado", 6:"Domingo" };
const MONTHS   = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const FORM_INITIAL = { scheduleid: "", appointment_date: "", appointment_time: "" };

function MiniCalendar({ dayOfWeek, scheduleid, selectedDate, onSelect }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [slotCache, setSlotCache] = useState({});

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isValidDay = (d) => {
    const date = new Date(viewYear, viewMonth, d);
    if (date < today) return false;
    return (date.getDay() === 0 ? 6 : date.getDay() - 1) === Number(dayOfWeek);
  };

  const getDateStr = (d) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const handleDayClick = async (d) => {
    if (!isValidDay(d)) return;
    const dateStr = getDateStr(d);
    onSelect(dateStr);
    if (!slotCache[dateStr]) {
      const res = await getAvailableSlots(scheduleid, dateStr);
      setSlotCache(prev => ({ ...prev, [dateStr]: res.status === "success" ? res.data : [] }));
    }
  };

  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div style={{ border: "1px solid var(--bordercolor)", borderRadius: "12px", padding: "1rem", backgroundColor: "#fff", userSelect: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: COLORS.primary, lineHeight: 1 }}>‹</button>
        <span style={{ fontSize: "14px", fontWeight: 500, color: COLORS.text }}>{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: COLORS.primary, lineHeight: 1 }}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
        {["Lu","Ma","Mi","Ju","Vi","Sa","Do"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "11px", color: COLORS.muted, padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {days.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const dateStr  = getDateStr(d);
          const valid    = isValidDay(d);
          const selected = selectedDate === dateStr;
          const hasSlots = slotCache[dateStr]?.length > 0;
          return (
            <button key={dateStr} onClick={() => handleDayClick(d)} disabled={!valid} style={{
              padding: "6px 2px", borderRadius: "6px", border: "none",
              fontSize: "12px", cursor: valid ? "pointer" : "default",
              backgroundColor: selected ? COLORS.primary : valid ? "#E8F5E9" : "transparent",
              color: selected ? "#fff" : valid ? "#2E7D32" : "#ccc",
              fontWeight: selected ? 600 : 400, position: "relative",
            }}>
              {d}
              {valid && hasSlots && !selected && (
                <span style={{
                  position: "absolute", bottom: "2px", left: "50%",
                  transform: "translateX(-50%)", width: "4px", height: "4px",
                  borderRadius: "50%", backgroundColor: "#2E7D32", display: "block",
                }} />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <p style={{ margin: "0.75rem 0 0", fontSize: "12px", color: COLORS.primary, textAlign: "center" }}>
          {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      )}
    </div>
  );
}

function PatientBooking({ patientId, onBooked }) {
  const [sessions,         setSessions]         = useState([]);
  const [schedules,        setSchedules]        = useState([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [slots,            setSlots]            = useState([]);
  const [sessionFilter,    setSessionFilter]    = useState("");
  const [form,             setForm]             = useState(FORM_INITIAL);
  const [loading,          setLoading]          = useState(false);
  const [error,            setError]            = useState("");
  const [success,          setSuccess]          = useState("");

  useEffect(() => {
    Promise.allSettled([getSchedules(), getSessions()]).then(([schRes, sesRes]) => {
      if (schRes.value?.status === "success") {
        setSchedules(schRes.value.data);
      }
      if (sesRes.value?.status === "success") setSessions(sesRes.value.data);
    });
  }, []);

  // ✅ Filtro derivado puro — sin SearchBar, sin useEffect, sin loops infinitos
  const filteredSchedules = schedules.filter(sc => {
    const matchSession = !sessionFilter || String(sc.sessionid) === String(sessionFilter);
    const matchDoctor  = !doctorSearch  ||
      sc.doctor?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      sc.session?.toLowerCase().includes(doctorSearch.toLowerCase());
    return matchSession && matchDoctor;
  });

  const handleSessionChange = (e) => {
    setSessionFilter(e.target.value);
    setForm(FORM_INITIAL);
    setSlots([]);
    setDoctorSearch("");
  };

  const handleSelectSchedule = (scheduleid) => {
    setForm({ scheduleid, appointment_date: "", appointment_time: "" });
    setSlots([]);
  };

const handleDateSelect = async (date, scheduleid) => {
  setForm(f => ({ ...f, appointment_date: date, appointment_time: "" }));

  const [slotsRes, apptRes] = await Promise.all([
    getAvailableSlots(scheduleid, date),
    getPatientAppointments(patientId),
  ]);

  if (slotsRes.status !== "success") { setSlots([]); return; }

  // ✅ Solo citas activas (no canceladas) del paciente ese día
  const takenByPatient = (apptRes.data ?? [])
    .filter(a =>
      a.appointment_date === date &&
      a.status !== "cancelada"
    )
    .map(a => a.appointment_time?.slice(0, 5)); // "08:15:00" → "08:15"

  const available = slotsRes.data.filter(slot => !takenByPatient.includes(slot));
  setSlots(available);
};

  const handleSubmit = async () => {
    if (!form.scheduleid || !form.appointment_date || !form.appointment_time) {
      setError("Selecciona horario, fecha y hora."); return;
    }
    setError(""); setLoading(true);
    try {
      const fd = new FormData();
      fd.append("pid", patientId);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const res = await createAppointment(fd);
      if (res.status === "success") {
        setSuccess("¡Cita agendada correctamente!");
        setForm(FORM_INITIAL); setSlots([]); setSessionFilter(""); onBooked();
      } else { setError(res.message || "Error al agendar."); }
    } catch { setError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  const selectedSchedule = schedules.find(s => String(s.scheduleid) === String(form.scheduleid));

  const alertStyle = (color, bg, border) => ({
    backgroundColor: bg, border: `1px solid ${border}`,
    borderRadius: "8px", padding: "0.75rem 1rem",
    marginBottom: "1rem", fontSize: "13px", color,
  });

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", color: COLORS.text }}>Agendar cita</h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: COLORS.muted }}>
          Selecciona un doctor, escoge tu fecha y confirma tu hora
        </p>
      </div>

      {error   && <div style={alertStyle("#C62828","#FFEBEE","#FFCDD2")}>{error}</div>}
      {success && <div style={alertStyle("#2E7D32","#E8F5E9","#A5D6A7")}>{success}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

        {/* Columna izquierda */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          <div style={patientCard}>
            <h4 style={{ margin: "0 0 1rem", fontSize: "14px", color: COLORS.text }}>1. Selecciona especialidad</h4>
            <label style={labelStyle}>Sesión</label>
            <select value={sessionFilter} onChange={handleSessionChange} style={inputStyle}>
              <option value="">Todas las sesiones</option>
              {sessions.map(s => <option key={s.id ?? s.sessionid} value={s.id ?? s.sessionid}>{s.title}</option>)}
            </select>
          </div>

          <div style={patientCard}>
            <h4 style={{ margin: "0 0 1rem", fontSize: "14px", color: COLORS.text }}>2. Selecciona doctor</h4>
            <div style={{ marginBottom: "0.75rem" }}>
              <input
                type="text"
                value={doctorSearch}
                onChange={e => setDoctorSearch(e.target.value)}
                placeholder="Buscar doctor o especialidad..."
                style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
              />
            </div>

            {filteredSchedules.length === 0
              ? <p style={{ fontSize: "13px", color: COLORS.muted }}>No hay resultados.</p>
              : filteredSchedules.map(sc => {
                  const sel = String(form.scheduleid) === String(sc.scheduleid);
                  return (
                    <div key={sc.scheduleid} onClick={() => handleSelectSchedule(sc.scheduleid)} style={{
                      padding: "0.75rem 1rem", borderRadius: "10px",
                      cursor: "pointer", marginBottom: "8px",
                      border: `2px solid ${sel ? COLORS.primary : "var(--bordercolor)"}`,
                      backgroundColor: sel ? "#E8F0FE" : "#fff",
                      transition: "all 0.15s",
                    }}>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: "14px", color: sel ? COLORS.primary : COLORS.text }}>{sc.doctor}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: COLORS.muted }}>
                        {sc.session || "Sin sesión"} · {DAYS_MAP[sc.day_of_week]} · {sc.start_time} – {sc.end_time}
                      </p>
                    </div>
                  );
                })}
          </div>

          {form.appointment_date && (
            <div style={patientCard}>
              <h4 style={{ margin: "0 0 1rem", fontSize: "14px", color: COLORS.text }}>4. Selecciona la hora</h4>
              {slots.length === 0
                ? <p style={{ fontSize: "13px", color: COLORS.muted }}>No hay horas disponibles este día.</p>
                : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {slots.map(s => {
                      const sel = form.appointment_time === s;
                      return (
                        <button key={s} onClick={() => setForm(f => ({ ...f, appointment_time: s }))} style={{
                          padding: "8px", borderRadius: "8px", fontSize: "13px", cursor: "pointer",
                          border: `2px solid ${sel ? COLORS.primary : "var(--bordercolor)"}`,
                          backgroundColor: sel ? COLORS.primary : "#fff",
                          color: sel ? "#fff" : COLORS.text,
                          fontWeight: sel ? 600 : 400, transition: "all 0.15s",
                        }}>{s}</button>
                      );
                    })}
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Columna derecha */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {form.scheduleid ? (
            <div style={patientCard}>
              <h4 style={{ margin: "0 0 1rem", fontSize: "14px", color: COLORS.text }}>
                3. Elige una fecha
                {selectedSchedule && (
                  <span style={{ fontWeight: 400, color: COLORS.muted, marginLeft: "6px" }}>
                    (solo {DAYS_MAP[selectedSchedule.day_of_week]}s)
                  </span>
                )}
              </h4>
              <MiniCalendar
                dayOfWeek={selectedSchedule?.day_of_week}
                scheduleid={form.scheduleid}
                selectedDate={form.appointment_date}
                onSelect={(date) => handleDateSelect(date, form.scheduleid)}
              />
            </div>
          ) : (
            <div style={{ ...patientCard, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
              <p style={{ color: COLORS.muted, fontSize: "13px", textAlign: "center" }}>
                Selecciona un doctor para ver el calendario
              </p>
            </div>
          )}

          {form.scheduleid && form.appointment_date && form.appointment_time && (
            <div style={{ ...patientCard, backgroundColor: "#E8F0FE", border: "1px solid #BBDEFB" }}>
              <h4 style={{ margin: "0 0 0.75rem", fontSize: "14px", color: COLORS.primary }}>Resumen de tu cita</h4>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: COLORS.text }}><strong>Doctor:</strong> {selectedSchedule?.doctor}</p>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: COLORS.text }}><strong>Sesión:</strong> {selectedSchedule?.session || "—"}</p>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: COLORS.text }}>
                <strong>Fecha:</strong>{" "}
                {new Date(form.appointment_date + "T00:00:00").toLocaleDateString("es-CO", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric"
                })}
              </p>
              <p style={{ margin: "0 0 1rem", fontSize: "13px", color: COLORS.text }}><strong>Hora:</strong> {form.appointment_time}</p>
              <button onClick={handleSubmit} disabled={loading} style={{ ...primaryBtn(loading), width: "100%" }}>
                {loading ? "Confirmando..." : "Confirmar cita"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default PatientBooking;