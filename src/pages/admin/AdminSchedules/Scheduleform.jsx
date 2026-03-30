import { COLORS, inputStyle, labelStyle } from "../../../styles/COLORS";

function ScheduleForm({ form, setForm, doctors, sessions, loading, onSubmit }) {
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });
  const today  = new Date().toISOString().split("T")[0];

  return (
    <>
      <h3 style={{ margin: "0 0 1.25rem", fontSize: "1rem", color: COLORS.text }}>Create schedule</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        <div>
          <label style={labelStyle}>Doctor *</label>
          <select name="docid" value={form.docid} onChange={handle} style={inputStyle}>
            <option value="">Select...</option>
            {doctors.map(d => <option key={d.docid} value={d.docid}>{d.dname}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Session</label>
          <select name="sessionid" value={form.sessionid} onChange={handle} style={inputStyle}>
            <option value="">Select...</option>
            {sessions.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Date *</label>
          <input type="date" name="scheduledate" min={today}
            value={form.scheduledate} onChange={handle} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Time *</label>
          <input type="time" name="scheduletime"
            value={form.scheduletime} onChange={handle} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Max patients per day</label>
          <input type="number" name="max_patients" min="1" max="50"
            value={form.max_patients} onChange={handle} style={inputStyle} />
        </div>

      </div>
      <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onSubmit} disabled={loading} style={{
          backgroundColor: COLORS.primary, color: COLORS.white,
          border: "none", borderRadius: "8px",
          padding: "0.6rem 1.5rem", cursor: "pointer", fontSize: "14px",
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Saving..." : "Create schedule"}
        </button>
      </div>
    </>
  );
}

export default ScheduleForm;