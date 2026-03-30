import { COLORS } from "./../../../styles/COLORS";
//import { COLORS } from "./scheduleColors";

function ScheduleList({ schedules }) {
  if (schedules.length === 0)
    return <p style={{ color: COLORS.textMuted, fontSize: "14px" }}>No schedules created yet.</p>;

  return (
    <>
      <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: COLORS.text }}>
        Schedules ({schedules.length})
      </h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr style={{ backgroundColor: COLORS.btnBg }}>
            {["#", "Doctor", "Session", "Date", "Time", "Max/day", "Availability"].map(h => (
              <th key={h} style={{
                padding: "0.75rem 1rem", textAlign: "left",
                color: COLORS.btnText, fontWeight: "500", fontSize: "13px",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedules.map((sc, i) => {
            const full = Number(sc.reserved) >= Number(sc.max_patients);
            return (
              <tr key={sc.scheduleid} style={{
                borderBottom: `1px solid ${COLORS.border}`,
                backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.gray,
              }}>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.textMuted }}>{sc.scheduleid}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{sc.doctor}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{sc.session || "—"}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{sc.scheduledate}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{sc.scheduletime}</td>
                <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{sc.max_patients}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{
                    backgroundColor: full ? "#FFEBEE" : "#E8F5E9",
                    color:           full ? "#C62828" : "#2E7D32",
                    padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                  }}>
                    {sc.reserved}/{sc.max_patients} {full ? "· Full" : "· Available"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default ScheduleList;