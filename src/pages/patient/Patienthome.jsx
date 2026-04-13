import { CalendarToday, History, Person, EventAvailable } from "@mui/icons-material";
import { COLORS } from "../../styles/COLORS";
import { patientCard, nextAppointmentBanner, quickAccessBtn, statCard } from "./patientStyles";

function PatientHome({ user, stats, appointments, setSection }) {
  const today = new Date().toISOString().split("T")[0];
  const nextAppointment = appointments
    .filter(a => a.appointment_date >= today && a.status === "reservada")
    .sort((a, b) => a.appointment_date.localeCompare(b.appointment_date))[0];

  const cards = [
    { label: "Total citas",  value: stats?.total     ?? 0, color: COLORS.primary },
    { label: "Completadas",  value: stats?.completed ?? 0, color: "#2E7D32" },
    { label: "Canceladas",   value: stats?.cancelled ?? 0, color: "#C62828" },
    { label: "Pendientes",   value: stats?.pending   ?? 0, color: "#E65100" },
  ];

  const quickAccess = [
    { key: "booking", label: "Agendar cita",  icon: <CalendarToday />, color: COLORS.primary },
    { key: "history", label: "Ver historial", icon: <History />,       color: "#2E7D32" },
    { key: "profile", label: "Mi perfil",     icon: <Person />,        color: "#7B1FA2" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.4rem", color: COLORS.text }}>
          Hola, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p style={{ color: COLORS.muted, margin: "4px 0 0", fontSize: "14px" }}>
          Bienvenido a tu portal de salud
        </p>
      </div>

      {nextAppointment && (
        <div style={nextAppointmentBanner}>
          <EventAvailable style={{ color: COLORS.primary, fontSize: "2rem" }} />
          <div>
            <p style={{ margin: 0, fontSize: "13px", color: COLORS.btnText }}>Próxima cita</p>
            <p style={{ margin: "2px 0 0", fontSize: "15px", fontWeight: 500, color: COLORS.text }}>
              {nextAppointment.doctor} — {nextAppointment.appointment_date} {nextAppointment.appointment_time}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "13px", color: COLORS.muted }}>
              {nextAppointment.session}
            </p>
          </div>
        </div>
      )}

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "1rem", marginBottom: "2rem",
      }}>
        {cards.map(c => (
          <div key={c.label} style={patientCard}>
            <p style={{ margin: 0, fontSize: "28px", fontWeight: 600, color: c.color }}>{c.value}</p>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: COLORS.muted }}>{c.label}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: "1rem", color: COLORS.text, marginBottom: "1rem" }}>Accesos rápidos</h3>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {quickAccess.map(q => (
          <button key={q.key} onClick={() => setSection(q.key)} style={quickAccessBtn}>
            <span style={{ color: q.color }}>{q.icon}</span>
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PatientHome;