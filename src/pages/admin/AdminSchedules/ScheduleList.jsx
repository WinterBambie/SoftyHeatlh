import { COLORS } from "./../../../styles/COLORS";
import {
  scheduleDayLabel,
  scheduleTimeRange,
  scheduleMaxPatients,
  scheduleReserved,
} from "./scheduleDisplay";

function ScheduleList({ schedules, onRefresh }) {
  if (!schedules?.length)
    return (
      <p style={{ color: COLORS.textMuted, fontSize: "14px" }}>
        No hay horarios registrados. Crea uno en «+ Nuevo horario».
      </p>
    );

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", color: COLORS.text }}>
          Horarios del doctor ({schedules.length})
        </h3>
        {typeof onRefresh === "function" && (
          <button
            type="button"
            onClick={onRefresh}
            style={{
              padding: "0.4rem 0.9rem",
              borderRadius: "8px",
              border: `1px solid ${COLORS.border}`,
              background: COLORS.btnBg,
              color: COLORS.btnText,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Actualizar
          </button>
        )}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "720px" }}>
          <thead>
            <tr style={{ backgroundColor: COLORS.btnBg }}>
              {["#", "Doctor", "Sesión", "Día", "Franja horaria", "Cita (min)", "Cupos", "Estado"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    color: COLORS.btnText,
                    fontWeight: "500",
                    fontSize: "13px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules.map((sc, i) => {
              const maxRaw = scheduleMaxPatients(sc);
              const maxNum = maxRaw === "—" ? NaN : Number(maxRaw);
              const reserved = scheduleReserved(sc);
              const full = Number.isFinite(maxNum) && reserved >= maxNum;
              const slotMin = sc.slot_duration_min ?? sc.slot_min ?? "—";

              return (
                <tr
                  key={sc.scheduleid}
                  style={{
                    borderBottom: `1px solid ${COLORS.border}`,
                    backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.gray,
                  }}
                >
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.textMuted }}>{sc.scheduleid}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{sc.doctor || "—"}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{sc.session || "—"}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{scheduleDayLabel(sc)}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{scheduleTimeRange(sc)}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>{slotMin}</td>
                  <td style={{ padding: "0.75rem 1rem", color: COLORS.text }}>
                    {Number.isFinite(maxNum) ? `${reserved} / ${maxNum}` : "—"}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span
                      style={{
                        backgroundColor: full ? "#FFEBEE" : "#E8F5E9",
                        color: full ? "#C62828" : "#2E7D32",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                      }}
                    >
                      {Number.isFinite(maxNum)
                        ? full
                          ? "Completo"
                          : "Disponible"
                        : "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ScheduleList;
