import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDoctorStats, getTodayAppointments,
  getWeeklyAgenda, getDoctorAppointments, getDoctorSchedules,
} from "../../services/doctorService";
import DoctorSidebar from "./../../components/dashboard/DoctorSidebar";
import DoctorHome    from "./DoctorHome";
import DoctorToday   from "./DoctorToday";
import DoctorAgenda  from "./DoctorAgenda";
import DoctorHistory from "./DoctorHistory";
import DoctorProfile from "./DoctorProfile";

function DashboardDoctor() {
  const [section,   setSection]   = useState("home");
  const [stats,     setStats]     = useState(null);
  const [today,     setToday]     = useState([]);
  const [agenda,    setAgenda]    = useState([]);
  const [history,   setHistory]   = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ El login guarda id como "id" para todos los roles — pero si el doctor
  // tiene docid, usamos ese. Soportamos ambos por si acaso.
  const doctorId = user?.id ?? user?.docid ?? null;

  useEffect(() => {
    if (!doctorId) { navigate("/login"); return; }
    loadData();
  }, []);

  // ✅ silent=true para refrescos desde perfil — no muestra spinner global
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [statsR, todayR, agendaR, histR, schR] = await Promise.allSettled([
        getDoctorStats(doctorId),
        getTodayAppointments(doctorId),
        getWeeklyAgenda(doctorId),
        getDoctorAppointments(doctorId),
        getDoctorSchedules(doctorId),
      ]);
      if (statsR.value?.status   === "success") setStats(statsR.value.data);
      if (todayR.value?.status   === "success") setToday(todayR.value.data   ?? []);
      if (agendaR.value?.status  === "success") setAgenda(agendaR.value.data  ?? []);
      if (histR.value?.status    === "success") setHistory(histR.value.data   ?? []);
      if (schR.value?.status     === "success") setSchedules(schR.value.data  ?? []);
    } catch (err) {
      console.error("DashboardDoctor error:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const sections = {
    home:    <DoctorHome    stats={stats} today={today} user={user} setSection={setSection} />,
    today:   <DoctorToday   appointments={today}   doctorId={doctorId} onRefresh={loadData} />,
    agenda:  <DoctorAgenda  agenda={agenda}         doctorId={doctorId} onRefresh={loadData} />,
    history: <DoctorHistory appointments={history}  doctorId={doctorId} onRefresh={loadData} />,
    profile: <DoctorProfile user={user} schedules={schedules} onUpdated={() => loadData(true)} />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      <DoctorSidebar activeMenu={section} setActiveMenu={setSection} user={user} />
      <div style={{ marginLeft: "220px", flex: 1, padding: "2rem 1.5rem" }}>
        {loading
          ? <p style={{ color: "#666", textAlign: "center", paddingTop: "4rem" }}>Cargando...</p>
          : (sections[section] ?? null)}
      </div>
    </div>
  );
}

export default DashboardDoctor;