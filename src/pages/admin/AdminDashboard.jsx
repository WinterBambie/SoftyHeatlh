import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar           from "../../components/dashboard/AdminSidebar";
import AdminStats        from "../../components/dashboard/AdminStats";
import TodayDate from "../../components/dashboard/TodayDate";
import AdminPatients     from "./AdminPatients";
import AdminDoctors      from "./AdminDoctors";
import AdminAppointments from "./AdminAppointments/AdminAppointments";
import AdminSchedules    from "./AdminSchedules/Adminschedules";

const API_URL = "http://localhost/HealthApi/router/api.php";

const COLORS = {
  text:     "#212529",
  textMuted:"#666",
  gray:     "#f5f7fa",
};

function AdminDashboard() {
  const [stats,        setStats]        = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeMenu,   setActiveMenu]   = useState("dashboard");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

const fetchData = async () => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [statsRes, appsRes, patientsRes, doctorsRes] = await Promise.allSettled([
      axios.get(`${API_URL}?action=adminStats`,        { headers }),
      axios.get(`${API_URL}?action=adminAppointments`, { headers }),
      axios.get(`${API_URL}?action=adminPatients`,     { headers }),
      axios.get(`${API_URL}?action=adminDoctors`,      { headers }),
    ]);

    if (statsRes.value?.data?.status    === "success") setStats(statsRes.value.data.data);
    if (appsRes.value?.data?.status     === "success") setAppointments(appsRes.value.data.data);
    if (patientsRes.value?.data?.status === "success") setPatients(patientsRes.value.data.data);
    if (doctorsRes.value?.data?.status  === "success") setDoctors(doctorsRes.value.data.data);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const menuLabels = {
    dashboard:    "Dashboard",
    patients:     "Pacientes",
    doctors:      "Doctores",
    appointments: "Citas médicas",
    agenda:       "Horarios (agenda)",
  };

  return (

  
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: COLORS.gray }}>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
  
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", margin: 0, color: COLORS.text }}>
            {menuLabels[activeMenu]}
          </h1>
          <TodayDate />
          <p style={{ color: COLORS.textMuted, margin: "4px 0 0", fontSize: "14px" }}>
            Bienvenido, {user.name}
          </p>
        </div>

        {loading ? (
          <p style={{ color: COLORS.textMuted }}>Cargando...</p>
        ) : (
          <>
            {activeMenu === "dashboard"    && <AdminStats        stats={stats} appointments={appointments} />}
            {activeMenu === "patients"     && <AdminPatients     patients={patients} />}
            {activeMenu === "doctors"      && <AdminDoctors      doctors={doctors} onRefresh={fetchData} />}
            
            {activeMenu === "appointments" && <AdminAppointments appointments={appointments} onRefresh={fetchData} />}
            {activeMenu === "agenda" && <AdminSchedules />}

          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;