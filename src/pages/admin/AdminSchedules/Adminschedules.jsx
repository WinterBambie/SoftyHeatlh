import { useState, useEffect } from "react";
import {
  getSchedules, createSchedule, getAdminDoctors,
  getSessions, updateSchedule, deleteSchedule,
} from "../../../services/adminService";
import { COLORS } from "../../../styles/COLORS";
import ScheduleList from "./ScheduleList";
import ScheduleForm from "./Scheduleform";
import { timeToMinutes } from "./scheduleDisplay";

const FORM_INITIAL = {
  docid: "", sessionid: "",
  days_of_week: [],      // ✅ array para múltiple selección
  day_of_week: "",       // para edición (un solo día)
  start_time: "08:00", end_time: "12:00",
  slot_duration_min: "30", max_patients_per_day: 10,
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
  const [editing,   setEditing]   = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [schRes, docRes, sesRes] = await Promise.allSettled([
      getSchedules(), getAdminDoctors(), getSessions(),
    ]);
    if (schRes.value?.status === "success") {
      const raw = schRes.value.data;
      setSchedules(Array.isArray(raw) ? raw : []);
    }
    if (docRes.value?.status === "success") setDoctors(docRes.value.data ?? []);
    if (sesRes.value?.status === "success") setSessions(sesRes.value.data ?? []);
  };

  const toFormData = (obj) => {
    const fd = new FormData();
    Object.entries(obj).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    return fd;
  };

  const handleSubmit = async () => {
    if (!form.docid || !form.start_time || !form.end_time) {
      setError("Doctor, hora inicio y hora fin son obligatorios."); return;
    }
    if (timeToMinutes(form.start_time) >= timeToMinutes(form.end_time)) {
      setError("La hora de inicio debe ser anterior a la hora de fin."); return;
    }

    if (!editing && (!form.days_of_week || form.days_of_week.length === 0)) {
      setError("Selecciona al menos un día de atención."); return;
    }

    setError(""); setLoading(true);

    try {
      if (editing) {
        // ── UPDATE — un solo horario ────────────────────────────────────────
        const fd = toFormData({
          scheduleid:           editing,
          docid:                form.docid,
          sessionid:            form.sessionid || "0",
          day_of_week:          form.day_of_week,
          start_time:           form.start_time,
          end_time:             form.end_time,
          slot_duration_min:    form.slot_duration_min,
          max_patients_per_day: form.max_patients_per_day ?? 10,
          is_active:            form.is_active ?? 1,
        });
        const res = await updateSchedule(fd);
        if (res?.status === "success") {
          setSuccess("✓ Horario actualizado.");
          handleCancel(); await loadData();
        } else {
          setError(res?.message || "Error al actualizar.");
        }
      } else {
        // ── CREATE — uno por cada día seleccionado ──────────────────────────
        const results = await Promise.allSettled(
          form.days_of_week.map(day =>
            createSchedule(toFormData({
              docid:                form.docid,
              sessionid:            form.sessionid || "0",
              day_of_week:          day,
              start_time:           form.start_time,
              end_time:             form.end_time,
              slot_duration_min:    form.slot_duration_min,
              max_patients_per_day: form.max_patients_per_day ?? 10,
            }))
          )
        );

        const errors   = results.filter(r => r.value?.status !== "success");
        const successes = results.filter(r => r.value?.status === "success");

        if (errors.length === 0) {
          setSuccess(`✓ ${successes.length} horario${successes.length > 1 ? "s" : ""} creado${successes.length > 1 ? "s" : ""} correctamente.`);
          handleCancel(); await loadData();
        } else if (successes.length > 0) {
          setSuccess(`✓ ${successes.length} horario${successes.length > 1 ? "s creados" : " creado"}. ${errors.length} error${errors.length > 1 ? "es" : ""}: ${errors.map(e => e.value?.message).join(", ")}`);
          await loadData(); setSection("list");
        } else {
          setError(errors.map(e => e.value?.message || "Error").join(" | "));
        }
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sc) => {
    setForm({
      ...FORM_INITIAL,
      docid:                String(sc.docid   ?? ""),
      sessionid:            String(sc.sessionid ?? ""),
      day_of_week:          String(sc.day_of_week),
      days_of_week:         [],
      start_time:           sc.start_time,
      end_time:             sc.end_time,
      slot_duration_min:    String(sc.slot_duration_min ?? 30),
      max_patients_per_day: sc.max_patients_per_day ?? 10,
      is_active:            sc.is_active ?? 1,
    });
    setEditing(sc.scheduleid);
    setError(""); setSuccess("");
    setSection("new");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este horario? También se eliminarán las citas asociadas.")) return;
    const fd = new FormData();
    fd.append("scheduleid", String(id));
    const res = await deleteSchedule(fd);
    if (res?.status === "success") { setSuccess("✓ Horario eliminado."); await loadData(); }
    else setError(res?.message || "Error al eliminar.");
  };

  const handleCancel = () => {
    setForm(FORM_INITIAL); setEditing(null);
    setSection("list"); setError("");
  };

  const tabBtn = (key, label) => (
    <button key={key} onClick={() => key === "list" ? handleCancel() : setSection(key)} style={{
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
        {tabBtn("new", editing ? "✏️ Editando horario" : "+ Nuevo horario")}
      </div>

      {error   && <div style={{ backgroundColor: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#C62828" }}>{error}</div>}
      {success && <div style={{ backgroundColor: "#E8F5E9", border: "1px solid #A5D6A7", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "13px", color: "#2E7D32" }}>{success}</div>}

      {section === "list" && (
        <ScheduleList schedules={schedules} onRefresh={loadData}
          onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {section === "new" && (
        <ScheduleForm form={form} setForm={setForm}
          doctors={doctors} sessions={sessions}
          loading={loading} editing={editing}
          onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
    </div>
  );
}

export default AdminSchedules;