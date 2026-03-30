import { COLORS, inputStyle, statusColor } from "./../../../styles/COLORS";

function AppointmentList({ appointments, onStatusChange }) {
  if (appointments.length === 0)
    return <p style={{ color: COLORS.textMuted, fontSize: "14px" }}>No hay citas registradas.</p>;

  return (
    <>
      <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: COLORS.text }}>
        Citas registradas ({appointments.length})
      </h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr style={{ backgroundColor: COLORS.btnBg }}>
            {["#", "Paciente", "Doctor", "Fecha", "Estado", "Acción"].map(h => (
              <th key={h} style={{
                padding: "0.75rem 1rem", textAlign: "left",
                color: COLORS.btnText, fontWeight: "500", fontSize: "13px",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments.map((app, i) => {
            const s = statusColor(app.status);
            return (
              <tr key={app.appoid} style={{
                borderBottom: `1px solid ${COLORS.border}`,
                backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.gray,
              }}>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.textMuted }}>{app.appoid}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{app.patient}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{app.doctor}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{app.appointment_date}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{
                    backgroundColor: s.bg, color: s.color,
                    padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                  }}>{app.status}</span>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <select value={app.status}
                    onChange={e => onStatusChange(app.appoid, e.target.value)}
                    style={{ ...inputStyle, width: "auto", padding: "4px 8px", fontSize: "12px" }}>
                    <option value="reservada">Reservada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default AppointmentList;