import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientAppointments, getPatientStats } from "../../services/patientService";
import PatientSidebar    from "./../../components/dashboard/PatientSidebar";
import PatientHome      from "./PatientHome";
import PatientBooking   from "./Patientbooking";
import PatientHistory   from "./Patienthistory";
import PatientProfile   from "./Patientprofile";

function DashboardPatient() {
  const [section,      setSection]      = useState("home");
  const [appointments, setAppointments] = useState([]);
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user?.id) { navigate("/login"); return; }
    loadData();
  }, []);

  // ✅ silent=true para refrescos desde perfil — no muestra spinner global
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [apptRes, statsRes] = await Promise.allSettled([
        getPatientAppointments(user.id),
        getPatientStats(user.id),
      ]);
      if (apptRes.value?.status === "success") setAppointments(apptRes.value.data);
      if (statsRes.value?.status === "success") setStats(statsRes.value.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", display: "flex" }}>
  
  <PatientSidebar
    activeMenu={section}
    setActiveMenu={setSection}
    user={user}
  />

  <div
    style={{
      flex: 1,
      marginLeft: "230px",
      padding: "2rem 1rem",
      transition: "margin-left 0.3s",
    }}
  >
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {loading ? (
        <p style={{ color: "#666", textAlign: "center" }}>Cargando...</p>
      ) : (
        <>
          {section === "home" && (
            <PatientHome
              user={user}
              stats={stats}
              appointments={appointments}
              setSection={setSection}
            />
          )}

          {section === "booking" && (
            <PatientBooking
              patientId={user.id}
              onBooked={loadData}
            />
          )}

          {section === "history" && (
            <PatientHistory
              appointments={appointments}
              onRefresh={loadData}
            />
          )}

          {section === "profile" && (
            <PatientProfile
              user={user}
              onUpdated={() => loadData(true)}
            />
          )}
        </>
      )}
    </div>
  </div>
</div>
  );
}

export default DashboardPatient;