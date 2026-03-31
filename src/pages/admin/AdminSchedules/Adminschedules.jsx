import { useState, useEffect } from "react";
import { getSchedules, createSchedule, getAdminDoctors, getSessions } from "../../../services/adminService";
import { COLORS } from "../../../styles/COLORS";
import ScheduleList from "./ScheduleList";
import ScheduleForm from "./Scheduleform";
import { timeToMinutes } from "./scheduleDisplay";

const FORM_INITIAL = {
  docid: "",
  sessionid: "",
  day_of_week: "",
  start_time: "08:00",
  end_time: "12:00",
  slot_duration_min: "30",
  max_patients_per_day: 10,
};

function AdminSchedules() {
  const [section,   setSection]   = useState("list");
  const [schedules, setSchedules] = useState([]);
  const [doctors,   setDoctors]   = useState([]);
  const [sessions,  setSessions]  = useState([]);
  const [form,      setForm]      = useState(FORM_INITIAL);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [schRes, docRes, sesRes] = await Promise.allSettled([
      getSchedules(), getAdminDoctors(), getSessions(),
    ]);
    if (schRes.value?.status === "success") {
      const raw = schRes.value.data;
      setSchedules(Array.isArray(raw) ? raw : []);
    }
    if (docRes.value?.status === "success") setDoctors(docRes.value.data);
    if (sesRes.value?.status === "success") setSessions(sesRes.value.data);
  };

  const handleSubmit = async () => {
    // day_of_week puede ser 0 (lunes); no usar !form.day_of_week
    if (!form.docid || form.day_of_week === "" || form.day_of_week === undefined || !form.start_time || !form.end_time) {
      setError("Doctor, día, hora inicio y hora fin son obligatorios."); return;
    }
    if (timeToMinutes(form.start_time) >= timeToMinutes(form.end_time)) {
      setError("La hora de inicio debe ser anterior a la hora de fin."); return;
    }
    setError(""); setLoading(true);
    try {
      const fd = new FormData();
      fd.append("docid", String(form.docid));
      fd.append("day_of_week", String(form.day_of_week));
      fd.append("start_time", form.start_time);
      fd.append("end_time", form.end_time);
      fd.append("slot_duration_min", String(form.slot_duration_min));
      fd.append("max_patients_per_day", String(form.max_patients_per_day ?? 10));
      fd.append("sessionid", form.sessionid ? String(form.sessionid) : "0");
      const res = await createSchedule(fd);
      if (res.status === "success") {
        setSuccess("Horario creado correctamente.");
        setForm(FORM_INITIAL);
        await loadData();
        setSection("list");
      } else {
        setError(res.message || "Error al crear horario.");
      }
    } catch { setError("Error de conexión."); }
    finally  { setLoading(false); }
  };

  const tabBtn = (key, label) => (
    <button key={key} onClick={() => { setSection(key); setError(""); setSuccess(""); }} style={{
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
        {tabBtn("list", "Listado de horarios")}
        {tabBtn("new",  "+ Nuevo horario")}
      </div>

      {error   && <p style={{ color: "#C62828", fontSize: "13px", marginBottom: "1rem" }}>{error}</p>}
      {success && <p style={{ color: "#2E7D32", fontSize: "13px", marginBottom: "1rem" }}>{success}</p>}

      {section === "list" && <ScheduleList schedules={schedules} onRefresh={loadData} />}
      {section === "new"  &&
        <ScheduleForm
          form={form} setForm={setForm}
          doctors={doctors} sessions={sessions}
          loading={loading} onSubmit={handleSubmit} />}
    </div>
  );
}

export default AdminSchedules;