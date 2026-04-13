import { CalendarToday, People, CheckCircle, Schedule } from "@mui/icons-material";
import { DOCTOR_COLORS, doctorCard, statusBadge } from "./doctorStyles";

const DAYS_MAP = { 0:"Lunes", 1:"Martes", 2:"Miércoles", 3:"Jueves", 4:"Viernes", 5:"Sábado", 6:"Domingo" };

function DoctorHome({ stats, today, user, setSection }) {
  const cards = [
    { label: "Citas hoy",       value: stats?.today_appointments ?? 0, icon: <CalendarToday />, color: "#0A76D8", bg: "#D8EBFA" },
    { label: "Esta semana",     value: stats?.week_appointments  ?? 0, icon: <Schedule />,      color: "#7B1FA2", bg: "#F3E5F5" },
    { label: "Total pacientes", value: stats?.total_patients     ?? 0, icon: <People />,        color: "#2E7D32", bg: "#E8F5E9" },
    { label: "Completadas",     value: stats?.completed          ?? 0, icon: <CheckCircle />,   color: "#E65100", bg: "#FFF3E0" },
  ];

  const quickAccess = [
    { key: "today",   label: "Ver citas de hoy", color: "#0A76D8" },
    { key: "agenda",  label: "Ver agenda",        color: "#7B1FA2" },
    { key: "history", label: "Ver historial",     color: "#2E7D32" },
    { key: "profile", label: "Mi perfil",         color: "#E65100" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.4rem", color: DOCTOR_COLORS.text }}>
          Buenos días, Dr. {user?.name?.split(" ")[0]} 👨‍⚕️
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: DOCTOR_COLORS.muted }}>
          {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {cards.map(c => (
          <div key={c.label} style={doctorCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: c.color }}>{c.value}</p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: DOCTOR_COLORS.muted }}>{c.label}</p>
              </div>
              <div style={{ backgroundColor: c.bg, borderRadius: "10px", padding: "0.6rem", color: c.color }}>
                {c.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Citas de hoy */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div style={doctorCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", color: DOCTOR_COLORS.text }}>Citas de hoy ({today.length})</h3>
            <button onClick={() => setSection("today")} style={{
              backgroundColor: "transparent", border: "none",
              color: DOCTOR_COLORS.primary, cursor: "pointer", fontSize: "13px",
            }}>Ver todas →</button>
          </div>
          {today.length === 0
            ? <p style={{ color: DOCTOR_COLORS.muted, fontSize: "14px" }}>No tienes citas programadas para hoy.</p>
            : today.slice(0, 4).map(a => (
              <div key={a.appoid} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.75rem 0", borderBottom: "1px solid var(--bordercolor)",
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: DOCTOR_COLORS.text }}>{a.patient}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: DOCTOR_COLORS.muted }}>{a.session || "—"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: DOCTOR_COLORS.primary }}>{a.appointment_time}</p>
                  <span style={statusBadge(a.status)}>{a.status}</span>
                </div>
              </div>
            ))}
        </div>

        {/* Accesos rápidos */}
        <div style={doctorCard}>
          <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: DOCTOR_COLORS.text }}>Accesos rápidos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {quickAccess.map(q => (
              <button key={q.key} onClick={() => setSection(q.key)} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "0.75rem 1rem", borderRadius: "10px", cursor: "pointer",
                border: "1px solid var(--bordercolor)", backgroundColor: "#fff",
                fontSize: "14px", color: DOCTOR_COLORS.text, textAlign: "left",
                transition: "all 0.15s",
              }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: q.color, flexShrink: 0 }} />
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorHome;