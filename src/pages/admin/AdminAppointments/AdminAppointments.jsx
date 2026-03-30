import { useState } from "react";
import {
  createAppointment, updateAppointmentStatus,
  getAdminPatients, getSchedules, getSessions,
} from "../../../services/adminService";
import { COLORS } from "./../../../styles/COLORS";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./Appointmentform";

const FORM_INITIAL = { pid: "", scheduleid: "", appointment_date: "" };

function AdminAppointments({ appointments, onRefresh }) {
  const [section,    setSection]    = useState("list");
  const [patients,   setPatients]   = useState([]);
  const [schedules,  setSchedules]  = useState([]);
  const [sessions,   setSessions]   = useState([]);
  const [form,       setForm]       = useState(FORM_INITIAL);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadFormData = async () => {
    if (dataLoaded) return;
    const [patRes, schRes, sesRes] = await Promise.allSettled([
      getAdminPatients(), getSchedules(), getSessions(),
    ]);
    if (patRes.value?.status === "success") setPatients(patRes.value.data);
    if (schRes.value?.status === "success") setSchedules(schRes.value.data);
    if (sesRes.value?.status === "success") setSessions(sesRes.value.data);
    setDataLoaded(true);
  };

  const handleTabChange = (tab) => {
    setSection(tab); setError(""); setSuccess("");
    if (tab === "new") loadFormData();
  };

  const handleSubmit = async () => {
    if (!form.pid || !form.scheduleid || !form.appointment_date) {
      setError("Todos los campos son obligatorios."); return;
    }
    setError(""); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const res = await createAppointment(fd);
      if (res.status === "success") {
        setSuccess("Cita registrada correctamente.");
        setForm(FORM_INITIAL);
        onRefresh();
        setSection("list");
      } else {
        setError(res.message || "Error al registrar cita.");
      }
    } catch { setError("Error al conectar con el servidor."); }
    finally  { setLoading(false); }
  };

  const handleStatusChange = async (appoid, status) => {
    const res = await updateAppointmentStatus(appoid, status);
    if (res.status === "success") onRefresh();
  };

  const tabBtn = (key, label) => (
    <button key={key} onClick={() => handleTabChange(key)} style={{
      padding: "0.5rem 1.25rem", borderRadius: "8px", cursor: "pointer",
      fontSize: "13px", border: "none",
      backgroundColor: section === key ? COLORS.primary : COLORS.btnBg,
      color:           section === key ? COLORS.white   : COLORS.btnText,
    }}>
      {label}
    </button>
  );

  return (
    <div style={{
      backgroundColor: COLORS.white, borderRadius: "12px",
      padding: "1.5rem", border: `1px solid ${COLORS.border}`,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
        {tabBtn("list", "Appointments")}
        {tabBtn("new",  "+ New appointment")}
      </div>

      {error   && <p style={{ color: "#C62828", fontSize: "13px", marginBottom: "1rem" }}>{error}</p>}
      {success && <p style={{ color: "#2E7D32", fontSize: "13px", marginBottom: "1rem" }}>{success}</p>}

      {section === "list" &&
        <AppointmentList appointments={appointments} onStatusChange={handleStatusChange} />}

      {section === "new" &&
        <AppointmentForm
          form={form} setForm={setForm}
          patients={patients} schedules={schedules} sessions={sessions}
          loading={loading} onSubmit={handleSubmit} />}
    </div>
  );
}

export default AdminAppointments;