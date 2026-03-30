import { People, LocalHospital, CalendarToday, DateRange, EventAvailable } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  primary:  "#0A76D8",
  btnBg:    "#D8EBFA",
  btnText:  "#1b62b3",
  border:   "#e9ecef",
  text:     "#212529",
  textMuted:"#666",
  white:    "#ffffff",
  gray:     "#f5f7fa",
};

function AdminStats({ stats }) {
  if (!stats) return <p style={{ color: COLORS.textMuted }}>Cargando...</p>;

  const cards = [
    { label: "Total Pacientes",  value: stats.total_patients,        icon: <People /> },
    { label: "Total Doctores",   value: stats.total_doctors,         icon: <LocalHospital /> },
    { label: "Citas Hoy",        value: stats.appointments_today,    icon: <CalendarToday /> },
    { label: "Citas este Mes",   value: stats.appointments_month,    icon: <DateRange /> },
    { label: "Citas Reservadas", value: stats.appointments_reserved, icon: <EventAvailable /> },
  ];

  const chartData = [
    { name: "Pacientes",  total: parseInt(stats.total_patients) },
    { name: "Doctores",   total: parseInt(stats.total_doctors) },
    { name: "Citas Hoy",  total: parseInt(stats.appointments_today) },
    { name: "Este Mes",   total: parseInt(stats.appointments_month) },
    { name: "Reservadas", total: parseInt(stats.appointments_reserved) },
  ];

  return (
    <>
      {/* Tarjetas */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem", marginBottom: "2rem"
      }}>
        {cards.map((card) => (
          <div key={card.label} style={{
            backgroundColor: COLORS.white, borderRadius: "12px",
            padding: "1.5rem", display: "flex",
            justifyContent: "space-between", alignItems: "center",
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
          }}>
            <div>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: "600", color: COLORS.primary }}>
                {card.value}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: COLORS.textMuted, lineHeight: "1.3" }}>
                {card.label}
              </p>
            </div>
            <div style={{
              backgroundColor: COLORS.btnBg, borderRadius: "10px",
              padding: "0.75rem", color: COLORS.primary,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Gráfica */}
      <div style={{
        backgroundColor: COLORS.white, borderRadius: "12px",
        padding: "1.5rem", border: `1px solid ${COLORS.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
      }}>
        <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", color: COLORS.text }}>Resumen general</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: COLORS.textMuted }} />
            <YAxis tick={{ fontSize: 12, fill: COLORS.textMuted }} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: `1px solid ${COLORS.border}` }} />
            <Bar dataKey="total" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default AdminStats;