import { useState, useEffect } from "react";
import { getSchedules, createSchedule, getAdminDoctors, getSessions } from "../../../services/adminService";
import { COLORS } from "../../../styles/COLORS";
import ScheduleList from "./ScheduleList";
import ScheduleForm from "./Scheduleform";

const FORM_INITIAL = {
  docid: "", sessionid: "", scheduledate: "", scheduletime: "", max_patients: 1,
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
    if (schRes.value?.status === "success") setSchedules(schRes.value.data);
    if (docRes.value?.status === "success") setDoctors(docRes.value.data);
    if (sesRes.value?.status === "success") setSessions(sesRes.value.data);
  };

  const handleSubmit = async () => {
    if (!form.docid || !form.scheduledate || !form.scheduletime) {
      setError("Doctor, date and time are required."); return;
    }
    setError(""); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const res = await createSchedule(fd);
      if (res.status === "success") {
        setSuccess("Schedule created successfully.");
        setForm(FORM_INITIAL);
        await loadData();
        setSection("list");
      } else {
        setError(res.message || "Error creating schedule.");
      }
    } catch { setError("Connection error."); }
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
        {tabBtn("list", "Schedules")}
        {tabBtn("new",  "+ New schedule")}
      </div>

      {error   && <p style={{ color: "#C62828", fontSize: "13px", marginBottom: "1rem" }}>{error}</p>}
      {success && <p style={{ color: "#2E7D32", fontSize: "13px", marginBottom: "1rem" }}>{success}</p>}

      {section === "list" && <ScheduleList schedules={schedules} />}

      {section === "new" &&
        <ScheduleForm
          form={form} setForm={setForm}
          doctors={doctors} sessions={sessions}
          loading={loading} onSubmit={handleSubmit} />}
    </div>
  );
}

export default AdminSchedules;