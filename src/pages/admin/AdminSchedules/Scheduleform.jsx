import { COLORS, inputStyle, labelStyle } from "./../../../styles/COLORS";

const DAYS = [
  { value: "0", label: "Lun" },
  { value: "1", label: "Mar" },
  { value: "2", label: "Mié" },
  { value: "3", label: "Jue" },
  { value: "4", label: "Vie" },
  { value: "5", label: "Sáb" },
  { value: "6", label: "Dom" },
];

function ScheduleForm({ form, setForm, doctors, sessions, loading, editing, onSubmit, onCancel }) {
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const toggleDay = (val) => {
    const current = form.days_of_week ?? [];
    const updated = current.includes(val)
      ? current.filter(d => d !== val)
      : [...current, val];
    setForm(f => ({ ...f, days_of_week: updated }));
  };

  const calcSlots = () => {
    if (!form.start_time || !form.end_time || !form.slot_duration_min) return 0;
    const [sh, sm] = form.start_time.split(":").map(Number);
    const [eh, em] = form.end_time.split(":").map(Number);
    const totalMin = (eh * 60 + em) - (sh * 60 + sm);
    const dur = Number(form.slot_duration_min);
    if (!Number.isFinite(dur) || dur <= 0) return 0;
    return totalMin > 0 ? Math.floor(totalMin / dur) : 0;
  };

  const selectedDays = form.days_of_week ?? [];
  const slots = calcSlots();

  return (
    <>
      <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", color: COLORS.text }}>
        {editing ? "Editar horario" : "Crear horario"}
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

        {/* ✅ Selector de días múltiple */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>
            Días de atención *
            {!editing && selectedDays.length > 0 && (
              <span style={{ color: COLORS.primary, marginLeft: "8px", fontWeight: 400 }}>
                ({selectedDays.length} día{selectedDays.length > 1 ? "s" : ""} seleccionado{selectedDays.length > 1 ? "s" : ""})
              </span>
            )}
          </label>

          {editing ? (
            // En edición solo se puede cambiar el horario, no el día
            <div style={{
              padding: "0.6rem 0.75rem", borderRadius: "8px",
              border: `1px solid ${COLORS.border}`,
              backgroundColor: "#f5f7fa", fontSize: "14px", color: COLORS.muted,
            }}>
              {DAYS.find(d => d.value === String(form.day_of_week))?.label ?? "—"}
              <span style={{ fontSize: "12px", marginLeft: "8px" }}>(no se puede cambiar el día en edición)</span>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {DAYS.map(d => {
                const active = selectedDays.includes(d.value);
                return (
                  <button key={d.value} type="button" onClick={() => toggleDay(d.value)} style={{
                    padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
                    border: `2px solid ${active ? COLORS.primary : COLORS.border}`,
                    backgroundColor: active ? COLORS.primary : "#fff",
                    color: active ? "#fff" : COLORS.text,
                    fontSize: "13px", fontWeight: active ? 600 : 400,
                    transition: "all 0.15s",
                  }}>
                    {d.label}
                  </button>
                );
              })}
            </div>
          )}
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
          <label style={labelStyle}>Máx. pacientes por día</label>
          <input type="number" name="max_patients_per_day" min="1" max="50"
            value={form.max_patients_per_day} onChange={handle} style={inputStyle} />
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

        {editing && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Estado</label>
            <select name="is_active" value={form.is_active ?? 1} onChange={handle}
              style={{ ...inputStyle, width: "auto" }}>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
        )}

        {/* Preview de slots */}
        {slots > 0 && (
          <div style={{
            gridColumn: "1 / -1",
            backgroundColor: "#E8F5E9", borderRadius: "8px",
            padding: "0.75rem 1rem", fontSize: "13px", color: "#2E7D32",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span>📅</span>
            <span>
              {slots} slots por día
              {!editing && selectedDays.length > 1 && (
                <strong> × {selectedDays.length} días = {slots * selectedDays.length} slots en total</strong>
              )}
              {editing && ` · se crearán ${slots} slots`}
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button onClick={onCancel} style={{
          backgroundColor: "#fff", color: COLORS.text,
          border: `1px solid ${COLORS.border}`, borderRadius: "8px",
          padding: "0.6rem 1.25rem", cursor: "pointer", fontSize: "14px",
        }}>
          Cancelar
        </button>
        <button onClick={onSubmit} disabled={loading} style={{
          backgroundColor: COLORS.primary, color: "#fff",
          border: "none", borderRadius: "8px",
          padding: "0.6rem 1.5rem",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "14px", opacity: loading ? 0.7 : 1,
        }}>
          {loading
            ? "Guardando..."
            : editing
              ? "Actualizar horario"
              : `Crear ${selectedDays.length > 1 ? selectedDays.length + " horarios" : "horario"}`}
        </button>
      </div>
    </>
  );
}

export default ScheduleForm;