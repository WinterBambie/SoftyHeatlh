import { COLORS, inputStyle, labelStyle } from "./../../../styles/COLORS";

/** Valores string para que Lunes ("0") no se confunda con vacío y coincida con el <select>. */
const DAYS = [
  { value: "0", label: "Lunes" },
  { value: "1", label: "Martes" },
  { value: "2", label: "Miércoles" },
  { value: "3", label: "Jueves" },
  { value: "4", label: "Viernes" },
  { value: "5", label: "Sábado" },
  { value: "6", label: "Domingo" },
];

function ScheduleForm({ form, setForm, doctors, sessions, loading, onSubmit }) {
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Calcular slots que generará este horario
  const calcSlots = () => {
    if (!form.start_time || !form.end_time || !form.slot_duration_min) return 0;
    const [sh, sm] = form.start_time.split(":").map(Number);
    const [eh, em] = form.end_time.split(":").map(Number);
    const totalMin = (eh * 60 + em) - (sh * 60 + sm);
    const dur = Number(form.slot_duration_min);
    if (!Number.isFinite(dur) || dur <= 0) return 0;
    return totalMin > 0 ? Math.floor(totalMin / dur) : 0;
  };

  return (
    <>
      <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", color: COLORS.text }}>
        Crear horario
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        <div>
          <label style={labelStyle}>Doctor *</label>
          <select name="docid" value={form.docid} onChange={handle} style={inputStyle}>
            <option value="">Seleccionar...</option>
            {doctors.map(d => <option key={d.docid} value={d.docid}>{d.dname}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Sesión</label>
          <select name="sessionid" value={form.sessionid} onChange={handle} style={inputStyle}>
            <option value="">Seleccionar...</option>
            {sessions.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Día de atención *</label>
          <select name="day_of_week" value={form.day_of_week} onChange={handle} style={inputStyle}>
            <option value="">Seleccionar...</option>
            {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Duración por cita (min) *</label>
          <select name="slot_duration_min" value={form.slot_duration_min} onChange={handle} style={inputStyle}>
            <option value="15">15 minutos</option>
            <option value="20">20 minutos</option>
            <option value="30">30 minutos</option>
            <option value="45">45 minutos</option>
            <option value="60">60 minutos</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Hora inicio *</label>
          <input type="time" name="start_time" value={form.start_time}
            onChange={handle} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Hora fin *</label>
          <input type="time" name="end_time" value={form.end_time}
            onChange={handle} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Máx. pacientes por día</label>
          <input type="number" name="max_patients_per_day" min="1" max="50"
            value={form.max_patients_per_day} onChange={handle} style={inputStyle} />
        </div>

        {/* Indicador de slots generados */}
        {calcSlots() > 0 && (
          <div style={{
            display: "flex", alignItems: "center",
            backgroundColor: "#E8F5E9", borderRadius: "8px",
            padding: "0.6rem 1rem", fontSize: "13px", color: "#2E7D32",
          }}>
            Este horario generará <strong style={{ margin: "0 4px" }}>{calcSlots()}</strong> slots de atención
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
          {loading ? "Guardando..." : "Crear horario"}
        </button>
      </div>
    </>
  );
}

export default ScheduleForm;